import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GmailLoginDTO, LoginDTO, RegisterDTO } from '../types';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async me(id: number) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        username: true,
        userTeam: true,
        email: true,
        id: true,
      },
    });
  }

  async gmailLogin(gmailLoginDTO: GmailLoginDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        openid: 'gmail',
        email: gmailLoginDTO.email,
      },
    });
    let token;
    if (user) {
      token = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        admin: user.admin,
        username: user.username,
      });
    } else {
      const user = await this.prisma.user.create({
        data: {
          openid: 'gmail',
          username: gmailLoginDTO.name,
          email: gmailLoginDTO.email,
        },
      });
      token = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        username: user.username,
      });
    }

    return token;
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { email: loginDTO.email },
    });

    const isSamePassword = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!isSamePassword) {
      throw new BadRequestException('Password is not correct.');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      admin: user.admin,
      username: user.username,
    });

    return token;
  }

  async register(registerDTO: RegisterDTO) {
    const userCount = await this.prisma.user.count({
      where: { email: registerDTO.email },
    });

    if (userCount > 0) {
      throw new ForbiddenException(
        'User with this email and username already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDTO.password, 6);

    const user = await this.prisma.user.create({
      data: {
        email: registerDTO.email,
        username: registerDTO.username,
        password: hashedPassword,
      },
    });

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      username: user.username,
      admin: user.admin,
    });

    return token;
  }
}

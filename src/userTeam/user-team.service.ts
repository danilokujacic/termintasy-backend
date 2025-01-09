import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGameTeamDTO } from '../types';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserTeamService {
  constructor(private prismaService: PrismaService) {}

  async getAllTeams() {
    const teams = await this.prismaService.userTeam.findMany({
      orderBy: {
        points: 'desc',
      },
    });

    return teams;
  }

  async getTeam(id: string) {
    return this.prismaService.userTeam.findFirstOrThrow({
      where: { id },
      include: {
        players: {
          include: {
            gameStats: {
              where: {
                active: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });
  }

  async createTeam(team: CreateGameTeamDTO, ownerId: number) {
    const hasTeam = await this.prismaService.userTeam.count({
      where: {
        ownerId,
      },
    });

    if (hasTeam) {
      throw new ForbiddenException('User already has a team!');
    }

    console.log(ownerId);
    return await this.prismaService.userTeam.create({
      data: {
        name: team.name,
        ownerId: ownerId,
        players: {
          connect: team.players.map((player) => ({ id: player })),
        },
      },
    });
  }
}

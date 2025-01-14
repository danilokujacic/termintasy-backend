import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateGameTeamDTO, MakeTransferDTO } from '../types';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserTeamService {
  constructor(private prismaService: PrismaService) {}

  async getAllTeams() {
    const teams = await this.prismaService.userTeam.findMany({
      orderBy: {
        points: 'desc',
      },
      include: {
        owner: true,
      },
    });

    return teams;
  }

  async setTeamCaptain(userTeamId: string, captainId: number) {
    const userTeam = await this.prismaService.userTeam.findUnique({
      where: { id: userTeamId },
      include: { players: true }, // Include players to validate
    });

    if (!userTeam) {
      throw new Error('UserTeam not found');
    }

    console.log(userTeam.players, captainId);
    const isPlayerInTeam = userTeam.players.some(
      (player) => player.id === +captainId,
    );

    if (!isPlayerInTeam) {
      throw new Error('Player must be part of the team to be set as captain');
    }

    await this.prismaService.userTeam.update({
      where: { id: userTeamId },
      data: { captainId: +captainId },
    });

    console.log(
      `Player with ID ${captainId} set as captain of UserTeam ${userTeamId}`,
    );
  }

  async makeTransfer(
    teamId: string,
    transferDTO: MakeTransferDTO,
    userId: number,
  ) {
    const { players, playersToReceive } = transferDTO;

    const user = await this.prismaService.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        userTeam: true,
      },
    });

    if (user.userTeam.id !== teamId) {
      throw new BadRequestException('You are not owner of this team');
    }

    // Step 1: Find the team by ID
    const team = await this.prismaService.userTeam.findUnique({
      where: { id: teamId },
      include: { players: true },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    // Step 2: Determine the players to remove and add
    const playersToRemove = team.players.filter((player) =>
      players.includes(player.id),
    );

    const playersToAdd = await this.prismaService.player.findMany({
      where: { id: { in: playersToReceive } },
    });

    const receivePlayersTransfersDiff =
      team.transfers - playersToReceive.length;

    // Step 3: Update the team
    const updatedTeam = await this.prismaService.userTeam.update({
      where: { id: teamId },
      data: {
        points: {
          decrement:
            playersToReceive.length - team.transfers < 0
              ? 0
              : (playersToReceive.length - team.transfers) * 4,
        },
        transfers:
          receivePlayersTransfersDiff < 0 ? 0 : receivePlayersTransfersDiff,
        players: {
          disconnect: playersToRemove.map((player) => ({ id: player.id })),
          connect: playersToAdd.map((player) => ({ id: player.id })),
        },
      },
      include: { players: true },
    });

    console.log(
      `[${user.username} - ${user.userTeam.name}] Made transfers. Players (${players}) for (${playersToReceive}) on date: ${new Date().toISOString()}`,
    );
    return updatedTeam;
  }

  async getTeam(id: string) {
    return this.prismaService.userTeam.findFirstOrThrow({
      where: { id },
      include: {
        captain: {
          select: {
            id: true,
          },
        },
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

    return await this.prismaService.userTeam.create({
      data: {
        name: team.name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        captain: {
          connect: { id: team.players[0] as number },
        },
        players: {
          connect: team.players.map((player) => ({ id: player })),
        },
      },
    });
  }
}

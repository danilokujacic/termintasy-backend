import { ForbiddenException, Injectable } from '@nestjs/common';
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
    });

    return teams;
  }

  async makeTransfer(teamId: string, transferDTO: MakeTransferDTO) {
    const { players, playersToReceive } = transferDTO;

    // Step 1: Find the team by ID
    const team = await this.prismaService.userTeam.findUnique({
      where: { id: teamId },
      include: { players: true },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    console.log(players, playersToReceive);

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

    return updatedTeam;
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

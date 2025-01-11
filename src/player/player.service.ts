import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePlayerDTO, Position } from '../types';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async getPlayers(position?: Position, pickrate?: string) {
    const players = await this.prisma.player.findMany({
      where: position ? { position } : undefined,
      include: pickrate ? { userTeams: true } : undefined,
    });
    if (pickrate === 'true') {
      const totalUserTeams = await this.prisma.userTeam.count();

      return players
        .map((player) => ({
          ...player,
          pickPercentage:
            totalUserTeams > 0
              ? (player.userTeams.length / totalUserTeams) * 100
              : 0,
        }))
        .sort((a, b) => b.pickPercentage - a.pickPercentage);
    }
    return players;
  }

  async createPlayer(playerDTO: CreatePlayerDTO) {
    const player = await this.prisma.player.create({ data: playerDTO });

    return player;
  }

  async updatePlayer(playerDTO: CreatePlayerDTO, playerId: number) {
    const player = await this.prisma.player.update({
      where: {
        id: playerId,
      },
      data: playerDTO,
    });

    return player;
  }

  async deletePlayer(playerId: number) {
    const deletedPlayer = await this.prisma.player.delete({
      where: {
        id: playerId,
      },
    });

    return deletedPlayer;
  }

  async getPlayer(playerId: number) {
    const player = await this.prisma.player.findFirstOrThrow({
      where: {
        id: playerId,
      },
      include: {
        userTeams: true,
      },
    });

    const totalUserTeams = await this.prisma.userTeam.count();
    const pickPercentage =
      totalUserTeams > 0 ? (player.userTeams.length / totalUserTeams) * 100 : 0;

    return { pickPercentage, ...player };
  }
}

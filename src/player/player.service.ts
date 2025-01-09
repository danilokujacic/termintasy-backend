import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePlayerDTO, Position } from '../types';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async getPlayers(position?: Position) {
    const query = position ? { where: { position } } : undefined;
    const players = await this.prisma.player.findMany(query);

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
    });

    return player;
  }
}

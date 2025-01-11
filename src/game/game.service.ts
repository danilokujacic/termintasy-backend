import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GameStatTypeDTO } from '../types';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('gameStatsQueue') private gameStateQueue: Queue,
    @InjectQueue('gameEndQueue') private gameEndQueue: Queue,
  ) {}

  async getAllGames() {
    const games = await this.prisma.game.findMany({
      orderBy: {
        matchDate: 'desc',
      },
    });
    return games;
  }

  async endGame(gameId: string) {
    return this.gameEndQueue.add('end_game', { gameId });
  }
  async summarizeGameStat(gameId: string) {
    return this.gameStateQueue.add('summarize_game', { gameId });
  }

  async createTeam(name: string, players: number[]) {
    console.log(name);
    const team = await this.prisma.gameTeam.create({
      data: {
        name,
        players: {
          connect: players.map((player) => ({ id: player })),
        },
      },
    });

    return team;
  }

  async createGame(
    homeTeamName: string,
    homeTeamPlayers: number[],
    awayTeamName: string,
    awayTeamPlayers: number[],
    gameDate: string,
  ) {
    const homeTeam = await this.createTeam(homeTeamName, homeTeamPlayers);
    const awayTeam = await this.createTeam(awayTeamName, awayTeamPlayers);

    const game = await this.prisma.game.create({
      data: {
        matchDate: gameDate,
        homeTeam: {
          connect: {
            id: homeTeam.id,
          },
        },
        awayTeam: {
          connect: {
            id: awayTeam.id,
          },
        },
      },
    });

    return game;
  }
  async getGame(id: string) {
    return await this.prisma.game.findFirst({
      where: {
        id: { equals: id },
      },
      include: {
        awayTeam: {
          include: {
            players: true,
          },
        },
        homeTeam: {
          include: {
            players: true,
          },
        },
      },
    });
  }

  async getGameStat(gameId: string, playerId: number) {
    try {
      const gameStat = await this.prisma.gameStat.findFirstOrThrow({
        where: {
          gameId,
          playerId: +playerId,
        },
      });

      return gameStat;
    } catch {
      return null;
    }
  }

  async updateGameStat(
    gameId: string,
    playerId: number,
    gameState: any,
    gameStatDTO: GameStatTypeDTO,
  ) {
    let gameStat;

    if (gameState?.id) {
      gameStat = this.prisma.gameStat.update({
        where: {
          playerId: +playerId,
          gameId,
          id: gameState.id,
        },
        data: {
          active: true,
          points: 0,
          [gameStatDTO.gameStat]:
            gameStatDTO.action === 'increase'
              ? gameState[gameStatDTO.gameStat] + 1
              : gameState[gameStatDTO.gameStat] - 1,
        },
      });
    } else {
      gameStat = this.prisma.gameStat.create({
        data: {
          gameId,
          active: true,
          playerId: +playerId,
          points: 0,
          goal: gameStatDTO.gameStat === 'goal' ? 1 : 0,
          assists: gameStatDTO.gameStat === 'assists' ? 1 : 0,
          cleanSheet: gameStatDTO.gameStat === 'cleanSheet' ? 1 : 0,
        },
      });
    }

    return gameStat;
  }
}

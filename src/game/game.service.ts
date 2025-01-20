import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { GameStatTypeDTO, GameTeamTransferDTO } from '../types';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GameStat } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('gameStatsQueue') private gameStateQueue: Queue,
    @InjectQueue('gameEndQueue') private gameEndQueue: Queue,
    @InjectQueue('gameStartProcessor') private gameStartQueue: Queue,
  ) {}

  async transferPlayers(gameId: string, transferDTO: GameTeamTransferDTO) {
    const { homePlayers, awayPlayers } = transferDTO;
    const game = await this.prisma.game.findFirst({
      where: {
        id: gameId,
      },
      include: {
        homeTeam: {
          include: {
            players: true,
          },
        },
        awayTeam: {
          include: {
            players: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const gameHomePlayers = game.homeTeam.players;
    const gameAwayPlayers = game.awayTeam.players;
    if (
      gameHomePlayers.some(
        (player) => homePlayers.findIndex((el) => el === player.id) === -1,
      ) ||
      gameAwayPlayers.some(
        (player) => awayPlayers.findIndex((el) => el === player.id) === -1,
      )
    ) {
      throw new NotFoundException('Player not exist');
    }

    const homeTeamId = game.homeTeam.id;
    const awayTeamId = game.awayTeam.id;

    await this.prisma.$transaction(
      homePlayers.map((player) =>
        this.prisma.player.update({
          where: { id: player },
          data: {
            gameTeams: {
              disconnect: { id: homeTeamId },
              connect: { id: awayTeamId },
            },
          },
        }),
      ),
    );
    await this.prisma.$transaction(
      awayPlayers.map((player) =>
        this.prisma.player.update({
          where: { id: player },
          data: {
            gameTeams: {
              disconnect: { id: awayTeamId },
              connect: { id: homeTeamId },
            },
          },
        }),
      ),
    );
  }

  async startGame(gameId: string) {
    return this.prisma.game.update({
      where: { id: gameId },
      data: {
        active: true,
      },
    });
  }

  async getAllGames() {
    const games = await this.prisma.game.findMany({
      orderBy: {
        matchDate: 'desc',
      },
    });
    return games;
  }

  async getActiveGame() {
    const game = await this.prisma.game.findFirst({
      where: {
        active: true,
      },
    });
    if (!game) {
      return {
        game: null,
      };
    }
    return {
      game,
    };
  }

  async endGame(gameId: string) {
    return this.gameEndQueue.add('end_game', { gameId });
  }
  async summarizeGameStat(gameId: string) {
    return this.gameStateQueue.add('summarize_game', { gameId });
  }

  async createTeam(players: number[]) {
    const team = await this.prisma.gameTeam.create({
      data: {
        name: null,
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
    const homeTeam = await this.createTeam(homeTeamPlayers);
    const awayTeam = await this.createTeam(awayTeamPlayers);

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
    const activationTime = new Date(
      new Date(gameDate).getTime() - 60 * 60 * 1000,
    );
    await this.gameStartQueue.add(
      'start_game',
      { gameId: game.id }, // Job data
      { delay: activationTime.getTime() - Date.now() }, // Delay until activation time
    );
    await this.gameEndQueue.add(
      'end_game',
      { gameId: game.id }, // Job data
      { delay: new Date(gameDate).getTime() + 1 * 24 * 60 * 60 * 1000 }, // Delay until end time
    );
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

  // async updateUserTeamsByGameStat(gameStat: GameStat) {
  //   return await this.prisma.userTeam.update({
  //     where: {
  //       players: {
  //         some: { id: gameStat.playerId },
  //       },
  //     },
  //   });
  // }

  async updateGameStat(
    gameId: string,
    playerId: number,
    gameState: any,
    gameStatDTO: GameStatTypeDTO,
  ) {
    let gameStat: GameStat | null = null;

    if (gameState?.id) {
      gameStat = await this.prisma.gameStat.update({
        where: {
          playerId: +playerId,
          gameId,
          id: gameState.id,
        },
        data: {
          active: true,
          points: 0,
          [gameStatDTO.type]:
            gameStatDTO.type === 'played' ? true : gameStatDTO.value,
        },
      });
    } else {
      gameStat = await this.prisma.gameStat.create({
        data: {
          gameId,
          active: true,
          playerId: +playerId,
          points: 0,
          [gameStatDTO.type]:
            gameStatDTO.type === 'played' ? true : gameStatDTO.value,
        },
      });
    }

    return gameStat;
  }
}

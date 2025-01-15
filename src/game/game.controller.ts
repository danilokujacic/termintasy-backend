import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateGameDTO, GameStatTypeDTO } from '../types';
import { GameService } from './game.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@UseGuards(AuthGuard)
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(AdminGuard)
  @Post('')
  async createGame(@Body() gameDTO: CreateGameDTO) {
    return await this.gameService.createGame(
      gameDTO.homeTeam.name,
      gameDTO.homeTeam.players,
      gameDTO.awayTeam.name,
      gameDTO.awayTeam.players,
      gameDTO.gameDate,
    );
  }

  @UseGuards(AdminGuard)
  @Get('active-game')
  async getActiveGame() {
    return await this.gameService.getActiveGame();
  }

  @Put(':gameId/start-game')
  async startGame(@Param('gameId') gameId: string) {
    return this.gameService.startGame(gameId);
  }
  @Get('all')
  async getGames() {
    return await this.gameService.getAllGames();
  }
  @Get(':id')
  async getGame(@Param('id') id: string) {
    return await this.gameService.getGame(id);
  }

  @Get(':gameId/game-stat/:playerId')
  async getPlayerGameStat(
    @Param('gameId') gameId: string,
    @Param('playerId') playerId: number,
  ) {
    return this.getPlayerGameStat(gameId, playerId);
  }

  @UseGuards(AdminGuard)
  @Post(':gameId/update-game-stat/:playerId')
  async updateGameStat(
    @Param('gameId') gameId: string,
    @Param('playerId') playerId: number,
    @Body() gameStatDTO: GameStatTypeDTO,
  ) {
    const gameState = await this.gameService.getGameStat(gameId, playerId);
    return await this.gameService.updateGameStat(
      gameId,
      playerId,
      gameState,
      gameStatDTO,
    );
  }

  @UseGuards(AdminGuard)
  @Delete(':gameId/end')
  async endGame(@Param('gameId') gameId: string) {
    await this.gameService.endGame(gameId);
    return { message: 'Game ending process started' };
  }

  @UseGuards(AdminGuard)
  @Post(':gameId/summarize')
  async summarizeGame(@Param('gameId') gameId: string) {
    await this.gameService.summarizeGameStat(gameId);

    return { message: 'Game summarization process started' };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePlayerDTO, Position } from '../types';
import { PlayerService } from './player.service';
import { AdminGuard } from 'src/auth/admin.guard';

@UseGuards(AuthGuard)
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  async createPlayer(@Body() playerDTO: CreatePlayerDTO) {
    return await this.playerService.createPlayer(playerDTO);
  }

  @Get('all')
  async getPlayers(
    @Query('position') position?: Position,
    @Query('withPickrate') pickrate?: string,
  ) {
    return await this.playerService.getPlayers(position, pickrate);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async updatePlayer(@Param() id: number, @Body() playerDTO: CreatePlayerDTO) {
    return await this.playerService.updatePlayer(playerDTO, id);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async deletePlayer(@Param('id') id: number) {
    return await this.playerService.deletePlayer(id);
  }

  @Get(':id')
  async getPlayer(@Param('id') id: number) {
    return await this.playerService.getPlayer(+id);
  }
}

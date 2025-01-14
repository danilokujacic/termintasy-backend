import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserTeamService } from './user-team.service';
import { CreateGameTeamDTO, MakeTransferDTO } from '../types';

@Controller('user-team')
@UseGuards(AuthGuard)
export class UserTeamController {
  constructor(private userTeamService: UserTeamService) {}

  @Get('all')
  async getAllTeams() {
    return await this.userTeamService.getAllTeams();
  }

  @Post(':teamId/set-captain/:playerId')
  async setCaptain(
    @Param('teamId') teamId: string,
    @Param('playerId') playerId: number,
  ) {
    return this.userTeamService.setTeamCaptain(teamId, playerId);
  }

  @Post(':teamId/transfer-players')
  async transferPlayers(
    @Req() request,
    @Param('teamId') teamId: string,
    @Body() playersForTransfer: MakeTransferDTO,
  ) {
    return this.userTeamService.makeTransfer(
      teamId,
      playersForTransfer,
      request.user.sub,
    );
  }

  @Get(':id')
  async getTeam(@Param('id') id: string) {
    return await this.userTeamService.getTeam(id);
  }

  @Post('create-team')
  async createTeam(@Body() createTeamDTO: CreateGameTeamDTO, @Req() request) {
    return await this.userTeamService.createTeam(
      createTeamDTO,
      request.user.sub,
    );
  }
}

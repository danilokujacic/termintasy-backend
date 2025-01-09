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
import { CreateGameTeamDTO } from '../types';

@Controller('user-team')
@UseGuards(AuthGuard)
export class UserTeamController {
  constructor(private userTeamService: UserTeamService) {}

  @Get('all')
  async getAllTeams() {
    return await this.userTeamService.getAllTeams();
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

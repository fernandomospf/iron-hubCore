import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { WorkoutPlansService } from './workout-plans.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';

@Controller('workout-plans')
@UseGuards(SupabaseAuthGuard)
export class WorkoutPlansController {
  constructor(private readonly service: WorkoutPlansService) { }

  @Get('liked')
  listMyLikedPlans(@Req() req) {
    return this.service.listMyLikedPlans(req);
  }

  @Get('favorite')
  listMyFavoritePlans(@Req() req) {
    return this.service.listMyFavoritePlans(req);
  }

  @Post()
  createPlan(@Req() req, @Body() dto) {
    return this.service.createPlan(req, dto);
  }

  @Get('public')
  listPublic(@Req() req) {
    return this.service.listPublicPlans(req);
  }

  @Post(':id/like')
  toggleLike(
    @Req() req,
    @Param('id') planId: string,
  ) {
    return this.service.toggleLike(req, planId);
  }

  @Post(':id/favorite')
  toggleFavorite(
    @Req() req,
    @Param('id') planId: string,
  ) {
    return this.service.toggleFavorite(req, planId);
  }

  @Get(':id')
  getWorkoutById(
    @Req() req,
    @Param('id') planId: string,
  ) {
    return this.service.getWorkoutById(req, { planId });
  }

  @Get()
  listMyPlans(@Req() req) {
    return this.service.listMyPlans(req);
  }
}

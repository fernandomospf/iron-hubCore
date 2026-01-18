import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { ProfilesService } from './profiles.service';
import { OnboardingDto } from 'src/dto/onboarding.dto';
import * as express from 'express';

@Controller('profiles')
@UseGuards(SupabaseAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Get('me')
  getMe(@Req() req) {
    return this.profilesService.findMe(req);
  }

  @Post('onboarding')
  async onboarding(@Req() req, @Body() dto: OnboardingDto, @Res() res: express.Response) {
    const response = await this.profilesService.completeOnboarding(req, dto);
    if (!response.success) return res.status(HttpStatus.BAD_REQUEST).json({
      error: "Error completing onboarding"
    });
    return res.status(HttpStatus.CREATED).json({
      success: "Onboarding completed successfully"
    });
  }
}

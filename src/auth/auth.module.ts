import { Module } from '@nestjs/common';
import { SupabaseAuthGuard } from './auth.guard';

@Module({
  imports: [],
  providers: [SupabaseAuthGuard],
  exports: [SupabaseAuthGuard],
})
export class AuthModule {}

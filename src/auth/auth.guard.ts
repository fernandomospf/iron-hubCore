import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createSupabaseClient } from '../config/supabase.client';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token ausente');
    }

    const token = authHeader.replace('Bearer ', '');

    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      throw new UnauthorizedException('Token inválido');
    }

    request.user = data.user;
    request.supabase = supabase;
    return true;
  }
}

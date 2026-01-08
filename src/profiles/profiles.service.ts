import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilesService {
  async findMe(req) {
    const { data, error } = await req.supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

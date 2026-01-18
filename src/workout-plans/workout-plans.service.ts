import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class WorkoutPlansService {

  async createPlan(req, dto) {
    const { data: plan, error } = await req.supabase
      .from('workout_plans')
      .insert({
        user_id: req.user.id,
        name: dto.name,
        is_public: dto.isPublic ?? false,
        created_at: new Date(),
        updated_at: new Date(),
        muscle_groups: dto.muscleGroups,
        goals: dto.goals,
        training_time: dto.trainingTime,
        workout_type: dto.workoutType,
      })
      .select()
      .single();

    if (error) throw error;

    const exercises = dto.exercises.map((e) => ({
      workout_plan_id: plan.id,
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      weight: e.weight,
      rest_time_seconds: e.restTimeSeconds,
    }));

    const { error: exError } = await req.supabase
      .from('workout_exercises')
      .insert(exercises);

    if (exError) throw exError;

    return plan;
  }


  async listMyPlans(req) {
    const { data, error } = await req.supabase
      .from('workout_plans')
      .select(`
        *,
        workout_exercises (*),
        workout_plan_like_counts (likes)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async listPublicPlans(req) {
    const supabase = req.supabase;

    const { data: plans, error: plansError } = await supabase
      .from('workout_plans')
      .select(`
      id,
      name,
      user_id,
      is_public,
      created_at,
      likes_count,
      rating_average,
      ratings_count
    `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (plansError) throw plansError;
    if (!plans?.length) return [];

    const planIds = plans.map(p => p.id);

    const { data: exercises, error: exercisesError } = await supabase
      .from('workout_exercises')
      .select(`
      id,
      workout_plan_id,
      name,
      sets,
      reps,
      weight,
      rest_time_seconds
    `)
      .in('workout_plan_id', planIds);

    if (exercisesError) throw exercisesError;

    const exercisesByPlan = exercises.reduce((acc, ex) => {
      if (!acc[ex.workout_plan_id]) acc[ex.workout_plan_id] = [];
      acc[ex.workout_plan_id].push(ex);
      return acc;
    }, {} as Record<string, any[]>);

    return plans.map(plan => ({
      ...plan,
      workout_exercises: exercisesByPlan[plan.id] ?? [],
    }));
  }


  async toggleLike(req, planId: string) {
    const { error } = await req.supabase
      .from('workout_plan_likes')
      .insert({
        workout_plan_id: planId,
        user_id: req.user.id,
      });

    if (error?.code === '23505') {
      await req.supabase
        .from('workout_plan_likes')
        .delete()
        .eq('workout_plan_id', planId)
        .eq('user_id', req.user.id);
      return { liked: false };
    }

    if (error) throw error;
    return { liked: true };
  }

  async getWorkoutById(
    req,
    dto: { planId: string },
  ) {
    const { data, error } = await req.supabase
      .from('workout_exercises')
      .select('*')
      .eq('workout_plan_id', dto.planId);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
}

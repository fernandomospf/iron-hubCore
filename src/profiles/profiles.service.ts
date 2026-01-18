import { Injectable } from '@nestjs/common';
import { AuthenticateRequest } from 'reqGuard';
import { OnboardingDto } from 'src/dto/onboarding.dto';

@Injectable()
export class ProfilesService {

  async findMe(req: AuthenticateRequest) {
    const { data, error } = await req.supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const { data: created, error: createError } = await req.supabase
        .from('profiles')
        .insert({
          id: req.user.id,
          email: req.user.email,
        })
        .select()
        .single();

      if (createError) throw createError;
      return created;
    }

    return data;
  }

  async completeOnboarding(req: AuthenticateRequest, dto: OnboardingDto) {
    const supabase = req.supabase;
    const userId = req.user.id;

    const { error: fitnessError } = await supabase
      .from('profile_fitness_data')
      .upsert({
        user_id: userId,
        social_name: dto.fitnessData.socialName,
        birth_date: dto.fitnessData.birthDate,
        gender: dto.fitnessData.gender,
        height_cm: dto.fitnessData.heightCm,
        weight_kg: dto.fitnessData.weightKg,
        goal: dto.fitnessData.goal,
        experience_level: dto.fitnessData.experienceLevel,
        training_frequency: dto.fitnessData.trainingFrequency,
        updated_at: new Date()
      });

    if (fitnessError) throw fitnessError;

    const { error: parqError } = await supabase
      .from('profile_parq_answers')
      .upsert({
        user_id: userId,
        has_heart_condition: dto.parq.hasHeartCondition,
        chest_pain_during_activity: dto.parq.chestPainDuringActivity,
        chest_pain_last_month: dto.parq.chestPainLastMonth,
        dizziness_or_fainting: dto.parq.dizzinessOrFainting,
        bone_or_joint_problem: dto.parq.boneOrJointProblem,
        uses_heart_or_pressure_medication: dto.parq.usesHeartOrPressureMedication,
        other_reason_not_to_exercise: dto.parq.otherReasonNotToExercise
      });

    if (parqError) throw parqError;

    const { error: consentError } = await supabase
      .from('profile_consents')
      .insert({
        user_id: userId,
        consent_type: dto.consent.type,
        consent_version: dto.consent.version,
        accepted: true
      });

    if (consentError) throw consentError;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date()
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    return { success: true };
  }

}
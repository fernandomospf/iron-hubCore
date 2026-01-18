import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class FitnessDataDto {
  @IsOptional()
  @IsString()
  socialName: string;

  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsNumber()
  heightCm: number;

  @IsNumber()
  weightKg: number;

  @IsString()
  goal: string;

  @IsString()
  experienceLevel: string;

  @IsString()
  trainingFrequency: string;
}

export class ParqDto {
  @IsBoolean() hasHeartCondition: boolean;
  @IsBoolean() chestPainDuringActivity: boolean;
  @IsBoolean() chestPainLastMonth: boolean;
  @IsBoolean() dizzinessOrFainting: boolean;
  @IsBoolean() boneOrJointProblem: boolean;
  @IsBoolean() usesHeartOrPressureMedication: boolean;
  @IsBoolean() otherReasonNotToExercise: boolean;
}

export class ConsentDto {
  @IsString()
  type: string;

  @IsString()
  version: string;
}

export class OnboardingDto {
  fitnessData: FitnessDataDto;
  parq: ParqDto;
  consent: ConsentDto;
}

// src/app/models/competency.interface.ts
export interface Competency {
  id: string;
  nameFa: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isActive: boolean;
  
  // فیلدهای اضافی از PDF
  mediaReason?: string;
  contentSupplyMethod?: string;
  learningObjective?: string;
  evaluationCriteria?: string;
  introductionMethod?: string;
  reminderMechanism?: string;
  
  // رسانه‌های مرتبط
  mediaTypes?: string[];
  
  // timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompetencyCreateDto {
  nameFa: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isActive?: boolean;
  mediaReason?: string;
  contentSupplyMethod?: string;
  learningObjective?: string;
  evaluationCriteria?: string;
  introductionMethod?: string;
  reminderMechanism?: string;
  mediaTypes?: string[];
}

export interface CompetencyUpdateDto extends Partial<CompetencyCreateDto> {}

export interface Recommendation {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail?: string;
  difficultyLevel: string;
  weight: number;
  competencyIds: {
    _id: string;
    name: string;
  }[];
  createdAt: Date;
}

export interface LearningPathItem {
  competency: {
    _id: string;
    name: string;
  };
  currentLevel: number;
  targetLevel: number;
  contents: Recommendation[];
}
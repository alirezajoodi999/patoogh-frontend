export interface UserProgressReport {
  userId: string;
  totalContents: number;
  totalLearningTime: number;
  avgRating: number;
  competencySummary: {
    competency: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    status: 'achieved' | 'in_progress';
  }[];
  achievements: {
    title: string;
    description: string;
    icon: string;
    earnedAt: Date;
  }[];
  recentActivities: {
    contentId: string;
    completedAt: Date;
    rating: number;
    quizScore: number;
  }[];
}

export interface OrganizationalInsights {
  totalUsers: number;
  activeUsers: number;
  participationRate: number;
  totalContents: number;
  competencyProgress: {
    competency: {
      name: string;
      category: string;
    };
    avgCurrentLevel: number;
    avgTargetLevel: number;
    usersCount: number;
  }[];
  topContents: {
    content: {
      title: string;
      type: string;
    };
    avgRating: number;
    totalReviews: number;
  }[];
}

export interface ContentEffectivenessReport {
  contentId: string;
  totalReviews: number;
  avgRating: number;
  ratingsDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  reviews: {
    user: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
}
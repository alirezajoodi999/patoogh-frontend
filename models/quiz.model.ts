export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ContentQuiz {
  _id: string;
  contentId: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  isActive: boolean;
}

export interface QuizResponse {
  quizId: string;
  userId: string;
  answers: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  score: number;
  isPassed: boolean;
  timeSpent?: number;
  completedAt: Date;
}

export interface QuizSubmitDto {
  answers: number[];
  timeSpent?: number;
}

export interface QuizResult {
  score: number;
  isPassed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
}
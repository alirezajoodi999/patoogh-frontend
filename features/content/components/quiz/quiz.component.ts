import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizService } from '../../../../core/services/quiz.service';
import { ToastrService } from 'ngx-toastr';
import { ContentQuiz, QuizResult } from '../../../../models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: false, // ❌ غیر-standalone
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @Input() contentId!: string;

  quiz: ContentQuiz | null = null;
  quizForm: FormGroup;
  loading = false;
  submitted = false;
  result: QuizResult | null = null;
  timeLeft: number = 0;
  timerInterval: any;

  constructor(
    private quizService: QuizService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.quizForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadQuiz();
  }

  loadQuiz(): void {
    this.loading = true;
    this.quizService.getQuizByContent(this.contentId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.initForm();
        if (quiz.timeLimit) {
          this.timeLeft = quiz.timeLimit * 60;
          this.startTimer();
        }
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.quiz = null;
        } else {
          this.toastr.error('Failed to load quiz');
        }
        this.loading = false;
      }
    });
  }

  initForm(): void {
    const controls: { [key: string]: any } = {};
    this.quiz?.questions.forEach((q, index) => {
      controls[`q${index}`] = [null, Validators.required];
    });
    this.quizForm = this.fb.group(controls);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
  }

  submitQuiz(): void {
    if (this.quizForm.invalid) {
      this.toastr.warning('Please answer all questions');
      return;
    }
    if (this.submitted) return;
    this.submitted = true;

    const answers = this.quiz!.questions.map((_, index) => {
      const value = this.quizForm.get(`q${index}`)?.value;
      return value !== null ? parseInt(value) : -1;
    });

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.quizService.submitQuiz(this.contentId, {
      answers,
      timeSpent: this.quiz?.timeLimit ? (this.quiz.timeLimit * 60 - this.timeLeft) : undefined
    }).subscribe({
      next: (result) => {
        this.result = result;
        this.toastr.success(result.isPassed ? 'Congratulations! You passed the quiz.' : 'Better luck next time!');
      },
      error: (err) => {
        this.toastr.error('Failed to submit quiz');
        this.submitted = false;
      }
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
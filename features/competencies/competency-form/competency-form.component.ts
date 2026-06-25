// src/app/features/competencies/competency-form/competency-form.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  CompetencyService, 
  Competency, 
  CompetencyCreatePayload, 
  CompetencyUpdatePayload 
} from '../../../core/services/competency.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  selector: 'app-competency-form',
  templateUrl: './competency-form.component.html',
  styleUrls: ['./competency-form.component.scss']
})
export class CompetencyFormComponent implements OnInit, OnDestroy {
  competencyForm!: FormGroup;
  isEditMode = false;
  competencyId: string | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  submitted = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private competencyService: CompetencyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.competencyForm = this.fb.group({
      nameFa: ['', [Validators.required, Validators.maxLength(100)]],
      nameEn: ['', Validators.maxLength(100)],
      description: ['', Validators.maxLength(500)],
      icon: ['', Validators.maxLength(50)],
      color: ['', [Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      displayOrder: [null, [Validators.min(0), Validators.max(9999)]],
      isActive: [true]
    });
  }

  private checkMode(): void {
    this.competencyId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.competencyId && this.competencyId !== 'new';

    if (this.isEditMode && this.competencyId) {
      this.loadCompetency(this.competencyId);
    }
  }

  private loadCompetency(id: string): void {
    this.loading = true;
    this.error = null;

    this.competencyService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (competency: Competency) => {
          this.competencyForm.patchValue({
            nameFa: competency.nameFa,
            nameEn: competency.nameEn || '',
            description: competency.description || '',
            icon: competency.icon || '',
            color: competency.color || '',
            displayOrder: competency.displayOrder,
            isActive: competency.isActive
          });
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.message || 'خطا در بارگذاری شایستگی';
          this.loading = false;
          console.error('Error loading competency:', err);
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.competencyForm.invalid) {
      this.competencyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const formValue = this.competencyForm.value;
    
    if (this.isEditMode && this.competencyId) {
      const payload: CompetencyUpdatePayload = {
        name_fa: formValue.nameFa,
        name_en: formValue.nameEn || undefined,
        description: formValue.description || undefined,
        icon: formValue.icon || undefined,
        color: formValue.color || undefined,
        display_order: formValue.displayOrder !== null ? formValue.displayOrder : undefined,
        is_active: formValue.isActive
      };

      this.competencyService.update(this.competencyId, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updated: Competency) => {
            this.successMessage = 'شایستگی با موفقیت بروزرسانی شد';
            this.loading = false;
            
            setTimeout(() => {
              this.router.navigate(['/competencies']);
            }, 1500);
          },
          error: (err: any) => {
            this.error = err.message || 'خطا در بروزرسانی شایستگی';
            this.loading = false;
            console.error('Error updating competency:', err);
          }
        });
    } else {
      const payload: CompetencyCreatePayload = {
        name_fa: formValue.nameFa,
        name_en: formValue.nameEn || undefined,
        description: formValue.description || undefined,
        icon: formValue.icon || undefined,
        color: formValue.color || undefined,
        display_order: formValue.displayOrder !== null ? formValue.displayOrder : undefined
      };

      this.competencyService.create(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (created: Competency) => {
            this.successMessage = 'شایستگی با موفقیت ایجاد شد';
            this.loading = false;
            
            setTimeout(() => {
              this.router.navigate(['/competencies']);
            }, 1500);
          },
          error: (err: any) => {
            this.error = err.message || 'خطا در ایجاد شایستگی';
            this.loading = false;
            console.error('Error creating competency:', err);
          }
        });
    }
  }

  onCancel(): void {
    if (this.competencyForm.dirty) {
      if (confirm('تغییرات ذخیره نشده‌اند. آیا مطمئن هستید؟')) {
        this.router.navigate(['/competencies']);
      }
    } else {
      this.router.navigate(['/competencies']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.competencyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.competencyForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'این فیلد الزامی است';
    if (field.errors['maxlength']) {
      const max = field.errors['maxlength'].requiredLength;
      return `حداکثر ${max} کاراکتر مجاز است`;
    }
    if (field.errors['min']) return 'مقدار باید بزرگتر یا مساوی صفر باشد';
    if (field.errors['max']) return 'مقدار بیش از حد مجاز است';
    if (field.errors['pattern'] && fieldName === 'color') {
      return 'فرمت رنگ نامعتبر است (مثال: #FF5733)';
    }

    return 'مقدار نامعتبر است';
  }

  get formTitle(): string {
    return this.isEditMode ? 'ویرایش شایستگی' : 'ایجاد شایستگی جدید';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'بروزرسانی' : 'ایجاد';
  }
}

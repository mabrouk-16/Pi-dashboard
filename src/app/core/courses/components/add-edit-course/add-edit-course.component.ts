import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CourseStatus } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { UrlsNames } from '../../../../shared/models/urlsNames';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-add-edit-course',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './add-edit-course.component.html',
  styleUrls: ['./add-edit-course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditCourseComponent {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  courseId = signal<string | undefined>(undefined);
  submitLoading = signal(false);

  categories = [
    'Frontend',
    'Backend',
    'Design',
    'Mobile',
    'DevOps',
    'Data Science',
  ];
  statusOptions: CourseStatus[] = [
    CourseStatus.Active,
    CourseStatus.Draft,
    CourseStatus.Archived,
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      instructorName: ['', Validators.required],
      category: ['', Validators.required],
      duration: [
        '',
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      status: [CourseStatus.Active, Validators.required],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  private checkEditMode(): void {
    this.courseId.set(this.route.snapshot.paramMap.get('id') || undefined);
    if (this.courseId()) {
      this.isEditMode.set(true);
      this.loadCourseData();
    }
  }

  private loadCourseData(): void {
    const courseId = this.courseId();
    if (!courseId) return;

    this.isLoading.set(true);
    this.courseService
      .getCourseById(courseId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((course) => {
        if (course) {
          this.courseForm.patchValue(course);
        }
      });
  }

  onSubmit(): void {
    if (!this.courseForm.valid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    this.submitLoading.set(true);
    const formData = this.courseForm.value;
    const courseId = this.courseId();

    let req$ =
      this.isEditMode() && courseId
        ? this.courseService.updateCourse(courseId, formData)
        : this.courseService.addCourse(formData);
    req$.pipe(finalize(() => this.submitLoading.set(false))).subscribe(
      () => {
        this.router.navigate(['/', UrlsNames.COURSES]);
      },
      (error) => {
        console.error('Error updating course:', error);
      },
    );
  }

  onCancel(): void {
    this.router.navigate(['/', UrlsNames.COURSES]);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.courseForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control.hasError('minLength')) {
      return `Minimum ${control.getError('minLength').requiredLength} characters required`;
    }
    if (control.hasError('min')) {
      return `Must be greater than ${control.getError('min').min}`;
    }
    if (control.hasError('maxLength')) {
      return `Maximum ${control.getError('maxLength').requiredLength} characters allowed`;
    }
    if (control.hasError('pattern')) {
      if (fieldName === 'duration') return 'Duration must be a valid number';
      if (fieldName === 'price') return 'Price must be a valid number';
    }

    return 'Invalid value';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      courseName: 'Course Name',
      instructorName: 'Instructor Name',
      category: 'Category',
      duration: 'Duration',
      price: 'Price',
      status: 'Status',
      description: 'Description',
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.courseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}

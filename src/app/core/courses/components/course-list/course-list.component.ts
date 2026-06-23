import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Course, CourseStatus } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UrlsNames } from '../../../../shared/models/urlsNames';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    CurrencyPipe,
  ],
  providers: [ToastService],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent {
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  courses = signal<Course[]>([]);
  filteredCourses = signal<Course[]>([]);

  displayColumns: string[] = [
    'courseName',
    'instructorName',
    'category',
    'duration',
    'price',
    'status',
    'actions',
  ];

  searchTerm = signal<string>('');
  selectedStatus = signal<CourseStatus | ''>('');
  isLoading = signal<boolean>(false);
  statusOptions: CourseStatus[] = [
    CourseStatus.Active,
    CourseStatus.Draft,
    CourseStatus.Archived,
  ];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.courseService
      .getAllCourses()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (courses) => {
          this.courses.set(courses);
          this.applyFilters();
        },
        error: () => {
          this.toastService.error('Failed to load courses. Please try again.');
        },
      });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading.set(true);
    this.courseService
      .searchCourses(this.searchTerm(), this.selectedStatus() || undefined)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((filtered) => {
        this.filteredCourses.set(filtered);
      });
  }

  viewCourse(course: Course): void {
    this.router.navigate(['/', UrlsNames.COURSES, course.id]);
  }

  editCourse(course: Course): void {
    this.router.navigate(['/', UrlsNames.COURSES, UrlsNames.EDIT, course.id]);
  }

  deleteCourse(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Course',
        message: `Are you sure you want to delete "${course.courseName}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseService.deleteCourse(course.id).subscribe({
          next: () => {
            this.loadCourses();
            this.toastService.success('Course deleted successfully.');
          },
          error: (err) => {
            this.toastService.error(
              'Failed to delete course. Please try again.',
            );
          },
        });
      }
    });
  }

  addNewCourse(): void {
    this.router.navigate(['/', UrlsNames.COURSES, UrlsNames.ADD]);
  }
  getStatusColor(status: CourseStatus): string {
    switch (status) {
      case CourseStatus.Active:
        return 'accent';
      case CourseStatus.Draft:
        return 'warn';
      case CourseStatus.Archived:
        return 'primary';
      default:
        return 'primary';
    }
  }
}

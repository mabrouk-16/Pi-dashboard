import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
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
import { Course, CourseStatus } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UrlsNames } from '../../../../shared/models/urlsNames';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
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
    CurrencyPipe,
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
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

  constructor() {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.courseService.getAllCourses().subscribe((courses) => {
      this.courses.set(courses);
      this.applyFilters();
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.courseService
      .searchCourses(this.searchTerm(), this.selectedStatus() || undefined)
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
        this.courseService.deleteCourse(course.id).subscribe(() => {
          this.loadCourses();
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

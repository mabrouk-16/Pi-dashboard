import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { UrlsNames } from '../../../../shared/models/urlsNames';
import { finalize } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
  ],
  providers: [ToastService],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailsComponent implements OnInit {
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  course = signal<Course | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  private loadCourse(courseId: string): void {
    this.courseService
      .getCourseById(courseId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (course) => {
          this.course.set(course || null);
        },
        error: () => {
          this.toastService.error('Failed to load course. Please try again.');
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/', UrlsNames.COURSES]);
  }

  editCourse(): void {
    if (this.course()) {
      this.router.navigate([
        '/',
        UrlsNames.COURSES,
        UrlsNames.EDIT,
        this.course()?.id,
      ]);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'accent';
      case 'Draft':
        return 'warn';
      case 'Archived':
        return 'primary';
      default:
        return 'primary';
    }
  }
}

import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, CourseStatus } from '../models/course.model';
import { sampleCourses } from '../models/couses-list';

const STORAGE_KEY = 'courses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private coursesSubject = new BehaviorSubject<Course[]>(
    this.loadCoursesFromStorage(),
  );
  public courses$ = this.coursesSubject.asObservable();

  constructor() {
    this.initializeSampleData();
  }

  private loadCoursesFromStorage(): Course[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCoursesToStorage(courses: Course[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    this.coursesSubject.next(courses);
  }

  private initializeSampleData(): void {
    const courses = this.loadCoursesFromStorage();
    if (courses.length === 0) {
      this.saveCoursesToStorage(sampleCourses);
    }
  }

  getAllCourses(): Observable<Course[]> {
    return this.courses$;
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return new Observable((observer) => {
      const course = this.coursesSubject.value.find((c) => c.id === id);
      observer.next(course);
      observer.complete();
    });
  }

  addCourse(course: Omit<Course, 'id' | 'createdDate'>): Observable<Course> {
    return new Observable((observer) => {
      setTimeout(() => {
        const courses = this.coursesSubject.value;
        const newCourse: Course = {
          ...course,
          id: Date.now().toString(),
          createdDate: new Date().toISOString().split('T')[0],
        };
        courses.push(newCourse);
        this.saveCoursesToStorage(courses);

        observer.next(newCourse);
        observer.complete();
      }, 300);
    });
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return new Observable((observer) => {
      setTimeout(() => {
        const courses = this.coursesSubject.value;
        const index = courses.findIndex((c) => c.id === id);
        if (index !== -1) {
          courses[index] = { ...courses[index], ...course, id };
          this.saveCoursesToStorage(courses);

          observer.next(courses[index]);
          observer.complete();
        } else {
          observer.error('Course not found');
        }
      }, 300);
    });
  }

  deleteCourse(id: string): Observable<boolean> {
    return new Observable((observer) => {
      setTimeout(() => {
        const courses = this.coursesSubject.value;
        const filteredCourses = courses.filter((c) => c.id !== id);
        this.saveCoursesToStorage(filteredCourses);

        observer.next(true);
        observer.complete();
      }, 300);
    });
  }

  searchCourses(searchTerm: string, status?: string): Observable<Course[]> {
    return new Observable((observer) => {
      const courses = this.coursesSubject.value;
      const filtered = courses.filter((course) => {
        const matchesSearch = course.courseName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus = !status || course.status === status;
        return matchesSearch && matchesStatus;
      });
      observer.next(filtered);
      observer.complete();
    });
  }
}

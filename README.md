# Pi Dashboard - Course Management Application

A modern Angular 17 course management dashboard built with standalone components, lazy-loaded routes, and reactive forms. This application features user authentication, CRUD operations for courses, and a responsive Material Design UI.

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Angular CLI**: v17.x (`npm install -g @angular/cli@17`)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Pi-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:4200`

4. **Build for Production**

   ```bash
   npm run build
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

### Default Credentials

- **Username**: `admin`
- **Password**: `123456`

## 🎯 Features

### ✅ Authentication & Security

- 🔐 **Login Page** - Secure authentication with reactive form validation
- 🛡️ **Auth Guard** - Protected routes that require authentication
- 💾 **localStorage Persistence** - User session saved and restored automatically
- 👤 **User Menu** - Dropdown toolbar menu with logout functionality
- 📝 **Session Management** - Automatic login state management with Observables & Signals

### ✅ Course Management (CRUD Operations)

- 📚 **Course List** - Display all courses in Material table
- 🔍 **Search Functionality** - Real-time search by course name
- 🏷️ **Filter by Status** - Filter courses by Active, Draft, or Archived
- ➕ **Add Courses** - Create new courses with comprehensive form validation
- ✏️ **Edit Courses** - Update existing course information
- 📖 **View Details** - Detailed course information page
- 🗑️ **Delete Courses** - Remove courses with confirmation dialog

### ✅ Form Validation & UI

- ✔️ **Reactive Forms** - FormBuilder with Validators for all forms
- 📋 **Real-time Validation** - Field-level error messages on blur
- 🎨 **Material Design** - Professional UI with Angular Material 17.3.10
- 📱 **Responsive Layout** - Mobile-friendly design (desktop, tablet, mobile)
- 🎯 **Loading States** - Visual feedback during operations
- 💬 **Toast Notifications** - Snackbar messages for user feedback

### ✅ Error Handling

- 🚫 **404 Page** - Custom error page for invalid routes
- 🔄 **Auto-redirect** - Unmatched routes redirect to 404
- ⚠️ **Form Error Display** - Inline validation error messages

## 🏗️ System Architecture

### Modern Angular 17 Features

#### 1. **Standalone Components** (`standalone: true`)

All components are built as standalone, eliminating the need for NgModule declarations. This is the modern Angular approach:

```typescript
@Component({
  selector: "app-course-list",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: "./course-list.component.html",
  styleUrl: "./course-list.component.scss",
})
export class CourseListComponent {
  // Component logic
}
```

**Benefits:**

- Simpler component structure
- Direct dependency imports (no module declarations)
- Easier testing and debugging
- Reduced boilerplate code
- Better tree-shaking for smaller bundles

#### 2. **OnPush Change Detection Strategy** (`ChangeDetectionStrategy.OnPush`)

Optimized performance through explicit change detection for specific components:

```typescript
@Component({
  selector: "app-course-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule],
  templateUrl: "./course-card.component.html",
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Output() action = new EventEmitter();
}
```

**Benefits:**

- Improved application performance
- Reduced unnecessary change detection cycles
- Better resource utilization
- Explicit data flow control
- Component only updates when inputs change

#### 3. **Lazy-Loaded Routes**

Feature modules are loaded on-demand to reduce initial bundle size:

```typescript
export const routes: Routes = [
  {
    path: "",
    redirectTo: "courses",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () => import("./core/auth/auth.routes"),
  },
  {
    path: "courses",
    canActivate: [authGuard],
    loadChildren: () => import("./core/courses/pages/courses.routes"),
  },
  {
    path: "404",
    component: NotFoundComponent,
  },
  {
    path: "**",
    redirectTo: "/404",
  },
];
```

**Route Structure:**

- `/` → Redirects to `/courses`
- `/login` → Authentication module (lazy-loaded)
- `/courses` → Course management module (lazy-loaded, protected by authGuard)
- `/courses/add` → Add new course
- `/courses/edit/:id` → Edit existing course
- `/courses/:id` → View course details
- `/404` → Custom 404 error page
- `/**` → Wildcard route (redirects to 404)

**Benefits:**

- Smaller initial bundle size
- Faster app startup
- Modules loaded only when needed
- Better performance for large applications

#### 4. **Modern Control Flow Directives** (@if, @else, @for)

Replace old structural directives with modern Angular syntax for better performance:

**@if() / @else() Syntax**

```html
<!-- Old way (deprecated): -->
<div *ngIf="isLoading">Loading...</div>
<div *ngIf="!isLoading">Content</div>

<!-- Modern way: -->
@if (isLoading) {
<div>Loading...</div>
} @else {
<div>Content</div>
}
```

**@for() Loop Syntax**

```html
<!-- Old way (deprecated): -->
<mat-row *ngFor="let course of courses; let i = index">
  <mat-cell>{{ course.name }}</mat-cell>
</mat-row>

<!-- Modern way: -->
@for (course of courses; track course.id; let i = $index) {
<mat-row>
  <mat-cell>{{ course.name }}</mat-cell>
</mat-row>
}
```

**Benefits:**

- Better performance (no directive overhead)
- Cleaner, more readable syntax
- Type-safe template syntax
- Built-in tracking for @for loops
- Smaller compiled bundle size

**Current Implementation:** All templates use `@if()` and `@for()` instead of `*ngIf` and `*ngFor`.

#### 5. **Dependency Injection & Services**

**Application-Level Services** (`@Injectable({ providedIn: 'root' })`)

Services provided at root level are available application-wide as singletons:

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    this.restoreSession();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Login logic
  }

  logout(): Observable<void> {
    // Logout logic
  }
}
```

Used for application-wide services:

- **AuthService** - Authentication and user management
- **CourseService** - Course CRUD operations

**Feature-Scoped Services** (`@Injectable()`)

Services provided at component level or feature module level:

```typescript
@Injectable()
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration = 3000): void {
    this.snackBar.open(message, "Close", {
      duration,
      panelClass: ["toast-success"],
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  showError(message: string, duration = 3000): void {
    this.snackBar.open(message, "Close", {
      duration,
      panelClass: ["toast-error"],
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
```

Used for feature-specific services:

- **ToastService** - Notification management
- **DialogService** - Modal and dialog handling

**Benefits of Different Providers:**

- `providedIn: 'root'` - Tree-shakeable, singleton, optimal for bundle size
- `@Injectable()` - Feature-scoped, created per feature/component
- Clearer scope management
- Better code organization
- Improved testability

#### 6. **Reactive State Management with RxJS**

Using Observables and BehaviorSubject for reactive data flow:

```typescript
export class CourseService {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  getAllCourses(): Observable<Course[]> {
    const courses = this.coursesSubject.value;
    return of(courses).pipe(
      delay(300), // Simulated API call
    );
  }

  addCourse(course: Omit<Course, "id" | "createdDate">): Observable<Course> {
    const newCourse: Course = {
      ...course,
      id: Date.now(),
      createdDate: new Date(),
    };
    const courses = [...this.coursesSubject.value, newCourse];
    this.coursesSubject.next(courses);
    return of(newCourse).pipe(delay(300));
  }
}
```

**In Components with Async Pipe:**

```html
@if ((courses$ | async) as courses) { @for (course of courses; track course.id) {
<app-course-card [course]="course"></app-course-card>
} }
```

**Benefits:**

- Reactive data flow
- Automatic subscription cleanup with async pipe
- Easy to test
- Type-safe observables
- Reduced memory leaks

#### 7. **TypeScript Type Safety**

Strict typing with interfaces for all data models:

```typescript
export interface Course {
  id: number;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: "Active" | "Draft" | "Archived";
  description?: string;
  createdDate: Date;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
  loginTime?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
```

## 📂 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── models/
│   │   │   │   └── auth.model.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── components/
│   │   │   │   └── login/
│   │   │   │       ├── login.component.ts
│   │   │   │       ├── login.component.html
│   │   │   │       └── login.component.scss
│   │   │   └── auth.routes.ts
│   │   ├── courses/
│   │   │   ├── models/
│   │   │   │   └── course.model.ts
│   │   │   ├── services/
│   │   │   │   └── course.service.ts
│   │   │   ├── components/
│   │   │   │   ├── course-list/
│   │   │   │   ├── add-edit-course/
│   │   │   │   └── course-details/
│   │   │   └── pages/
│   │   │       └── courses.routes.ts
│   ├── shared/
│   │   ├── models/
│   │   │   └── urlsNames.ts
│   │   └── services/
│   │       └── toast.service.ts
│   ├── pages/
│   │   └── not-found/
│   │       ├── not-found.component.ts
│   │       ├── not-found.component.html
│   │       └── not-found.component.scss
│   ├── app.routes.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.component.scss
├── main.ts
├── styles.scss
└── index.html
```

## 🏛️ Architecture Highlights

### Functional & Declarative Approach

- Uses functional route guards (`authGuard` function)
- Declarative component configuration
- Functional programming patterns with RxJS operators

### Type-Safe Development

- Strict TypeScript configuration
- Interfaces for all data models
- No implicit `any` types

### Performance Optimized

- OnPush change detection strategy
- Lazy-loaded feature modules
- Minimal bundle size
- Efficient reactive patterns

### Separation of Concerns

- Components handle UI/presentation
- Services handle business logic
- Guards handle route protection
- Models define data structures

## 📚 Dependencies

### Core Angular (v17.1.0)

- `@angular/core` - Core framework
- `@angular/common` - Common directives and pipes
- `@angular/router` - Routing with lazy loading
- `@angular/forms` - Reactive forms
- `@angular/platform-browser` - Browser utilities

### Angular Material (v17.3.10)

- `@angular/material` - Material components (Table, Form, Button, Dialog, Menu, etc.)
- `@angular/cdk` - Component Development Kit

### RxJS (v7.8.0)

- Reactive programming library for Observables and operators

### TypeScript (v5.3.2)

- Type safety and modern JavaScript features

## 🛣️ Application Routes

| Route               | Feature    | Status    | Description                                |
| ------------------- | ---------- | --------- | ------------------------------------------ |
| `/`                 | Root       | -         | Redirects to `/courses`                    |
| `/login`            | Auth       | Public    | Login page with reactive form              |
| `/courses`          | Courses    | Protected | Display all courses with search and filter |
| `/courses/add`      | Courses    | Protected | Form to add new course                     |
| `/courses/edit/:id` | Courses    | Protected | Form to edit existing course               |
| `/courses/:id`      | Courses    | Protected | View detailed course information           |
| `/404`              | Error Page | Public    | Custom 404 page                            |
| `/**`               | Wildcard   | Public    | Redirects to `/404`                        |

## 🔐 Authentication Flow

1. User navigates to `/courses` (or any protected route)
2. `authGuard` intercepts the navigation
3. Guard checks `authService.isAuthenticated()`
4. If not authenticated: Redirect to `/login`, return `false`
5. If authenticated: Allow navigation, return `true`
6. On login page: User enters credentials (admin/123456)
7. Submit triggers `authService.login(credentials)`
8. Service validates and saves to localStorage
9. Observables update (`user$` and `isAuthenticated$`)
10. Component redirects to `/courses`
11. User can logout via toolbar menu

## 💻 Development Best Practices

### Component Development

```typescript
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./example.component.html",
  styleUrl: "./example.component.scss",
})
export class ExampleComponent implements OnInit {
  ngOnInit(): void {
    // Component initialization
  }
}
```

### Service Development

```typescript
@Injectable({
  providedIn: "root",
})
export class ExampleService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    return this.data$.pipe(switchMap((data) => this.http.get("/api/data")));
  }
}
```

### Template Development

```html
@if (isLoading$ | async) {
<mat-spinner></mat-spinner>
} @else if ((items$ | async) as items) { @for (item of items; track item.id) {
<app-item [item]="item"></app-item>
} } @else {
<p>No items found</p>
}
```

## 📞 Support & Resources

### Official Documentation

- [Angular 17 Docs](https://angular.io)
- [Angular Material](https://material.angular.io)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Getting Help

1. Check browser Console for errors
2. Use Angular DevTools extension
3. Verify Node.js and npm versions
4. Clear node_modules and reinstall if needed

## 📝 Version Information

- **Angular**: 17.1.0
- **TypeScript**: 5.3.2
- **Angular Material**: 17.3.10
- **RxJS**: 7.8.0
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher

## 🎯 Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Open browser: `http://localhost:4200`
4. Login with: `admin` / `123456`
5. Explore course management features

---

**Built with ❤️ using Angular 17, TypeScript, and Modern Web Technologies**

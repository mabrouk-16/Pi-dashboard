import { Routes } from '@angular/router';
import { UrlsNames } from './shared/models/urlsNames';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: UrlsNames.COURSES,
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () => import('./core/auth/auth.routes'),
      },
      {
        path: UrlsNames.COURSES,
        canActivate: [AuthGuard],
        loadChildren: () => import('./core/courses/pages/courses.routes'),
      },
    ],
  },
  {
    path: UrlsNames.NOT_FOUND,
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  {
    path: '**',
    redirectTo: UrlsNames.NOT_FOUND,
  },
];

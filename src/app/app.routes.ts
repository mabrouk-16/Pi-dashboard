import { Routes } from '@angular/router';
import { UrlsNames } from './shared/models/urlsNames';

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
        path: UrlsNames.COURSES,
        loadChildren: () => import('./core/courses/pages/courses.routes'),
      },
    ],
  },
];

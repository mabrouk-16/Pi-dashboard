import { Route } from '@angular/router';
import { UrlsNames } from '../../shared/models/urlsNames';

export default [
  {
    path: UrlsNames.LOGIN,
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
] satisfies Route[];

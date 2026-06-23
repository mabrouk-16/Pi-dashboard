import { Route } from '@angular/router';
import { UrlsNames } from '../../../shared/models/urlsNames';

export default [
  {
    path: '',
    loadComponent: () =>
      import('../components/course-list/course-list.component').then(
        (m) => m.CourseListComponent,
      ),
  },
  {
    path: UrlsNames.ADD,
    loadComponent: () =>
      import('../components/add-edit-course/add-edit-course.component').then(
        (m) => m.AddEditCourseComponent,
      ),
  },
  {
    path: UrlsNames.EDIT + '/:id',
    loadComponent: () =>
      import('../components/add-edit-course/add-edit-course.component').then(
        (m) => m.AddEditCourseComponent,
      ),
  },
  {
    path:':id',
    loadComponent: () =>
      import('../components/course-details/course-details.component').then(
        (m) => m.CourseDetailsComponent,
      ),
  },
] satisfies Route[];

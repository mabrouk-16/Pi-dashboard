import { Course, CourseStatus } from './course.model';

export const sampleCourses: Course[] = [
  {
    id: '1',
    courseName: 'Angular Fundamentals',
    instructorName: 'Ahmed Ali',
    category: 'Frontend',
    duration: 20,
    price: 1500,
    status: CourseStatus.Active,
    description:
      'Learn the basics of Angular framework and build modern web applications.',
    createdDate: '2026-06-01',
  },
  {
    id: '2',
    courseName: 'Advanced TypeScript',
    instructorName: 'Sarah Smith',
    category: 'Frontend',
    duration: 30,
    price: 2000,
    status: CourseStatus.Active,
    description: 'Master TypeScript advanced concepts and best practices.',
    createdDate: '2026-05-15',
  },
  {
    id: '3',
    courseName: 'Node.js Backend Development',
    instructorName: 'John Doe',
    category: 'Backend',
    duration: 25,
    price: 1800,
    status: CourseStatus.Draft,
    description: 'Build scalable backend applications with Node.js.',
    createdDate: '2026-06-10',
  },
];

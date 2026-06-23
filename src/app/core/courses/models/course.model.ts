export interface Course {
  id: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description?: string;
  createdDate: string;
}

export enum CourseStatus {
  Active = 'Active',
  Draft = 'Draft',
  Archived = 'Archived',
}

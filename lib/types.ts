export const courseAreas = [
  "Technology",
  "Health",
  "Education",
  "Engineering",
  "Humanities",
  "Exact Sciences",
  "Communication and Arts",
  "Business",
  "Other",
] as const;
export type CourseArea = (typeof courseAreas)[number];

export interface Member {
  name: string;
  email?: string;
  course: string;
  github: string;
  linkedin: string;
}
export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  image: string;
}
export interface Project {
  id: string;
  title: string;
  area: CourseArea;
  image: string;
  imageAlt: string;
  description: string;
  fullDescription: string;
  members: Member[];
  professor: Professor;
  github: string;
  website?: string;
  video?: string;
  createdAt: string;
}

// Frontend contracts only. Map these to the documented Java API when available.
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  courseArea: string;
  ra: string;
}
export interface RegisterResponse {
  message: string;
}
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface LoginResponse {
  message: string;
  user: { name: string; email: string };
}
export type ProjectRequest = Omit<Project, "id" | "createdAt">;

import { USE_MOCKS } from '@/config/env';
import { Course, CourseImp, CourseFilters, PageResponse } from '@/types';
import { request, buildQuery } from './api';
import { getAllCoursesData, getAllCourseImpsData } from './dataLoader';

export async function getAllCourses(): Promise<Course[]> {
  if (USE_MOCKS) return getAllCoursesData();
  try {
    const response: any = await request('/model/course');
    return response.content || response;
  } catch {
    return getAllCoursesData();
  }
}

export async function getCoursesFiltered(filters: CourseFilters): Promise<PageResponse<Course>> {
  if (USE_MOCKS) {
    let filtered = [...getAllCoursesData()];
    if (filters.category) {
      filtered = filtered.filter((c) => c.category === filters.category);
    }
    const page = filters.page ?? 0;
    const size = filters.size ?? 20;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    return { content, totalPages: Math.ceil(filtered.length / size), totalElements: filtered.length, size, number: page };
  }
  try {
    const qs = buildQuery({
      page: filters.page ?? 0,
      size: filters.size ?? 20,
      sortBy: filters.sortBy ?? 'name',
      direction: filters.direction ?? 'asc',
      category: filters.category,
    });
    const response: any = await request(`/model/course${qs}`);
    return response;
  } catch {
    return { content: getAllCoursesData(), totalPages: 1, totalElements: getAllCoursesData().length, size: 20, number: 0 };
  }
}

export async function getAllCourseImps(): Promise<CourseImp[]> {
  if (USE_MOCKS) return getAllCourseImpsData();
  try {
    const response: any = await request('/course');
    return response.content || response;
  } catch {
    return getAllCourseImpsData();
  }
}

export async function getCourseImpsByCourseId(courseId: number): Promise<CourseImp[]> {
  const allImps = await getAllCourseImps();
  return allImps.filter((imp) => imp.course.id === courseId);
}

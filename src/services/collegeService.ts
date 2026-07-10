import { USE_MOCKS } from '@/config/env';
import { College, CourseImp, CollegeFilters, PageResponse } from '@/types';
import { request, buildQuery } from './api';
import { getAllCourseImps } from './courseService';
import { getAllCollegesData, getAllCourseImpsData } from './dataLoader';

export async function getAllColleges(): Promise<College[]> {
  if (USE_MOCKS) return getAllCollegesData();
  try {
    const response: any = await request('/college?size=500');
    return response.content || response;
  } catch {
    return getAllCollegesData();
  }
}

export async function getCollegesFiltered(filters: CollegeFilters): Promise<PageResponse<College>> {
  if (USE_MOCKS) {
    let filtered = [...getAllCollegesData()];
    if (filters.maxDistance && filters.lat && filters.lon) {
      filtered = filtered.filter((c) => {
        if (!c.locale) return false;
        const R = 6371000;
        const dLat = (c.locale.lat - filters.lat!) * Math.PI / 180;
        const dLon = (c.locale.lon - filters.lon!) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
          Math.cos(filters.lat! * Math.PI / 180) * Math.cos(c.locale.lat * Math.PI / 180) *
          Math.sin(dLon / 2) ** 2;
        const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return dist <= filters.maxDistance!;
      });
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
      lat: filters.lat,
      lon: filters.lon,
      maxDistance: filters.maxDistance,
    });
    const response: any = await request(`/college${qs}`);
    return response;
  } catch {
    return { content: getAllCollegesData(), totalPages: 1, totalElements: getAllCollegesData().length, size: 20, number: 0 };
  }
}

export async function getCollegeCourses(id: number): Promise<CourseImp[]> {
  if (USE_MOCKS) {
    const allImps = getAllCourseImpsData();
    return allImps.filter((imp) => imp.college.id === id);
  }
  try {
    const response: any = await request(`/college/${id}/course`);
    return response.content || response;
  } catch {
    const allImps = getAllCourseImpsData();
    return allImps.filter((imp) => imp.college.id === id);
  }
}

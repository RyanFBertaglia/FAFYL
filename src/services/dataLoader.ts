import coursesData from '@/data/courses.json';
import collegesData from '@/data/colleges.json';
import { College, Course, CourseImp } from '@/types';

interface RawCourse {
  id: number;
  name: string;
  discWeights: Record<string, number>;
  description: string;
  category: string;
}

interface RawLocale {
  lat: number;
  lon: number;
}

interface RawNote {
  mec?: number | null;
  enade?: number | null;
  horario?: string;
  duracao_semestres?: number;
  link?: string;
}

interface RawCourseImp {
  courseId: number;
  name: string;
  note?: RawNote;
  details?: string;
  fees?: number;
  locale?: RawLocale;
}

interface RawCollege {
  id?: number;
  name: string;
  description: string;
  locale: RawLocale;
  image?: string;
  courses: RawCourseImp[];
}

let loaded = false;
let allCourses: Course[] = [];
let allColleges: College[] = [];
let allCourseImps: CourseImp[] = [];
let nextImpId = 1;

function load() {
  if (loaded) return;
  loaded = true;

  const rawCourses = coursesData as RawCourse[];
  const rawColleges = collegesData as RawCollege[];

  allCourses = rawCourses.map((c) => ({
    id: c.id,
    name: c.name,
    discWeights: c.discWeights,
    description: c.description,
    category: c.category as any,
  }));

  const courseMap = new Map<number, Course>();
  for (const c of allCourses) {
    courseMap.set(c.id, c);
  }

  allColleges = rawColleges.map((rc, idx) => {
    const id = rc.id ?? idx + 1;
    const college: College = {
      id,
      name: rc.name,
      description: rc.description,
      locale: rc.locale,
      image: rc.image || '',
      courses: [],
    };

    for (const rawImp of rc.courses) {
      const course = courseMap.get(rawImp.courseId);
      if (!course) continue;

      const impId = nextImpId++;
      const imp: CourseImp = {
        id: impId,
        name: rawImp.name,
        course,
        college,
        note: rawImp.note ?? {},
        details: rawImp.details ?? '',
        fees: rawImp.fees ?? 0,
        locale: rawImp.locale ?? rc.locale,
      };
      college.courses.push(imp);
      allCourseImps.push(imp);
    }

    return college;
  });
}

export function getAllCoursesData(): Course[] {
  load();
  return allCourses;
}

export function getAllCollegesData(): College[] {
  load();
  return allColleges;
}

export function getAllCourseImpsData(): CourseImp[] {
  load();
  return allCourseImps;
}

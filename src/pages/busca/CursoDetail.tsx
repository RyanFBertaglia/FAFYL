import Background from '@/components/layout/background';
import MapModal from '@/components/MapModal';
import CursoDetailSkeleton from '@/components/skeletons/CursoDetailSkeleton';
import { getAllCourses } from '@/services/courseService';
import { getCollegesWithCourse } from '@/services/fafylService';
import { Course, College, CourseImp } from '@/types';
import { IoChevronDown, IoMap, IoOpenOutline, IoTimeOutline, IoCalendarOutline, IoStar, IoStarOutline } from 'react-icons/io5';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const PERIOD_LABELS: Record<string, string> = {
  matutino: 'Matutino',
  vespertino: 'Vespertino',
  noturno: 'Noturno',
  integral: 'Integral',
};

function renderStars(value: number | null | undefined): React.ReactNode {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= value
        ? <IoStar key={i} className="inline text-yellow-500" size={14} />
        : <IoStarOutline key={i} className="inline text-muted-foreground" size={14} />
    );
  }
  return <span className="inline-flex items-center gap-0.5">{stars} <span className="text-xs text-muted-foreground ml-1">{value}/{5}</span></span>;
}

interface NoteEntry {
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

function useNoteEntries(imp: CourseImp): NoteEntry[] {
  const entries: NoteEntry[] = [];

  if (imp.note) {
    if ('mec' in imp.note) {
      entries.push({
        label: 'Conceito MEC',
        icon: <IoStar size={14} className="text-yellow-500" />,
        content: renderStars(imp.note.mec as number | null),
      });
    }
    if ('enade' in imp.note) {
      entries.push({
        label: 'Conceito ENADE',
        icon: <IoStar size={14} className="text-yellow-500" />,
        content: renderStars(imp.note.enade as number | null),
      });
    }
    if ('horario' in imp.note && imp.note.horario) {
      entries.push({
        label: 'Período',
        icon: <IoTimeOutline size={14} className="text-primary" />,
        content: <span>{PERIOD_LABELS[imp.note.horario as string] || (imp.note.horario as string)}</span>,
      });
    }
    if ('duracao_semestres' in imp.note && imp.note.duracao_semestres) {
      const sem = imp.note.duracao_semestres as number;
      entries.push({
        label: 'Duração',
        icon: <IoCalendarOutline size={14} className="text-primary" />,
        content: <span>{sem} semestres ({Math.round(sem / 2)} anos)</span>,
      });
    }
  }

  return entries;
}

export default function CursoDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const highlightCollegeId = searchParams.get('collegeId');
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [items, setItems] = useState<{ college: College; courseImp: CourseImp }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedImp, setSelectedImp] = useState<CourseImp | null>(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const courseId = parseInt(id || '0', 10);
    Promise.all([getAllCourses(), getCollegesWithCourse(courseId)]).then(
      ([courses, results]) => {
        const found = courses.find((c) => c.id === courseId);
        setCourse(found || null);
        setItems(results);
        setLoading(false);
      }
    );
  }, [id]);

  useEffect(() => {
    if (!loading && highlightCollegeId && items.length > 0 && !scrolledRef.current) {
      scrolledRef.current = true;
      const collegeIdNum = parseInt(highlightCollegeId, 10);
      setTimeout(() => {
        const el = document.getElementById(`college-imp-${collegeIdNum}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-yellow-400', 'rounded-2xl');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-yellow-400', 'rounded-2xl');
          }, 2500);
        }
      }, 200);
    }
  }, [loading, highlightCollegeId, items]);

  const handleViewMap = (imp: CourseImp) => {
    setSelectedImp(imp);
    setMapVisible(true);
  };

  if (loading) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1"><CursoDetailSkeleton /></div>
        </PageTransition>
      </Background>
    );
  }

  if (!course) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Curso não encontrado</p>
          </div>
        </PageTransition>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton>
      <PageTransition>
        <div className="flex-1 overflow-y-auto p-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-6" variants={fadeUp}>
              <h1 className="text-2xl font-bold text-primary mb-1.5">{course.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
            </motion.div>

            <motion.h2 className="text-base font-semibold text-foreground mb-3" variants={fadeUp}>
              Faculdades com {course.name}:
            </motion.h2>

            {items.length === 0 ? (
              <motion.p className="text-center text-sm text-muted-foreground mt-10" variants={fadeUp}>
                Nenhuma faculdade com esse curso
              </motion.p>
            ) : (
              <motion.div className="space-y-3 pb-24" variants={fadeUp}>
                {items.map(({ college, courseImp }, index) => (
                  <motion.div key={courseImp.id} variants={fadeUp} custom={index}>
                    <CourseImpCard
                      imp={{ ...courseImp, college }}
                      onViewMap={handleViewMap}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {selectedImp?.locale && (
          <MapModal
            visible={mapVisible}
            onClose={() => {
              setMapVisible(false);
              setSelectedImp(null);
            }}
            destination={{
              lat: selectedImp.locale.lat,
              lon: selectedImp.locale.lon,
              name: selectedImp.name,
              collegeName: selectedImp.college?.name || '',
            }}
          />
        )}
      </PageTransition>
    </Background>
  );
}

interface CourseImpCardProps {
  imp: CourseImp;
  onViewMap: (imp: CourseImp) => void;
}

function CourseImpCard({ imp, onViewMap }: CourseImpCardProps) {
  const [expanded, setExpanded] = useState(false);
  const collegeName = imp.college?.name || 'Faculdade';
  const collegeId = imp.college?.id;
  const noteEntries = [] as NoteEntry[];

  // Build note entries manually here too (can't use hook in non-hook context)
  if (imp.note) {
    if ('mec' in imp.note) {
      noteEntries.push({
        label: 'Conceito MEC',
        icon: <IoStar key="mec-icon" size={14} className="text-yellow-500" />,
        content: renderStars(imp.note.mec as number | null),
      });
    }
    if ('enade' in imp.note) {
      noteEntries.push({
        label: 'Conceito ENADE',
        icon: <IoStar key="enade-icon" size={14} className="text-yellow-500" />,
        content: renderStars(imp.note.enade as number | null),
      });
    }
    if ('horario' in imp.note && imp.note.horario) {
      noteEntries.push({
        label: 'Período',
        icon: <IoTimeOutline key="time-icon" size={14} className="text-primary" />,
        content: <span>{PERIOD_LABELS[imp.note.horario as string] || (imp.note.horario as string)}</span>,
      });
    }
    if ('duracao_semestres' in imp.note && imp.note.duracao_semestres) {
      const sem = imp.note.duracao_semestres as number;
      noteEntries.push({
        label: 'Duração',
        icon: <IoCalendarOutline key="cal-icon" size={14} className="text-primary" />,
        content: <span>{sem} semestres ({Math.round(sem / 2)} anos)</span>,
      });
    }
  }

  const hasLink = imp.note && typeof imp.note.link === 'string' && imp.note.link.length > 0;

  const feesLabel = imp.fees === 0
    ? 'Pública'
    : imp.fees
      ? `R$ ${imp.fees.toFixed(2).replace('.', ',')}/mês`
      : null;

  return (
    <div id={collegeId ? `college-imp-${collegeId}` : undefined}>
      <Card className="rounded-2xl overflow-hidden">
        <button
          className="w-full text-left p-4 cursor-pointer border-none bg-transparent active:scale-[0.99] transition-transform"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-primary mb-0.5 truncate">{collegeName}</p>
              {feesLabel && (
                <p className={`text-sm font-medium ${imp.fees === 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {feesLabel}
                </p>
              )}
            </div>
            <div className="transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <IoChevronDown size={20} className="text-primary shrink-0" />
            </div>
          </div>
        </button>

        <div
          className="overflow-hidden transition-all duration-250 ease-out"
          style={{
            height: expanded ? 'auto' : 0,
            opacity: expanded ? 1 : 0,
          }}
        >
          <CardContent className="pt-0 pb-4 px-4">
            <div className="pt-3 border-t border-border">
              {imp.details && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{imp.details}</p>
              )}

              {noteEntries.length > 0 && (
                <div className="space-y-2 mb-3">
                  {noteEntries.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {entry.icon}
                      <span className="text-muted-foreground">{entry.label}:</span>
                      <span className="text-foreground font-medium">{entry.content}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {hasLink && (
                  <a
                    href={imp.note.link as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="outline" size="lg" className="w-full gap-1.5">
                      <IoOpenOutline size={16} />
                      Ver no site
                    </Button>
                  </a>
                )}

                {imp.locale && (
                  <Button
                    variant="outline" size="lg"
                    className={`gap-1.5 ${hasLink ? 'flex-1' : 'w-full'}`}
                    onClick={(e) => { e.stopPropagation(); onViewMap(imp); }}
                  >
                    <IoMap size={16} />
                    Mapa
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

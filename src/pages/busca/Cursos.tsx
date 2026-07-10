import Background from '@/components/layout/background';
import { IoSearch, IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Course, CourseFilters } from '@/types';
import { getCoursesFiltered, getAllCourses } from '@/services/courseService';
import CursosSkeleton from '@/components/skeletons/CursosSkeleton';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import PageTransition from '@/components/layout/PageTransition';
import FilterBar from '@/components/filter/FilterBar';
import Pagination from '@/components/filter/Pagination';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CursosScreen() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getAllCourses().then((data) => {
      setCourses(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setPage(0);
    if (search.trim() === '') {
      setFiltered(courses);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        courses.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      );
    }
  }, [search, courses]);

  const fetchFiltered = useCallback(async (filters: CourseFilters) => {
    setLoading(true);
    const res = await getCoursesFiltered(filters);
    setFiltered(res.content);
    setTotalPages(res.totalPages);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (category || sortBy !== 'name') {
      fetchFiltered({ category: category || undefined, sortBy, direction, page, size: 20 });
    } else {
      setPage(0);
    }
  }, [category, sortBy, direction, page, fetchFiltered]);

  const handleSortChange = (by: string, dir: 'asc' | 'desc') => {
    setSortBy(by);
    setDirection(dir);
    setPage(0);
  };

  const ITEMS_PER_PAGE = 20;
  const sourceList = category || sortBy !== 'name' ? filtered : (
    search.trim() === '' ? courses : filtered
  );
  const displayTotalPages = category || sortBy !== 'name' ? totalPages : Math.ceil(sourceList.length / ITEMS_PER_PAGE);
  const displayList = category || sortBy !== 'name' ? filtered : sourceList.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <Background title="Cursos" showBackButton onBackPress={() => navigate('/busca')}>
      <PageTransition>
        <div className="flex-1 p-4">
          <motion.div
            className="relative mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10 rounded-2xl"
              placeholder="Buscar curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          <FilterBar
            showCategory
            showFees={false}
            category={category}
            onCategoryChange={(v) => { setCategory(v); setPage(0); }}
            sortBy={sortBy}
            direction={direction}
            onSortChange={handleSortChange}
          />

          {loading ? (
            <CursosSkeleton />
          ) : displayList.length === 0 ? (
            <motion.p
              className="text-center text-sm text-muted-foreground mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Nenhum curso encontrado
            </motion.p>
          ) : (
            <motion.div
              className="space-y-3 pb-24"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayList.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card
                    className="p-4 cursor-pointer"
                    onClick={() => navigate(`/busca/${item.id}/curso`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-primary truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                      <div className="shrink-0 group-hover:translate-x-1 transition-transform">
                        <IoChevronForward size={20} className="text-primary shrink-0" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {displayTotalPages > 1 && (
            <Pagination current={page} total={displayTotalPages} onChange={setPage} />
          )}
        </div>
      </PageTransition>
    </Background>
  );
}
import { User, Course } from "@/src/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlayCircle, Star, Clock, BookOpen, ChevronRight, Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MyCoursesProps {
  user: User | null;
}

export default function MyCourses({ user }: MyCoursesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!user) return null;

  const enrolledCourses = user.enrollments?.map(e => e.course).filter(Boolean) as Course[] || [];
  
  const getCourseProgress = (courseId: string) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (!course || !course.modules) return 0;
    
    const lessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    if (lessonIds.length === 0) return 0;
    
    const completedLessons = user.progress?.filter(p => p.completed && lessonIds.includes(p.lessonId)).length || 0;
    return Math.round((completedLessons / lessonIds.length) * 100);
  };

  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(enrolledCourses.map(c => c.category)));

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-heading">Meus Cursos</h1>
          <p className="text-muted-foreground font-medium">Você tem <span className="text-primary font-bold">{enrolledCourses.length}</span> cursos em sua jornada de aprendizado.</p>
        </div>
        <Link to="/courses">
          <Button className="rounded-2xl px-8 h-12 premium-gradient shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            Explorar Catálogo
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Pesquisar em meus cursos..." 
            className="pl-12 h-14 bg-card border-none rounded-2xl shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            className="rounded-xl h-14 px-6 whitespace-nowrap font-bold"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="rounded-xl h-14 px-6 whitespace-nowrap font-bold"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
          <Button variant="outline" size="icon" className="rounded-xl h-14 w-14 flex-shrink-0">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, i) => (
            <motion.div
              layout
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-card group h-full flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                      <PlayCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] font-bold text-primary shadow-sm uppercase tracking-widest">
                      {course.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors line-clamp-2 font-heading leading-tight">{course.title}</h3>
                  
                  <div className="space-y-6 mt-auto">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="text-primary">{getCourseProgress(course.id)}%</span>
                      </div>
                      <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${getCourseProgress(course.id)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute h-full premium-gradient rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" /> {course.duration || 0}h
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-primary" /> {course.modules?.length || 0} Módulos
                        </div>
                      </div>
                      <Link to={`/student/course/${course.id}`}>
                        <Button size="sm" className="rounded-xl px-6 h-10 font-bold shadow-lg shadow-primary/10">
                          Continuar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-border/50"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold font-heading">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Tente ajustar sua pesquisa ou explore novos cursos em nosso catálogo completo.</p>
          <Link to="/courses">
            <Button className="mt-8 rounded-2xl px-10 h-14 premium-gradient shadow-xl shadow-primary/20">
              Ver Catálogo Completo
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

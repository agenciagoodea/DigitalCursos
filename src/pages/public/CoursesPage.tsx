import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, Clock, BookOpen, ArrowRight } from "lucide-react";
import { api } from "@/src/lib/api";
import { Course } from "@/src/types";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.courses.list();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = ["Todos", "Desenvolvimento Web", "Design", "Marketing", "Negócios"];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando cursos...</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Explore Nosso Catálogo</h1>
          <p className="text-slate-500 text-lg">Descubra cursos criados por especialistas para impulsionar sua carreira.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="O que você quer aprender hoje?" 
              className="pl-12 h-12 rounded-2xl border-slate-200 bg-slate-50 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "ghost"}
                className={cn(
                  "rounded-full px-6 whitespace-nowrap",
                  selectedCategory === cat ? "shadow-lg shadow-primary/20" : "text-slate-500"
                )}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-white group h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-yellow-500 mb-3">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-700">{course.rating || 0}</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">({course.studentsCount || 0} alunos)</span>
                  </div>
                  <Link to={`/courses/${course.id}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{course.title}</h3>
                  </Link>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">{course.description}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {course.duration || 0}h
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> {course.modules?.length || 0} módulos
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                          {course.instructor?.name?.charAt(0) || 'I'}
                        </div>
                        <span className="text-xs font-medium text-slate-600">{course.instructor?.name || 'Instrutor'}</span>
                      </div>
                      <Link to={`/courses/${course.id}`} className={cn(buttonVariants({ size: "sm" }), "rounded-full px-6 font-bold")}>
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900">Nenhum curso encontrado</h3>
            <p className="text-slate-500 mt-2">Tente ajustar seus filtros ou pesquisar por outro termo.</p>
            <Button variant="outline" className="mt-8 rounded-full px-8" onClick={() => {setSearchQuery(""); setSelectedCategory("Todos");}}>
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


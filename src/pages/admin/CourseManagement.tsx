import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/src/lib/api";
import { Course } from "@/src/types";
import { 
  Plus, 
  MoreVertical, 
  Edit2, 
  Layers, 
  Trash2, 
  Video, 
  Eye 
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const data = await api.courses.listAdmin();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.")) return;
    try {
      await api.courses.delete(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Erro ao excluir curso.");
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando cursos...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestão de Cursos</h1>
          <p className="text-slate-500 mt-1">Crie, edite e organize seus conteúdos educacionais.</p>
        </div>
        <Button onClick={() => navigate("edit/new")} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Criar Novo Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-none shadow-sm rounded-[2rem] bg-white group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={course.thumbnail || "https://picsum.photos/seed/course/800/450"} 
                alt={course.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <Badge className={cn(
                  "rounded-full px-3 uppercase text-[10px] font-bold border-none",
                  course.status === 'PUBLISHED' ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                )}>
                  {course.status === 'PUBLISHED' ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full h-8 w-8 bg-white/90 backdrop-blur shadow-sm")}>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => navigate(`edit/${course.id}`)} className="flex items-center cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4" /> Editar Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`edit/${course.id}`)} className="flex items-center cursor-pointer">
                      <Layers className="mr-2 h-4 w-4" /> Gerenciar Módulos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(course.id)} className="flex items-center text-destructive focus:text-destructive cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir Curso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{course.category}</span>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Video className="h-3 w-3" /> {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} aulas
                </div>
              </div>
              <h3 className="text-lg font-bold mb-4 line-clamp-1">{course.title}</h3>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Instrutor</span>
                  <span className="text-xs font-bold text-slate-700">{course.instructor?.name || 'Instrutor'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/courses/${course.id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full h-9 w-9 hover:bg-primary/5 hover:text-primary")}>
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Button onClick={() => navigate(`edit/${course.id}`)} variant="outline" size="sm" className="rounded-full px-4 border-slate-200">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Course Card */}
        <button 
          onClick={() => navigate("edit/new")}
          className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-colors group h-full min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Plus className="h-8 w-8 text-slate-400 group-hover:text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Criar Novo Curso</h3>
          <p className="text-sm text-slate-500 mt-1">Adicione novos conteúdos à plataforma</p>
        </button>
      </div>
    </div>
  );
}


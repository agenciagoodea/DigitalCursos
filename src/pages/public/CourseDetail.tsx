import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/src/lib/api";
import { Course, User } from "@/src/types";
import { 
  Star, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  PlayCircle, 
  Shield, 
  Award, 
  Users,
  ChevronRight,
  ArrowLeft,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CourseDetailProps {
  user: User | null;
}

export default function CourseDetail({ user }: CourseDetailProps) {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.courses.get(courseId!);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      await api.courses.enroll(courseId!);
      alert("Matrícula realizada com sucesso!");
      navigate("/student/courses");
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Erro ao realizar matrícula. Você já pode estar matriculado.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando detalhes...</div>;
  if (!course) return null;

  const isEnrolled = user?.enrollments?.some(e => e.courseId === course.id);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl space-y-6">
            <Link to="/courses" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para cursos
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary hover:bg-primary text-white border-none rounded-full px-4 py-1 uppercase text-[10px] font-bold tracking-widest">
                {course.category}
              </Badge>
              <Badge variant="outline" className="text-white border-white/20 rounded-full px-4 py-1 uppercase text-[10px] font-bold tracking-widest">
                {course.level}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">{course.title}</h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star className="h-5 w-5 fill-yellow-400" />
                <span className="text-lg font-bold text-white">{course.rating || 4.8}</span>
                <span className="text-slate-500">(1.2k avaliações)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="h-5 w-5" />
                <span>{course.studentsCount || 0} alunos matriculados</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-5 w-5" />
                <span>Última atualização: {new Date(course.updatedAt || '').toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <Avatar className="h-12 w-12 border-2 border-white/10">
                <AvatarImage src={course.instructor?.avatar} />
                <AvatarFallback>{course.instructor?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Instrutor</p>
                <p className="font-bold text-lg">{course.instructor?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <div className="p-8 md:p-10 space-y-10">
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    O que você vai aprender
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Domine os conceitos fundamentais e avançados",
                      "Aprenda na prática com projetos reais",
                      "Desenvolva habilidades de resolução de problemas",
                      "Acesso a materiais exclusivos e atualizados",
                      "Suporte direto com o instrutor",
                      "Certificado de conclusão reconhecido"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-slate-600">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    Conteúdo do Curso
                  </h2>
                  <div className="flex items-center justify-between mb-4 text-sm text-slate-500 font-medium">
                    <span>{course.modules?.length || 0} módulos • {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} aulas</span>
                    <button className="text-primary font-bold hover:underline">Expandir tudo</button>
                  </div>
                  <Accordion multiple className="space-y-3">
                    {course.modules?.map((module) => (
                      <AccordionItem key={module.id} value={module.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">Módulo {module.order}</span>
                            <span className="font-bold text-slate-900">{module.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 pt-2 space-y-2">
                          {module.lessons?.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between py-2.5 group">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-slate-400 font-medium">{lesson.duration} min</span>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              </div>
            </Card>
          </div>

          {/* Sidebar - Pricing & Enrollment */}
          <div className="space-y-6">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white sticky top-24">
              <div className="aspect-video relative group cursor-pointer">
                <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <PlayCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl text-center text-xs font-bold text-primary shadow-lg">
                  Assista ao vídeo de introdução
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">R$ {course.price?.toFixed(2)}</span>
                  <span className="text-slate-400 line-through text-sm">R$ {(course.price! * 1.5).toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  {isEnrolled ? (
                    <Button onClick={() => navigate("/student/courses")} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                      Continuar Aprendendo
                    </Button>
                  ) : (
                    <Button onClick={handleEnroll} disabled={enrolling} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                      {enrolling ? "Processando..." : "Matricular-se Agora"}
                    </Button>
                  )}
                  <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Garantia de 7 dias ou seu dinheiro de volta</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-sm font-bold text-slate-900">Este curso inclui:</p>
                  <ul className="space-y-3">
                    {[
                      { icon: PlayCircle, text: "Acesso vitalício ao conteúdo" },
                      { icon: Award, text: "Certificado de conclusão" },
                      { icon: Shield, text: "Suporte prioritário" },
                      { icon: Users, text: "Comunidade exclusiva" }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                        <item.icon className="h-4 w-4 text-primary" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

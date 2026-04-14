import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, PlayCircle, CheckCircle2, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/src/lib/api";
import { Course } from "@/src/types";

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.courses.list();
        setCourses(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950 to-slate-950"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30 mb-6 inline-block">
                A Nova Era do Ensino Digital
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
                Transforme seu <span className="text-primary">Futuro</span> com Conhecimento
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Acesse cursos premium criados pelos melhores especialistas do mercado. Aprenda no seu ritmo, em qualquer lugar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20">
                <Link to="/courses" className="flex items-center">Ver Todos os Cursos <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-700 hover:bg-slate-900">
                Como Funciona
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-12 flex items-center justify-center gap-8 text-slate-500"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">10k+ Alunos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">4.9/5 Avaliação</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">Certificado MEC</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Por que escolher a EduVibe?</h2>
            <p className="text-slate-600">Nossa plataforma foi desenhada para oferecer a melhor experiência de aprendizado possível.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Conteúdo Premium",
                desc: "Aulas em alta definição com materiais complementares exclusivos.",
                icon: PlayCircle,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "Certificação Automática",
                desc: "Receba seu certificado instantaneamente após concluir o curso.",
                icon: Award,
                color: "bg-purple-50 text-purple-600"
              },
              {
                title: "Suporte Especializado",
                desc: "Tire suas dúvidas diretamente com os instrutores e mentores.",
                icon: Users,
                color: "bg-green-50 text-green-600"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Cursos em Destaque</h2>
              <p className="text-slate-600">Explore os cursos mais procurados da nossa plataforma.</p>
            </div>
            <Button variant="ghost" className="text-primary font-semibold">
              <Link to="/courses" className="flex items-center">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <motion.div key={course.id} whileHover={{ scale: 1.02 }} className="group">
                <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-white">
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
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 text-yellow-500 mb-3">
                      <Star className="h-4 w-4 fill-yellow-500" />
                      <span className="text-sm font-bold text-slate-700">{course.rating || 0}</span>
                      <span className="text-xs text-slate-400 font-normal">({course.studentsCount || 0} alunos)</span>
                    </div>
                    <Link to={`/courses/${course.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{course.title}</h3>
                    </Link>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                          {course.instructor?.name?.charAt(0) || 'I'}
                        </div>
                        <span className="text-xs font-medium text-slate-600">{course.instructor?.name || 'Instrutor'}</span>
                      </div>
                      <Button size="sm" className="rounded-full px-4">
                        <Link to={`/courses/${course.id}`}>Saiba Mais</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {courses.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">Nenhum curso em destaque no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Alunos Ativos", value: "15k+" },
              { label: "Cursos Publicados", value: "200+" },
              { label: "Instrutores Experts", value: "50+" },
              { label: "Certificados Emitidos", value: "12k+" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-extrabold">{stat.value}</div>
                <div className="text-primary-foreground/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Pronto para começar sua jornada?</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Junte-se a milhares de alunos e comece a aprender hoje mesmo com os melhores instrutores do Brasil.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full w-full sm:w-auto">
                  <Link to="/register">Cadastrar Gratuitamente</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-slate-700 text-white hover:bg-slate-800 w-full sm:w-auto">
                  Falar com Consultor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

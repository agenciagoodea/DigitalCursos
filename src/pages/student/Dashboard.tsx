import { User, Badge, Course } from "@/src/types";
import { api } from "@/src/lib/api";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  PlayCircle, 
  CheckCircle2,
  ChevronRight,
  Star,
  Rocket,
  Flame,
  Trophy,
  Target,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MOCK_COURSES } from "@/src/lib/mock-data";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { cn } from "@/lib/utils";

const activityData = [
  { name: "Seg", hours: 2, tasks: 3 },
  { name: "Ter", hours: 4, tasks: 5 },
  { name: "Qua", hours: 1.5, tasks: 2 },
  { name: "Qui", hours: 5, tasks: 7 },
  { name: "Sex", hours: 3, tasks: 4 },
  { name: "Sáb", hours: 0.5, tasks: 1 },
  { name: "Dom", hours: 2, tasks: 2 },
];

const categoryData = [
  { name: 'Frontend', value: 400 },
  { name: 'Backend', value: 300 },
  { name: 'Design', value: 300 },
  { name: 'Mobile', value: 200 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'];

const BadgeIcon = ({ icon, className }: { icon: string, className?: string }) => {
  switch (icon) {
    case 'Rocket': return <Rocket className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Trophy': return <Trophy className={className} />;
    default: return <Award className={className} />;
  }
};

interface StudentDashboardProps {
  user: User | null;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await api.courses.list();
        setRecommendedCourses(data.filter((c: Course) => !user?.enrollments?.some(e => e.courseId === c.id)).slice(0, 2));
      } catch (error) {
        console.error("Error fetching recommended courses:", error);
      }
    };
    if (user) fetchRecommended();
  }, [user]);

  if (!user) return null;

  const enrolledCourses = user.enrollments?.map(e => e.course).filter(Boolean) as Course[] || [];
  const completedCount = user.progress?.filter(p => p.completed).length || 0;
  const inProgressCount = enrolledCourses.length - completedCount;

  const getCourseProgress = (courseId: string) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (!course || !course.modules) return 0;
    
    const lessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    if (lessonIds.length === 0) return 0;
    
    const completedLessons = user.progress?.filter(p => p.completed && lessonIds.includes(p.lessonId)).length || 0;
    return Math.round((completedLessons / lessonIds.length) * 100);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold tracking-tight font-heading">Olá, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground mt-2 text-lg">É bom ver você de volta. Seu progresso hoje está incrível.</p>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-card p-3 rounded-3xl shadow-sm border border-border/50">
            <div className="bg-orange-500/10 p-2.5 rounded-2xl">
              <Flame className="h-6 w-6 text-orange-500 fill-orange-500/20" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Ofensiva</p>
              <p className="text-lg font-bold">12 Dias</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-card p-3 rounded-3xl shadow-sm border border-border/50">
            <div className="bg-primary/10 p-2.5 rounded-2xl">
              <Zap className="h-6 w-6 text-primary fill-primary/20" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">XP Total</p>
              <p className="text-lg font-bold">12.450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Cursos Ativos", value: inProgressCount, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Concluídos", value: completedCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Horas de Estudo", value: "48h", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Certificados", value: user.certificates?.length || 0, icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden hover:shadow-md transition-all group">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold font-heading">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section: Courses in Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-heading">Continuar Aprendendo</h2>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Link to="/student/courses" className="flex items-center">Ver todos <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {enrolledCourses.length > 0 ? enrolledCourses.map((course, i) => (
                <motion.div 
                  key={course.id} 
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden group hover:bg-muted/30 transition-colors">
                    <CardContent className="p-4 flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{course.category}</span>
                          <span className="text-xs font-bold text-muted-foreground">{getCourseProgress(course.id)}%</span>
                        </div>
                        <h3 className="font-bold text-lg truncate mb-3 font-heading">{course.title}</h3>
                        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getCourseProgress(course.id)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 hover:bg-primary/10 hover:text-primary">
                        <Link to={`/student/course/${course.id}`}><ChevronRight className="h-6 w-6" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )) : (
                <div className="text-center py-16 bg-card rounded-[3rem] border-2 border-dashed border-border/50">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold font-heading">Nenhum curso em andamento</h3>
                  <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Explore nosso catálogo e comece sua jornada de aprendizado hoje mesmo!</p>
                  <Link to="/student/courses">
                    <Button className="rounded-full px-8 h-12 shadow-lg shadow-primary/20">
                      Explorar Cursos
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-card">
              <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between mb-6">
                <div>
                  <CardTitle className="text-xl font-bold font-heading">Atividade Semanal</CardTitle>
                  <p className="text-sm text-muted-foreground">Horas dedicadas aos estudos</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))'}}
                      cursor={{stroke: 'hsl(var(--primary))', strokeWidth: 2}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorHours)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-card">
              <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between mb-6">
                <div>
                  <CardTitle className="text-xl font-bold font-heading">Distribuição</CardTitle>
                  <p className="text-sm text-muted-foreground">Foco por categoria</p>
                </div>
                <div className="bg-indigo-500/10 p-2 rounded-xl">
                  <PieChart className="h-5 w-5 text-indigo-500" />
                </div>
              </CardHeader>
              <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-heading">12</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Cursos</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar: Gamification & Certificates */}
        <div className="space-y-8">
          {/* Badges Section */}
          <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-heading">Suas Medalhas</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{user.badges?.length || 0}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {user.badges?.map((badge: Badge) => (
                <motion.div 
                  key={badge.id}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex flex-col items-center text-center group cursor-help"
                  title={badge.description}
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2 shadow-inner border border-border/50 group-hover:border-primary/50 transition-colors">
                    <BadgeIcon icon={badge.icon} className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter line-clamp-1">{badge.title}</span>
                </motion.div>
              ))}
              <div className="flex flex-col items-center text-center opacity-30 grayscale">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-2 border border-dashed border-slate-300">
                  <Award className="h-8 w-8 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bloqueado</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-8 rounded-2xl border-dashed">Ver Todas as Medalhas</Button>
          </Card>

          {/* Next Achievement */}
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Trophy className="h-32 w-32" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Award className="h-7 w-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-heading">Próxima Conquista</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Conclua o curso de React 19 para ganhar seu certificado de especialista.</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Progresso</span>
                  <span className="text-primary">45%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
              <Button className="w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100 h-12 font-bold text-lg shadow-xl shadow-white/5">
                Continuar Curso
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading">Recomendados</h2>
            <div className="space-y-4">
              {recommendedCourses.map((course) => (
                <motion.div key={course.id} whileHover={{ y: -5 }}>
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-card hover:shadow-md transition-all">
                    <CardContent className="p-4 flex gap-4">
                      <img src={course.thumbnail} className="w-24 h-24 rounded-2xl object-cover shadow-sm" referrerPolicy="no-referrer" />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="font-bold text-sm line-clamp-2 font-heading leading-tight">{course.title}</h4>
                          <div className="flex items-center gap-1.5 text-amber-500 mt-2">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            <span className="text-xs font-bold">{course.rating || 0}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{course.duration || 0}h de conteúdo</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {recommendedCourses.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma recomendação no momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

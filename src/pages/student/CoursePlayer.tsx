import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User, Course, Lesson, Module, Progress, QuizAttempt, Comment } from "@/src/types";
import { MOCK_COURSES, MOCK_QUIZZES } from "@/src/lib/mock-data";
import QuizComponent from "@/src/components/learning/QuizComponent";
import { 
  PlayCircle, 
  FileText, 
  Download, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  X,
  ArrowLeft,
  Clock,
  Video,
  FileDown,
  MessageSquare,
  HelpCircle,
  Lock,
  Trophy,
  Send,
  ThumbsUp,
  MoreVertical,
  Share2,
  Bookmark
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

const MOCK_COMMENTS: Record<string, Comment[]> = {
  "l1": [
    { id: "c1", userId: "u1", userName: "João Silva", content: "Aula excelente! Muito clara a explicação sobre React 19.", createdAt: "2024-03-20T10:00:00Z", likes: 5 },
    { id: "c2", userId: "u2", userName: "Maria Souza", content: "Tive uma dúvida na parte de Server Components, alguém pode ajudar?", createdAt: "2024-03-21T14:30:00Z", likes: 2 },
  ]
};

interface CoursePlayerProps {
  user: User | null;
}

import { api } from "@/src/lib/api";

export default function CoursePlayer({ user }: CoursePlayerProps) {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [lessonProgress, setLessonProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const data = await api.courses.get(courseId);
        setCourse(data);
        if (data.modules) {
          setOpenModules(data.modules.map((m: any) => m.id));
        }
        
        // Set first lesson as default if none selected
        if (data.modules && data.modules.length > 0 && data.modules[0].lessons.length > 0) {
          setCurrentLesson(data.modules[0].lessons[0]);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        navigate("/student/courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  useEffect(() => {
    if (currentLesson) {
      setComments(MOCK_COMMENTS[currentLesson.id] || []);
    }
  }, [currentLesson]);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const isLessonCompleted = (lessonId: string) => {
    return user?.progress?.some(p => p.lessonId === lessonId && p.completed) || false;
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user) return;
    try {
      const completed = !isLessonCompleted(lessonId);
      await api.users.saveProgress(lessonId, completed);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const allLessons = course?.modules?.flatMap(m => m.lessons) || [];
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const completedCount = allLessons.filter(l => isLessonCompleted(l.id)).length;
  const totalLessons = allLessons.length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const getModuleProgress = (moduleId: string) => {
    if (!course || !course.modules) return 0;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    const moduleLessons = module.lessons;
    const completedModuleLessons = moduleLessons.filter(l => isLessonCompleted(l.id));
    return Math.round((completedModuleLessons.length / moduleLessons.length) * 100);
  };

  const isLessonLocked = (lesson: Lesson) => {
    const index = allLessons.findIndex(l => l.id === lesson.id);
    if (index === 0) return false;
    const previousLesson = allLessons[index - 1];
    return !isLessonCompleted(previousLesson.id);
  };

  if (loading) return <div className="fixed inset-0 z-[60] bg-background flex items-center justify-center">Carregando curso...</div>;
  if (!course || !currentLesson) return null;

  const handleQuizComplete = async (attempt: QuizAttempt) => {
    if (!user) return;
    try {
      if (attempt.status === 'approved') {
        await api.users.saveProgress(currentLesson.id, true);
      }
      setLessonProgress(prev => ({
        ...prev,
        [currentLesson.id]: {
          ...prev[currentLesson.id],
          quizAttempts: [...(prev[currentLesson.id]?.quizAttempts || []), attempt]
        }
      }));
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  };

  const currentQuiz = currentLesson.type === 'QUIZ' ? MOCK_QUIZZES.find(q => q.lessonId === currentLesson.id) : null;

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/student/courses" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold truncate max-w-[300px]">{course.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <ProgressBar value={progress} className="h-1.5 w-32 rounded-full" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{progress}% concluído</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-primary/20 text-primary">
            <HelpCircle className="mr-2 h-4 w-4" /> Suporte
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Content Display */}
            <div className={cn(
              "rounded-3xl overflow-hidden shadow-2xl relative group",
              currentLesson.type === 'VIDEO' ? "aspect-video bg-black" : "bg-white min-h-[400px]"
            )}>
              {currentLesson.type === 'VIDEO' ? (
                <iframe 
                  src={currentLesson.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                  className="w-full h-full border-none"
                  allowFullScreen
                ></iframe>
              ) : currentLesson.type === 'QUIZ' ? (
                <div className="p-8 md:p-12 bg-slate-50 min-h-[500px]">
                  {currentQuiz ? (
                    <QuizComponent 
                      quiz={currentQuiz} 
                      onComplete={handleQuizComplete}
                      previousAttempts={lessonProgress[currentLesson.id]?.quizAttempts}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <HelpCircle className="h-16 w-16 text-slate-300 mb-4" />
                      <h3 className="text-xl font-bold">Avaliação não encontrada</h3>
                      <p className="text-slate-500">Esta avaliação ainda não foi configurada pelo instrutor.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 flex-col space-y-4 p-20">
                  <FileText className="h-20 w-20 text-primary/20" />
                  <p className="text-xl font-bold text-slate-600">Conteúdo em Texto / PDF</p>
                  <p className="text-slate-400 max-w-md text-center">Esta lição contém materiais de leitura. Você pode encontrá-los na aba "Conteúdo" abaixo.</p>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                  <Clock className="h-4 w-4" /> {currentLesson.duration} minutos
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{currentLesson.title}</h2>
              </div>
              {currentLesson.type !== 'QUIZ' && (
                <Button 
                  size="lg" 
                  onClick={() => toggleLessonCompletion(currentLesson.id)}
                  className={cn(
                    "rounded-full px-8 h-14 text-lg font-bold transition-all duration-300",
                    isLessonCompleted(currentLesson.id) 
                      ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200" 
                      : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  )}
                >
                  {isLessonCompleted(currentLesson.id) ? (
                    <><CheckCircle2 className="mr-2 h-6 w-6" /> Concluída</>
                  ) : (
                    "Marcar como Concluída"
                  )}
                </Button>
              )}
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8">
                <TabsTrigger value="content" className="rounded-xl px-6">Conteúdo</TabsTrigger>
                <TabsTrigger value="materials" className="rounded-xl px-6">Materiais</TabsTrigger>
                <TabsTrigger value="comments" className="rounded-xl px-6">Dúvidas</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="prose prose-slate max-w-none">
                {currentLesson.content ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-slate-600 leading-relaxed">
                    Nesta lição, vamos explorar os conceitos fundamentais apresentados no título. 
                    Acompanhe o vídeo acima e utilize os materiais complementares na aba ao lado para aprofundar seus estudos.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="materials" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Guia de Estudos.pdf", size: "2.4 MB", icon: FileDown },
                    { name: "Código Fonte.zip", size: "15.8 MB", icon: Download },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl border shadow-sm group-hover:text-primary transition-colors">
                          <file.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <div className="space-y-8">
                  <div className="flex gap-4 items-start">
                    <Avatar className="h-10 w-10 rounded-xl">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="rounded-xl">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="relative">
                        <textarea 
                          placeholder="O que você achou desta aula?" 
                          className="w-full min-h-[100px] p-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          className="rounded-xl px-6 gap-2" 
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          <Send className="h-4 w-4" /> Comentar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={comment.id} 
                        className="flex gap-4 group"
                      >
                        <Avatar className="h-10 w-10 rounded-xl">
                          <AvatarImage src={comment.userAvatar} />
                          <AvatarFallback className="rounded-xl">{comment.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{comment.userName}</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
                          <div className="flex items-center gap-4 pt-1">
                            <button className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">
                              <ThumbsUp className="h-3.5 w-3.5" /> {comment.likes}
                            </button>
                            <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">
                              Responder
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="ghost" 
                className="rounded-full px-6 h-12"
                disabled={!prevLesson}
                onClick={() => prevLesson && setCurrentLesson(prevLesson)}
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Lição Anterior
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-full px-6 h-12"
                disabled={!nextLesson || isLessonLocked(nextLesson)}
                onClick={() => nextLesson && setCurrentLesson(nextLesson)}
              >
                Próxima Lição <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>

        {/* Sidebar - Course Content */}
        <aside className={cn(
          "w-full lg:w-[400px] border-l bg-card flex flex-col shrink-0 transition-all duration-300 fixed lg:relative inset-y-0 right-0 z-50 lg:z-0",
          !isSidebarOpen && "lg:hidden translate-x-full lg:translate-x-0"
        )}>
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-bold text-lg">Conteúdo do Curso</h3>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <Accordion 
              multiple 
              value={openModules} 
              onValueChange={setOpenModules} 
              className="px-2"
            >
              {course.modules.map((module) => (
                <AccordionItem key={module.id} value={module.id} className="border-none">
                  <AccordionTrigger className="hover:no-underline px-4 py-4 rounded-2xl hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-start text-left w-full pr-4">
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Módulo {module.order}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">{getModuleProgress(module.id)}%</span>
                      </div>
                      <span className="font-bold text-sm mb-2">{module.title}</span>
                      <ProgressBar value={getModuleProgress(module.id)} className="h-1 w-full rounded-full bg-slate-100" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-4 px-2 space-y-1">
                    {module.lessons.map((lesson) => {
                      const locked = isLessonLocked(lesson);
                      const active = currentLesson.id === lesson.id;
                      const completed = isLessonCompleted(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          disabled={locked}
                          onClick={() => setCurrentLesson(lesson)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left",
                            active ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground",
                            locked && "opacity-50 cursor-not-allowed grayscale"
                          )}
                        >
                          <div className="relative">
                            {completed ? (
                              <div className="bg-green-500 rounded-full p-0.5">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                            ) : locked ? (
                              <Lock className="h-4 w-4 text-slate-300" />
                            ) : (
                              <div className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                active ? "border-primary" : "border-muted-foreground/30"
                              )}>
                                <Video className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{lesson.title}</p>
                            <p className="text-[10px] opacity-70">
                              {lesson.duration} min
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

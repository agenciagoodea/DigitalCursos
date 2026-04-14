import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/src/lib/api";
import { Course, Module, Lesson } from "@/src/types";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Video, 
  FileText, 
  Save, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  Layout,
  PlayCircle,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isNew = courseId === "new";
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Partial<Course>>({
    title: "",
    description: "",
    price: 0,
    category: "",
    level: "BEGINNER",
    status: "DRAFT",
    thumbnail: "https://picsum.photos/seed/course/800/450",
    modules: []
  });

  useEffect(() => {
    if (!isNew && courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const data = await api.courses.get(courseId!);
      setCourse(data);
      if (data.modules) {
        setOpenModules(data.modules.map((m: any) => m.id));
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      navigate("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const newCourse = await api.courses.create(course);
        navigate(`/admin/courses/edit/${newCourse.id}`);
      } else {
        await api.courses.update(courseId!, course);
        alert("Curso salvo com sucesso!");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Erro ao salvar curso.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddModule = async () => {
    if (isNew) {
      alert("Salve o curso primeiro para adicionar módulos.");
      return;
    }
    try {
      const newModule = await api.courses.addModule(courseId!, {
        title: "Novo Módulo",
        order: (course.modules?.length || 0) + 1
      });
      setCourse({
        ...course,
        modules: [...(course.modules || []), { ...newModule, lessons: [] }]
      });
      setOpenModules(prev => [...prev, newModule.id]);
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    try {
      const module = course.modules?.find(m => m.id === moduleId);
      const newLesson = await api.courses.addLesson(moduleId, {
        title: "Nova Aula",
        type: "VIDEO",
        order: (module?.lessons?.length || 0) + 1,
        duration: 10
      });
      
      setCourse({
        ...course,
        modules: course.modules?.map(m => 
          m.id === moduleId 
            ? { ...m, lessons: [...(m.lessons || []), newLesson] }
            : m
        )
      });
      setEditingLesson(newLesson);
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Tem certeza que deseja excluir este módulo e todas as suas aulas?")) return;
    try {
      await api.courses.deleteModule(moduleId);
      setCourse({
        ...course,
        modules: course.modules?.filter(m => m.id !== moduleId)
      });
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Excluir esta aula?")) return;
    try {
      await api.courses.deleteLesson(lessonId);
      setCourse({
        ...course,
        modules: course.modules?.map(m => 
          m.id === moduleId 
            ? { ...m, lessons: m.lessons?.filter(l => l.id !== lessonId) }
            : m
        )
      });
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    try {
      const updated = await api.courses.updateLesson(editingLesson.id, editingLesson);
      setCourse({
        ...course,
        modules: course.modules?.map(m => ({
          ...m,
          lessons: m.lessons?.map(l => l.id === editingLesson.id ? updated : l)
        }))
      });
      setEditingLesson(null);
    } catch (error) {
      console.error("Error updating lesson:", error);
      alert("Erro ao atualizar aula.");
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando editor...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/courses")} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isNew ? "Criar Novo Curso" : "Editar Curso"}
            </h1>
            <p className="text-slate-500 mt-1">Configure os detalhes e o conteúdo do seu curso.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/admin/courses")} className="rounded-xl">
            Cancelar
          </Button>
          <Button onClick={handleSaveCourse} disabled={saving} className="rounded-xl shadow-lg shadow-primary/20 min-w-[120px]">
            {saving ? "Salvando..." : <><Save className="mr-2 h-4 w-4" /> Salvar Curso</>}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8">
          <TabsTrigger value="details" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings className="mr-2 h-4 w-4" /> Detalhes
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm" disabled={isNew}>
            <Layout className="mr-2 h-4 w-4" /> Conteúdo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Título do Curso</label>
                    <Input 
                      placeholder="Ex: Masterclass de React 19" 
                      value={course.title}
                      onChange={e => setCourse({...course, title: e.target.value})}
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Descrição</label>
                    <Textarea 
                      placeholder="Descreva o que os alunos aprenderão..." 
                      className="rounded-xl min-h-[150px]"
                      value={course.description}
                      onChange={e => setCourse({...course, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Categoria</label>
                      <Input 
                        placeholder="Ex: Programação" 
                        value={course.category}
                        onChange={e => setCourse({...course, category: e.target.value})}
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Preço (R$)</label>
                      <Input 
                        type="number"
                        value={course.price}
                        onChange={e => setCourse({...course, price: parseFloat(e.target.value)})}
                        className="rounded-xl h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Configurações de Publicação</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nível</label>
                      <select 
                        className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={course.level}
                        onChange={e => setCourse({...course, level: e.target.value as any})}
                      >
                        <option value="BEGINNER">Iniciante</option>
                        <option value="INTERMEDIATE">Intermediário</option>
                        <option value="ADVANCED">Avançado</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Status</label>
                      <select 
                        className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={course.status}
                        onChange={e => setCourse({...course, status: e.target.value as any})}
                      >
                        <option value="DRAFT">Rascunho</option>
                        <option value="PUBLISHED">Publicado</option>
                        <option value="ARCHIVED">Arquivado</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg">Thumbnail</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center relative group">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="h-8 w-8 text-slate-300" />
                    )}
                  </div>
                  <Input 
                    placeholder="URL da Imagem" 
                    value={course.thumbnail}
                    onChange={e => setCourse({...course, thumbnail: e.target.value})}
                    className="rounded-xl h-11"
                  />
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center">Recomendado: 1280x720px</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Estrutura do Curso</h2>
              <Button onClick={handleAddModule} className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Módulo
              </Button>
            </div>

            <Accordion 
              multiple 
              value={openModules} 
              onValueChange={setOpenModules} 
              className="space-y-4"
            >
              {course.modules?.map((module) => (
                <AccordionItem key={module.id} value={module.id} className="border-none bg-white rounded-3xl shadow-sm overflow-hidden">
                  <div className="flex items-center px-6 py-4 border-b bg-slate-50/30">
                    <GripVertical className="h-5 w-5 text-slate-300 mr-4 cursor-grab" />
                    <AccordionTrigger className="flex-1 hover:no-underline py-0">
                      <div className="flex items-center gap-4 text-left">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Módulo {module.order}</span>
                        <span className="font-bold text-slate-900">{module.title}</span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent className="p-6 bg-white">
                    <div className="space-y-3">
                      {module.lessons?.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 group hover:border-primary/20 hover:bg-white transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                              {lesson.type === 'VIDEO' ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{lesson.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lesson.duration} min • {lesson.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary"
                              onClick={() => setEditingLesson(lesson)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-destructive" onClick={() => handleDeleteLesson(module.id, lesson.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        className="w-full h-12 rounded-2xl border-2 border-dashed border-slate-100 hover:border-primary/20 hover:bg-primary/5 text-slate-400 hover:text-primary transition-all"
                        onClick={() => handleAddLesson(module.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Aula
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Lesson Dialog */}
      <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 border-b bg-slate-50/50">
            <DialogTitle className="text-xl font-bold">Editar Aula</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Título da Aula</label>
              <Input 
                value={editingLesson?.title || ""}
                onChange={e => setEditingLesson(prev => prev ? {...prev, title: e.target.value} : null)}
                className="rounded-xl h-11"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tipo</label>
                <select 
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingLesson?.type}
                  onChange={e => setEditingLesson(prev => prev ? {...prev, type: e.target.value as any} : null)}
                >
                  <option value="VIDEO">Vídeo</option>
                  <option value="TEXT">Texto / Leitura</option>
                  <option value="QUIZ">Avaliação / Quiz</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Duração (min)</label>
                <Input 
                  type="number"
                  value={editingLesson?.duration || 0}
                  onChange={e => setEditingLesson(prev => prev ? {...prev, duration: parseInt(e.target.value) || 0} : null)}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            {editingLesson?.type === 'VIDEO' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">URL do Vídeo (YouTube/Vimeo)</label>
                <Input 
                  placeholder="https://..."
                  value={editingLesson?.videoUrl || ""}
                  onChange={e => setEditingLesson(prev => prev ? {...prev, videoUrl: e.target.value} : null)}
                  className="rounded-xl h-11"
                />
              </div>
            )}

            {editingLesson?.type === 'TEXT' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Conteúdo (Markdown)</label>
                <Textarea 
                  placeholder="Escreva o conteúdo da aula..."
                  value={editingLesson?.content || ""}
                  onChange={e => setEditingLesson(prev => prev ? {...prev, content: e.target.value} : null)}
                  className="rounded-xl min-h-[150px]"
                />
              </div>
            )}
          </div>
          <DialogFooter className="p-6 bg-slate-50/50 border-t">
            <Button variant="outline" onClick={() => setEditingLesson(null)} className="rounded-xl">
              Cancelar
            </Button>
            <Button onClick={handleUpdateLesson} className="rounded-xl px-8 shadow-lg shadow-primary/20">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

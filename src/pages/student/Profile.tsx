import { User } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Lock, Bell, Shield, Mail, User as UserIcon, Settings, CreditCard, ChevronRight, Zap, CheckCircle2, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  user: User | null;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-card p-8 md:p-12 rounded-[3rem] shadow-xl border border-border/50 group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 premium-gradient blur-3xl opacity-10 rounded-full -mr-32 -mt-32 group-hover:opacity-20 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-3xl opacity-10 rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group/avatar">
            <div className="absolute inset-0 premium-gradient rounded-[2.5rem] blur-lg opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
            <Avatar className="h-40 w-40 rounded-[2.5rem] border-4 border-background shadow-2xl relative z-10">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="text-5xl font-bold bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute -bottom-2 -right-2 rounded-2xl shadow-2xl h-12 w-12 premium-gradient border-4 border-background z-20 hover:scale-110 transition-transform">
              <Camera className="h-5 w-5 text-white" />
            </Button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  {user.role}
                </span>
                <span className="px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verificado
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight font-heading">{user.name}</h1>
              <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4 text-primary" /> {user.email}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold">{new Date(user.createdAt || '').getFullYear() || '2024'}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Membro desde</p>
              </div>
              <div className="w-px h-10 bg-border hidden md:block"></div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold">{user.certificates?.length || 0}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Cursos Concluídos</p>
              </div>
              <div className="w-px h-10 bg-border hidden md:block"></div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold">{user.progress?.filter(p => p.completed).length * 10 || 0}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">XP Total</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-card p-1.5 rounded-3xl shadow-xl border border-border/50 mb-10 h-16 w-full md:w-fit justify-start overflow-x-auto scrollbar-hide">
          <TabsTrigger value="general" className="rounded-2xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">
            <UserIcon className="mr-2 h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-2xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">
            <Shield className="mr-2 h-4 w-4" /> Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-2xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">
            <Bell className="mr-2 h-4 w-4" /> Notificações
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-2xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">
            <CreditCard className="mr-2 h-4 w-4" /> Assinatura
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="general">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-xl rounded-[3rem] bg-card p-10">
                <CardHeader className="px-0 pt-0 mb-8">
                  <CardTitle className="text-2xl font-bold font-heading flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="full-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</Label>
                    <Input id="full-name" defaultValue={user.name} className="rounded-2xl h-14 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-lg px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail</Label>
                    <Input id="email" defaultValue={user.email} className="rounded-2xl h-14 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-lg px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" className="rounded-2xl h-14 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-lg px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Bio</Label>
                    <Input id="bio" placeholder="Conte um pouco sobre você" className="rounded-2xl h-14 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-lg px-6" />
                  </div>
                </div>
                <div className="flex justify-end mt-12">
                  <Button className="rounded-2xl px-10 h-14 font-bold premium-gradient shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Salvar Alterações
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-xl rounded-[3rem] bg-card p-10">
                <CardHeader className="px-0 pt-0 mb-8">
                  <CardTitle className="text-2xl font-bold font-heading flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    Segurança da Conta
                  </CardTitle>
                </CardHeader>
                <div className="space-y-8 max-w-md">
                  <div className="space-y-3">
                    <Label htmlFor="current-password text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Senha Atual</Label>
                    <Input id="current-password" type="password" className="rounded-2xl h-14 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-password text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nova Senha</Label>
                    <Input id="new-password" type="password" className="rounded-2xl h-14 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="confirm-password text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" className="rounded-2xl h-14 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 px-6" />
                  </div>
                  <Button className="rounded-2xl px-10 h-14 font-bold premium-gradient shadow-xl shadow-primary/20 hover:scale-105 transition-transform w-full sm:w-auto">
                    Atualizar Senha
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-xl rounded-[3rem] bg-card p-10">
                <CardHeader className="px-0 pt-0 mb-8">
                  <CardTitle className="text-2xl font-bold font-heading flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    Preferências de Notificação
                  </CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  {[
                    { title: "Novos Cursos", desc: "Receba alertas quando novos cursos forem lançados.", active: true },
                    { title: "Mensagens de Instrutores", desc: "Notificações de novas mensagens e respostas.", active: true },
                    { title: "Lembretes de Estudo", desc: "Avisos para você não perder o ritmo de aprendizado.", active: false },
                    { title: "Promoções e Ofertas", desc: "Receba cupons e descontos exclusivos.", active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/30 hover:bg-muted/50 transition-colors group">
                      <div className="space-y-1">
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                      </div>
                      <button className={cn(
                        "h-8 w-14 rounded-full relative transition-colors duration-300",
                        item.active ? "bg-primary" : "bg-muted-foreground/20"
                      )}>
                        <div className={cn(
                          "absolute top-1 h-6 w-6 bg-white rounded-full transition-all duration-300 shadow-lg",
                          item.active ? "right-1" : "left-1"
                        )}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="billing">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-xl rounded-[3rem] bg-card p-10">
                <CardHeader className="px-0 pt-0 mb-8">
                  <CardTitle className="text-2xl font-bold font-heading flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    Assinatura & Faturamento
                  </CardTitle>
                </CardHeader>
                
                <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 mb-10">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 premium-gradient rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold font-heading">Plano Premium Vitalício</p>
                        <p className="text-muted-foreground font-medium">Acesso ilimitado a todos os cursos e certificados.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-6 py-2 rounded-2xl border border-emerald-500/20">
                      <CheckCircle2 className="h-5 w-5" /> Ativo
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Histórico de Pagamentos</h4>
                  <div className="space-y-3">
                    {[
                      { date: "15 Mar 2024", amount: "R$ 497,00", status: "Pago", method: "**** 4421" },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center border border-border/50">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-bold">{invoice.date}</p>
                            <p className="text-xs text-muted-foreground font-medium">{invoice.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{invoice.amount}</p>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{invoice.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

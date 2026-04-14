import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  GraduationCap,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const salesData = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Fev", sales: 3000, revenue: 1398 },
  { name: "Mar", sales: 5000, revenue: 9800 },
  { name: "Abr", sales: 4500, revenue: 3908 },
  { name: "Mai", sales: 6000, revenue: 4800 },
  { name: "Jun", sales: 5500, revenue: 3800 },
];

const recentEnrollments = [
  { id: "1", name: "Ana Oliveira", course: "React 19 Masterclass", date: "Há 2 horas", status: "Pago", amount: "R$ 497,00", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "Bruno Santos", course: "UI Design com Figma", date: "Há 5 horas", status: "Pago", amount: "R$ 297,00", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Carla Lima", course: "React 19 Masterclass", date: "Há 1 dia", status: "Pendente", amount: "R$ 497,00", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "Diego Costa", course: "Node.js Avançado", date: "Há 2 dias", status: "Pago", amount: "R$ 397,00", avatar: "https://i.pravatar.cc/150?u=4" },
];

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.admin.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Carregando estatísticas...</div>;
  if (!stats) return <div className="p-10 text-center">Erro ao carregar estatísticas.</div>;

  const statCards = [
    { label: "Total de Alunos", value: stats.totalUsers.toString(), icon: Users, trend: "+12%", up: true, color: "from-blue-500/20 to-indigo-500/20", iconColor: "text-blue-500" },
    { label: "Cursos Ativos", value: stats.totalCourses.toString(), icon: BookOpen, trend: "+2", up: true, color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-500" },
    { label: "Receita Mensal", value: `R$ ${stats.monthlyRevenue.toLocaleString()}`, icon: Wallet, trend: "+8%", up: true, color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-500" },
    { label: "Matrículas Totais", value: stats.totalEnrollments.toString(), icon: GraduationCap, trend: "+5%", up: true, color: "from-orange-500/20 to-red-500/20", iconColor: "text-orange-500" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight font-heading">Dashboard Administrativo</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-primary" /> Bem-vindo de volta, Administrador.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 border-border/50 hover:bg-muted font-bold transition-all">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button className="rounded-2xl h-12 px-6 premium-gradient shadow-xl shadow-primary/20 font-bold hover:scale-105 transition-transform">
            <Plus className="mr-2 h-4 w-4" /> Novo Curso
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-card group hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-500", stat.color)}>
                    <stat.icon className={cn("h-7 w-7", stat.iconColor)} />
                  </div>
                  <div className={cn(
                    "flex items-center text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                    stat.up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {stat.up ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-bold font-heading mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[3rem] bg-card p-8">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between mb-8">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold font-heading">Receita de Vendas</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">Desempenho financeiro dos últimos meses.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl font-bold border-border/50">6 Meses</Button>
              <Button variant="ghost" size="sm" className="rounded-xl font-bold text-muted-foreground">1 Ano</Button>
            </div>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600}} 
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'hsl(var(--card))',
                    padding: '16px'
                  }}
                  cursor={{stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Courses */}
        <Card className="border-none shadow-xl rounded-[3rem] bg-card p-8">
          <CardHeader className="px-0 pt-0 mb-8">
            <CardTitle className="text-2xl font-bold font-heading">Cursos Populares</CardTitle>
            <p className="text-sm text-muted-foreground font-medium">Cursos com maior engajamento.</p>
          </CardHeader>
          <div className="space-y-8">
            {[
              { name: "React 19 Masterclass", sales: 450, amount: "R$ 223k", color: "bg-blue-500", icon: "⚛️" },
              { name: "UI Design com Figma", sales: 380, amount: "R$ 112k", color: "bg-purple-500", icon: "🎨" },
              { name: "Node.js Avançado", sales: 290, amount: "R$ 115k", color: "bg-emerald-500", icon: "🚀" },
              { name: "Marketing Digital", sales: 210, amount: "R$ 42k", color: "bg-orange-500", icon: "📈" },
            ].map((course, i) => (
              <div key={i} className="space-y-3 group cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {course.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{course.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{course.sales} vendas</p>
                    </div>
                  </div>
                  <span className="font-black text-sm">{course.amount}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(course.sales / 500) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className={cn("h-full rounded-full", course.color)}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-10 rounded-2xl h-12 text-primary font-bold hover:bg-primary/5">
            Ver Relatório Completo
          </Button>
        </Card>
      </div>

      {/* Recent Enrollments Table */}
      <Card className="border-none shadow-xl rounded-[3rem] bg-card overflow-hidden">
        <CardHeader className="p-10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold font-heading">Matrículas Recentes</CardTitle>
            <p className="text-sm text-muted-foreground font-medium">Últimos alunos que ingressaram na plataforma.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar aluno..." className="pl-10 h-11 bg-muted/50 border-none rounded-xl" />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 border-border/50">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <div className="px-10 pb-10">
          <div className="rounded-3xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest py-5 px-6">Aluno</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest py-5">Curso</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest py-5">Data</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest py-5">Status</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest py-5 px-6 text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentEnrollments.map((enrollment: any) => (
                  <TableRow key={enrollment.id} className="border-border/50 hover:bg-muted/20 transition-colors group">
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-xl border-2 border-background shadow-md">
                          <AvatarImage src={enrollment.avatar} />
                          <AvatarFallback className="font-bold">{enrollment.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold group-hover:text-primary transition-colors">{enrollment.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">{enrollment.course}</TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        {new Date(enrollment.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-xl px-4 py-1 font-bold text-[10px] uppercase tracking-widest border-none",
                        enrollment.status === "Pago" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black px-6">{enrollment.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}

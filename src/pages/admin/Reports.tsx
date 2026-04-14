import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
  { name: "Jan", vendas: 4000, alunos: 2400 },
  { name: "Fev", vendas: 3000, alunos: 1398 },
  { name: "Mar", vendas: 2000, alunos: 9800 },
  { name: "Abr", vendas: 2780, alunos: 3908 },
  { name: "Mai", vendas: 1890, alunos: 4800 },
  { name: "Jun", vendas: 2390, alunos: 3800 },
];

const categoryData = [
  { name: "Programação", value: 400 },
  { name: "Design", value: 300 },
  { name: "Marketing", value: 300 },
  { name: "Negócios", value: 200 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Relatórios e Análises</h1>
          <p className="text-slate-500 mt-1">Acompanhe o desempenho da sua plataforma em tempo real.</p>
        </div>
        <Button className="rounded-xl gap-2">
          <Download className="h-4 w-4" /> Exportar Dados
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Receita Total", value: "R$ 45.231,89", icon: DollarSign, trend: "+12.5%", positive: true },
          { label: "Novos Alunos", value: "+2.350", icon: Users, trend: "+18.2%", positive: true },
          { label: "Cursos Ativos", value: "48", icon: BookOpen, trend: "-4.1%", positive: false },
          { label: "Taxa de Conclusão", value: "64%", icon: TrendingUp, trend: "+2.4%", positive: true },
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={cn(
                  "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                  stat.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="rounded-3xl border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold">Crescimento de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card className="rounded-3xl border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 flex items-center justify-center h-[300px]">
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-4">
              {categoryData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-xs font-medium text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

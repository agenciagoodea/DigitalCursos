import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { api } from "@/src/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.auth.register({ name, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">
        {/* Left Side: Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block space-y-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Comece sua jornada de <span className="text-primary">sucesso</span> hoje.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-md">
            Junte-se a mais de 10.000 alunos que já estão transformando suas vidas através do conhecimento.
          </p>
          
          <div className="space-y-6">
            {[
              "Acesso vitalício a todos os cursos",
              "Certificados reconhecidos pelo mercado",
              "Suporte direto com instrutores",
              "Materiais complementares exclusivos"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
            <CardHeader className="space-y-1 pb-8 pt-10 px-8">
              <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para começar.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="name" 
                      placeholder="Seu Nome" 
                      className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center px-4">
                  Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
                <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold mt-4" disabled={loading}>
                  {loading ? "Criando Conta..." : "Criar Minha Conta"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-8 flex justify-center border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Já tem uma conta?{" "}
                <Link to="/login" className="font-bold text-primary hover:underline">Entrar</Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

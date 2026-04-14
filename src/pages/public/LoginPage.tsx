import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { User } from "@/src/types";
import { api } from "@/src/lib/api";

interface LoginPageProps {
  setUser: (user: User | null) => void;
}

export default function LoginPage({ setUser }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await api.auth.login({ email, password });
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      if (userData.role === 'ADMIN') navigate("/admin");
      else if (userData.role === 'INSTRUCTOR') navigate("/instructor");
      else navigate("/student");
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
          <p className="text-slate-500 mt-2">Acesse sua conta para continuar aprendendo.</p>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-1 pb-8 pt-10 px-8">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>
              Use suas credenciais para acessar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link to="#" className="text-xs font-medium text-primary hover:underline">Esqueceu a senha?</Link>
                </div>
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
              <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold mt-4" disabled={loading}>
                {loading ? "Entrando..." : "Entrar na Conta"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl border-slate-200 hover:bg-slate-50">
                <Chrome className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-slate-200 hover:bg-slate-50">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 p-8 flex justify-center border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Não tem uma conta?{" "}
              <Link to="/register" className="font-bold text-primary hover:underline">Cadastre-se</Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 space-y-1">
          <p className="font-bold">Dica para o Demo:</p>
          <p>• Admin: admin@eduvibe.com / admin123</p>
          <p>• Instrutor: ricardo@eduvibe.com / instrutor123</p>
          <p>• Aluno: qualquer e-mail</p>
        </div>
      </motion.div>
    </div>
  );
}

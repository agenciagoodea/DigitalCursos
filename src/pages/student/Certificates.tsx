import { User } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download, ExternalLink, Search, Calendar, CheckCircle2, Share2, ShieldCheck, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface CertificatesPageProps {
  user: User | null;
}

export default function CertificatesPage({ user }: CertificatesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) return null;

  const certificates = user.certificates?.map(cert => ({
    id: cert.id,
    title: cert.course?.title || "Curso Concluído",
    date: new Date(cert.issuedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    code: cert.id.substring(0, 8).toUpperCase(),
    instructor: cert.course?.instructor?.name || "EduVibe Academy",
    hours: cert.course?.duration || 0
  })) || [];

  const filteredCertificates = certificates.filter(cert => 
    cert.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-heading">Meus Certificados</h1>
          <p className="text-muted-foreground font-medium">Você conquistou <span className="text-primary font-bold">{certificates.length}</span> certificações oficiais. Parabéns!</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Pesquisar certificado..." 
            className="pl-12 h-14 bg-card border-none rounded-2xl shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCertificates.map((cert, i) => (
            <motion.div
              layout
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <CardContent className="p-0 flex flex-col md:flex-row h-full">
                  {/* Visual Part */}
                  <div className="w-full md:w-56 premium-gradient flex flex-col items-center justify-center p-10 text-white relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 blur-3xl rounded-full -ml-20 -mb-20"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 group-hover:scale-110 transition-transform duration-500">
                        <Award className="h-10 w-10 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">EduVibe Academy</p>
                        <p className="text-xs font-bold">CERTIFIED</p>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-30">
                      <ShieldCheck className="h-24 w-24" />
                    </div>
                  </div>

                  {/* Content Part */}
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verificado & Autêntico
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight leading-tight font-heading group-hover:text-primary transition-colors">{cert.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                        Instrutor: {cert.instructor}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 my-8 border-y border-border/50">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Data de Emissão</p>
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <Calendar className="h-4 w-4 text-primary" />
                          {cert.date}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Carga Horária</p>
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <Clock className="h-4 w-4 text-primary" />
                          {cert.hours} Horas
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button className="w-full sm:flex-1 rounded-2xl h-12 font-bold premium-gradient shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                        <Download className="mr-2 h-4 w-4" /> Baixar Certificado
                      </Button>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-border/50 hover:bg-muted">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-border/50 hover:bg-muted">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCertificates.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-border/50"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold font-heading">Nenhum certificado encontrado</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Continue estudando e conclua seus cursos para conquistar suas certificações oficiais.</p>
          <Link to="/student/courses">
            <Button className="mt-8 rounded-2xl px-10 h-14 premium-gradient shadow-xl shadow-primary/20">
              Continuar Estudando
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

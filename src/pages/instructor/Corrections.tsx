import React, { useState } from "react";
import { MOCK_QUIZ_ATTEMPTS, MOCK_QUIZZES, MOCK_USERS } from "@/src/lib/mock-data";
import { QuizAttempt, Quiz } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Clock, Search, Filter, Check, X, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function Corrections() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>(MOCK_QUIZ_ATTEMPTS);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [feedback, setFeedback] = useState("");

  const getQuiz = (quizId: string) => MOCK_QUIZZES.find(q => q.id === quizId);
  const getUser = (userId: string) => MOCK_USERS.find(u => u.id === userId);

  const handleGrade = (status: 'approved' | 'failed') => {
    if (!selectedAttempt) return;

    const updatedAttempts = attempts.map(a => 
      a.id === selectedAttempt.id ? { ...a, status, feedback } : a
    );
    
    setAttempts(updatedAttempts);
    setSelectedAttempt(null);
    setFeedback("");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Correções Pendentes</h1>
          <p className="text-muted-foreground mt-1">Avalie as respostas dissertativas dos seus alunos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List of Attempts */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar aluno ou curso..." className="pl-10 rounded-2xl border-slate-100" />
          </div>

          <div className="space-y-3">
            {attempts.map((attempt) => {
              const user = getUser(attempt.userId);
              const quiz = getQuiz(attempt.quizId);
              
              return (
                <Card 
                  key={attempt.id} 
                  onClick={() => setSelectedAttempt(attempt)}
                  className={cn(
                    "border-none shadow-sm rounded-3xl cursor-pointer transition-all hover:shadow-md",
                    selectedAttempt?.id === attempt.id ? "ring-2 ring-primary bg-primary/5" : "bg-white"
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{user?.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{quiz?.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0",
                          attempt.status === 'pending' ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                          attempt.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" :
                          "bg-red-50 text-red-600 border-red-100"
                        )}>
                          {attempt.status === 'pending' ? 'Pendente' : 
                           attempt.status === 'approved' ? 'Aprovado' : 'Reprovado'}
                        </Badge>
                        <span className="text-[10px] text-slate-400 flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {new Date(attempt.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Correction Detail */}
        <div className="lg:col-span-2">
          {selectedAttempt ? (
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white h-full">
              <CardHeader className="p-8 border-b border-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/10">
                      <AvatarImage src={getUser(selectedAttempt.userId)?.avatar} />
                      <AvatarFallback>{getUser(selectedAttempt.userId)?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-bold">{getUser(selectedAttempt.userId)?.name}</CardTitle>
                      <CardDescription>{getQuiz(selectedAttempt.quizId)?.title}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nota Atual</p>
                    <p className="text-3xl font-black text-primary">{selectedAttempt.score}%</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {getQuiz(selectedAttempt.quizId)?.questions.map((q, i) => (
                  <div key={q.id} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-sm font-bold text-slate-500">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-2">{q.question}</h4>
                        
                        {q.type === 'essay' ? (
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 italic text-slate-700 leading-relaxed">
                            "{selectedAttempt.answers[q.id]}"
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Resposta:</span>
                            <span className="font-bold">
                              {q.type === 'multiple-choice' ? q.options?.[selectedAttempt.answers[q.id]] : 
                               selectedAttempt.answers[q.id] ? 'Verdadeiro' : 'Falso'}
                            </span>
                            {selectedAttempt.answers[q.id] === q.correctAnswer ? (
                              <Badge className="bg-green-500/10 text-green-600 border-none ml-2">Correto</Badge>
                            ) : (
                              <Badge className="bg-red-500/10 text-red-600 border-none ml-2">Incorreto</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-8 border-t border-slate-50 space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" /> Feedback do Instrutor
                  </h4>
                  <Textarea 
                    placeholder="Escreva um feedback para o aluno..."
                    className="min-h-[120px] rounded-3xl border-slate-100 p-6 focus:ring-primary/20"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  
                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={() => handleGrade('approved')}
                      className="flex-1 rounded-full h-14 text-lg font-bold bg-green-500 hover:bg-green-600 shadow-lg shadow-green-100"
                    >
                      <Check className="mr-2 h-6 w-6" /> Aprovar Avaliação
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleGrade('failed')}
                      className="flex-1 rounded-full h-14 text-lg font-bold border-red-100 text-red-500 hover:bg-red-50"
                    >
                      <X className="mr-2 h-6 w-6" /> Reprovar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Selecione uma tentativa</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                Escolha um aluno na lista ao lado para revisar as respostas e atribuir uma nota.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

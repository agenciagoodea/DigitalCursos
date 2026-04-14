import React, { useState } from "react";
import { Quiz, QuizQuestion, QuizAttempt } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, AlertCircle, Send, RotateCcw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
  previousAttempts?: QuizAttempt[];
}

export default function QuizComponent({ quiz, onComplete, previousAttempts = [] }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    let hasEssay = false;

    quiz.questions.forEach(q => {
      totalPoints += q.points;
      const answer = answers[q.id];

      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (answer === q.correctAnswer) {
          earnedPoints += q.points;
        }
      } else if (q.type === 'essay') {
        hasEssay = true;
        // Essay questions are usually manually graded, but for this demo 
        // we'll give partial points if they wrote something
        if (answer && answer.length > 20) {
          earnedPoints += q.points * 0.8; // Auto-give 80% for now
        }
      }
    });

    return {
      score: Math.round((earnedPoints / totalPoints) * 100),
      hasEssay
    };
  };

  const handleSubmit = () => {
    const { score, hasEssay } = calculateScore();
    const status = hasEssay ? 'pending' : (score >= quiz.minGrade ? 'approved' : 'failed');
    
    const attempt: QuizAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: quiz.id,
      userId: "3", // Mock user ID
      answers,
      score,
      status,
      createdAt: new Date().toISOString(),
    };

    setResult(attempt);
    setIsSubmitted(true);
    onComplete(attempt);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setResult(null);
  };

  if (isSubmitted && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <div className={cn(
            "h-3 w-full",
            result.status === 'approved' ? "bg-green-500" : 
            result.status === 'pending' ? "bg-yellow-500" : "bg-red-500"
          )} />
          <CardHeader className="text-center pt-10">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-slate-50">
              {result.status === 'approved' ? (
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              ) : result.status === 'pending' ? (
                <Clock className="h-10 w-10 text-yellow-500" />
              ) : (
                <XCircle className="h-10 w-10 text-red-500" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold">
              {result.status === 'approved' ? "Parabéns! Você foi aprovado." : 
               result.status === 'pending' ? "Avaliação enviada para correção." : "Não foi desta vez."}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {result.status === 'pending' ? 
                "Sua resposta dissertativa será avaliada por um instrutor em breve." :
                <>Sua nota final foi <span className="font-bold text-foreground">{result.score}%</span>. A nota mínima para aprovação é {quiz.minGrade}%.</>
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <div className="bg-slate-50 rounded-3xl p-6 mb-8">
              <h4 className="font-semibold mb-4 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-slate-400" />
                Resumo da Tentativa
              </h4>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span className="font-medium text-slate-900">{new Date(result.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={cn(
                    "font-bold",
                    result.status === 'approved' ? "text-green-600" : 
                    result.status === 'pending' ? "text-yellow-600" : "text-red-600"
                  )}>
                    {result.status === 'approved' ? "APROVADO" : 
                     result.status === 'pending' ? "AGUARDANDO CORREÇÃO" : "REPROVADO"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {result.status === 'failed' && (quiz.maxAttempts === undefined || previousAttempts.length < quiz.maxAttempts) && (
                <Button onClick={resetQuiz} className="flex-1 rounded-full h-12 text-lg font-bold">
                  <RotateCcw className="mr-2 h-5 w-5" /> Tentar Novamente
                </Button>
              )}
              <Button variant="outline" className="flex-1 rounded-full h-12 text-lg font-bold border-slate-200">
                {result.status === 'pending' ? "Ver Minhas Respostas" : "Ver Gabarito"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const hasReachedLimit = quiz.maxAttempts !== undefined && previousAttempts.length >= quiz.maxAttempts && !previousAttempts.some(a => a.status === 'approved');

  if (hasReachedLimit) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Limite de tentativas atingido</h2>
        <p className="text-slate-500 mt-2 mb-8">
          Você já realizou as {quiz.maxAttempts} tentativas permitidas para esta avaliação e não obteve a nota mínima. 
          Entre em contato com o suporte ou seu instrutor para solicitar uma nova chance.
        </p>
        <Button variant="outline" className="rounded-full px-8">Voltar para o Curso</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{quiz.title}</h2>
          <p className="text-slate-500">Questão {currentQuestionIndex + 1} de {quiz.questions.length}</p>
        </div>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 w-8 rounded-full transition-all duration-300",
                i === currentQuestionIndex ? "bg-primary w-12" : 
                i < currentQuestionIndex ? "bg-primary/40" : "bg-slate-200"
              )} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
                {currentQuestion.type === 'multiple-choice' ? 'Múltipla Escolha' : 
                 currentQuestion.type === 'true-false' ? 'Verdadeiro ou Falso' : 'Dissertativa'}
              </div>
              <CardTitle className="text-xl md:text-2xl leading-tight">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              {currentQuestion.type === 'multiple-choice' && (
                <RadioGroup 
                  value={answers[currentQuestion.id]?.toString()} 
                  onValueChange={(v) => handleAnswerChange(currentQuestion.id, parseInt(v))}
                  className="space-y-3"
                >
                  {currentQuestion.options?.map((option, idx) => (
                    <div key={idx} className="flex items-center">
                      <RadioGroupItem value={idx.toString()} id={`q-${currentQuestion.id}-${idx}`} className="sr-only" />
                      <Label
                        htmlFor={`q-${currentQuestion.id}-${idx}`}
                        className={cn(
                          "flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-slate-50",
                          answers[currentQuestion.id] === idx 
                            ? "border-primary bg-primary/5 text-primary font-bold shadow-sm" 
                            : "border-slate-100 text-slate-600"
                        )}
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-500 mr-3 text-sm font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  {[true, false].map((val) => (
                    <div 
                      key={val.toString()}
                      onClick={() => handleAnswerChange(currentQuestion.id, val)}
                      className={cn(
                        "p-6 rounded-3xl border-2 cursor-pointer text-center transition-all",
                        answers[currentQuestion.id] === val
                          ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                          : "border-slate-100 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3",
                        answers[currentQuestion.id] === val ? "bg-primary/10" : "bg-slate-100"
                      )}>
                        {val ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                      </div>
                      {val ? 'Verdadeiro' : 'Falso'}
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'essay' && (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Digite sua resposta aqui..."
                    className="min-h-[200px] rounded-3xl border-slate-100 p-6 focus:ring-primary/20"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  />
                  <p className="text-xs text-slate-400 text-right">
                    {(answers[currentQuestion.id]?.length || 0)} caracteres
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-8 pt-0 flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="rounded-full px-6"
              >
                Anterior
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={answers[currentQuestion.id] === undefined}
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 font-bold"
                >
                  Finalizar Avaliação <Send className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={answers[currentQuestion.id] === undefined}
                  className="rounded-full px-8 font-bold"
                >
                  Próxima Questão
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  Globe, 
  Mail, 
  Shield, 
  Palette, 
  Bell,
  CreditCard,
  Smartphone
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Configurações salvas com sucesso!");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configurações</h1>
        <p className="text-slate-500 mt-1">Gerencie as preferências e ajustes da sua plataforma.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="general" className="rounded-xl px-6 gap-2">
            <Globe className="h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl px-6 gap-2">
            <Palette className="h-4 w-4" /> Aparência
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 gap-2">
            <Bell className="h-4 w-4" /> Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 gap-2">
            <Shield className="h-4 w-4" /> Segurança
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl px-6 gap-2">
            <CreditCard className="h-4 w-4" /> Pagamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Informações da Plataforma</CardTitle>
              <CardDescription>Ajuste o nome e a descrição básica do seu EAD.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome da Plataforma</label>
                  <Input defaultValue="DigitalCursos" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">E-mail de Suporte</label>
                  <Input defaultValue="suporte@digitalcursos.com" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Descrição Curta</label>
                <Textarea 
                  defaultValue="A melhor plataforma de cursos online para o seu desenvolvimento profissional." 
                  className="rounded-xl min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Localização</CardTitle>
              <CardDescription>Defina o idioma e a moeda padrão.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Idioma Padrão</label>
                  <select className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Moeda</label>
                  <select className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>Real (BRL)</option>
                    <option>Dólar (USD)</option>
                    <option>Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Cores e Marca</CardTitle>
              <CardDescription>Personalize a identidade visual do seu portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center text-white font-bold">Logo</div>
                <Button variant="outline" className="rounded-xl">Alterar Logotipo</Button>
                <Button variant="ghost" className="rounded-xl text-destructive">Remover</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Cor Primária</label>
                  <div className="flex gap-2">
                    <Input defaultValue="#3b82f6" className="rounded-xl" />
                    <div className="h-10 w-10 rounded-xl border bg-blue-500 shrink-0"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Cor Secundária</label>
                  <div className="flex gap-2">
                    <Input defaultValue="#1e293b" className="rounded-xl" />
                    <div className="h-10 w-10 rounded-xl border bg-slate-800 shrink-0"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>E-mails e Alertas</CardTitle>
              <CardDescription>Escolha quais eventos disparam notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Novas Matrículas", desc: "Receber e-mail quando um aluno se matricular em um curso." },
                { label: "Comentários em Aulas", desc: "Notificar instrutores sobre novas dúvidas postadas." },
                { label: "Conclusão de Curso", desc: "Enviar e-mail de parabéns ao aluno ao finalizar o curso." },
                { label: "Lembretes de Inatividade", desc: "Enviar alerta para alunos que não acessam há 7 dias." },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Configure políticas de senha e autenticação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">Autenticação de Dois Fatores (2FA)</p>
                  <p className="text-xs text-slate-500">Exigir código via e-mail ou app para login.</p>
                </div>
                <Switch />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Expiração de Sessão (horas)</label>
                  <Input type="number" defaultValue="24" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Limite de Tentativas de Login</label>
                  <Input type="number" defaultValue="5" className="rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Políticas de Senha</CardTitle>
              <CardDescription>Defina requisitos mínimos para senhas de usuários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Mínimo de 8 caracteres", checked: true },
                { label: "Exigir letras maiúsculas", checked: true },
                { label: "Exigir números", checked: true },
                { label: "Exigir caracteres especiais", checked: false },
              ].map((policy, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-600">{policy.label}</span>
                  <Switch defaultChecked={policy.checked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
            <div className="bg-blue-600 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Mercado Pago</h3>
                  <p className="text-blue-100 text-sm">Integração oficial para pagamentos no Brasil.</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-white data-[state=checked]:text-blue-600" />
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Public Key</label>
                  <Input placeholder="APP_USR-..." className="rounded-xl font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Access Token</label>
                  <Input type="password" placeholder="APP_USR-..." className="rounded-xl font-mono text-xs" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">Modo Sandbox (Teste)</p>
                    <p className="text-xs text-slate-500">Use credenciais de teste para validar o fluxo.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Webhook URL</label>
                  <div className="flex gap-2">
                    <Input readOnly value="https://sua-plataforma.com/api/webhooks/mercadopago" className="rounded-xl bg-slate-50 text-slate-500" />
                    <Button variant="outline" className="rounded-xl">Copiar</Button>
                  </div>
                  <p className="text-[10px] text-slate-400">Configure esta URL no painel do Mercado Pago para receber notificações de pagamento.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-bold text-slate-900">URLs de Retorno</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Sucesso</label>
                    <Input defaultValue="/payment/success" className="rounded-lg h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Falha</label>
                    <Input defaultValue="/payment/failure" className="rounded-lg h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Pendente</label>
                    <Input defaultValue="/payment/pending" className="rounded-lg h-9 text-xs" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Outras Opções</CardTitle>
              <CardDescription>Configure parcelamento e taxas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">Parcelamento sem Juros</p>
                  <p className="text-xs text-slate-500">Permitir que o aluno parcele sem acréscimo (taxas por sua conta).</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Máximo de Parcelas</label>
                <select className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {[1, 2, 3, 4, 5, 6, 10, 12].map(n => (
                    <option key={n} value={n}>{n}x</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="ghost" className="rounded-xl">Descartar</Button>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl px-8 shadow-lg shadow-primary/20 gap-2">
          {saving ? "Salvando..." : <><Save className="h-4 w-4" /> Salvar Configurações</>}
        </Button>
      </div>
    </div>
  );
}

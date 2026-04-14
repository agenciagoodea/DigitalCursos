import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "@/src/types";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell,
  PlusCircle,
  FileText,
  BarChart3,
  Menu,
  CheckCircle2
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function AdminLayout({ user, setUser }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", href: user.role === 'ADMIN' ? "/admin" : "/instructor", icon: LayoutDashboard },
    { label: "Cursos", href: user.role === 'ADMIN' ? "/admin/courses" : "/instructor/courses", icon: BookOpen },
    { label: "Correções", href: user.role === 'ADMIN' ? "/admin/corrections" : "/instructor/corrections", icon: CheckCircle2 },
    ...(user.role === 'ADMIN' ? [
      { label: "Usuários", href: "/admin/users", icon: Users },
      { label: "Relatórios", href: "/admin/reports", icon: BarChart3 },
    ] : []),
    { label: "Configurações", href: user.role === 'ADMIN' ? "/admin/settings" : "/instructor/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6 flex items-center space-x-2">
        <div className="bg-primary p-1.5 rounded-lg">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">DigitalCursos <span className="text-xs font-normal text-slate-500 uppercase ml-1">{user.role}</span></span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              location.pathname === item.href 
                ? "bg-primary text-white font-semibold shadow-lg shadow-primary/20" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5",
              location.pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair do Painel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 fixed h-full z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b bg-white sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="ml-4 text-xl font-bold text-primary">DigitalCursos</span>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center rounded-full border-primary/20 text-primary hover:bg-primary/5">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>
            
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-white"></span>
            </Button>
            
            <div className="flex items-center space-x-3 pl-2 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{user.role}</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

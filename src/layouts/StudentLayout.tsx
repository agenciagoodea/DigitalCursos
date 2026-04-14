import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { User, Notification } from "@/src/types";
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  User as UserIcon, 
  LogOut, 
  Bell,
  Search,
  Menu,
  Moon,
  Sun,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  Settings,
  Zap
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";

interface StudentLayoutProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function StudentLayout({ user, setUser }: StudentLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "Meus Cursos", href: "/student/courses", icon: BookOpen },
    { label: "Certificados", href: "/student/certificates", icon: Award },
    { label: "Perfil", href: "/student/profile", icon: UserIcon },
  ];

  const unreadNotifications = user?.notifications?.filter(n => !n.read) || [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-8">
        <Link to="/student" className="flex items-center gap-3 group">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-heading">DigitalCursos</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isActive ? "text-white" : "text-muted-foreground"
              )} />
              <span className="font-semibold">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-muted/50 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plano Pro</p>
              <p className="text-sm font-bold">Acesso Vitalício</p>
            </div>
          </div>
          <Button variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
            Ver Benefícios
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 fixed h-full z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 border-b bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-xl")}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-none">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="ml-4 text-xl font-bold font-heading">DigitalCursos</span>
          </div>

          <div className="hidden md:flex relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Pesquisar cursos, lições..." 
              className="pl-11 pr-4 h-11 bg-muted/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl h-11 w-11 hover:bg-muted"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative rounded-xl h-11 w-11 hover:bg-muted")}>
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2 rounded-3xl shadow-2xl border-border/50">
                <DropdownMenuLabel className="px-4 py-3 font-heading text-lg">Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                  {user?.notifications?.length ? user.notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="p-4 rounded-2xl cursor-pointer focus:bg-muted mb-1">
                      <div className="flex gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          n.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {n.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-sm leading-none">{n.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )) : (
                    <div className="py-8 text-center text-muted-foreground">
                      Nenhuma notificação por aqui.
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center py-3 font-bold text-primary rounded-2xl">
                  Ver todas as notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "pl-2 pr-4 h-12 rounded-2xl hover:bg-muted gap-3 flex items-center")}>
                <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold leading-none">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">Aluno Premium</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-border/50">
                <DropdownMenuLabel className="px-4 py-2 font-heading">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500 focus:bg-red-50 rounded-xl py-2.5 cursor-pointer" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-8 md:p-10 flex-1 bg-background/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

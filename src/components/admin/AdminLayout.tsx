import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  CheckSquare,
  TrendingUp,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Solicitudes",
    href: "/admin/solicitudes",
    icon: FileText,
  },
  {
    name: "Aprobaciones",
    href: "/admin/aprobaciones",
    icon: CheckSquare,
  },
  {
    name: "Reglas Automáticas",
    href: "/admin/reglas",
    icon: TrendingUp,
  },
  {
    name: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-neutral-600 hover:text-neutral-900"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-bank-magenta to-bank-magenta-dark bg-clip-text text-transparent">
              Panel de Administración
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-bank-magenta-light to-pink-100 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bank-magenta to-bank-magenta-dark flex items-center justify-center text-white font-semibold text-sm">
                MG
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-neutral-800">María González</p>
                <p className="text-xs text-neutral-600">Analista</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-bank-magenta transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-10 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{ top: "73px" }}
        >
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all
                    ${
                      active
                        ? "bg-gradient-to-r from-bank-magenta-light to-pink-100 text-bank-magenta shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-bank-magenta"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="p-4 mt-6">
            <div className="bg-gradient-to-br from-bank-magenta-light to-pink-50 rounded-xl p-4 border border-pink-200">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Estadísticas Hoy</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-600">Pendientes</span>
                  <span className="text-sm font-bold text-bank-magenta">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-600">Aprobadas</span>
                  <span className="text-sm font-bold text-emerald-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-600">En Revisión</span>
                  <span className="text-sm font-bold text-amber-600">12</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-0 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

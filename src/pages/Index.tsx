import { useNavigate } from "react-router-dom";
import { LoanType, LoanTypeOption } from "@/types/loan";
import { User, Car, Home, Briefcase, ArrowRight } from "lucide-react";

const loanTypes: LoanTypeOption[] = [
  {
    id: "personal",
    title: "Préstamo Personal",
    description: "Hasta 36 meses para gastos personales y proyectos",
    icon: "user",
    minAmount: 500,
    maxAmount: 50000,
    terms: [6, 12, 24, 36],
  },
  {
    id: "vehicular",
    title: "Préstamo Vehicular",
    description: "Financia tu auto nuevo o usado con tasas preferenciales",
    icon: "car",
    minAmount: 5000,
    maxAmount: 80000,
    terms: [12, 24, 36, 48, 60],
  },
  {
    id: "hipotecario",
    title: "Préstamo Hipotecario",
    description: "Compra o construye tu casa con los mejores plazos",
    icon: "home",
    minAmount: 20000,
    maxAmount: 500000,
    terms: [60, 120, 180, 240, 300],
  },
  {
    id: "negocio",
    title: "Préstamo para Negocio",
    description: "Impulsa tu emprendimiento o empresa con capital de trabajo",
    icon: "briefcase",
    minAmount: 1000,
    maxAmount: 100000,
    terms: [6, 12, 24, 36, 48],
  },
];

const iconMap: Record<string, React.ReactNode> = {
  user: <User className="h-8 w-8" />,
  car: <Car className="h-8 w-8" />,
  home: <Home className="h-8 w-8" />,
  briefcase: <Briefcase className="h-8 w-8" />,
};

const Index = () => {
  const navigate = useNavigate();

  const handleSelectLoanType = (loanType: LoanType) => {
    navigate("/solicitud", { state: { loanType } });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Mi Banco</h1>
            <div className="flex items-center gap-4">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ayuda
              </button>
              <button className="text-sm font-medium text-primary hover:text-bank-blue-dark transition-colors">
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-bank-blue-dark text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Solicita tu préstamo
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Proceso 100% digital. Respuesta rápida y condiciones transparentes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span>Aprobación en 24 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span>Sin comisiones ocultas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span>Desembolso inmediato</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Selection */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-3">
              ¿Qué tipo de préstamo necesitas?
            </h3>
            <p className="text-muted-foreground text-center mb-10">
              Selecciona el tipo de préstamo que mejor se adapte a tus necesidades
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {loanTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelectLoanType(type.id)}
                  className="group bg-card border border-border rounded-2xl p-6 text-left transition-all duration-200 hover:border-primary hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-accent text-accent-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {iconMap[type.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {type.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {type.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>
                          Desde ${type.minAmount.toLocaleString()} hasta $
                          {type.maxAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-10">
              ¿Por qué elegir nuestros préstamos?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold mb-2">Proceso ágil</h4>
                <p className="text-sm text-muted-foreground">
                  Solicitud 100% digital en menos de 10 minutos
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-success/10 text-success mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="font-semibold mb-2">Tasas competitivas</h4>
                <p className="text-sm text-muted-foreground">
                  Las mejores tasas del mercado según tu perfil
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-warning/10 text-warning mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h4 className="font-semibold mb-2">Seguro y confiable</h4>
                <p className="text-sm text-muted-foreground">
                  Tus datos protegidos con tecnología de punta
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm">
            <p className="mb-2">© 2024 Mi Banco. Todos los derechos reservados.</p>
            <p className="text-neutral-400">
              Préstamos sujetos a evaluación crediticia y aprobación.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

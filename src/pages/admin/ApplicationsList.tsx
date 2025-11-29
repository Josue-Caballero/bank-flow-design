import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockApplications } from "@/data/mockData";
import { Search, Filter, Eye, Clock, CheckCircle, AlertCircle, ChevronRight, Zap, FileText } from "lucide-react";
import { AdminLoanApplication, RiskLevel } from "@/types/admin";
import { formatCurrency } from "@/utils/loanCalculator";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ApplicationsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"draft" | "submitted" | "evaluating" | "approved" | "rejected" | "all">("all");
  const [applications] = useState<AdminLoanApplication[]>(mockApplications);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalData.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: "draft" | "submitted" | "evaluating" | "approved" | "rejected") => {
    const badges: Record<string, { label: string; className: string }> = {
      draft: { label: "Borrador", className: "bg-neutral-100 text-neutral-700 border-neutral-300" },
      submitted: { label: "Enviada", className: "bg-blue-50 text-blue-700 border-blue-200" },
      evaluating: { label: "En Evaluación", className: "bg-amber-50 text-amber-700 border-amber-200" },
      approved: { label: "Aprobada", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      rejected: { label: "Rechazada", className: "bg-red-50 text-red-700 border-red-200" },
    };

    const badge = badges[status];
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const getRiskBadge = (risk: RiskLevel) => {
    const badges: Record<RiskLevel, { label: string; className: string; icon: any }> = {
      low: { label: "Bajo", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle },
      medium: { label: "Medio", className: "bg-amber-50 text-amber-700", icon: AlertCircle },
      high: { label: "Alto", className: "bg-red-50 text-red-700", icon: AlertCircle },
      critical: { label: "Crítico", className: "bg-red-100 text-red-800", icon: AlertCircle },
    };

    const badge = badges[risk];
    const Icon = badge.icon;
    return (
      <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg ${badge.className}`}>
        <Icon className="h-3.5 w-3.5" />
        <span>{badge.label}</span>
      </div>
    );
  };

  const getLoanTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      personal: "Personal",
      vehicular: "Vehicular",
      hipotecario: "Hipotecario",
      negocio: "Negocio",
    };
    return labels[type] || type;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Solicitudes</h2>
            <p className="text-neutral-600 mt-1">Gestiona y revisa todas las solicitudes de préstamo</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por ID, nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-magenta/20 focus:border-bank-magenta"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-neutral-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "draft" | "submitted" | "evaluating" | "approved" | "rejected" | "all")}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-magenta/20 focus:border-bank-magenta bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="submitted">Enviadas</option>
                <option value="evaluating">En Evaluación</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-medium">{filteredApplications.length}</span>
          <span>solicitudes encontradas</span>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Link
              key={app.id}
              to={`/admin/solicitud/${app.id}`}
              className="block bg-white rounded-xl p-6 border border-neutral-200 hover:border-bank-magenta hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Main Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-bank-magenta transition-colors">
                          {app.personalData.fullName}
                        </h3>
                        {app.approvalType === "automatic" && (
                          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            <Zap className="h-3.5 w-3.5" />
                            <span>Automático</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">
                        {app.id} • {app.personalData.email}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Tipo</p>
                      <p className="text-sm font-semibold text-neutral-800">
                        {getLoanTypeLabel(app.loanType)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Monto</p>
                      <p className="text-sm font-semibold text-neutral-800">
                        {formatCurrency(app.loanDetails.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Score</p>
                      <p className="text-sm font-semibold text-neutral-800">
                        {app.creditScore?.score || "N/A"}
                        {app.creditScore && (
                          <span className="text-xs text-neutral-500 ml-1">/ 850</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Riesgo</p>
                      {getRiskBadge(app.riskLevel)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(app.submittedAt), "dd MMM yyyy, HH:mm", { locale: es })}
                      </span>
                    </div>
                    {app.assignedTo && (
                      <div className="flex items-center gap-1.5">
                        <span>Asignada a: {app.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-bank-magenta-light to-pink-100 text-bank-magenta font-medium rounded-lg hover:shadow-md transition-all group-hover:from-bank-magenta group-hover:to-bank-magenta-dark group-hover:text-white">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Ver Detalle</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
            <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 font-medium">No se encontraron solicitudes</p>
            <p className="text-sm text-neutral-500 mt-1">Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApplicationsList;

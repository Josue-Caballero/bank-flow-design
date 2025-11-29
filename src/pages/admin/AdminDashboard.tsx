import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockStatistics } from "@/data/mockData";
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, FileText } from "lucide-react";

const AdminDashboard = () => {
  const stats = mockStatistics;

  const statCards = [
    {
      title: "Total Solicitudes",
      value: stats.total.toLocaleString(),
      icon: FileText,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "amber",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    {
      title: "Aprobadas",
      value: stats.approved.toLocaleString(),
      icon: CheckCircle,
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      trend: `${stats.approvalRate.toFixed(1)}%`,
      trendUp: true,
    },
    {
      title: "Rechazadas",
      value: stats.rejected.toLocaleString(),
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Dashboard</h2>
          <p className="text-neutral-600 mt-1">Resumen general de solicitudes y aprobaciones</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`bg-white rounded-xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-medium mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    {stat.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        {stat.trendUp ? (
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-semibold ${stat.trendUp ? "text-emerald-600" : "text-red-600"}`}>
                          {stat.trend}
                        </span>
                        <span className="text-xs text-neutral-500">tasa aprobación</span>
                      </div>
                    )}
                  </div>
                  <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-xl`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Processing Time */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tiempo de Procesamiento</h3>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-bank-magenta">{stats.averageProcessingTime}</p>
              <span className="text-neutral-600 mb-2">horas promedio</span>
            </div>
            <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-bank-magenta to-bank-magenta-dark"
                style={{ width: `${Math.min((24 - stats.averageProcessingTime) / 24 * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">Meta: Menos de 24 horas</p>
          </div>

          {/* Auto Approval Rate */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tasa de Aprobación Automática</h3>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-bank-magenta">{stats.autoApprovalRate.toFixed(1)}%</p>
            </div>
            <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                style={{ width: `${stats.autoApprovalRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              {Math.round((stats.total * stats.autoApprovalRate) / 100)} solicitudes aprobadas automáticamente
            </p>
          </div>
        </div>

        {/* Loan Types Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Solicitudes por Tipo de Préstamo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Object.entries(stats.byLoanType).map(([type, data]) => {
              const approvalRate = (data.approved / data.total) * 100;
              const typeLabels: Record<string, string> = {
                personal: "Personal",
                vehicular: "Vehicular",
                hipotecario: "Hipotecario",
                negocio: "Negocio",
              };

              return (
                <div key={type} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-800">{typeLabels[type]}</p>
                    <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">
                      {data.total} total
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600">Aprobadas</span>
                      <span className="font-semibold">{data.approved}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Rechazadas</span>
                      <span className="font-semibold">{data.rejected}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>Tasa aprobación</span>
                      <span className="font-semibold">{approvalRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-bank-magenta to-bank-magenta-dark"
                        style={{ width: `${approvalRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

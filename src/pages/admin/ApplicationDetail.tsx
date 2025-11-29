import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockApplications } from "@/data/mockData";
import { 
  ArrowLeft, CheckCircle, XCircle, FileText, 
  User, Briefcase, DollarSign, AlertCircle, History,
  MessageSquare, Download, Zap
} from "lucide-react";
import { formatCurrency } from "@/utils/loanCalculator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application] = useState(() => mockApplications.find((app) => app.id === id));
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  if (!application) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Solicitud no encontrada</h2>
          <p className="text-neutral-600 mb-6">La solicitud que buscas no existe</p>
          <button
            onClick={() => navigate("/admin/solicitudes")}
            className="px-6 py-3 bg-bank-magenta text-white rounded-lg hover:bg-bank-magenta-dark transition-colors"
          >
            Volver a solicitudes
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleApprove = () => {
    toast.success("Solicitud aprobada exitosamente");
    setShowApprovalModal(false);
    setTimeout(() => navigate("/admin/solicitudes"), 1500);
  };

  const handleReject = () => {
    toast.error("Solicitud rechazada");
    setShowRejectModal(false);
    setTimeout(() => navigate("/admin/solicitudes"), 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/solicitudes")}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-600" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900">Detalle de Solicitud</h2>
            <p className="text-neutral-600 mt-1">{application.id}</p>
          </div>
          {application.approvalType === "automatic" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Aprobación Automática</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cliente Info */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-bank-magenta-light to-pink-100 rounded-xl">
                  <User className="h-6 w-6 text-bank-magenta" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Datos del Cliente</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Nombre Completo</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.personalData.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Cédula</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.personalData.documentId}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Email</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.personalData.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Teléfono</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.personalData.phone}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-neutral-500 font-medium">Dirección</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.personalData.address}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Estado Civil</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1 capitalize">
                    {application.personalData.maritalStatus}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Cliente Existente</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.personalData.isExistingClient ? "Sí" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Work Info */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-bank-magenta-light to-pink-100 rounded-xl">
                  <Briefcase className="h-6 w-6 text-bank-magenta" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Información Laboral</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Tipo de Empleo</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1 capitalize">
                    {application.workInfo.employmentType}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Cargo</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.workInfo.position}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Empresa</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.workInfo.companyName}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Antigüedad</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.workInfo.workYears} años
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Ingresos Mensuales</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {formatCurrency(application.workInfo.monthlyIncome)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Teléfono Empresa</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.workInfo.companyPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-bank-magenta-light to-pink-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-bank-magenta" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Detalles del Préstamo</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Monto Solicitado</label>
                  <p className="text-2xl font-bold text-bank-magenta mt-1">
                    {formatCurrency(application.loanDetails.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Plazo</label>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    {application.loanDetails.term} meses
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Cuota Mensual</label>
                  <p className="text-lg font-semibold text-neutral-900 mt-1">
                    {formatCurrency(application.calculation.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-medium">Tasa de Interés</label>
                  <p className="text-lg font-semibold text-neutral-900 mt-1">
                    {application.calculation.interestRate}% anual
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-neutral-500 font-medium">Destino</label>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {application.loanDetails.purpose}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-bank-magenta-light to-pink-100 rounded-xl">
                  <FileText className="h-6 w-6 text-bank-magenta" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Documentos Adjuntos</h3>
              </div>

              <div className="space-y-3">
                {application.documents.map((doc) => (
                  <div
                    key={doc.type}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium text-neutral-800">{doc.name}</span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-bank-magenta hover:bg-bank-magenta-light rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Descargar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-bank-magenta-light to-pink-100 rounded-xl">
                  <History className="h-6 w-6 text-bank-magenta" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Historial</h3>
              </div>

              <div className="space-y-4">
                {application.history.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-bank-magenta"></div>
                      {index < application.history.length - 1 && (
                        <div className="w-0.5 h-full bg-neutral-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold text-neutral-900">{entry.action}</p>
                      <p className="text-sm text-neutral-600 mt-1">
                        Por: {entry.performedBy}
                      </p>
                      {entry.details && (
                        <p className="text-sm text-neutral-500 mt-1">{entry.details}</p>
                      )}
                      <p className="text-xs text-neutral-400 mt-2">
                        {format(new Date(entry.timestamp), "dd MMM yyyy, HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Credit Score */}
            {application.creditScore && (
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-700 mb-4 uppercase tracking-wide">
                  Score Crediticio
                </h3>
                <div className="text-center mb-6">
                  <p className="text-5xl font-bold bg-gradient-to-br from-bank-magenta to-bank-magenta-dark bg-clip-text text-transparent">
                    {application.creditScore.score}
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">sobre 850</p>
                  <p className="text-lg font-semibold text-neutral-800 mt-2 capitalize">
                    {application.creditScore.rating}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-600">Ingresos</span>
                      <span className="font-semibold">{application.creditScore.factors.income}/250</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-bank-magenta to-bank-magenta-dark"
                        style={{ width: `${(application.creditScore.factors.income / 250) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-600">Ratio deuda</span>
                      <span className="font-semibold">{application.creditScore.factors.debtRatio}/200</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-bank-magenta to-bank-magenta-dark"
                        style={{ width: `${(application.creditScore.factors.debtRatio / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-600">Empleo</span>
                      <span className="font-semibold">{application.creditScore.factors.employment}/200</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-bank-magenta to-bank-magenta-dark"
                        style={{ width: `${(application.creditScore.factors.employment / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-600">Historial</span>
                      <span className="font-semibold">{application.creditScore.factors.history}/150</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-bank-magenta to-bank-magenta-dark"
                        style={{ width: `${(application.creditScore.factors.history / 150) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {application.status === "submitted" && (
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-neutral-700 mb-4 uppercase tracking-wide">
                  Acciones
                </h3>
                <button
                  onClick={() => setShowApprovalModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Aprobar Solicitud</span>
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Rechazar Solicitud</span>
                </button>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5 text-bank-magenta" />
                <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">
                  Notas Internas
                </h3>
              </div>
              {application.notes.length > 0 ? (
                <div className="space-y-3">
                  {application.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm font-semibold text-neutral-800 mb-1">{note.author}</p>
                      <p className="text-sm text-neutral-600">{note.content}</p>
                      <p className="text-xs text-neutral-400 mt-2">
                        {format(new Date(note.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No hay notas registradas</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Aprobar Solicitud</h3>
            </div>
            <p className="text-neutral-600 mb-6">
              ¿Estás seguro de que deseas aprobar esta solicitud?
            </p>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Notas de aprobación (opcional)"
              className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-magenta/20 focus:border-bank-magenta mb-4"
              rows={4}
            ></textarea>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 px-4 py-2.5 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Confirmar Aprobación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Rechazar Solicitud</h3>
            </div>
            <p className="text-neutral-600 mb-6">
              Por favor, indica el motivo del rechazo:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo del rechazo (requerido)"
              className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 mb-4"
              rows={4}
              required
            ></textarea>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2.5 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ApplicationDetail;

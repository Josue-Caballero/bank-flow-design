import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CreateRuleModal } from "@/components/admin/CreateRuleModal";
import { EditRuleModal } from "@/components/admin/EditRuleModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { mockApprovalRules } from "@/data/mockData";
import { ApprovalRule } from "@/types/admin";
import { Plus, Edit, Trash2, ToggleLeft, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AutomaticRulesConfig = () => {
  const [rules, setRules] = useState<ApprovalRule[]>(mockApprovalRules);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
    const rule = rules.find(r => r.id === ruleId);
    toast.success(`Regla "${rule?.name}" ${rule?.isActive ? 'desactivada' : 'activada'}`);
  };

  const handleCreateRule = (newRule: ApprovalRule) => {
    setRules([...rules, newRule]);
    setShowCreateModal(false);
    toast.success(`Regla "${newRule.name}" creada exitosamente`);
  };

  const handleEditRule = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setShowEditModal(true);
  };

  const handleSaveEditRule = (updatedRule: ApprovalRule) => {
    setRules(rules.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ));
    setShowEditModal(false);
    setEditingRule(null);
    toast.success(`Regla "${updatedRule.name}" actualizada exitosamente`);
  };

  const handleDeleteRule = (ruleId: string) => {
    setDeletingRuleId(ruleId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!deletingRuleId) return;
    
    const rule = rules.find(r => r.id === deletingRuleId);
    
    setRules(rules.filter(r => r.id !== deletingRuleId));
    setShowDeleteConfirm(false);
    setDeletingRuleId(null);
    toast.success(`Regla "${rule?.name}" eliminada`);
  };

  const getActionBadge = (actionType: string) => {
    const badges: Record<string, { label: string; className: string; icon: any }> = {
      auto_approve: { 
        label: "Aprobar Automático", 
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle 
      },
      auto_reject: { 
        label: "Rechazar Automático", 
        className: "bg-red-50 text-red-700 border-red-200",
        icon: AlertCircle 
      },
      require_manual_review: { 
        label: "Revisión Manual", 
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: AlertCircle 
      },
      assign_to: { 
        label: "Asignar a", 
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: AlertCircle 
      },
    };

    const badge = badges[actionType] || badges.require_manual_review;
    const Icon = badge.icon;

    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${badge.className}`}>
        <Icon className="h-3.5 w-3.5" />
        <span>{badge.label}</span>
      </div>
    );
  };

  const getPriorityBadge = (priority: number) => {
    const colors: Record<number, string> = {
      0: "bg-red-100 text-red-700",
      1: "bg-amber-100 text-amber-700",
      2: "bg-blue-100 text-blue-700",
      3: "bg-neutral-100 text-neutral-700",
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${colors[priority] || colors[3]}`}>
        P{priority}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Reglas de Aprobación Automática</h2>
            <p className="text-neutral-600 mt-1">
              Configura las condiciones para aprobaciones y rechazos automáticos
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-bank-magenta to-bank-magenta-dark text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Regla</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-bank-magenta-light to-pink-50 rounded-xl p-6 border border-pink-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Zap className="h-6 w-6 text-bank-magenta" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-neutral-900 mb-2">¿Cómo funcionan las reglas automáticas?</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Las reglas se evalúan en orden de prioridad (P0 es la más alta). Cuando una solicitud cumple 
                todas las condiciones de una regla, se ejecuta la acción asociada automáticamente. Las reglas 
                desactivadas no se evalúan.
              </p>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {rules.sort((a, b) => a.priority - b.priority).map((rule) => (
            <div
              key={rule.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                rule.isActive 
                  ? "border-neutral-200 hover:border-bank-magenta hover:shadow-md" 
                  : "border-neutral-100 bg-neutral-50/50 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Priority Badge */}
                <div className="flex-shrink-0">
                  {getPriorityBadge(rule.priority)}
                </div>

                {/* Rule Content */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-neutral-900">{rule.name}</h3>
                        {getActionBadge(rule.action.type)}
                        {!rule.isActive && (
                          <span className="text-xs px-2 py-1 bg-neutral-200 text-neutral-600 rounded-full font-semibold">
                            Desactivada
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">{rule.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          rule.isActive
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-neutral-400 hover:bg-neutral-100"
                        }`}
                        title={rule.isActive ? "Desactivar" : "Activar"}
                      >
                        <ToggleLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                      Condiciones (todas deben cumplirse):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rule.conditions.map((condition, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                        >
                          <div className="w-2 h-2 rounded-full bg-bank-magenta"></div>
                          <span className="text-sm font-medium text-neutral-800">
                            {condition.label || `${condition.field} ${condition.operator} ${condition.value}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Parameters */}
                  {rule.action.parameters && Object.keys(rule.action.parameters).length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-bank-magenta-light to-pink-50 rounded-lg border border-pink-200">
                      <AlertCircle className="h-4 w-4 text-bank-magenta mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-neutral-700">
                        {rule.action.parameters.maxAmount && (
                          <p><strong>Monto máximo:</strong> ${rule.action.parameters.maxAmount.toLocaleString()}</p>
                        )}
                        {rule.action.parameters.reason && (
                          <p><strong>Razón:</strong> {rule.action.parameters.reason}</p>
                        )}
                        {rule.action.parameters.assignTo && (
                          <p><strong>Asignar a:</strong> {rule.action.parameters.assignTo}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                    <span>Creada por: <strong>{rule.createdBy}</strong></span>
                    <span>•</span>
                    <span>Última actualización: {new Date(rule.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
            <Zap className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 font-medium mb-2">No hay reglas configuradas</p>
            <p className="text-sm text-neutral-500 mb-6">Crea tu primera regla de aprobación automática</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-bank-magenta text-white font-semibold rounded-lg hover:bg-bank-magenta-dark transition-colors"
            >
              Crear Regla
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateRuleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateRule}
        userName="Admin"
      />

      {/* Edit Modal */}
      <EditRuleModal
        isOpen={showEditModal}
        rule={editingRule}
        onClose={() => {
          setShowEditModal(false);
          setEditingRule(null);
        }}
        onSave={handleSaveEditRule}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        ruleName={rules.find(r => r.id === deletingRuleId)?.name || ""}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeletingRuleId(null);
        }}
      />
    </AdminLayout>
  );
};

export default AutomaticRulesConfig;

import { useState } from "react";
import { ApprovalRule, RuleCondition, RuleAction } from "@/types/admin";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: ApprovalRule) => void;
  userName: string;
}

const fieldOptions = [
  { value: "isExistingClient", label: "Cliente Existente" },
  { value: "creditScore.score", label: "Score Crediticio" },
  { value: "loanDetails.amount", label: "Monto del Préstamo" },
  { value: "loanType", label: "Tipo de Préstamo" },
  { value: "workInfo.monthlyIncome", label: "Ingreso Mensual" },
  { value: "workInfo.workYears", label: "Años en Trabajo" },
  { value: "riskLevel", label: "Nivel de Riesgo" },
  { value: "personalData.maritalStatus", label: "Estado Civil" },
  { value: "loanDetails.term", label: "Plazo (meses)" },
];

const operatorOptions = [
  { value: "equals", label: "Igual a" },
  { value: "greater_than", label: "Mayor que" },
  { value: "less_than", label: "Menor que" },
  { value: "between", label: "Entre" },
  { value: "in", label: "En la lista" },
  { value: "not_in", label: "No en la lista" },
];

const actionTypeOptions = [
  { value: "auto_approve", label: "Aprobar Automáticamente" },
  { value: "auto_reject", label: "Rechazar Automáticamente" },
  { value: "require_manual_review", label: "Requerir Revisión Manual" },
];

export const CreateRuleModal = ({
  isOpen,
  onClose,
  onSave,
  userName,
}: CreateRuleModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: 3,
    conditions: [] as RuleCondition[],
    actionType: "auto_approve" as RuleAction["type"],
    maxAmount: "",
    reason: "",
  });

  const [currentCondition, setCurrentCondition] = useState({
    field: "",
    operator: "equals",
    value: "",
  });

  const handleAddCondition = () => {
    if (!currentCondition.field || !currentCondition.value) {
      toast.error("Completa todos los campos de la condición");
      return;
    }

    const newCondition: RuleCondition = {
      field: currentCondition.field,
      operator: currentCondition.operator as any,
      value:
        currentCondition.operator === "equals" ||
        currentCondition.operator === "in" ||
        currentCondition.operator === "not_in"
          ? currentCondition.value
          : Number(currentCondition.value),
      label: `${
        fieldOptions.find((f) => f.value === currentCondition.field)?.label ||
        currentCondition.field
      } ${
        operatorOptions.find((o) => o.value === currentCondition.operator)
          ?.label || currentCondition.operator
      } ${currentCondition.value}`,
    };

    setFormData({
      ...formData,
      conditions: [...formData.conditions, newCondition],
    });

    setCurrentCondition({
      field: "",
      operator: "equals",
      value: "",
    });

    toast.success("Condición agregada");
  };

  const handleRemoveCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre de la regla es requerido");
      return;
    }

    if (formData.conditions.length === 0) {
      toast.error("Debes agregar al menos una condición");
      return;
    }

    const newRule: ApprovalRule = {
      id: `RULE-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      isActive: true,
      priority: formData.priority,
      conditions: formData.conditions,
      action: {
        type: formData.actionType,
        parameters: {
          ...(formData.maxAmount && { maxAmount: Number(formData.maxAmount) }),
          ...(formData.reason && { reason: formData.reason }),
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userName,
    };

    onSave(newRule);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      priority: 3,
      conditions: [],
      actionType: "auto_approve",
      maxAmount: "",
      reason: "",
    });
    setCurrentCondition({
      field: "",
      operator: "equals",
      value: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 className="text-lg font-medium text-neutral-900">Nueva Regla</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Información Básica</h3>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: Auto-aprobación clientes premium"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-bank-magenta bg-neutral-50 hover:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe el propósito"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-bank-magenta resize-none bg-neutral-50 hover:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Prioridad
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`py-1.5 rounded-lg font-medium text-sm transition-colors ${
                      formData.priority === p
                        ? "bg-bank-magenta text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    P{p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <h3 className="text-sm font-semibold text-neutral-900">Condiciones</h3>

            {/* Add Condition Form */}
            <div className="bg-neutral-50 rounded-lg p-3 space-y-2 border border-neutral-200">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Campo
                  </label>
                  <select
                    value={currentCondition.field}
                    onChange={(e) =>
                      setCurrentCondition({
                        ...currentCondition,
                        field: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-bank-magenta bg-neutral-50 hover:bg-white transition-colors"
                  >
                    <option value="">Selecciona</option>
                    {fieldOptions.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Operador
                  </label>
                  <select
                    value={currentCondition.operator}
                    onChange={(e) =>
                      setCurrentCondition({
                        ...currentCondition,
                        operator: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-bank-magenta bg-neutral-50 hover:bg-white transition-colors"
                  >
                    {operatorOptions.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Valor
                  </label>
                  <input
                    type={
                      currentCondition.operator === "equals" ||
                      currentCondition.operator === "in" ||
                      currentCondition.operator === "not_in"
                        ? "text"
                        : "number"
                    }
                    value={currentCondition.value}
                    onChange={(e) =>
                      setCurrentCondition({
                        ...currentCondition,
                        value: e.target.value,
                      })
                    }
                    placeholder="Valor"
                    className="w-full px-2 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-bank-magenta bg-neutral-50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCondition}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-bank-magenta text-white font-medium text-sm rounded-lg hover:bg-bank-magenta-dark transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Condición</span>
              </button>
            </div>

            {/* Conditions List */}
            {formData.conditions.length > 0 && (
              <div className="space-y-2">
                {formData.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200"
                  >
                    <span className="text-xs font-medium text-emerald-900 line-clamp-2">
                      {condition.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action */}
          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <h3 className="text-sm font-semibold text-neutral-900">Acción</h3>

            <div className="grid grid-cols-1 gap-2">
              {actionTypeOptions.map((action) => (
                <label
                  key={action.value}
                  className="flex items-center gap-3 p-2 rounded-lg border-2 cursor-pointer transition-all"
                  style={{
                    borderColor:
                      formData.actionType === action.value
                        ? "#d946a6"
                        : "#e5e7eb",
                    backgroundColor:
                      formData.actionType === action.value
                        ? "#fce7f3"
                        : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="actionType"
                    value={action.value}
                    checked={formData.actionType === action.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actionType: e.target.value as RuleAction["type"],
                      })
                    }
                    className="w-3 h-3"
                  />
                  <span className="font-medium text-sm text-neutral-900">
                    {action.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Conditional fields */}
            {(formData.actionType === "auto_approve" ||
              formData.actionType === "auto_reject") && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Monto Máximo (Opcional)
                </label>
                <input
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxAmount: e.target.value })
                  }
                  placeholder="Ej: 10000"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-bank-magenta bg-neutral-50 hover:bg-white transition-colors"
                />
              </div>
            )}

            {(formData.actionType === "auto_reject" ||
              formData.actionType === "require_manual_review") && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Razón
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Ej: Score crediticio bajo"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-bank-magenta bg-neutral-50 hover:bg-white transition-colors"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-neutral-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-lg border-2 border-neutral-300 text-neutral-900 font-medium text-sm hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-bank-magenta to-bank-magenta-dark text-white font-medium text-sm hover:shadow-lg transition-all"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

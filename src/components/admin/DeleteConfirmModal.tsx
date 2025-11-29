import { AlertCircle, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  ruleName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  ruleName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center pt-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">
            ¿Eliminar esta regla?
          </h3>
          <p className="text-sm text-neutral-600">
            Estás a punto de eliminar la regla{" "}
            <span className="font-medium text-neutral-900">"{ruleName}"</span>
            . Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-neutral-200">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 rounded-lg border-2 border-neutral-300 text-neutral-900 font-medium text-sm hover:bg-neutral-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

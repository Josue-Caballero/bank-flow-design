import { Upload, CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  title: string;
  description?: string;
  uploaded: boolean;
  fileName?: string;
  onUploadClick: () => void;
}

export const DocumentCard = ({
  title,
  description,
  uploaded,
  fileName,
  onUploadClick,
}: DocumentCardProps) => {
  return (
    <button
      type="button"
      onClick={onUploadClick}
      className={cn(
        "w-full min-h-[120px] rounded-xl border-2 border-dashed p-6",
        "transition-all duration-200",
        "flex flex-col items-center justify-center gap-3",
        "text-center",
        uploaded
          ? "border-success bg-success/5"
          : "border-neutral-300 bg-background hover:border-primary hover:bg-accent/50"
      )}
    >
      {uploaded ? (
        <>
          <CheckCircle2 className="h-10 w-10 text-success" />
          <div>
            <p className="text-sm font-semibold text-success">{title}</p>
            {fileName && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>{fileName}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-neutral-700">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <p className="text-xs text-primary font-medium">
            Tocar para subir o tomar foto
          </p>
        </>
      )}
    </button>
  );
};

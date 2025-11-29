import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { LoanType, PersonalData, WorkInfo, LoanDetails, DocumentUpload, LoanApplication as LoanApp } from "@/types/loan";
import { calculateLoan, calculateCreditScore, formatCurrency } from "@/utils/loanCalculator";
import { BankInput } from "@/components/loan/BankInput";
import { BankButton } from "@/components/loan/BankButton";
import { LoanChip } from "@/components/loan/LoanChip";
import { LoanCalculatorCard } from "@/components/loan/LoanCalculatorCard";
import { DocumentCard } from "@/components/loan/DocumentCard";
import { ProgressStepper } from "@/components/loan/ProgressStepper";
import { CreditScoreCard } from "@/components/loan/CreditScoreCard";
import { BankCaptcha } from "@/components/loan/BankCaptcha";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Schemas
const personalDataSchema = z.object({
  fullName: z.string().min(3, "Nombre debe tener al menos 3 caracteres").max(100),
  documentId: z.string().min(5, "Documento inválido").max(20),
  birthDate: z.date({ required_error: "Fecha de nacimiento requerida" }),
  maritalStatus: z.enum(["soltero", "casado", "divorciado", "viudo"]),
  phone: z.string().min(7, "Teléfono inválido").max(15),
  email: z.string().email("Email inválido"),
  address: z.string().min(10, "Dirección debe ser más específica").max(200),
  isExistingClient: z.boolean(),
});

const workInfoSchema = z.object({
  employmentType: z.enum(["dependiente", "independiente"]),
  position: z.string().min(2, "Cargo requerido").max(100),
  companyName: z.string().min(2, "Nombre de empresa requerido").max(100),
  monthlyIncome: z.number().min(300, "Ingresos deben ser al menos $300"),
  workYears: z.number().min(0, "Antigüedad inválida").max(50),
  companyPhone: z.string().min(7, "Teléfono inválido").max(15),
});

const loanDetailsSchema = z.object({
  amount: z.number().min(500, "Monto mínimo $500"),
  term: z.number().min(6, "Plazo mínimo 6 meses"),
  purpose: z.string().min(1, "Seleccione el destino del préstamo"),
  guaranteeType: z.string().optional(),
});

const STEPS = [
  { id: 1, title: "Datos Personales", description: "Información básica del solicitante" },
  { id: 2, title: "Información Laboral", description: "Situación laboral y económica" },
  { id: 3, title: "Detalles del Préstamo", description: "Monto, plazo y destino" },
  { id: 4, title: "Documentos", description: "Adjunta los documentos requeridos" },
  { id: 5, title: "Confirmación", description: "Revisa y confirma tu solicitud" },
];

const LOAN_PURPOSES = [
  "Consumo personal",
  "Vehículo",
  "Vivienda",
  "Educación",
  "Salud",
  "Negocio",
  "Consolidación de deudas",
  "Otro",
];

const LoanApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loanType = (location.state?.loanType as LoanType) || "personal";

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState<Partial<LoanApp>>({
    loanType,
    status: "draft",
    createdAt: new Date(),
  });

  // Forms
  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      isExistingClient: false,
    },
  });

  const workForm = useForm<WorkInfo>({
    resolver: zodResolver(workInfoSchema),
    defaultValues: {
      employmentType: "dependiente",
      workYears: 0,
    },
  });

  const loanForm = useForm<LoanDetails>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: {
      amount: 5000,
      term: 12,
    },
  });

  // State
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: "id", name: "Cédula de identidad", uploaded: false },
    { type: "income", name: "Comprobante de ingresos", uploaded: false },
    { type: "utility", name: "Planilla de servicios básicos", uploaded: false },
  ]);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Loan calculation
  const amount = loanForm.watch("amount");
  const term = loanForm.watch("term");
  const calculation = calculateLoan(loanType, amount, term);

  // Get available terms based on loan type
  const getTermsForLoanType = () => {
    switch (loanType) {
      case "personal":
        return [6, 12, 24, 36];
      case "vehicular":
        return [12, 24, 36, 48, 60];
      case "hipotecario":
        return [60, 120, 180, 240, 300];
      case "negocio":
        return [6, 12, 24, 36, 48];
      default:
        return [6, 12, 24, 36];
    }
  };

  const availableTerms = getTermsForLoanType();

  // Handle document upload
  const handleDocumentUpload = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newDocuments = [...documents];
        newDocuments[index] = {
          ...newDocuments[index],
          uploaded: true,
          file,
        };
        setDocuments(newDocuments);
        toast.success(`${documents[index].name} cargado correctamente`);
      }
    };
    input.click();
  };

  // Navigation
  const goToNextStep = async () => {
    let isValid = false;

    if (currentStep === 0) {
      isValid = await personalForm.trigger();
      if (isValid) {
        setApplicationData((prev) => ({
          ...prev,
          personalData: personalForm.getValues(),
        }));
      }
    } else if (currentStep === 1) {
      isValid = await workForm.trigger();
      if (isValid) {
        setApplicationData((prev) => ({
          ...prev,
          workInfo: workForm.getValues(),
        }));
      }
    } else if (currentStep === 2) {
      isValid = await loanForm.trigger();
      if (isValid) {
        setApplicationData((prev) => ({
          ...prev,
          loanDetails: loanForm.getValues(),
          calculation,
        }));
      }
    } else if (currentStep === 3) {
      const allUploaded = documents.every((doc) => doc.uploaded);
      if (!allUploaded) {
        toast.error("Por favor, sube todos los documentos requeridos");
        return;
      }
      isValid = true;
      setApplicationData((prev) => ({
        ...prev,
        documents,
      }));
    } else if (currentStep === 4) {
      if (!termsAccepted) {
        toast.error("Debes aceptar los términos y condiciones");
        return;
      }
      if (!captchaVerified) {
        toast.error("Por favor, completa la verificación de seguridad");
        return;
      }
      isValid = true;
    }

    if (isValid || currentStep > 2) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit application
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Calculate credit score
    const creditScore = calculateCreditScore(
      applicationData.workInfo!,
      applicationData.loanDetails!,
      applicationData.personalData!.isExistingClient
    );

    const finalApplication: Partial<LoanApp> = {
      ...applicationData,
      creditScore,
      status: "submitted",
      id: `SOL-${Date.now()}`,
    };

    setApplicationData(finalApplication);
    setIsSubmitting(false);
    setCurrentStep(5); // Go to success screen
    toast.success("¡Solicitud enviada exitosamente!");
  };

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Datos Personales</h2>
            <p className="text-muted-foreground">
              Completa tu información personal para continuar con la solicitud
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BankInput
                label="Nombre completo"
                placeholder="Ej: Juan Pérez García"
                {...personalForm.register("fullName")}
                error={personalForm.formState.errors.fullName?.message}
              />
              <BankInput
                label="Cédula / Documento"
                placeholder="Ej: 1234567890"
                {...personalForm.register("documentId")}
                error={personalForm.formState.errors.documentId?.message}
              />
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  className="w-full h-[52px] px-4 text-base bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  {...personalForm.register("birthDate", {
                    setValueAs: (v) => (v ? new Date(v) : undefined),
                  })}
                />
                {personalForm.formState.errors.birthDate && (
                  <p className="mt-1.5 text-xs text-error font-medium">
                    {personalForm.formState.errors.birthDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Estado civil
                </label>
                <Select
                  onValueChange={(value) => personalForm.setValue("maritalStatus", value as any)}
                  defaultValue="soltero"
                >
                  <SelectTrigger className="h-[52px] rounded-xl">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soltero">Soltero/a</SelectItem>
                    <SelectItem value="casado">Casado/a</SelectItem>
                    <SelectItem value="divorciado">Divorciado/a</SelectItem>
                    <SelectItem value="viudo">Viudo/a</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <BankInput
                label="Teléfono móvil"
                type="tel"
                placeholder="Ej: +593 99 123 4567"
                {...personalForm.register("phone")}
                error={personalForm.formState.errors.phone?.message}
              />
              <BankInput
                label="Correo electrónico"
                type="email"
                placeholder="Ej: juan.perez@email.com"
                {...personalForm.register("email")}
                error={personalForm.formState.errors.email?.message}
              />
            </div>

            <BankInput
              label="Dirección domiciliaria"
              placeholder="Ej: Av. Principal 123 y Calle Secundaria"
              {...personalForm.register("address")}
              error={personalForm.formState.errors.address?.message}
            />

            <div className="flex items-start gap-3 p-4 bg-accent rounded-xl">
              <Checkbox
                id="existing-client"
                checked={personalForm.watch("isExistingClient")}
                onCheckedChange={(checked) =>
                  personalForm.setValue("isExistingClient", checked as boolean)
                }
                className="mt-1"
              />
              <label
                htmlFor="existing-client"
                className="text-sm font-medium leading-tight cursor-pointer"
              >
                ¿Ya eres cliente del banco?
                <p className="text-xs text-muted-foreground font-normal mt-1">
                  Los clientes actuales pueden obtener mejores condiciones
                </p>
              </label>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Información Laboral</h2>
            <p className="text-muted-foreground">
              Cuéntanos sobre tu situación laboral y económica actual
            </p>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-3">
                Tipo de actividad
              </label>
              <div className="flex gap-3">
                <LoanChip
                  label="Dependiente"
                  selected={workForm.watch("employmentType") === "dependiente"}
                  onClick={() => workForm.setValue("employmentType", "dependiente")}
                />
                <LoanChip
                  label="Independiente"
                  selected={workForm.watch("employmentType") === "independiente"}
                  onClick={() => workForm.setValue("employmentType", "independiente")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BankInput
                label="Cargo / Ocupación"
                placeholder="Ej: Gerente de Ventas"
                {...workForm.register("position")}
                error={workForm.formState.errors.position?.message}
              />
              <BankInput
                label="Nombre de la empresa"
                placeholder="Ej: ABC Corp"
                {...workForm.register("companyName")}
                error={workForm.formState.errors.companyName?.message}
              />
              <BankInput
                label="Ingresos mensuales (USD)"
                type="number"
                placeholder="Ej: 1500"
                {...workForm.register("monthlyIncome", { valueAsNumber: true })}
                error={workForm.formState.errors.monthlyIncome?.message}
              />
              <BankInput
                label="Años de antigüedad"
                type="number"
                placeholder="Ej: 3"
                {...workForm.register("workYears", { valueAsNumber: true })}
                error={workForm.formState.errors.workYears?.message}
              />
              <BankInput
                label="Teléfono de la empresa"
                type="tel"
                placeholder="Ej: +593 2 234 5678"
                {...workForm.register("companyPhone")}
                error={workForm.formState.errors.companyPhone?.message}
              />
            </div>

            <div className="bg-accent/50 border border-border rounded-xl p-4">
              <p className="text-sm font-semibold text-accent-foreground mb-2">
                💡 Consejo
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Una información clara y actualizada sobre tu situación laboral ayuda a acelerar el proceso de aprobación de tu solicitud.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Detalles del Préstamo</h2>
            <p className="text-muted-foreground">
              Define el monto, plazo y destino de tu préstamo
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-end justify-between mb-3">
                    <label className="block text-xs font-medium text-neutral-700">
                      Monto solicitado
                    </label>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <Slider
                    value={[amount]}
                    onValueChange={(values) => loanForm.setValue("amount", values[0])}
                    min={500}
                    max={50000}
                    step={500}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$500</span>
                    <span>$50,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-3">
                    Plazo del préstamo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTerms.map((months) => (
                      <LoanChip
                        key={months}
                        label={`${months} meses`}
                        selected={term === months}
                        onClick={() => loanForm.setValue("term", months)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Destino del préstamo
                  </label>
                  <Select
                    onValueChange={(value) => loanForm.setValue("purpose", value)}
                  >
                    <SelectTrigger className="h-[52px] rounded-xl">
                      <SelectValue placeholder="Selecciona el destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOAN_PURPOSES.map((purpose) => (
                        <SelectItem key={purpose} value={purpose}>
                          {purpose}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loanForm.formState.errors.purpose && (
                    <p className="mt-1.5 text-xs text-error font-medium">
                      {loanForm.formState.errors.purpose.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <LoanCalculatorCard {...calculation} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Documentos Requeridos</h2>
            <p className="text-muted-foreground">
              Adjunta los documentos necesarios para procesar tu solicitud
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <DocumentCard
                  key={doc.type}
                  title={doc.name}
                  description="Formatos: PDF, JPG, PNG (máx. 5MB)"
                  uploaded={doc.uploaded}
                  fileName={doc.file?.name}
                  onUploadClick={() => handleDocumentUpload(index)}
                />
              ))}
            </div>

            <div className="bg-accent/50 border border-border rounded-xl p-4">
              <p className="text-sm font-semibold text-accent-foreground mb-2">
                📄 Información importante
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                <li>• Los documentos deben estar vigentes y ser legibles</li>
                <li>• El comprobante de ingresos debe ser del último mes</li>
                <li>• La planilla de servicios no debe tener más de 2 meses</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Confirmación</h2>
            <p className="text-muted-foreground">
              Revisa todos los datos antes de enviar tu solicitud
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="personal" className="border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <span className="font-semibold">Datos Personales</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Nombre:</dt>
                      <dd className="font-medium">{applicationData.personalData?.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Documento:</dt>
                      <dd className="font-medium">{applicationData.personalData?.documentId}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Email:</dt>
                      <dd className="font-medium">{applicationData.personalData?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Teléfono:</dt>
                      <dd className="font-medium">{applicationData.personalData?.phone}</dd>
                    </div>
                  </dl>
                  <button
                    onClick={() => goToStep(0)}
                    className="mt-3 text-xs text-primary hover:underline font-medium"
                  >
                    Editar información
                  </button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="work" className="border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <span className="font-semibold">Información Laboral</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Tipo:</dt>
                      <dd className="font-medium capitalize">{applicationData.workInfo?.employmentType}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Cargo:</dt>
                      <dd className="font-medium">{applicationData.workInfo?.position}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Empresa:</dt>
                      <dd className="font-medium">{applicationData.workInfo?.companyName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Ingresos:</dt>
                      <dd className="font-medium">{formatCurrency(applicationData.workInfo?.monthlyIncome || 0)}</dd>
                    </div>
                  </dl>
                  <button
                    onClick={() => goToStep(1)}
                    className="mt-3 text-xs text-primary hover:underline font-medium"
                  >
                    Editar información
                  </button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="loan" className="border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <span className="font-semibold">Detalles del Préstamo</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Monto:</dt>
                      <dd className="font-medium">{formatCurrency(applicationData.loanDetails?.amount || 0)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Plazo:</dt>
                      <dd className="font-medium">{applicationData.loanDetails?.term} meses</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Destino:</dt>
                      <dd className="font-medium">{applicationData.loanDetails?.purpose}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Cuota mensual:</dt>
                      <dd className="font-medium">{formatCurrency(applicationData.calculation?.monthlyPayment || 0)}</dd>
                    </div>
                  </dl>
                  <button
                    onClick={() => goToStep(2)}
                    className="mt-3 text-xs text-primary hover:underline font-medium"
                  >
                    Editar información
                  </button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="documents" className="border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <span className="font-semibold">Documentos</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <ul className="space-y-2">
                    {applicationData.documents?.map((doc) => (
                      <li key={doc.type} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        <span className="font-medium">{doc.name}</span>
                        {doc.file && (
                          <span className="text-xs text-muted-foreground">({doc.file.name})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => goToStep(3)}
                    className="mt-3 text-xs text-primary hover:underline font-medium"
                  >
                    Editar documentos
                  </button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="bg-accent/50 border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  <span className="font-medium">Acepto los términos y condiciones</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    He leído y acepto las{" "}
                    <a href="#" className="text-primary hover:underline">
                      condiciones del crédito
                    </a>
                    , la{" "}
                    <a href="#" className="text-primary hover:underline">
                      política de privacidad
                    </a>{" "}
                    y autorizo la verificación de mis datos en centrales de riesgo.
                  </p>
                </label>
              </div>
            </div>

            {/* Captcha */}
            <BankCaptcha 
              onVerify={setCaptchaVerified} 
              isVerified={captchaVerified}
            />
          </div>
        );

      case 5:
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4 flex items-center justify-center shadow-sm">
                <Check className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold mb-2">¡Solicitud Enviada!</h2>
              <p className="text-muted-foreground text-base">
                Tu solicitud ha sido recibida y está siendo procesada
              </p>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-bank-magenta-light to-pink-100 rounded-full">
                <span className="text-xs font-medium text-neutral-600">Número de solicitud:</span>
                <span className="text-sm font-bold text-bank-magenta">{applicationData.id}</span>
              </div>
            </div>

            {applicationData.creditScore && (
              <CreditScoreCard creditScore={applicationData.creditScore} />
            )}

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 text-neutral-800">Próximos pasos</h3>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-bank-magenta-light to-pink-100 text-bank-magenta flex items-center justify-center font-bold text-sm shadow-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Verificación de documentos</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Nuestro equipo revisará los documentos adjuntados (1-2 días hábiles)
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-bank-magenta-light to-pink-100 text-bank-magenta flex items-center justify-center font-bold text-sm shadow-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Evaluación crediticia</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Análisis de tu perfil y capacidad de pago
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-bank-magenta-light to-pink-100 text-bank-magenta flex items-center justify-center font-bold text-sm shadow-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Decisión final</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Recibirás una notificación con la decisión por email y SMS
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex gap-3">
              <BankButton variant="secondary" onClick={() => navigate("/")} fullWidth>
                Volver al inicio
              </BankButton>
              <BankButton variant="primary" onClick={() => window.print()} fullWidth>
                Imprimir comprobante
              </BankButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => currentStep === 0 ? navigate("/") : goToPreviousStep()}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-primary">Solicitud de Préstamo</h1>
            </div>
            {currentStep < 5 && (
              <div className="text-sm text-muted-foreground">
                Paso {currentStep + 1} de 5
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stepper */}
          {currentStep < 5 && (
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <ProgressStepper
                  steps={STEPS}
                  currentStep={currentStep}
                  onStepClick={goToStep}
                />
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={currentStep < 5 ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
              {renderStep()}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  {currentStep > 0 && (
                    <BankButton variant="secondary" onClick={goToPreviousStep}>
                      <ArrowLeft className="h-4 w-4" />
                      Anterior
                    </BankButton>
                  )}
                  <BankButton
                    variant="primary"
                    onClick={goToNextStep}
                    fullWidth={currentStep === 0}
                    className="ml-auto"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </BankButton>
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <BankButton variant="secondary" onClick={goToPreviousStep}>
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </BankButton>
                  <BankButton
                    variant="primary"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!termsAccepted || !captchaVerified}
                    fullWidth
                  >
                    {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                  </BankButton>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;

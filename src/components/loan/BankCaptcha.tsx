import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { BankButton } from "./BankButton";

interface BankCaptchaProps {
  onVerify: (isValid: boolean) => void;
  isVerified: boolean;
}

export const BankCaptcha = ({ onVerify, isVerified }: BankCaptchaProps) => {
  const [captchaCode, setCaptchaCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    // Generar código alfanumérico de 6 caracteres
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sin caracteres confusos
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput("");
    setError(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (userInput.toUpperCase() === captchaCode) {
      setError(false);
      onVerify(true);
    } else {
      setError(true);
      onVerify(false);
      setTimeout(() => {
        generateCaptcha();
      }, 1000);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-bank-magenta"></div>
        <label className="text-sm font-semibold text-neutral-700">
          Verificación de seguridad
        </label>
      </div>

      <div className="flex flex-col gap-4">
        {/* Captcha Display */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-16 bg-gradient-to-br from-neutral-100 to-neutral-50 border-2 border-neutral-300 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Pattern background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-bank-magenta to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-bank-magenta to-transparent"></div>
              <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-transparent via-bank-magenta to-transparent"></div>
              <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-transparent via-bank-magenta to-transparent"></div>
            </div>
            
            {/* Captcha text with distortion */}
            <div className="relative flex items-center gap-1">
              {captchaCode.split("").map((char, index) => (
                <span
                  key={index}
                  className="text-2xl font-bold text-neutral-700 select-none"
                  style={{
                    transform: `rotate(${Math.random() * 20 - 10}deg) translateY(${Math.random() * 4 - 2}px)`,
                    display: "inline-block",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Noise lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }}>
              <line x1="0" y1="20" x2="100%" y2="25" stroke="#E6007E" strokeWidth="1" />
              <line x1="0" y1="40" x2="100%" y2="35" stroke="#E6007E" strokeWidth="1" />
              <line x1="10%" y1="0" x2="12%" y2="100%" stroke="#E6007E" strokeWidth="1" />
              <line x1="70%" y1="0" x2="68%" y2="100%" stroke="#E6007E" strokeWidth="1" />
            </svg>
          </div>

          <button
            type="button"
            onClick={generateCaptcha}
            className="flex-shrink-0 w-12 h-12 rounded-lg border-2 border-neutral-300 hover:border-bank-magenta bg-white hover:bg-bank-magenta-light flex items-center justify-center transition-all group"
            title="Generar nuevo código"
          >
            <RefreshCw className="h-5 w-5 text-neutral-600 group-hover:text-bank-magenta transition-colors" />
          </button>
        </div>

        {/* Input */}
        <div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toUpperCase())}
            placeholder="Ingresa el código"
            maxLength={6}
            disabled={isVerified}
            className={`w-full h-12 px-4 text-center text-lg font-semibold tracking-wider uppercase border-2 rounded-lg transition-all ${
              isVerified
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : error
                ? "bg-red-50 border-red-300 text-red-700 animate-shake"
                : "bg-white border-neutral-300 focus:border-bank-magenta focus:ring-2 focus:ring-bank-magenta/20"
            } focus:outline-none`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && userInput.length === 6 && !isVerified) {
                handleVerify();
              }
            }}
          />
          {error && (
            <p className="text-xs text-red-600 mt-2 font-medium">
              Código incorrecto. Intenta nuevamente.
            </p>
          )}
          {isVerified && (
            <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Verificación exitosa
            </p>
          )}
        </div>

        {/* Verify Button */}
        {!isVerified && (
          <BankButton
            type="button"
            variant="secondary"
            onClick={handleVerify}
            disabled={userInput.length !== 6}
            fullWidth
          >
            Verificar código
          </BankButton>
        )}
      </div>
    </div>
  );
};

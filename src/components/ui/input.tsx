import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ValidationRule {
  rule: (value: string) => boolean;
  message: string;
}

interface InputProps extends React.ComponentProps<"input"> {
  rules?: ValidationRule[];
  showValidation?: boolean;
}

function Input({
  className,
  type,
  rules = [],
  showValidation = true,
  value: externalValue,
  onChange: externalOnChange,
  ...props
}: InputProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  // Use external value if provided (controlled), otherwise use internal (uncontrolled)
  const value =
    externalValue !== undefined ? String(externalValue) : internalValue;

  const validateInput = (val: string) => {
    if (rules.length === 0) return;

    const newErrors: string[] = [];
    rules.forEach((rule) => {
      if (!rule.rule(val)) {
        newErrors.push(rule.message);
      }
    });
    setErrors(newErrors);
  };

  // Validate whenever value changes (including external changes)
  React.useEffect(() => {
    if (touched) {
      validateInput(value);
    }
  }, [value, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Update internal state if uncontrolled
    if (externalValue === undefined) {
      setInternalValue(newValue);
    }

    // Call external onChange if provided
    if (externalOnChange) {
      externalOnChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    validateInput(value);
    props.onBlur?.(e);
  };

  const hasErrors = touched && errors.length > 0;
  const isValid = touched && errors.length === 0 && value.length > 0;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          data-slot="input"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`flex h-10 w-full text-dark rounded-lg border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
            hasErrors
              ? "border-red-400 bg-light focus-visible:ring-red-400 pr-10"
              : isValid
              ? "border-green-400 bg-light focus-visible:ring-green-400 pr-10"
              : "border-input bg-light focus-visible:ring-normal"
          } ${className}`}
          {...props}
        />
        {showValidation && touched && value.length > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasErrors ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
        )}
      </div>

      {showValidation && hasErrors && (
        <div className="mt-1.5 space-y-1">
          {errors.map((error, index) => (
            <p
              key={index}
              className="text-xs text-red-600 flex items-start gap-1.5"
            >
              <span className="mt-0.5">•</span>
              <span>{error}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export { Input };
export type { ValidationRule };

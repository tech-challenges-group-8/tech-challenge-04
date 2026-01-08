import { TextField, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface NumericInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  sx?: object;
  disabled?: boolean;
  label?: string;
  useCurrencyMask?: boolean;
}

const MAX_VALUE = 999999999.99;
const MAX_CENTS = MAX_VALUE * 100;

// Format cents to currency display: 12345 -> "R$ 123,45"
const formatCurrency = (cents: number): string => {
  const value = cents / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// Parse string value to cents: "123.45" -> 12345
const valueToCents = (value: string): number => {
  if (!value) return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : Math.round(num * 100);
};

// Convert cents to decimal string: 12345 -> "123.45"
const centsToValue = (cents: number): string => {
  return (cents / 100).toFixed(2);
};

export default function NumericInputField({
  value,
  onChange,
  placeholder,
  error,
  helperText,
  sx,
  disabled,
  label,
  useCurrencyMask = false,
}: NumericInputFieldProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  // For currency mask: handle digit input (right-to-left entry)
  const handleCurrencyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentCents = valueToCents(value);

    if (e.key === "Backspace") {
      e.preventDefault();
      const newCents = Math.floor(currentCents / 10);
      onChange(centsToValue(newCents));
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      onChange("0");
      return;
    }

    // Only allow digits
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const digit = parseInt(e.key, 10);
    const newCents = currentCents * 10 + digit;

    if (newCents <= MAX_CENTS) {
      onChange(centsToValue(newCents));
    }
  };

  // For regular number input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue) {
      onChange("");
      return;
    }
    if (newValue.includes("-")) return;
    const [, fraction] = newValue.split(".");
    if (fraction && fraction.length > 2) return;
    const num = parseFloat(newValue);
    if (!isNaN(num) && num <= MAX_VALUE) {
      onChange(newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (useCurrencyMask) return;
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      onChange(num.toFixed(2));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (["-", "e", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const displayValue = useCurrencyMask ? formatCurrency(valueToCents(value)) : value;
  const showMinAmountError = value && parseFloat(value) < 0.01;

  return (
    <TextField
      value={displayValue}
      onChange={useCurrencyMask ? undefined : handleChange}
      onBlur={handleBlur}
      placeholder={placeholder || t("newTransaction.valuePlaceholder")}
      type={useCurrencyMask ? "text" : "number"}
      label={label || t("newTransaction.valueLabel")}
      error={error}
      helperText={showMinAmountError ? t("validation.minAmount") : helperText}
      disabled={disabled}
      slotProps={{
        input: { style: { height: 48 } },
        htmlInput: useCurrencyMask
          ? { onKeyDown: handleCurrencyKeyDown, inputMode: "numeric" }
          : { min: 0, step: 0.01, onKeyDown: handleKeyDown },
        inputLabel: {
          shrink: true,
          sx: {
            top: "-15px",
            left: "-12px",
            "&.Mui-focused": { color: theme.palette.primary.main },
          },
        },
      }}
      sx={{
        backgroundColor: "#fff",
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: "8px",
        zIndex: 1,
        "& .MuiInputBase-input": {
          padding: "12px 8px",
          height: "24px",
          textAlign: "left",
        },
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
        ...sx,
      }}
    />
  );
}
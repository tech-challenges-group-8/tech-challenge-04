import { TextField, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  getCommonInputStyles,
  getCommonInputLabelProps,
} from "../../../styles/commonStyles";
import { NumericInputField } from "../../ui";

interface FilterDialogFieldsProps {
  dateFrom: string;
  dateTo: string;
  minValue: string;
  maxValue: string;
  description: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onMinValueChange: (value: string) => void;
  onMaxValueChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  theme: any;
}

export default function FilterDialogFields({
  dateFrom,
  dateTo,
  minValue,
  maxValue,
  description,
  onDateFromChange,
  onDateToChange,
  onMinValueChange,
  onMaxValueChange,
  onDescriptionChange,
  theme,
}: FilterDialogFieldsProps) {
  const { t } = useTranslation();
  const commonInputStyles = getCommonInputStyles(theme);
  const commonInputLabelProps = getCommonInputLabelProps(theme);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label={t("statement.filter.startDate")}
        type="date"
        fullWidth
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        slotProps={{
          inputLabel: commonInputLabelProps,
        }}
        sx={{
          ...commonInputStyles,
          mt: 3,
          "& input[type='date']::-webkit-calendar-picker-indicator": {
            cursor: "pointer",
          },
        }}
        inputProps={{
          max: dateTo || undefined,
          onClick: (e: React.MouseEvent<HTMLInputElement>) => {
            (e.target as HTMLInputElement).showPicker?.();
          },
        }}
      />
      <TextField
        label={t("statement.filter.endDate")}
        type="date"
        fullWidth
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        slotProps={{
          inputLabel: commonInputLabelProps,
        }}
        sx={{
          ...commonInputStyles,
          mt: 2,
          "& input[type='date']::-webkit-calendar-picker-indicator": {
            cursor: "pointer",
          },
        }}
        inputProps={{
          min: dateFrom || undefined,
          onClick: (e: React.MouseEvent<HTMLInputElement>) => {
            (e.target as HTMLInputElement).showPicker?.();
          },
        }}
      />
      <NumericInputField
        label={t("statement.filter.minValue")}
        value={minValue}
        onChange={onMinValueChange}
        useCurrencyMask
        sx={{
          mt: 2,
          width: "100%",
        }}
      />
      <NumericInputField
        label={t("statement.filter.maxValue")}
        value={maxValue}
        onChange={onMaxValueChange}
        useCurrencyMask
        sx={{
          mt: 2,
          width: "100%",
        }}
      />
      <TextField
        label={t("statement.filter.description")}
        fullWidth
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        slotProps={{
          inputLabel: commonInputLabelProps,
        }}
        sx={{
          ...commonInputStyles,
          mt: 2,
        }}
        placeholder={
          t("statement.filter.descriptionPlaceholder") ||
          "Digite parte da descrição..."
        }
      />
    </Box>
  );
}

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import type { VariantType } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useUser } from "../../../contexts/UserContext";
import { useTransactions } from "../../../hooks/useTransactions";
import {
  getCommonInputStyles,
  getCommonInputLabelProps,
  getSelectInputStyles,
} from "../../../styles/commonStyles";

import { LoadingButton, NumericInputField, PageTitle } from "../../ui";
import FileUpload from "./FileUpload";

const TRANSACTION_TYPES = (t: any) => [
  { value: "DEPOSIT", label: t("newTransaction.typeDeposit") },
  { value: "TRANSFER", label: t("newTransaction.typeTransfer") },
];

export default function NewTransaction() {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [typeError, setTypeError] = useState("");
  const [valueError, setValueError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { user } = useUser();
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const commonInputStyles = getCommonInputStyles(theme);
  const selectInputStyles = getSelectInputStyles(theme, !!typeError);
  const commonInputLabelProps = getCommonInputLabelProps(theme);

  const handleFeedback = (variant: VariantType, message: string) => () => {
    enqueueSnackbar(message, { variant });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    let hasError = false;

    if (!type) {
      setTypeError(t("newTransaction.errorSelectType"));
      hasError = true;
    }

    const parsedValue = parseFloat(value);
    if (!value || isNaN(parsedValue) || parsedValue <= 0) {
      setValueError(t("newTransaction.errorInvalidValue"));
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("accountId", user?.account || "");
    formData.append("type", type as "DEPOSIT" | "TRANSFER");
    formData.append("value", parsedValue.toString());
    if (file) {
      formData.append("attachment", file);
    }

    const newTransaction = {
      accountId: user?.account || "",
      type: type as "DEPOSIT" | "TRANSFER",
      value: parsedValue,
      description: description || "",
      anexo: file ? file.name : "",
    };

    try {
      await addTransaction(newTransaction);
      setType("");
      setValue("");
      setDescription("");
      setFile(null);
      setTypeError("");
      setValueError("");

      handleFeedback("success", "Transação cadastrada")();
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
      handleFeedback("error", "Erro ao adicionar transação")();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle
        sx={{
          marginBottom: "44px",
        }}
      >
        {t("newTransaction.title")}
      </PageTitle>

      <Box display="flex" flexDirection="column" gap={3}>
        <FormControl
          sx={{
            width: { xs: "100%", sm: "355px" },
            alignSelf: "flex-start",
            mb: 2,
          }}
          error={!!typeError}
        >
          <InputLabel
            id="transaction-type-label"
            shrink
            sx={{
              color: type ? theme.palette.primary.main : undefined,
              ...commonInputLabelProps.sx,
            }}
            className="InputLabelCustom"
          >
            {t("newTransaction.typeLabel")}
          </InputLabel>
          <Select
            labelId="transaction-type-label"
            id="transaction-type-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if (typeError) setTypeError("");
            }}
            displayEmpty
            error={!!typeError}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <span style={{ color: theme.palette.text.disabled }}>
                    {t("newTransaction.typePlaceholder") || "Selecione o tipo de transação"}
                  </span>
                );
              }
              return TRANSACTION_TYPES(t).find((type) => type.value === selected)?.label;
            }}
            sx={{
              ...selectInputStyles,
              width: { xs: "100%", sm: "400px" },
            }}
            disabled={isSubmitting}
          >
            {TRANSACTION_TYPES(t).map((transactionType) => (
              <MenuItem
                key={transactionType.value}
                value={transactionType.value}
              >
                {transactionType.label}
              </MenuItem>
            ))}
          </Select>
          {typeError && (
            <Typography color="error" variant="caption" sx={{ mt: 0.5, textAlign: "left" }}>
              {typeError}
            </Typography>
          )}
        </FormControl>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label={t("newTransaction.description")}
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("newTransaction.descriptionPlaceholder") || "Digite a descrição da transação"}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 255 }}
            slotProps={{
              htmlInput: {
                maxLength: 255,
              },
              inputLabel: commonInputLabelProps,
            }}
            sx={{
              ...commonInputStyles,
              width: { xs: "100%", sm: "400px" },
            }}
          />
          <NumericInputField
            value={value}
            onChange={(val) => {
              setValue(val);
              if (valueError) setValueError("");
            }}
            useCurrencyMask
            placeholder={t("newTransaction.valuePlaceholder")}
            sx={{
              width: { xs: "100%", sm: "400px" },
            }}
            error={!!valueError || (value !== "" && parseFloat(value) < 0.01)}
            helperText={valueError}
            disabled={isSubmitting}
          />
          <FileUpload
            file={file}
            onFileChange={setFile}
            disabled={isSubmitting}
            sx={{ mb: 3 }}
          />
        </Box>

        <LoadingButton
          onClick={handleSubmit}
          isSubmitting={isSubmitting}
          loadingText={t("newTransaction.loadingButton")}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        >
          {t("newTransaction.completeButton")}
        </LoadingButton>
      </Box>
    </>
  );
}

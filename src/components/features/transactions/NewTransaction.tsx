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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { user } = useUser();
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const commonInputStyles = getCommonInputStyles(theme);
  const commonInputLabelProps = getCommonInputLabelProps(theme);

  const handleFeedback = (variant: VariantType, message: string) => () => {
    enqueueSnackbar(message, { variant });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!type) {
      setError(t("newTransaction.errorSelectType"));
      return;
    }

    const parsedValue = parseFloat(value);
    if (!value || isNaN(parsedValue) || parsedValue <= 0) {
      setError(t("newTransaction.errorInvalidValue"));
      return;
    }

    setIsSubmitting(true);
    setError("");

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

      handleFeedback("success", "Transação cadastrada")();
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
      setError("Erro ao adicionar transação.");
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
              if (error) setError("");
            }}
            displayEmpty
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
              ...commonInputStyles,
              height: "48px",
              width: { xs: "100%", sm: "400px" },
              "& .MuiSelect-icon": { color: theme.palette.primary.main },
              "& .MuiSelect-select": {
                textAlign: "left",
              },
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
              m: "0 2",
              width: { xs: "100%", sm: "400px" },
              mb: 2,
            }}
          />
          <NumericInputField
            value={value}
            onChange={(val) => {
              setValue(val);
              if (error) setError("");
            }}
            useCurrencyMask
            placeholder={t("newTransaction.valuePlaceholder")}
            sx={{
              zIndex: 1,
              width: { xs: "100%", sm: "400px" },
              mb: 2,
              "& .MuiInputBase-input": {
                textAlign: "left",
              },
            }}
            error={!!error || (value !== "" && parseFloat(value) < 0.01)}
            helperText={error}
            disabled={isSubmitting}
          />
          <FileUpload
            file={file}
            onFileChange={setFile}
            disabled={isSubmitting}
            sx={{ mb: 3 }}
          />
        </Box>

        {error && (
          <Typography color="error" variant="caption" mt={-1} mb={1}>
            {error}
          </Typography>
        )}

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

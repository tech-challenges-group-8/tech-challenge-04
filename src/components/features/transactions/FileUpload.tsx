import { Box, Button, IconButton, useTheme } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearIcon from "@mui/icons-material/Clear";
import { useSnackbar } from "notistack";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  buttonText?: string;
  sx?: any;
}

export default function FileUpload({
  file,
  onFileChange,
  disabled = false,
  buttonText = "Anexar arquivo",
  sx,
}: FileUploadProps) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedExtensions = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedExtensions.includes(selectedFile.type)) {
      enqueueSnackbar("Apenas arquivos JPG, PNG ou PDF são permitidos", {
        variant: "error",
      });
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      enqueueSnackbar("O arquivo deve ter no máximo 5MB", { variant: "error" });
      e.target.value = "";
      return;
    }

    onFileChange(selectedFile);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  return (
    <Box display="flex" alignItems="center" sx={sx}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<AttachFileIcon />}
        sx={{
          width: { xs: "100%", sm: "300px" },
          alignSelf: "flex-start",
        }}
        disabled={disabled}
      >
        {file ? file.name : buttonText}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          disabled={disabled}
        />
      </Button>
      {file && (
        <IconButton
          aria-label="Remover anexo"
          onClick={handleRemoveFile}
          disabled={disabled}
          sx={{ color: theme.palette.error.main }}
        >
          <ClearIcon />
        </IconButton>
      )}
    </Box>
  );
}

import { type Theme } from "@mui/material/styles";

const getBaseInputStyles = (theme: Theme, error?: boolean) => ({
  backgroundColor: "#fff",
  border: `1px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`,
  borderRadius: "8px",
  mb: 2,
});

const getInputFieldStyles = () => ({
  "& .MuiInputBase-input": {
    padding: "12px 8px",
    height: "24px",
    textAlign: "left",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    display: "none",
  },
});

export const getCommonInputStyles = (theme: Theme, error?: boolean) => ({
  ...getBaseInputStyles(theme, error),
  ...getInputFieldStyles(),
});

export const getCommonInputLabelProps = (theme: Theme) => ({
  shrink: true,
  sx: {
    top: "-15px",
    left: "-12px",
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
  },
});

export const getNumericInputStyles = (theme: Theme, error?: boolean) => ({
  zIndex: 1,
  "& .MuiOutlinedInput-root": {
    ...getBaseInputStyles(theme, error),
  },
  ...getInputFieldStyles(),
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    marginTop: "4px",
  },
});

export const getSelectInputStyles = (theme: Theme, error?: boolean) => ({
  ...getBaseInputStyles(theme, error),
  ...getInputFieldStyles(),
  height: "48px",
  "& .MuiSelect-icon": { color: theme.palette.primary.main },
  "& .MuiSelect-select": {
    textAlign: "left",
  },
});

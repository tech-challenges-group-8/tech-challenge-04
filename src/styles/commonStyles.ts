import { type Theme } from "@mui/material/styles";

export const getCommonInputStyles = (theme: Theme) => ({
  backgroundColor: "#fff",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "8px",
  "& .MuiInputBase-input": {
    padding: "12px 8px",
    height: "24px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    display: "none",
  },
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

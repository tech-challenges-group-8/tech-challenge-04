import { Typography, useTheme } from "@mui/material";
import type { SxProps } from "@mui/system";
import type { ReactNode } from "react";

export interface PageTitleProps {
  children: ReactNode;
  sx?: SxProps;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * PageTitle - Consistent page title component
 */
export default function PageTitle({ 
  children, 
  sx, 
  variant = "h4" 
}: PageTitleProps) {
  const theme = useTheme();

  return (
    <Typography
      variant={variant}
      fontWeight="bold"
      mb={2}
      sx={{ 
        color: theme.palette.primary.main,
        ...(sx as any) 
      }}
    >
      {children}
    </Typography>
  );
}

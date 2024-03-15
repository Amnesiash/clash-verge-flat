import { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  type SxProps,
  type Theme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCustomTheme } from "@/components/layout/use-custom-theme";

interface Props {
  title: ReactNode;
  open: boolean;
  okBtn?: ReactNode;
  cancelBtn?: ReactNode;
  disableOk?: boolean;
  disableCancel?: boolean;
  disableFooter?: boolean;
  contentSx?: SxProps<Theme>;
  children?: ReactNode;
  loading?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export interface DialogRef {
  open: () => void;
  close: () => void;
}

export const BaseDialog: React.FC<Props> = (props) => {
  const {
    open,
    title,
    children,
    okBtn,
    cancelBtn,
    contentSx,
    disableCancel,
    disableOk,
    disableFooter,
    loading,
  } = props;
  const { theme } = useCustomTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={props.onClose}
      PaperProps={{
        sx: {
          borderRadius: "10px", // 设置圆角大小
          backgroundColor: isDark ? "#000000" : "#FFFFFF",
        },
      }}
    >
      <DialogTitle sx={{ padding: "20px" }}>{title}</DialogTitle>

      <DialogContent sx={contentSx}>{children}</DialogContent>

      {!disableFooter && (
        <DialogActions sx={{ padding: "20px" }}>
          {!disableCancel && (
            <Button variant="outlined" onClick={props.onCancel}>
              {cancelBtn}
            </Button>
          )}
          {!disableOk && (
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={props.onOk}
            >
              {okBtn}
            </LoadingButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

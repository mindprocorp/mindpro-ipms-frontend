import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AlertModal } from "@repo/ui";
import { useAlertStore } from "../store/useAlertStore";
import { useShallow } from "zustand/shallow";

export function AppRouter() {
  const open = useAlertStore((state) => state.open);
  const { title, desc, confirmText, cancelText, message, onCancel, onConfirm, className } =
    useAlertStore(
      useShallow((state) => ({
        title: state.title,
        desc: state.desc,
        confirmText: state.confirmText,
        cancelText: state.cancelText,
        message: state.message,
        onCancel: state.onCancel,
        onConfirm: state.onConfirm,
        className: state.className,
      })),
    );
  const close = useAlertStore((state) => state.close);

  return (
    <BrowserRouter>
      <AppRoutes />
      <AlertModal
        open={open}
        onOpenChange={close}
        title={title}
        description={desc}
        confirmText={confirmText}
        cancelText={cancelText}
        message={message}
        onCancel={onCancel}
        onConfirm={onConfirm}
        className={className}
      />
    </BrowserRouter>
  );
}

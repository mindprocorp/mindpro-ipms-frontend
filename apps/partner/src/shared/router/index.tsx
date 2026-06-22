import { RouterProvider } from "react-router-dom";
import { AlertModal } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useShallow } from "zustand/shallow";
import { router } from "./routes";

export function AppRouter() {
  const open = useAlertStore((state) => state.open);
  const { title, desc, confirmText, cancelText, message, onCancel, onConfirm, onClose, className, showCancel } =
    useAlertStore(
      useShallow((state) => ({
        title: state.title,
        desc: state.desc,
        confirmText: state.confirmText,
        cancelText: state.cancelText,
        message: state.message,
        onCancel: state.onCancel,
        onConfirm: state.onConfirm,
        onClose: state.onClose,
        className: state.className,
        showCancel: state.showCancel,
      })),
    );
  const close = useAlertStore((state) => state.close);

  return (
    <>
      <RouterProvider router={router} />
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
        onClose={onClose}
        className={className}
        showCancel={showCancel}
      />
    </>
  );
}

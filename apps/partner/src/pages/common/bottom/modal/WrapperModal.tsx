import { FormDialog } from "@repo/ui";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const WrapperModal = ({ isOpen, onClose, title = "", children }: ModalProps) => {
  return (
    <FormDialog
      open={isOpen}
      onOpenChange={(o) => { if (!o) onClose(); }}
      title={title}
      isFooter={false}
      className="w-[90vw] max-w-[1400px] sm:max-w-[1400px] h-[85vh] p-6 [&>button[data-slot=dialog-close]]:top-3 [&>button[data-slot=dialog-close]]:right-4"
    >
      {children}
    </FormDialog>
  );
};

import { create } from 'zustand'

type ModalProps = {
  title?: string
  desc?: string
  confirmText?: string
  cancelText?: string
  message?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  className?: string
}

type AlertStore = {
  open: boolean
  openAlert: (props: ModalProps) => void
  close: () => void
} & ModalProps

export const useAlertStore = create<AlertStore>((set) => ({
  open: false,
  openAlert: (payload: ModalProps) =>
    set((state) => ({
      ...state,
      open: true,
      title: payload?.title,
      desc: payload?.desc,
      confirmText: payload?.confirmText,
      cancelText: payload?.cancelText,
      message: payload?.message,
      onConfirm: payload?.onConfirm,
      onCancel: payload?.onCancel,
      className: payload?.className,
    })),
  close: () =>
    set((state) => ({
      ...state,
      open: !open,
      title: '',
      desc: '',
      confirmText: '',
      cancelText: '',
      message: '',
      onConfirm: undefined,
      onCancel: undefined,
      className: '',
    })),
}))

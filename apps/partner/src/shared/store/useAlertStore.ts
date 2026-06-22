import { create } from 'zustand'

type ModalProps = {
  title?: string
  desc?: string
  confirmText?: string
  cancelText?: string
  message?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
  className?: string
  type?: string
  showCancel?: boolean
}

type AlertStore = {
  open: boolean
  openAlert: (props: ModalProps) => void
  close: () => void
} & ModalProps

export const useAlertStore = create<AlertStore>((set) => ({
  open: false,
  title: '',
  desc: '',
  confirmText: '',
  cancelText: '',
  message: '',
  openAlert: (payload: ModalProps) =>
    set(() => ({
      open: true,
      title: payload?.title ?? '',
      desc: payload?.desc ?? '',
      confirmText: payload?.confirmText ?? '확인',
      cancelText: payload?.cancelText ?? '',
      message: payload?.message ?? '',
      onConfirm: payload?.onConfirm,
      onCancel: payload?.onCancel,
      onClose: payload?.onClose,
      className: payload?.className ?? '',
      showCancel: payload?.showCancel ?? !!payload?.cancelText,
    })),
  close: () =>
    set(() => ({
      open: false,
      title: '',
      desc: '',
      confirmText: '',
      cancelText: '',
      message: '',
      onConfirm: undefined,
      onCancel: undefined,
      onClose: undefined,
      className: '',
      showCancel: false,
    })),
}))

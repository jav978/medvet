export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  createdAt: number
}

const toasts = ref<ToastNotification[]>([])

export const useToastNotification = () => {
  const addToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    duration: number = 4500
  ) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
    const toast: ToastNotification = {
      id,
      type,
      title,
      message,
      duration,
      createdAt: Date.now()
    }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message?: string, duration?: number) =>
    addToast('success', title, message, duration)

  const error = (title: string, message?: string, duration?: number) =>
    addToast('error', title, message, duration || 6000)

  const warning = (title: string, message?: string, duration?: number) =>
    addToast('warning', title, message, duration)

  const info = (title: string, message?: string, duration?: number) =>
    addToast('info', title, message, duration)

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

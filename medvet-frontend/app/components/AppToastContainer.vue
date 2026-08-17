<template>
  <div
    class="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
    role="status"
    aria-live="polite"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4 scale-95"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full overflow-hidden rounded-2xl p-4 shadow-2xl border backdrop-blur-xl transition-all relative"
        :class="getToastClasses(toast.type)"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            <span
              v-if="toast.type === 'success'"
              class="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </span>

            <span
              v-else-if="toast.type === 'error'"
              class="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>

            <span
              v-else-if="toast.type === 'warning'"
              class="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>

            <span
              v-else
              class="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>

          <!-- Body -->
          <div class="flex-1 min-w-0 pr-2">
            <h4 class="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {{ toast.title }}
            </h4>
            <p
              v-if="toast.message"
              class="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
            >
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            @click="removeToast(toast.id)"
            type="button"
            class="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <span class="sr-only">Cerrar notificación</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastNotification } from '~/composables/useToast'

const { toasts, removeToast } = useToastNotification()

const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-white/95 dark:bg-slate-900/95 border-emerald-500/30 text-slate-900 dark:text-white'
    case 'error':
      return 'bg-white/95 dark:bg-slate-900/95 border-rose-500/30 text-slate-900 dark:text-white'
    case 'warning':
      return 'bg-white/95 dark:bg-slate-900/95 border-amber-500/30 text-slate-900 dark:text-white'
    case 'info':
    default:
      return 'bg-white/95 dark:bg-slate-900/95 border-cyan-500/30 text-slate-900 dark:text-white'
  }
}
</script>

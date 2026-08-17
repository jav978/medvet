import type { HookContext } from '../declarations'
import { handleGlobalError } from './security'

export const logErrorHook = async (context: HookContext, next?: () => Promise<void>) => {
  try {
    if (next) {
      await next()
    }
  } catch (error: any) {
    console.error(`[MedVet API Error] in ${context.path}.${context.method}:`, error.message)
    throw error
  }
}

export const hooks = {
  around: {
    all: [logErrorHook]
  },
  before: {},
  after: {},
  error: {
    all: [handleGlobalError]
  }
}


import { authenticate } from '@feathersjs/authentication'
import { BadRequest, Forbidden, Conflict, NotAuthenticated } from '@feathersjs/errors'
import type { HookContext } from '../declarations'

/**
 * Hook to require JWT authentication.
 */
export const requireAuth = authenticate('jwt')

/**
 * Hook to enforce that regular clients can only read/mutate their own resources (prevents IDOR).
 * Admins, veterinarians, and receptionists can access all records.
 */
export const restrictToOwner = (userIdField: string = 'user_id') => {
  return async (context: HookContext) => {
    const { user } = context.params
    if (!user) {
      // If user is not present and this is an internal call or public route, continue
      if (context.params.provider === undefined) return context
      throw new NotAuthenticated('Autenticación requerida para acceder a este recurso.')
    }

    // Privileged roles can access any resource
    if (['admin', 'veterinarian', 'receptionist'].includes(user.role)) {
      return context
    }

    // For clients:
    if (context.type === 'before') {
      if (context.method === 'find') {
        context.params.query = context.params.query || {}
        context.params.query[userIdField] = user.id
      } else if (context.method === 'create') {
        if (Array.isArray(context.data)) {
          context.data.forEach((item: any) => {
            item[userIdField] = user.id
          })
        } else if (context.data) {
          context.data[userIdField] = user.id
        }
      } else if (['get', 'update', 'patch', 'remove'].includes(context.method)) {
        if (context.id) {
          const knex = context.app.get('knexClient')
          const table = (context.service as any).options?.name || context.path
          if (knex && table) {
            const existing = await knex(table).where({ id: context.id }).first()
            if (existing && existing[userIdField] && existing[userIdField] !== user.id) {
              throw new Forbidden('No tienes autorización para acceder o modificar este registro.')
            }
          }
        }
      }
    }

    return context
  }
}

/**
 * Hook to require specific roles (RBAC).
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (context: HookContext) => {
    const { user } = context.params
    if (!user) {
      if (context.params.provider === undefined) return context
      throw new NotAuthenticated('Autenticación requerida.')
    }

    if (!allowedRoles.includes(user.role)) {
      throw new Forbidden(`Acceso restringido. Se requiere rol: ${allowedRoles.join(', ')}`)
    }

    return context
  }
}

/**
 * Sanitizes user registration to prevent privilege escalation and enforces real identity.
 */
export const sanitizeUserRegistration = async (context: HookContext) => {
  const { data, params } = context
  if (!data) return context

  // If created via public API (not by an existing authenticated admin)
  if (params.provider && (!params.user || params.user.role !== 'admin')) {
    data.role = 'client' // Force client role
    data.active = true
  }

  // Sanitize and validate names
  if (data.email) {
    data.email = data.email.trim().toLowerCase()
  }

  if (data.first_name || data.last_name) {
    const fn = (data.first_name || '').trim()
    const ln = (data.last_name || '').trim()
    data.first_name = fn
    data.last_name = ln
    data.name = `${fn} ${ln}`.trim()
  } else if (data.name) {
    data.name = data.name.trim()
    const parts = data.name.split(' ')
    data.first_name = parts[0] || data.name
    data.last_name = parts.slice(1).join(' ') || ''
  }

  if (!data.name || data.name.length < 2) {
    throw new BadRequest('El nombre completo del titular es obligatorio (mínimo 2 caracteres).')
  }

  return context
}

/**
 * Validates and locks appointment slots against race conditions (double booking).
 */
export const checkSlotAvailability = async (context: HookContext) => {
  const { data, app } = context
  if (!data || context.method !== 'create') return context

  const knex = app.get('knexClient')
  if (!knex) return context

  const { professional_id, date, start_time } = data
  if (!professional_id || !date || !start_time) {
    throw new BadRequest('Los campos profesional, fecha y horario son obligatorios para agendar.')
  }

  // Check if an active appointment already exists for this slot
  const existing = await knex('appointments')
    .where({
      professional_id,
      date,
      start_time
    })
    .whereNot('status', 'cancelled')
    .first()

  if (existing) {
    throw new Conflict('El horario seleccionado ya ha sido reservado por otro paciente. Por favor elija otro turno disponible.')
  }

  return context
}

/**
 * Global robust error formatting hook. Prevents process crashes and formats DB constraints gracefully.
 */
export const handleGlobalError = async (context: HookContext) => {
  const error = context.error
  if (!error) return context

  // PostgreSQL unique constraint violation (code 23505)
  if (error.code === '23505' || (error.message && error.message.includes('duplicate key'))) {
    if (error.message.includes('idx_unique_active_slot') || error.message.includes('appointments')) {
      context.error = new Conflict('El turno seleccionado ya no está disponible (concurrencia de reservas). Por favor seleccione otro horario.')
    } else if (error.message.includes('users_email_unique')) {
      context.error = new Conflict('Ya existe un usuario registrado con este correo electrónico.')
    } else {
      context.error = new Conflict('El registro ya existe en el sistema.')
    }
  }

  // PostgreSQL foreign key violation (code 23503)
  if (error.code === '23503') {
    context.error = new BadRequest('Uno de los registros relacionados (usuario, mascota o profesional) no existe o no es válido.')
  }

  // PostgreSQL invalid input syntax / UUID format (code 22P02)
  if (error.code === '22P02' || (error.message && error.message.includes('invalid input syntax for type uuid'))) {
    context.error = new BadRequest('El identificador de la mascota, servicio o profesional no tiene un formato UUID válido.')
  }

  // PostgreSQL syntax / check violations
  if (error.code === '23514') {
    context.error = new BadRequest('Los datos proporcionados no cumplen con las reglas clínicas del sistema.')
  }

  return context
}


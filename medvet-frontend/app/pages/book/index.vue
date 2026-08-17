<template>
  <div class="book-page">
    <div class="book-glow-ambient"></div>

    <div class="book-inner">

      <!-- Header -->
      <div class="book-header">
        <span class="eyebrow-pill">
          <span class="eyebrow-tag">ONLINE 24/7</span>
          <span class="eyebrow-text">Sistema de Turnos Clínicos</span>
        </span>
        <h1 class="book-title">
          Agenda la atención de tu <span class="gradient-text-mint">mascota</span>
        </h1>
        <p class="book-subtitle">
          Confirmación instantánea, recordatorios automáticos y sincronización con tu calendario.
        </p>
      </div>

      <!-- Stepper Header -->
      <div class="stepper-card">
        <div class="stepper-track">
          <div
            v-for="(item, idx) in stepperItems"
            :key="idx"
            class="stepper-item"
            @click="canJumpTo(idx + 1) && jumpToStep(idx + 1)"
            :class="{ 'stepper-item--clickable': canJumpTo(idx + 1) }"
          >
            <div :class="['stepper-circle', getStepClass(idx + 1)]">
              <svg v-if="bookingStore.step > idx + 1" class="stepper-check" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span :class="['stepper-label', bookingStore.step === idx + 1 ? 'stepper-label--active' : '']">
              {{ item.title }}
            </span>
          </div>

          <!-- Progress line -->
          <div class="stepper-line">
            <div class="stepper-progress" :style="`width: ${((bookingStore.step - 1) / 4) * 100}%`"></div>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           STEP 1: SELECT SERVICE
      ──────────────────────────────────────── -->
      <div v-if="bookingStore.step === 1" class="step-section">
        <div class="step-header">
          <div>
            <h2 class="step-title">1. Seleccioná el Servicio</h2>
            <p class="step-hint">Elegí la prestación médica o especializada que necesitás</p>
          </div>
          <span class="step-count font-mono-numbers">Paso 1 de 5</span>
        </div>

        <!-- Filter bar -->
        <div class="service-filters">
          <div class="category-pills">
            <button
              v-for="cat in serviceCategories"
              :key="cat.id"
              type="button"
              @click="selectedCategory = cat.id"
              :class="['cat-pill', selectedCategory === cat.id ? 'cat-pill--active' : '']"
            >
              <span>{{ cat.icon }}</span>
              <span>{{ cat.label }}</span>
            </button>
          </div>

          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <input
              v-model="serviceSearch"
              type="text"
              placeholder="Buscar servicio (ej. Consulta, Vacuna, Cirugía)..."
              class="service-search-input"
            />
            <button v-if="serviceSearch" @click="serviceSearch = ''" class="search-clear">✕</button>
          </div>
        </div>

        <!-- Service cards grid -->
        <div class="pick-grid">
          <div
            v-for="service in filteredServices"
            :key="service.id"
            @click="handleSelectService(service)"
            :class="['pick-card', bookingStore.selectedService?.id === service.id ? 'pick-card--active' : '']"
          >
            <div class="pick-card-top">
              <span class="pick-duration font-mono-numbers">
                <svg class="clock-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                {{ service.duration }} min
              </span>
              <div v-if="bookingStore.selectedService?.id === service.id" class="pick-check-wrap">
                <svg class="pick-check" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>

            <h3 class="pick-name">{{ service.name }}</h3>
            <p class="pick-desc">{{ service.description }}</p>

            <div class="pick-price-row">
              <div class="pick-price-left">
                <span class="pick-price-label">Arancel Estimado</span>
                <span class="pick-price-equiv font-mono-numbers">≈ {{ formatPrice(service.price || 0, activeCurrency === 'USD' ? 'VES' : 'USD') }}</span>
              </div>
              <span class="pick-price font-mono-numbers">{{ formatPrice(service.price || 0) }}</span>
            </div>
          </div>
        </div>

        <div v-if="!filteredServices.length" class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-text">No encontramos servicios con "{{ serviceSearch }}".</p>
          <button @click="clearServiceFilters" class="btn-ghost btn-sm">Limpiar filtros</button>
        </div>

      </div>

      <!-- ────────────────────────────────────────
           STEP 2: SELECT OR ADD PET
      ──────────────────────────────────────── -->
      <div v-if="bookingStore.step === 2" class="step-section">
        <div class="step-header">
          <div>
            <h2 class="step-title">2. Seleccioná o Registrá tu Mascota</h2>
            <p class="step-hint">¿Para quién es la consulta veterinaria?</p>
          </div>
          <button @click="showAddPet = !showAddPet" class="btn-ghost btn-sm add-pet-toggle">
            {{ showAddPet ? '✕ Cancelar' : '＋ Registrar Nueva' }}
          </button>
        </div>

        <!-- Add pet inline panel -->
        <Transition name="expand">
          <div v-if="showAddPet" class="add-pet-panel">
            <div class="add-pet-panel-header">
              <h3 class="add-pet-title">🐾 Registrar Mascota en MedVet</h3>
              <p class="add-pet-sub">Guardaremos su ficha médica para esta y futuras consultas</p>
            </div>

            <!-- Species buttons -->
            <div class="species-group">
              <label class="form-label">Especie *</label>
              <div class="species-grid">
                <button
                  v-for="spec in speciesList"
                  :key="spec.name"
                  type="button"
                  @click="newPet.species = spec.name"
                  :class="['species-pick', newPet.species === spec.name ? 'species-pick--active' : '']"
                >
                  <span class="spec-emoji">{{ spec.emoji }}</span>
                  <span class="spec-name">{{ spec.name }}</span>
                </button>
              </div>
            </div>

            <div class="pet-form-grid">
              <div class="form-field">
                <label class="form-label">Nombre del Paciente *</label>
                <input v-model="newPet.name" type="text" placeholder="Ej. Thor, Luna, Simba" class="form-input" required />
              </div>
              <div class="form-field">
                <label class="form-label">Raza / Tipo</label>
                <input v-model="newPet.breed" type="text" placeholder="Ej. Mestizo, Golden, Siamés" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Edad Aprox. (años)</label>
                <input v-model.number="newPet.age" type="number" placeholder="Ej. 3" class="form-input" min="0" />
              </div>
              <div class="form-field">
                <label class="form-label">Peso Aprox. (kg)</label>
                <input v-model.number="newPet.weight" type="number" placeholder="Ej. 12.5" step="0.1" class="form-input" min="0" />
              </div>
            </div>

            <div class="form-field">
              <label class="form-label">Antecedentes o Alergias conocidas (opcional)</label>
              <textarea
                v-model="newPet.notes"
                placeholder="Ej. Alérgico a penicilina, antecedentes cardíacos, temeroso..."
                class="form-input pet-notes"
                rows="2"
              ></textarea>
            </div>

            <div class="add-pet-actions">
              <button type="button" @click="handleAddPet" class="btn-primary" :disabled="!newPet.name.trim()">
                ✓ Guardar y Seleccionar
              </button>
            </div>
          </div>
        </Transition>

        <!-- Pet cards grid -->
        <div class="pick-grid">
          <div
            v-for="pet in userPets"
            :key="pet.id || pet.name"
            @click="handleSelectPet(pet)"
            :class="['pick-card pick-card--pet', bookingStore.selectedPet?.name === pet.name ? 'pick-card--active' : '']"
          >
            <div class="pet-avatar-wrap">
              <span class="pet-emoji">{{ getSpeciesEmoji(pet.species) }}</span>
            </div>

            <div class="pet-info">
              <div class="pet-name-row">
                <h4 class="pet-name">{{ pet.name }}</h4>
                <span class="pet-species-badge">{{ pet.species }}</span>
              </div>
              <p class="pet-meta">{{ pet.breed || 'Sin raza especificada' }}</p>
              <div class="pet-stats font-mono-numbers">
                <span v-if="pet.age">{{ pet.age }} {{ pet.age === 1 ? 'año' : 'años' }}</span>
                <span v-if="pet.weight">· {{ pet.weight }} kg</span>
              </div>
            </div>

            <div v-if="bookingStore.selectedPet?.name === pet.name" class="pick-check-wrap">
              <svg class="pick-check" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>

          <!-- Add new pet tile -->
          <div @click="showAddPet = true" class="add-pet-tile">
            <span class="add-pet-tile-icon">＋</span>
            <p class="add-pet-tile-text">Registrar otra mascota</p>
            <span class="add-pet-tile-sub">Perros, gatos, aves y exóticos</span>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           STEP 3: SELECT DATE & DOCTOR
      ──────────────────────────────────────── -->
      <div v-if="bookingStore.step === 3" class="step-section">
        <div class="step-header">
          <div>
            <h2 class="step-title">3. Seleccioná la Fecha</h2>
            <p class="step-hint">Elegí el día ideal para asistir a la clínica</p>
          </div>
          <span class="step-count font-mono-numbers">Paso 3 de 5</span>
        </div>

        <div class="date-step-card">
          <!-- Quick date buttons -->
          <div class="quick-dates-label">Días recomendados con disponibilidad:</div>
          <div class="quick-dates-grid">
            <button
              v-for="qd in quickDateOptions"
              :key="qd.iso"
              type="button"
              @click="selectQuickDate(qd.iso)"
              :class="['quick-date-btn', selectedDateStr === qd.iso ? 'quick-date-btn--active' : '']"
            >
              <span class="qd-day font-mono-numbers">{{ qd.dayNum }}</span>
              <span class="qd-label">{{ qd.label }}</span>
              <span class="qd-month">{{ qd.month }}</span>
            </button>
          </div>

          <div class="custom-date-divider">
            <span>o seleccioná en el calendario</span>
          </div>

          <!-- Native date picker -->
          <div class="date-picker-wrap">
            <label for="appointment-date" class="date-label">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              Fecha seleccionada
            </label>
            <input
              type="date"
              v-model="selectedDateStr"
              :min="todayStr"
              class="date-input font-mono-numbers"
              id="appointment-date"
              @change="handleDateSelect"
            />
          </div>

          <!-- Selected feedback -->
          <div v-if="selectedDateStr" class="date-selected-banner">
            <span class="date-selected-icon">📅</span>
            <span class="date-selected-text">
              Has elegido: <strong>{{ formatDate(selectedDateStr) }}</strong>
            </span>
          </div>

          <!-- Professional preference -->
          <div class="pro-pref-wrap">
            <label class="form-label">Preferencia de Profesional (opcional):</label>
            <div class="pro-pref-pills">
              <button
                type="button"
                @click="selectProfessionalPref(null)"
                :class="['pro-pill', !bookingStore.selectedProfessionalId ? 'pro-pill--active' : '']"
              >
                Cualquier profesional disponible
              </button>
              <button
                type="button"
                @click="selectProfessionalPref('1')"
                :class="['pro-pill', bookingStore.selectedProfessionalId === '1' ? 'pro-pill--active' : '']"
              >
                👨‍⚕️ Dr. Mateo Silva (Clínico)
              </button>
              <button
                type="button"
                @click="selectProfessionalPref('2')"
                :class="['pro-pill', bookingStore.selectedProfessionalId === '2' ? 'pro-pill--active' : '']"
              >
                👩‍⚕️ Dra. Camila Torres (Cirugía)
              </button>
            </div>

          </div>

          <button
            class="btn-primary date-confirm-btn"
            :disabled="!selectedDateStr"
            @click="bookingStore.setStep(4)"
          >
            Buscar Horarios Disponibles →
          </button>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           STEP 4: SELECT TIME SLOT
      ──────────────────────────────────────── -->
      <div v-if="bookingStore.step === 4" class="step-section">
        <div class="step-header">
          <div>
            <h2 class="step-title">4. Seleccioná un Horario</h2>
            <p class="step-hint">
              Turnos para el <strong>{{ formatDate(bookingStore.selectedDate || selectedDateStr) }}</strong>
            </p>
          </div>
          <span class="step-count font-mono-numbers">Paso 4 de 5</span>
        </div>

        <!-- Morning section -->
        <div class="slots-shift-section">
          <div class="shift-title">
            <span>🌅 Turno Mañana (08:30 — 12:30)</span>
            <span class="shift-badge">{{ morningSlots.length }} disponibles</span>
          </div>
          <div v-if="morningSlots.length" class="slots-grid">
            <button
              v-for="slot in morningSlots"
              :key="`${slot.professional_id}-${slot.time}`"
              @click="handleSelectSlot(slot)"
              :class="['slot-btn', isSlotActive(slot) ? 'slot-btn--active' : '']"
            >
              <span class="slot-time font-mono-numbers">{{ slot.time }}</span>
              <span class="slot-vet">{{ slot.professional_name }}</span>
            </button>
          </div>
          <div v-else class="shift-empty">No hay turnos disponibles por la mañana.</div>
        </div>

        <!-- Afternoon section -->
        <div class="slots-shift-section">
          <div class="shift-title">
            <span>🌇 Turno Tarde (14:00 — 19:30)</span>
            <span class="shift-badge">{{ afternoonSlots.length }} disponibles</span>
          </div>
          <div v-if="afternoonSlots.length" class="slots-grid">
            <button
              v-for="slot in afternoonSlots"
              :key="`${slot.professional_id}-${slot.time}`"
              @click="handleSelectSlot(slot)"
              :class="['slot-btn', isSlotActive(slot) ? 'slot-btn--active' : '']"
            >
              <span class="slot-time font-mono-numbers">{{ slot.time }}</span>
              <span class="slot-vet">{{ slot.professional_name }}</span>
            </button>
          </div>
          <div v-else class="shift-empty">No hay turnos disponibles por la tarde.</div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           STEP 5: CONFIRMATION & TICKET
      ──────────────────────────────────────── -->
      <div v-if="bookingStore.step === 5" class="step-section">
        <div class="step-header">
          <div>
            <h2 class="step-title">5. Revisión y Confirmación</h2>
            <p class="step-hint">Verificá los detalles de la consulta antes de emitir la cita</p>
          </div>
          <span class="step-count font-mono-numbers">Paso 5 de 5</span>
        </div>

        <!-- Medical boarding pass / ticket -->
        <div class="ticket-card">
          <div class="ticket-header">
            <div class="ticket-brand">
              <div class="ticket-brand-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
              </div>
              <div>
                <span class="ticket-brand-title">MedVet Clinical Ticket</span>
                <span class="ticket-brand-sub">Comprobante Preliminar de Turno</span>
              </div>
            </div>
            <span class="ticket-badge">Pendiente de Confirmación</span>
          </div>

          <div class="ticket-grid">
            <div class="ticket-cell">
              <span class="ticket-cell-label">Servicio</span>
              <span class="ticket-cell-val">{{ bookingStore.selectedService?.name }}</span>
              <span class="ticket-cell-sub">{{ bookingStore.selectedService?.duration }} min de atención</span>
            </div>

            <div class="ticket-cell">
              <span class="ticket-cell-label">Paciente</span>
              <span class="ticket-cell-val">
                {{ getSpeciesEmoji(bookingStore.selectedPet?.species) }} {{ bookingStore.selectedPet?.name }}
              </span>
              <span class="ticket-cell-sub">{{ bookingStore.selectedPet?.species }} · {{ bookingStore.selectedPet?.breed || 'Raza no esp.' }}</span>
            </div>

            <div class="ticket-cell">
              <span class="ticket-cell-label">Fecha y Hora</span>
              <span class="ticket-cell-val font-mono-numbers">{{ bookingStore.selectedSlot?.time }} hs</span>
              <span class="ticket-cell-sub">{{ formatDate(bookingStore.selectedDate || selectedDateStr) }}</span>
            </div>

            <div class="ticket-cell">
              <span class="ticket-cell-label">Profesional Asignado</span>
              <span class="ticket-cell-val">{{ bookingStore.selectedSlot?.professional_name || 'Dr. Mateo Silva' }}</span>
              <span class="ticket-cell-sub">Sede Central · Consultorio 2</span>
            </div>
          </div>

          <!-- Total price bar -->
          <div class="ticket-total-bar">
            <div>
              <span class="ticket-total-label">Total a Abonar en Clínica:</span>
              <span class="ticket-total-sub">Tasa oficial BCV · Tarjetas, Pago Móvil, Efectivo o Divisas</span>
            </div>
            <div class="ticket-total-col font-mono-numbers">
              <span class="ticket-total-val">
                {{ formatPrice(bookingStore.selectedService?.price || 0) }}
              </span>
              <span class="ticket-total-equiv">
                ≈ {{ formatPrice(bookingStore.selectedService?.price || 0, activeCurrency === 'USD' ? 'VES' : 'USD') }} (BCV)
              </span>
            </div>
          </div>
        </div>

        <!-- Optional clinical notes -->
        <div class="notes-card">
          <label for="booking-notes" class="form-label">
            Motivo de consulta o síntomas relevantes (opcional):
          </label>
          <textarea
            id="booking-notes"
            v-model="notes"
            class="form-input"
            rows="3"
            placeholder="Ej. Lleva 2 días sin comer, renguea de la pata trasera izquierda, control de rutina..."
          ></textarea>
        </div>

        <!-- AUTHENTICATION SECTION -->
        <!-- Case A: User is logged in -->
        <div v-if="authStore.isAuthenticated" class="auth-verified-card">
          <div class="auth-verified-avatar">
            <span>{{ userInitials }}</span>
          </div>
          <div class="auth-verified-info">
            <div class="auth-verified-badge-row">
              <span class="auth-verified-badge">✓ Titular Autenticado</span>
              <span class="auth-verified-role">Cliente Verificado</span>
            </div>
            <h4 class="auth-verified-name">{{ authStore.user?.name || authStore.user?.email }}</h4>
            <p class="auth-verified-email font-mono-numbers">{{ authStore.user?.email }}</p>
          </div>
          <button type="button" @click="authStore.logout()" class="btn-ghost btn-xs auth-switch-btn" title="Cerrar sesión e ingresar con otra cuenta">
            Cambiar cuenta
          </button>
        </div>

        <!-- Case B: User is NOT logged in (Authentication Required) -->
        <div v-else class="booking-auth-card" id="booking-auth-section">
          <div class="booking-auth-header">
            <div class="auth-lock-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0v2h2V7a5 5 0 00-5-5z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="booking-auth-titles">
              <h3 class="booking-auth-title">Autenticación Requerida para Confirmar</h3>
              <p class="booking-auth-sub">
                Para vincular el historial médico de tu mascota y evitar reservas no válidas, ingresá a tu cuenta o regístrate en 30 segundos.
              </p>
            </div>
          </div>

          <!-- Auth Tab Switcher -->
          <div class="auth-tabs">
            <button
              type="button"
              @click="setAuthTab('login')"
              :class="['auth-tab-btn', authTab === 'login' ? 'auth-tab-btn--active' : '']"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              @click="setAuthTab('register')"
              :class="['auth-tab-btn', authTab === 'register' ? 'auth-tab-btn--active' : '']"
            >
              Crear Cuenta
            </button>
          </div>


          <!-- Tab 1: Login Form -->
          <form v-if="authTab === 'login'" @submit.prevent="handleInlineLogin" class="auth-form-inline" autocomplete="off">
            <div class="auth-form-grid">
              <div class="form-field">
                <label class="form-label">Correo Electrónico *</label>
                <input
                  v-model="loginEmail"
                  type="email"
                  placeholder="javier.silva@gmail.com"
                  class="form-input"
                  required
                  autocomplete="off"
                />
              </div>
              <div class="form-field">
                <label class="form-label">Contraseña *</label>
                <div class="password-input-wrap">
                  <input
                    v-model="loginPassword"
                    :type="showLoginPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="form-input has-eye"
                    required
                    autocomplete="off"
                  />
                  <button
                    type="button"
                    class="eye-btn"
                    @click="showLoginPassword = !showLoginPassword"
                    :title="showLoginPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                    tabindex="-1"
                  >
                    <svg v-if="showLoginPassword" class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <svg v-else class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="authError" class="auth-error-msg">
              <span class="error-icon">⚠️</span>
              <span>{{ authError }}</span>
            </div>

            <div class="auth-actions-row">
              <button type="submit" class="btn-primary auth-submit-btn" :disabled="authLoading">
                <span v-if="authLoading" class="spinner"></span>
                <span v-else>Entrar y Vincular Cita</span>
              </button>
              <button type="button" @click="handleGoogleLogin" class="btn-google-auth" :disabled="authLoading">
                <svg class="google-svg" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>

            <!-- Demo shortcut -->
            <div class="auth-demo-shortcut">
              <span class="demo-shortcut-label">¿Probando el sistema?</span>
              <button type="button" @click="handleDemoLogin" class="btn-demo-pill">
                ⚡ Ingresar con cuenta de prueba (Javier Silva)
              </button>
            </div>
          </form>

          <!-- Tab 2: Register Form -->
          <form v-else @submit.prevent="handleInlineRegister" class="auth-form-inline" autocomplete="off">
            <div class="auth-form-grid">
              <div class="form-field">
                <label class="form-label">Nombre(s) del Titular *</label>
                <input
                  v-model="registerFirstName"
                  type="text"
                  placeholder="Ej. Javier Antonio"
                  class="form-input"
                  required
                  autocomplete="off"
                />
              </div>
              <div class="form-field">
                <label class="form-label">Apellido(s) *</label>
                <input
                  v-model="registerLastName"
                  type="text"
                  placeholder="Ej. Silva Paredes"
                  class="form-input"
                  required
                  autocomplete="off"
                />
              </div>
              <div class="form-field">
                <label class="form-label">Correo Electrónico *</label>
                <input
                  v-model="registerEmail"
                  type="email"
                  placeholder="javier.silva@ejemplo.com"
                  class="form-input"
                  required
                  autocomplete="off"
                />
              </div>
              <div class="form-field">
                <label class="form-label">Teléfono / WhatsApp *</label>
                <input
                  v-model="registerPhone"
                  type="tel"
                  placeholder="+58 412 1234567"
                  class="form-input"
                  required
                  autocomplete="off"
                />
              </div>
              <div class="form-field sm:col-span-2">
                <label class="form-label">Contraseña Segura *</label>
                <div class="password-input-wrap">
                  <input
                    v-model="registerPassword"
                    :type="showRegisterPassword ? 'text' : 'password'"
                    placeholder="Mínimo 6 caracteres"
                    class="form-input has-eye"
                    required
                    minlength="6"
                    autocomplete="new-password"
                  />
                  <button
                    type="button"
                    class="eye-btn"
                    @click="showRegisterPassword = !showRegisterPassword"
                    :title="showRegisterPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                    tabindex="-1"
                  >
                    <svg v-if="showRegisterPassword" class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <svg v-else class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="authError" class="auth-error-msg">
              <span class="error-icon">⚠️</span>
              <span>{{ authError }}</span>
            </div>

            <div class="auth-actions-row">
              <button type="submit" class="btn-primary auth-submit-btn" :disabled="authLoading">
                <span v-if="authLoading" class="spinner"></span>
                <span v-else>Crear Cuenta & Vincular</span>
              </button>
              <button type="button" @click="handleGoogleLogin" class="btn-google-auth" :disabled="authLoading">
                <svg class="google-svg" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>

        </div>
      </div>

      <!-- Navigation button group -->
      <div class="nav-buttons">
        <button
          v-if="bookingStore.step > 1"
          @click="bookingStore.prevStep()"
          class="btn-ghost nav-prev"
        >
          ← Paso Anterior
        </button>
        <div v-else></div>

        <button
          v-if="bookingStore.step < 5"
          @click="bookingStore.nextStep()"
          class="btn-primary nav-next"
          :disabled="!canProceed"
        >
          Continuar al Paso Siguiente →
        </button>
        
        <!-- Step 5 Confirm Buttons -->
        <template v-else>
          <button
            v-if="authStore.isAuthenticated"
            @click="handleConfirm"
            class="btn-amber nav-confirm"
            :disabled="bookingStore.loading"
          >
            <span v-if="bookingStore.loading" class="spinner"></span>
            <span v-else>✓ Confirmar y Emitir Turno</span>
          </button>

          <button
            v-else
            @click="scrollToAuth"
            class="btn-amber nav-confirm nav-confirm--locked"
            title="Inicia sesión o regístrate en el formulario arriba para confirmar"
          >
            <span>🔒 Iniciar Sesión para Confirmar</span>
          </button>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { activeCurrency, formatPrice, toggleCurrency } = useCurrency()
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const router = useRouter()
const route = useRoute()

const selectedCategory = ref('all')
const serviceSearch = ref('')
const selectedDateStr = ref('')
const notes = ref('')
const showAddPet = ref(false)

// Inline Auth State
const authTab = ref('login')
const authLoading = ref(false)
const authError = ref('')

const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

const loginEmail = ref('')
const loginPassword = ref('')

const registerFirstName = ref('')
const registerLastName = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerPhone = ref('')
const registerPassword = ref('')

const resetRegisterForm = () => {
  registerFirstName.value = ''
  registerLastName.value = ''
  registerName.value = ''
  registerEmail.value = ''
  registerPhone.value = ''
  registerPassword.value = ''
  showRegisterPassword.value = false
  authError.value = ''
}

const resetLoginForm = () => {
  loginEmail.value = ''
  loginPassword.value = ''
  showLoginPassword.value = false
  authError.value = ''
}

const todayStr = computed(() => new Date().toISOString().split('T')[0])


const serviceCategories = [
  { id: 'all', label: 'Todos', icon: '✨' },
  { id: 'consulta', label: 'Consultas', icon: '🩺' },
  { id: 'vacuna', label: 'Vacunación', icon: '💉' },
  { id: 'diagnostico', label: 'Diagnóstico', icon: '🔬' },
  { id: 'estetica', label: 'Estética', icon: '✂️' },
  { id: 'cirugia', label: 'Cirugías', icon: '🏥' }
]

const speciesList = [
  { name: 'Perro', emoji: '🐶' },
  { name: 'Gato', emoji: '🐱' },
  { name: 'Ave / Loro', emoji: '🦜' },
  { name: 'Conejo', emoji: '🐰' },
  { name: 'Exótico / Otro', emoji: '🐍' }
]

const newPet = reactive({
  name: '',
  species: 'Perro',
  breed: '',
  age: null,
  weight: null,
  notes: ''
})

const defaultPets = ref([
  { id: 1, name: 'Thor', species: 'Perro', breed: 'Golden Retriever', age: 4, weight: 28.5 },
  { id: 2, name: 'Mishi', species: 'Gato', breed: 'Siamés', age: 2, weight: 4.2 }
])

const userPets = computed(() => bookingStore.pets?.length ? bookingStore.pets : defaultPets.value)

const stepperItems = [
  { title: 'Servicio' },
  { title: 'Mascota' },
  { title: 'Fecha' },
  { title: 'Horario' },
  { title: 'Confirmación' }
]

const canJumpTo = (n) => {
  if (n === 1) return true
  if (n === 2) return !!bookingStore.selectedService
  if (n === 3) return !!bookingStore.selectedService && !!bookingStore.selectedPet
  if (n === 4) return !!bookingStore.selectedService && !!bookingStore.selectedPet && !!selectedDateStr.value
  if (n === 5) return !!bookingStore.selectedService && !!bookingStore.selectedPet && !!selectedDateStr.value && !!bookingStore.selectedSlot
  return false
}

const jumpToStep = (n) => {
  bookingStore.setStep(n)
}

const getStepClass = (n) => {
  if (bookingStore.step === n) return 'stepper-circle--current'
  if (bookingStore.step > n) return 'stepper-circle--done'
  return 'stepper-circle--pending'
}

const getSpeciesEmoji = (species) => {
  const m = speciesList.find(s => (species || '').toLowerCase().includes(s.name.toLowerCase().split(' ')[0]))
  return m ? m.emoji : '🐾'
}

const userInitials = computed(() => {
  if (!authStore.user) return 'MV'
  const name = authStore.user.name || authStore.user.email || ''
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'MV'
})

const fallbackServices = [
  { id: 1, name: 'Consulta Clínica General', category: 'consulta', description: 'Revisión médica completa, diagnóstico y prescripción.', duration: 30, price: 15 },
  { id: 2, name: 'Vacunación Séxtuple Canina', category: 'vacuna', description: 'Inmunización completa con certificado oficial y sello profesional.', duration: 20, price: 18 },
  { id: 3, name: 'Vacunación Triple Felina', category: 'vacuna', description: 'Protección integral para gatos de todas las edades.', duration: 20, price: 17.5 },
  { id: 4, name: 'Perfil Bioquímico & Sangre', category: 'diagnostico', description: 'Laboratorio de alta precisión con resultados en 24hs.', duration: 25, price: 22 },
  { id: 5, name: 'Ecografía Abdominal Completa', category: 'diagnostico', description: 'Estudio de imágenes de alta resolución con informe digital.', duration: 35, price: 28 },
  { id: 6, name: 'Castración / Esterilización', category: 'cirugia', description: 'Cirugía ambulatoria de mínima invasión con monitoreo anestésico.', duration: 60, price: 48 },
  { id: 7, name: 'Baño Terapéutico & Deslanado', category: 'estetica', description: 'Cuidado dermatológico profesional con shampoo medicado.', duration: 45, price: 16 }
]

const availableServices = computed(() => bookingStore.services?.length ? bookingStore.services : fallbackServices)

const filteredServices = computed(() => {
  return availableServices.value.filter(s => {
    const matchesCat = selectedCategory.value === 'all' || (s.category || '').toLowerCase().includes(selectedCategory.value)
    const matchesSearch = !serviceSearch.value.trim() || s.name.toLowerCase().includes(serviceSearch.value.toLowerCase()) || (s.description || '').toLowerCase().includes(serviceSearch.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})

const quickDateOptions = computed(() => {
  const list = []
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  for (let i = 0; i < 5; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    let label = days[d.getDay()]
    if (i === 0) label = 'Hoy'
    if (i === 1) label = 'Mañana'

    list.push({
      iso,
      dayNum: d.getDate(),
      month: months[d.getMonth()],
      label
    })
  }
  return list
})

const handleSelectService = (service) => {
  bookingStore.selectService(service)
  bookingStore.setStep(2)
}

const handleSelectPet = (pet) => {
  bookingStore.selectPet(pet)
  bookingStore.setStep(3)
}

const selectQuickDate = (iso) => {
  selectedDateStr.value = iso
  handleDateSelect()
}

const formatDate = (str) => {
  if (!str) return ''
  const d = new Date(str + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const fallbackSlots = [
  { time: '08:30', professional_id: '1', professional_name: 'Dr. Mateo Silva', available: true },
  { time: '09:30', professional_id: '1', professional_name: 'Dr. Mateo Silva', available: true },
  { time: '10:30', professional_id: '2', professional_name: 'Dra. Camila Torres', available: true },
  { time: '11:45', professional_id: '2', professional_name: 'Dra. Camila Torres', available: true },
  { time: '14:15', professional_id: '1', professional_name: 'Dr. Mateo Silva', available: true },
  { time: '15:30', professional_id: '2', professional_name: 'Dra. Camila Torres', available: true },
  { time: '16:45', professional_id: '1', professional_name: 'Dr. Mateo Silva', available: true },
  { time: '18:00', professional_id: '2', professional_name: 'Dra. Camila Torres', available: true }
]

const displayedSlots = computed(() => {
  const slots = bookingStore.availableSlots?.length ? bookingStore.availableSlots.filter(s => s.available) : fallbackSlots
  if (bookingStore.selectedProfessionalId) {
    return slots.filter(s => String(s.professional_id) === String(bookingStore.selectedProfessionalId))
  }
  return slots
})

const morningSlots = computed(() => {
  return displayedSlots.value.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10)
    return hour < 13
  })
})

const afternoonSlots = computed(() => {
  return displayedSlots.value.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10)
    return hour >= 13
  })
})

const isSlotActive = (slot) => {
  return bookingStore.selectedSlot?.time === slot.time &&
    String(bookingStore.selectedSlot?.professional_id) === String(slot.professional_id)
}

const handleSelectSlot = (slot) => {
  bookingStore.selectSlot(slot)
  bookingStore.setStep(5)
}

const canProceed = computed(() => {
  switch (bookingStore.step) {
    case 1: return !!bookingStore.selectedService
    case 2: return !!bookingStore.selectedPet
    case 3: return !!selectedDateStr.value
    case 4: return !!bookingStore.selectedSlot
    default: return true
  }
})

const handleAddPet = () => {
  if (!newPet.name.trim()) return
  const pet = {
    id: Date.now().toString(),
    name: newPet.name.trim(),
    species: newPet.species,
    breed: newPet.breed.trim(),
    age: newPet.age,
    weight: newPet.weight
  }
  if (!bookingStore.pets) bookingStore.pets = []
  bookingStore.pets.push(pet)
  defaultPets.value.push(pet)
  bookingStore.selectPet(pet)
  showAddPet.value = false
  Object.assign(newPet, { name: '', species: 'Perro', breed: '', age: null, weight: null, notes: '' })
  bookingStore.setStep(3)
}

const clearServiceFilters = () => {
  serviceSearch.value = ''
  selectedCategory.value = 'all'
}

const selectProfessionalPref = (id: string | null) => {
  bookingStore.selectedProfessionalId = id
  handleDateSelect()
}

const setAuthTab = (tab: string) => {
  authTab.value = tab
  authError.value = ''
  if (tab === 'register') {
    resetRegisterForm()
  } else {
    resetLoginForm()
  }
}

const handleDateSelect = async () => {
  if (!selectedDateStr.value) return
  bookingStore.selectDate(selectedDateStr.value)
  try {
    await bookingStore.fetchAvailableSlots(
      bookingStore.selectedService?.id || '1',
      selectedDateStr.value,
      bookingStore.selectedProfessionalId || undefined
    )
  } catch { /* use fallback */ }
}


const handleInlineLogin = async () => {
  const toast = useToastNotification()
  const em = loginEmail.value.trim()
  const pw = loginPassword.value

  if (!em || !pw) {
    authError.value = 'Por favor ingresá tu correo y contraseña.'
    toast.warning('Campos requeridos', authError.value)
    return
  }
  authError.value = ''
  authLoading.value = true
  try {
    await authStore.login(em, pw)
    if (authStore.user?.id) {
      await bookingStore.fetchPets(authStore.user.id).catch(() => {})
      toast.success('Sesión iniciada', `Bienvenido de nuevo, ${authStore.user.name || 'Paciente'}`)
    }
  } catch (err: any) {
    authError.value = err?.message || 'Error al iniciar sesión. Verificá tus credenciales.'
    toast.error('Error de acceso', authError.value)
  } finally {
    authLoading.value = false
  }
}

const handleInlineRegister = async () => {
  const toast = useToastNotification()
  const fn = registerFirstName.value.trim()
  const ln = registerLastName.value.trim()
  const em = registerEmail.value.trim()
  const ph = registerPhone.value.trim()
  const pw = registerPassword.value

  // Strict field checks
  if (!fn || fn.length < 2) {
    authError.value = 'El nombre del titular es requerido (mínimo 2 caracteres).'
    toast.warning('Campo incompleto', authError.value)
    return
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(fn)) {
    authError.value = 'El nombre sólo debe contener letras y espacios.'
    toast.warning('Formato inválido', authError.value)
    return
  }

  if (!ln || ln.length < 2) {
    authError.value = 'El apellido del titular es requerido (mínimo 2 caracteres).'
    toast.warning('Campo incompleto', authError.value)
    return
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(ln)) {
    authError.value = 'El apellido sólo debe contener letras y espacios.'
    toast.warning('Formato inválido', authError.value)
    return
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!em || !emailRegex.test(em)) {
    authError.value = 'Ingresá un correo electrónico válido (ej. usuario@dominio.com).'
    toast.warning('Formato inválido', authError.value)
    return
  }

  const digits = (ph.match(/\d/g) || []).length
  if (!ph || digits < 7) {
    authError.value = 'Ingresá un número de teléfono o WhatsApp válido (mínimo 7 dígitos).'
    toast.warning('Formato inválido', authError.value)
    return
  }

  if (!pw || pw.length < 6 || !pw.trim()) {
    authError.value = 'La contraseña debe tener al menos 6 caracteres (no se permiten sólo espacios en blanco).'
    toast.warning('Seguridad', authError.value)
    return
  }

  authError.value = ''
  authLoading.value = true
  try {
    await authStore.register({
      first_name: fn,
      last_name: ln,
      name: `${fn} ${ln}`,
      email: em,
      phone: ph,
      password: pw
    })
    if (authStore.user?.id) {
      await bookingStore.fetchPets(authStore.user.id).catch(() => {})
      toast.success('Cuenta creada exitosamente', `¡Bienvenido a MedVet, ${fn}! Tu perfil ha sido vinculado.`)
    }
  } catch (err: any) {
    authError.value = err?.message || 'Error al crear la cuenta. Intenta nuevamente.'
    toast.error('Error en registro', authError.value)
  } finally {
    authLoading.value = false
  }
}


const handleGoogleLogin = async () => {
  authError.value = ''
  authLoading.value = true
  try {
    await authStore.loginWithGoogle()
    if (authStore.user?.id) {
      await bookingStore.fetchPets(authStore.user.id).catch(() => {})
    }
  } catch (err) {
    authError.value = 'Error al conectar con Google.'
  } finally {
    authLoading.value = false
  }
}

const handleDemoLogin = async () => {
  authError.value = ''
  authLoading.value = true
  try {
    await authStore.login('javier.silva@gmail.com', 'medvet123')
    if (authStore.user?.id) {
      await bookingStore.fetchPets(authStore.user.id).catch(() => {})
    }
  } catch (err) {
    authError.value = 'No se pudo iniciar sesión demo.'
  } finally {
    authLoading.value = false
  }
}

const scrollToAuth = () => {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('booking-auth-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const input = el.querySelector('input')
      if (input) input.focus()
    }
  }
}

const handleConfirm = async () => {
  const toast = useToastNotification()
  if (!authStore.isAuthenticated || !authStore.user?.id) {
    scrollToAuth()
    authError.value = 'Por favor iniciá sesión o regístrate para confirmar tu turno.'
    toast.warning('Autenticación requerida', 'Debes identificarte con tu nombre y apellido para confirmar el turno.')
    return
  }

  try {
    const apt = await bookingStore.confirmBooking(authStore.user.id, notes.value)
    const appointmentId = apt?.id || 'apt-' + Math.random().toString(36).substr(2, 9)
    toast.success('Turno Reservado con Éxito', `Cita confirmada para ${bookingStore.selectedPet?.name || 'tu mascota'} el ${formatDate(bookingStore.selectedDate || selectedDateStr.value)} a las ${bookingStore.selectedSlot?.time} hs.`)
    router.push(`/book/confirm/${appointmentId}`)
  } catch (err: any) {
    console.error('Error confirming appointment:', err)
    toast.error('Error de concurrencia', err.message || 'El turno seleccionado no está disponible. Por favor elija otro horario.')
  }
}


onMounted(async () => {
  if (!authStore.isAuthenticated) {
    resetRegisterForm()
    resetLoginForm()
  }

  // Always default to Step 1 (Servicio) unless specified in query
  bookingStore.setStep(route.query.step ? Number(route.query.step) : 1)

  // Preselect today as default date without forcing step change
  selectedDateStr.value = todayStr.value
  bookingStore.selectDate(todayStr.value)

  const serviceId = route.query.service
  try {
    await bookingStore.fetchServices()
    if (serviceId) {
      const svc = availableServices.value.find(s => String(s.id) === String(serviceId))
      if (svc) {
        bookingStore.selectService(svc)
      }
    }
    if (authStore.isAuthenticated && authStore.user?.id) {
      await bookingStore.fetchPets(authStore.user.id)
    }
  } catch { /* continue */ }
})

</script>

<style scoped>
/* ────────────────────────────────────────
   PAGE & AMBIENT
──────────────────────────────────────── */
.book-page {
  position: relative;
  min-height: 85vh;
  padding: 3.5rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  max-width: 100%;
  width: 100%;
}

.dark .book-page {
  background-color: #040706;
}

.book-glow-ambient {
  position: absolute;
  top: -140px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  max-width: 100%;
  height: 480px;
  background: radial-gradient(ellipse 800px 400px at 50% 0%, rgba(0, 245, 155, 0.12) 0%, rgba(0, 168, 107, 0.03) 50%, transparent 80%);
  filter: blur(40px);
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.book-inner {
  position: relative;
  z-index: 1;
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  width: 100%;
}

/* Header */
.book-header {
  text-align: center;
  max-width: 620px;
  margin: 0 auto;
  width: 100%;
}

.book-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0.85rem 0 0.5rem;
  line-height: 1.15;
}

.dark .book-title { color: #f8fafc; }

.book-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  line-height: 1.6;
  margin: 0;
}

.dark .book-subtitle { color: #94a3b8; }

/* ────────────────────────────────────────
   STEPPER
──────────────────────────────────────── */
.stepper-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: clamp(16px, 2.5vw, 20px);
  padding: clamp(0.875rem, 2.5vw, 1.5rem) clamp(0.875rem, 3vw, 2rem);
  box-shadow: 0 12px 32px -8px rgba(0, 80, 50, 0.06);
}

.dark .stepper-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.18);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.stepper-track {
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: flex-start;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.stepper-item--clickable {
  cursor: pointer;
}

.stepper-item--clickable:hover .stepper-circle {
  transform: scale(1.08);
}

.stepper-circle {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.25s ease;
}

.stepper-circle--current {
  background: #00a86b;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 168, 107, 0.4);
  transform: scale(1.1);
}

.dark .stepper-circle--current {
  background: #00f59b;
  color: #040706;
  box-shadow: 0 0 20px rgba(0, 245, 155, 0.7);
}

.stepper-circle--done {
  background: rgba(0, 168, 107, 0.12);
  color: #007a4d;
  border: 1.5px solid rgba(0, 168, 107, 0.35);
}

.dark .stepper-circle--done {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
  border-color: rgba(0, 245, 155, 0.4);
}

.stepper-circle--pending {
  background: var(--color-cream-200);
  color: var(--color-ink-300);
}

.dark .stepper-circle--pending {
  background: rgba(16, 28, 22, 0.7);
  color: #94a3b8;
}

.stepper-check { width: 1.1rem; height: 1.1rem; }

.stepper-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-ink-300);
  text-align: center;
  display: none;
}

@media (min-width: 540px) { .stepper-label { display: block; } }

.dark .stepper-label { color: var(--color-ink-400); }
.stepper-label--active { color: #00a86b; font-weight: 700; }
.dark .stepper-label--active { color: #00f59b; }

.stepper-line {
  position: absolute;
  top: 1.125rem;
  left: 8%;
  right: 8%;
  height: 2px;
  background: var(--color-cream-200);
  z-index: 0;
  border-radius: 2px;
}

.dark .stepper-line { background: rgba(0, 245, 155, 0.15); }

.stepper-progress {
  height: 100%;
  background: #00a86b;
  border-radius: 2px;
  transition: width 0.35s ease;
}

.dark .stepper-progress { background: #00f59b; box-shadow: 0 0 10px rgba(0, 245, 155, 0.5); }

/* ────────────────────────────────────────
   STEP COMMON
──────────────────────────────────────── */
.step-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.step-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .step-title { color: #f8fafc; }

.step-hint {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0.2rem 0 0;
}

.dark .step-hint { color: #94a3b8; }

.step-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-forest-700);
  background: rgba(0, 168, 107, 0.1);
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.dark .step-count {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.12);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

/* ────────────────────────────────────────
   STEP 1: SERVICE FILTERS & CARDS
──────────────────────────────────────── */
.service-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-ink-700);
  cursor: pointer;
  transition: all 0.18s ease;
}

.cat-pill:hover { border-color: #00a86b; color: #007a4d; }

.cat-pill--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
  font-weight: 700;
}

.dark .cat-pill {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

.dark .cat-pill:hover {
  border-color: #00f59b;
  color: #00f59b;
}

.dark .cat-pill--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
  box-shadow: 0 0 14px rgba(0, 245, 155, 0.4);
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-ink-400);
  pointer-events: none;
}

.service-search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.65rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink-900);
  outline: none;
  transition: all 0.18s ease;
}

.service-search-input:focus {
  border-color: #00a86b;
  box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.12);
}

.dark .service-search-input {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.18);
  color: #f1faf5;
}

.dark .service-search-input:focus {
  border-color: #00f59b;
  box-shadow: 0 0 18px rgba(0, 245, 155, 0.25);
}

.search-clear {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--color-ink-400);
  cursor: pointer;
  font-size: 0.875rem;
}

/* Pick grid */
.pick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 600px) { .pick-grid { grid-template-columns: 1fr; } }

.pick-card {
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.35rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.pick-card:hover {
  transform: translateY(-3px);
  border-color: #00a86b;
  box-shadow: 0 8px 24px -6px rgba(0, 80, 50, 0.08);
}

.pick-card--active {
  border-color: #00a86b;
  border-width: 2px;
  background: var(--color-cream-50);
  box-shadow: 0 10px 28px -6px rgba(0, 168, 107, 0.25);
}

.dark .pick-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .pick-card:hover {
  border-color: #00f59b;
  box-shadow: 0 10px 30px -6px rgba(0, 245, 155, 0.25);
}

.dark .pick-card--active {
  border-color: #00f59b;
  box-shadow: 0 0 24px rgba(0, 245, 155, 0.28);
}

.pick-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pick-duration {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  background: var(--color-cream-200);
  color: var(--color-ink-500);
}

.dark .pick-duration {
  background: rgba(16, 28, 22, 0.8);
  color: #cbd5e1;
}

.clock-icon { width: 13px; height: 13px; color: var(--color-forest-600); }
.dark .clock-icon { color: #00f59b; }

.pick-check-wrap {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #00a86b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .pick-check-wrap {
  background: #00f59b;
  color: #040706;
}

.pick-check { width: 1rem; height: 1rem; }

.pick-name {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.25;
}

.dark .pick-name { color: #f8fafc; }

.pick-desc {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  line-height: 1.55;
  flex-grow: 1;
  margin: 0;
}

.dark .pick-desc { color: #94a3b8; }

.pick-price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-cream-200);
  margin-top: 0.25rem;
}

.dark .pick-price-row { border-top-color: rgba(0, 245, 155, 0.15); }

.pick-price-left {
  display: flex;
  flex-direction: column;
}

.pick-price-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
  font-weight: 600;
}

.pick-price-equiv {
  font-size: 0.68rem;
  color: var(--color-ink-400);
  margin-top: 1px;
}

.dark .pick-price-equiv { color: #cbd5e1; }

.pick-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: #00a86b;
  line-height: 1.2;
}

.dark .pick-price { color: #00f59b; }

/* ────────────────────────────────────────
   STEP 2: PETS
──────────────────────────────────────── */
.add-pet-toggle { font-size: 0.8125rem; }

.add-pet-panel {
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 12px 32px -8px rgba(0, 80, 50, 0.08);
}

.dark .add-pet-panel {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.7);
}

.add-pet-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .add-pet-title { color: #f1faf5; }

.add-pet-sub {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0.2rem 0 0;
}

.dark .add-pet-sub { color: #cbd5e1; }

.species-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.5rem;
}

.species-pick {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.85rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--color-ink-700);
}

.species-pick:hover { border-color: #00a86b; }

.species-pick--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
  font-weight: 700;
}

.dark .species-pick {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.18);
  color: #d6e8de;
}

.dark .species-pick--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
}

.spec-emoji { font-size: 1.25rem; }

.pet-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

@media (max-width: 500px) { .pet-form-grid { grid-template-columns: 1fr; } }

.form-field { display: flex; flex-direction: column; gap: 0.35rem; }

.form-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-ink-700);
}

.dark .form-label { color: #d6e8de; }

.form-input {
  padding: 0.7rem 0.95rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink-900);
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  width: 100%;
}

.form-input:focus {
  border-color: #00a86b;
  box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.12);
}

.dark .form-input {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.dark .form-input:focus {
  border-color: #00f59b;
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.25);
}

.pet-notes { resize: none; }

.add-pet-actions { display: flex; justify-content: flex-end; }

/* Pet cards */
.pick-card--pet {
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.pet-avatar-wrap {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 14px;
  background: var(--color-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .pet-avatar-wrap {
  background: rgba(16, 28, 22, 0.8);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

.pet-emoji { font-size: 1.85rem; }

.pet-info { flex: 1; min-width: 0; }

.pet-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pet-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.0625rem;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .pet-name { color: #f8fafc; }

.pet-species-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  background: rgba(0, 168, 107, 0.1);
  color: #007a4d;
}

.dark .pet-species-badge {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

.pet-meta {
  font-size: 0.78rem;
  color: var(--color-ink-500);
  margin: 0.15rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .pet-meta { color: #94a3b8; }

.pet-stats {
  font-size: 0.72rem;
  color: var(--color-ink-400);
}

/* Add pet tile */
.add-pet-tile {
  border: 2px dashed var(--color-cream-300);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  gap: 0.35rem;
  transition: all 0.2s ease;
}

.add-pet-tile:hover {
  border-color: #00a86b;
  background: rgba(0, 168, 107, 0.05);
}

.dark .add-pet-tile {
  border-color: rgba(0, 245, 155, 0.2);
}

.dark .add-pet-tile:hover {
  border-color: #00f59b;
  background: rgba(0, 245, 155, 0.08);
}

.add-pet-tile-icon { font-size: 1.75rem; color: #00a86b; }
.dark .add-pet-tile-icon { color: #00f59b; }

.add-pet-tile-text {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .add-pet-tile-text { color: #f1faf5; }

.add-pet-tile-sub { font-size: 0.72rem; color: var(--color-ink-400); }

/* ────────────────────────────────────────
   STEP 3: DATE & PRO PREFERENCE
──────────────────────────────────────── */
.date-step-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dark .date-step-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.18);
}

.quick-dates-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink-700);
}

.dark .quick-dates-label { color: #d6e8de; }

.quick-dates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.65rem;
}

.quick-date-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.85rem 0.5rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  cursor: pointer;
  transition: all 0.18s ease;
}

.quick-date-btn:hover {
  border-color: #00a86b;
  transform: translateY(-2px);
}

.quick-date-btn--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff !important;
  box-shadow: 0 6px 18px -4px rgba(0, 168, 107, 0.4);
}

.dark .quick-date-btn {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.18);
  color: #d6e8de;
}

.dark .quick-date-btn:hover { border-color: #00f59b; }

.dark .quick-date-btn--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706 !important;
  box-shadow: 0 0 20px rgba(0, 245, 155, 0.4);
}

.qd-day { font-size: 1.35rem; font-weight: 800; line-height: 1.1; }
.qd-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; margin-top: 0.2rem; }
.qd-month { font-size: 0.68rem; opacity: 0.75; }

.custom-date-divider {
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-ink-400);
  margin: 0.25rem 0;
}

.custom-date-divider::before,
.custom-date-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .custom-date-divider::before,
.dark .custom-date-divider::after {
  border-bottom-color: rgba(0, 245, 155, 0.12);
}

.custom-date-divider span {
  padding: 0 0.85rem;
}

.date-picker-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.date-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink-700);
}

.dark .date-label { color: #d6e8de; }
.date-label svg { width: 1rem; height: 1rem; color: #00a86b; }
.dark .date-label svg { color: #00f59b; }

.date-input {
  width: 100%;
  max-width: 260px;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-ink-900);
  text-align: center;
  outline: none;
  cursor: pointer;
  transition: all 0.18s ease;
}

.date-input:focus { border-color: #00a86b; }

.dark .date-input {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.22);
  color: #f1faf5;
}

.dark .date-input::-webkit-calendar-picker-indicator { filter: invert(1); }

.date-selected-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(0, 168, 107, 0.08);
  border: 1px solid rgba(0, 168, 107, 0.2);
  font-size: 0.875rem;
  color: #007a4d;
}

.dark .date-selected-banner {
  background: rgba(0, 245, 155, 0.1);
  border-color: rgba(0, 245, 155, 0.25);
  color: #00f59b;
}

.pro-pref-wrap { display: flex; flex-direction: column; gap: 0.5rem; }

.pro-pref-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pro-pill {
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-ink-700);
  cursor: pointer;
  transition: all 0.15s ease;
}

.pro-pill--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
  font-weight: 700;
}

.dark .pro-pill {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

.dark .pro-pill--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
}

.date-confirm-btn {
  width: 100%;
  justify-content: center;
  padding: 0.85rem 1.5rem;
  margin-top: 0.5rem;
}

/* ────────────────────────────────────────
   STEP 4: TIME SLOTS
──────────────────────────────────────── */
.slots-shift-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.shift-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .shift-title { color: #f8fafc; }

.shift-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-ink-400);
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
}

.slot-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.85rem 0.75rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: var(--font-body);
}

.slot-btn:hover {
  border-color: #00a86b;
  transform: translateY(-2px);
}

.slot-btn--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff !important;
  box-shadow: 0 6px 20px -4px rgba(0, 168, 107, 0.45);
}

.dark .slot-btn {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.18);
  color: #f1faf5;
}

.dark .slot-btn:hover { border-color: #00f59b; }

.dark .slot-btn--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706 !important;
  box-shadow: 0 0 24px rgba(0, 245, 155, 0.4);
}

.slot-time { font-size: 1.15rem; font-weight: 800; }
.slot-vet {
  font-size: 0.65rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}

.shift-empty {
  font-size: 0.8125rem;
  color: var(--color-ink-400);
  font-style: italic;
  padding: 0.5rem 0;
}

/* ────────────────────────────────────────
   STEP 5: TICKET & SUMMARY
──────────────────────────────────────── */
.ticket-card {
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-300);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 40px -12px rgba(0, 80, 50, 0.1);
}

.dark .ticket-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.22);
  box-shadow: 0 20px 50px -16px rgba(0, 0, 0, 0.85);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: rgba(0, 168, 107, 0.08);
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .ticket-header {
  background: rgba(0, 245, 155, 0.1);
  border-bottom-color: rgba(0, 245, 155, 0.15);
}

.ticket-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ticket-brand-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: #00a86b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .ticket-brand-icon { background: #00f59b; color: #040706; }
.ticket-brand-icon svg { width: 1.1rem; height: 1.1rem; }

.ticket-brand-title {
  display: block;
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .ticket-brand-title { color: #f8fafc; }

.ticket-brand-sub {
  display: block;
  font-size: 0.65rem;
  color: var(--color-ink-400);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ticket-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 122, 0, 0.15);
  color: var(--color-joy-tangerine);
  border: 1px solid rgba(255, 122, 0, 0.3);
}

.ticket-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  padding: 1.75rem;
}

@media (max-width: 540px) { .ticket-grid { grid-template-columns: 1fr; } }

.ticket-cell { display: flex; flex-direction: column; gap: 0.2rem; }

.ticket-cell-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 600;
  color: var(--color-ink-400);
}

.ticket-cell-val {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .ticket-cell-val { color: #f8fafc; }

.ticket-cell-sub { font-size: 0.75rem; color: var(--color-ink-500); }
.dark .ticket-cell-sub { color: #94a3b8; }

.ticket-total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: var(--color-cream-100);
  border-top: 1px dashed var(--color-cream-300);
}

.dark .ticket-total-bar {
  background: #060c09;
  border-top-color: rgba(0, 245, 155, 0.2);
}

.ticket-total-label {
  display: block;
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .ticket-total-label { color: #f8fafc; }

.ticket-total-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ticket-total-val {
  font-size: 1.65rem;
  font-weight: 800;
  color: #00a86b;
  line-height: 1.2;
}

.dark .ticket-total-val { color: #00f59b; }

.ticket-total-equiv {
  font-size: 0.78rem;
  color: var(--color-ink-400);
}

.dark .ticket-total-equiv { color: #cbd5e1; }

.notes-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ────────────────────────────────────────
   AUTHENTICATED USER BADGE & CARD
──────────────────────────────────────── */
.auth-verified-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 20px;
  background: rgba(0, 168, 107, 0.08);
  border: 1.5px solid rgba(0, 168, 107, 0.28);
}

.dark .auth-verified-card {
  background: rgba(10, 24, 18, 0.75);
  border-color: rgba(0, 245, 155, 0.3);
}

.auth-verified-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a86b, #04432b);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.15rem;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0, 168, 107, 0.35);
}

.dark .auth-verified-avatar {
  background: linear-gradient(135deg, #00f59b, #008f58);
  color: #040706;
}

.auth-verified-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.auth-verified-badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.auth-verified-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #00a86b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dark .auth-verified-badge {
  color: #00f59b;
}

.auth-verified-role {
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.15);
  color: var(--color-ink-700);
  font-weight: 600;
}

.dark .auth-verified-role {
  background: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

.auth-verified-name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .auth-verified-name {
  color: #f8fafc;
}

.auth-verified-email {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0;
}

.dark .auth-verified-email {
  color: #94a3b8;
}

.auth-switch-btn {
  font-size: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ────────────────────────────────────────
   INLINE AUTHENTICATION REQUIRED CARD
──────────────────────────────────────── */
.booking-auth-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem;
  border-radius: 24px;
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-300);
  box-shadow: 0 12px 36px -8px rgba(0, 60, 40, 0.08);
}

.dark .booking-auth-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.booking-auth-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.auth-lock-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: rgba(255, 122, 0, 0.15);
  color: var(--color-joy-tangerine);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.auth-lock-icon svg {
  width: 1.35rem;
  height: 1.35rem;
}

.booking-auth-titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.booking-auth-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .booking-auth-title {
  color: #f8fafc;
}

.booking-auth-sub {
  font-size: 0.825rem;
  color: var(--color-ink-500);
  margin: 0;
  line-height: 1.45;
}

.dark .booking-auth-sub {
  color: #94a3b8;
}

/* Tabs */
.auth-tabs {
  display: flex;
  background: var(--color-cream-200);
  padding: 0.3rem;
  border-radius: 12px;
  gap: 0.3rem;
}

.dark .auth-tabs {
  background: rgba(20, 35, 27, 0.85);
}

.auth-tab-btn {
  flex: 1;
  padding: 0.55rem 1rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  background: transparent;
  color: var(--color-ink-500);
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.dark .auth-tab-btn {
  color: #94a3b8;
}

.auth-tab-btn--active {
  background: #ffffff;
  color: #00a86b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dark .auth-tab-btn--active {
  background: #060c09;
  color: #00f59b;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

/* Forms */
.auth-form-inline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .auth-form-grid {
    grid-template-columns: 1fr;
  }
}

.auth-error-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 0.8125rem;
  font-weight: 600;
}

.dark .auth-error-msg {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}

.auth-actions-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.auth-submit-btn {
  flex: 1;
  min-width: 180px;
  justify-content: center;
  padding: 0.8rem 1.25rem;
  font-size: 0.875rem;
}

.btn-google-auth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: #ffffff;
  color: var(--color-ink-800);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
}

.dark .btn-google-auth {
  background: #0e1713;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.btn-google-auth:hover {
  border-color: #00a86b;
  transform: translateY(-1px);
}

.dark .btn-google-auth:hover {
  border-color: #00f59b;
}

.google-svg {
  width: 1.15rem;
  height: 1.15rem;
}

/* Demo shortcut */
.auth-demo-shortcut {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--color-cream-300);
  flex-wrap: wrap;
}

.dark .auth-demo-shortcut {
  border-top-color: rgba(0, 245, 155, 0.15);
}

.demo-shortcut-label {
  font-size: 0.75rem;
  color: var(--color-ink-400);
}

.btn-demo-pill {
  border: none;
  background: rgba(0, 168, 107, 0.1);
  color: #00a86b;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dark .btn-demo-pill {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.btn-demo-pill:hover {
  transform: scale(1.03);
}

/* ────────────────────────────────────────
   NAV BUTTONS & FOOTER
──────────────────────────────────────── */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.75rem;
  border-top: 1px solid var(--color-cream-200);
}

.dark .nav-buttons { border-top-color: rgba(0, 245, 155, 0.15); }

.nav-prev { font-size: 0.9rem; }
.nav-next { font-size: 0.9375rem; padding: 0.85rem 1.85rem; }
.nav-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.nav-confirm { font-size: 0.9375rem; padding: 0.85rem 2rem; }
.nav-confirm:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.nav-confirm--locked {
  background: rgba(255, 122, 0, 0.18) !important;
  color: var(--color-joy-tangerine) !important;
  border: 1.5px solid rgba(255, 122, 0, 0.4) !important;
  box-shadow: none !important;
}

.nav-confirm--locked:hover {
  background: rgba(255, 122, 0, 0.28) !important;
  transform: translateY(-2px);
}

.stepper-item--clickable {
  cursor: pointer;
}

.stepper-item--clickable:hover .stepper-circle {
  transform: scale(1.08);
  border-color: #00a86b;
}

.dark .stepper-item--clickable:hover .stepper-circle {
  border-color: #00f59b;
}

.spinner {
  display: inline-block;
  width: 1.1rem;
  height: 1.1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Password eye input styling */
.password-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.password-input-wrap .form-input.has-eye {
  padding-right: 2.75rem;
}

.eye-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: color 0.2s ease, transform 0.15s ease;
  z-index: 2;
}

.eye-btn:hover {
  color: #00a86b;
  transform: translateY(-50%) scale(1.1);
}

.dark .eye-btn:hover {
  color: #00f59b;
}

.eye-svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: all 0.28s ease;
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
</style>


<template>
  <div v-if="isOpen" class="study-viewer-overlay" @click.self="$emit('close')">
    <div class="study-viewer-container">

      <!-- Header Toolbar -->
      <div class="viewer-header">
        <div class="viewer-title-group">
          <span class="viewer-category-badge" :class="`badge--${currentStudy?.category || 'radiografia'}`">
            {{ getCategoryIcon(currentStudy?.category) }} {{ getCategoryName(currentStudy?.category) }}
          </span>
          <h2 class="viewer-title">{{ currentStudy?.title || 'Estudio Clínico' }}</h2>
          <span class="viewer-date font-mono-numbers">{{ formatDate(currentStudy?.study_date || currentStudy?.created_at) }}</span>
        </div>

        <div class="viewer-header-actions">
          <button
            type="button"
            class="viewer-btn"
            @click="isUploadModalOpen = true"
            title="Adjuntar nuevo estudio o placa"
          >
            ➕ Subir Placa / Informe
          </button>
          <button
            type="button"
            class="viewer-btn viewer-btn--close"
            @click="$emit('close')"
            aria-label="Cerrar visor"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Main Viewer Area -->
      <div class="viewer-body">

        <!-- Center Stage: Medical Image / Document Viewer with Tools -->
        <div class="viewer-stage" :class="{ 'stage--inverted': isInverted }">

          <!-- Floating Image Controls Overlay -->
          <div class="stage-tools-bar" v-if="isImage(currentStudy?.file_url)">
            <div class="tools-pill">
              <button type="button" class="tool-btn" @click="zoomIn" title="Acercar Zoom (+)">
                🔍＋
              </button>
              <span class="tool-val font-mono-numbers">{{ Math.round(zoomLevel * 100) }}%</span>
              <button type="button" class="tool-btn" @click="zoomOut" title="Alejar Zoom (-)">
                🔍－
              </button>
              <span class="tool-sep"></span>
              <button type="button" class="tool-btn" @click="resetZoom" title="Restablecer Zoom">
                ↺ 1:1
              </button>
              <button type="button" class="tool-btn" @click="rotateRight" title="Rotar 90°">
                ↻ 90°
              </button>
              <button
                type="button"
                class="tool-btn"
                :class="{ 'tool-btn--active': isInverted }"
                @click="isInverted = !isInverted"
                title="Invertir Contraste RX (Negativo/Positivo)"
              >
                🌓 Negativo
              </button>
              <button
                type="button"
                class="tool-btn"
                :class="{ 'tool-btn--active': isGrayscale }"
                @click="isGrayscale = !isGrayscale"
                title="Monocromo RX"
              >
                ⬛ Monocromo
              </button>
              <span class="tool-sep"></span>
              <a
                v-if="currentStudy?.file_url"
                :href="currentStudy.file_url"
                target="_blank"
                download
                class="tool-btn tool-btn--link"
                title="Descargar en resolución original"
              >
                ⬇️ Descargar
              </a>
            </div>
          </div>

          <!-- Media Display Viewport -->
          <div class="media-viewport" ref="viewportRef">
            <!-- Loading state -->
            <div v-if="!currentStudy" class="empty-study-state">
              <span class="empty-icon">📁</span>
              <p>No se ha seleccionado ningún estudio o placa.</p>
            </div>

            <!-- Image View (X-Ray / Ultrasound / Blood panel photo) -->
            <div
              v-else-if="isImage(currentStudy.file_url)"
              class="image-canvas-wrapper"
              :style="{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                filter: `invert(${isInverted ? 1 : 0}) grayscale(${isGrayscale ? 1 : 0})`
              }"
            >
              <img
                :src="currentStudy.file_url"
                :alt="currentStudy.title"
                class="study-main-img"
              />
            </div>

            <!-- PDF Viewer -->
            <div v-else-if="isPdf(currentStudy.file_url)" class="pdf-wrapper">
              <iframe
                :src="currentStudy.file_url"
                class="pdf-frame"
                title="Informe PDF"
              ></iframe>
            </div>

            <!-- Fallback generic file -->
            <div v-else class="generic-file-box">
              <span class="file-icon">📄</span>
              <h3>{{ currentStudy.title }}</h3>
              <p>{{ currentStudy.file_type || 'Documento adjunto' }}</p>
              <a :href="currentStudy.file_url" target="_blank" class="btn-primary">
                Abrir Archivo Externo
              </a>
            </div>
          </div>

          <!-- Bottom Filmstrip / Thumbnails Gallery -->
          <div class="study-filmstrip" v-if="studies.length > 1">
            <button
              v-for="(study, idx) in studies"
              :key="study.id || idx"
              type="button"
              class="filmstrip-thumb"
              :class="{ 'filmstrip-thumb--active': selectedIndex === idx }"
              @click="selectedIndex = idx"
            >
              <img
                v-if="isImage(study.file_url)"
                :src="study.thumbnail_url || study.file_url"
                :alt="study.title"
                class="thumb-img"
              />
              <div v-else class="thumb-placeholder">
                {{ getCategoryIcon(study.category) }}
              </div>
              <div class="thumb-caption">
                <span class="thumb-cat">{{ study.category }}</span>
                <span class="thumb-title">{{ study.title }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Right Side: Medical Findings & Clinical Report Panel -->
        <div class="viewer-sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-heading">📋 Información del Estudio</h3>
            <div class="info-grid font-mono-numbers">
              <div class="info-item">
                <span class="info-lbl">Categoría</span>
                <span class="info-val capitalize">{{ currentStudy?.category }}</span>
              </div>
              <div class="info-item">
                <span class="info-lbl">Fecha de Toma</span>
                <span class="info-val">{{ formatDate(currentStudy?.study_date || currentStudy?.created_at) }}</span>
              </div>
              <div class="info-item" v-if="currentStudy?.file_size">
                <span class="info-lbl">Tamaño</span>
                <span class="info-val">{{ (currentStudy.file_size / (1024 * 1024)).toFixed(2) }} MB</span>
              </div>
            </div>
          </div>

          <!-- Findings & Report -->
          <div class="sidebar-section sidebar-section--grow">
            <h3 class="sidebar-heading">🔬 Informe y Hallazgos Radiológicos</h3>
            <div class="findings-box">
              <p v-if="currentStudy?.findings" class="findings-text">
                {{ currentStudy.findings }}
              </p>
              <div v-else class="findings-empty">
                <em>Sin observaciones o informe radiológico redactado.</em>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="sidebar-footer">
            <button
              type="button"
              class="btn-outline-danger btn-block"
              @click="handleDeleteStudy"
              v-if="currentStudy?.id"
            >
              🗑️ Eliminar Estudio
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- Upload New Study Modal Sub-component -->
    <div v-if="isUploadModalOpen" class="upload-modal-backdrop" @click.self="isUploadModalOpen = false">
      <div class="upload-modal-dialog">
        <div class="upload-header">
          <h3 class="upload-title">📤 Adjuntar Nuevo Estudio o Placa</h3>
          <button type="button" class="upload-close" @click="isUploadModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleUploadSubmit" class="upload-form">
          <div class="form-group">
            <label class="form-label">Tipo de Estudio *</label>
            <select v-model="uploadForm.category" class="form-select" required>
              <option value="radiografia">🩻 Radiografía (Rayos X)</option>
              <option value="ecografia">🔊 Ecografía / Ultrasonido</option>
              <option value="sangre">🩸 Análisis de Sangre / Hemograma</option>
              <option value="orina">🧪 Urianálisis</option>
              <option value="biopsia">🔬 Biopsia / Citología</option>
              <option value="informe_escaneado">📄 Informe Escaneado / PDF</option>
              <option value="otro">📁 Otro Estudio</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Título del Estudio *</label>
            <input
              v-model="uploadForm.title"
              type="text"
              class="form-input"
              placeholder="Ej: Radiografía de Tórax Lateral y Ventrodorsal"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Fecha del Estudio</label>
            <input
              v-model="uploadForm.study_date"
              type="date"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Informe / Hallazgos Radiológicos</label>
            <textarea
              v-model="uploadForm.findings"
              rows="3"
              class="form-textarea"
              placeholder="Describa los hallazgos observados, densidad ósea, silueta cardíaca, órganos abdominales..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Seleccionar Archivo (Imagen o PDF) *</label>
            <div class="drop-zone" @click="triggerFileInput" :class="{ 'drop-zone--has-file': uploadForm.fileData }">
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*,application/pdf"
                class="hidden-file-input"
                @change="onFileSelected"
              />
              <div v-if="!uploadForm.fileData" class="drop-zone-content">
                <span class="drop-icon">📷</span>
                <p class="drop-text">Haga clic o arrastre una imagen de Rayos X o PDF</p>
                <span class="drop-sub">Formatos: JPG, PNG, WEBP, PDF (máx. 10MB)</span>
              </div>
              <div v-else class="file-preview-strip">
                <img v-if="uploadForm.fileType?.includes('image')" :src="uploadForm.fileData" class="preview-mini" />
                <span v-else class="preview-mini-icon">📄</span>
                <span class="preview-filename">{{ uploadForm.fileName }}</span>
                <button type="button" class="btn-clear-file" @click.stop="clearSelectedFile">✕</button>
              </div>
            </div>
          </div>

          <div class="upload-actions">
            <button type="button" class="btn-ghost" @click="isUploadModalOpen = false">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="isUploading || !uploadForm.fileData">
              {{ isUploading ? 'Subiendo...' : 'Guardar y Adjuntar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface ClinicalStudy {
  id?: string
  pet_id: string
  medical_record_id?: string
  category: 'radiografia' | 'ecografia' | 'sangre' | 'orina' | 'biopsia' | 'informe_escaneado' | 'otro'
  title: string
  findings?: string
  file_url: string
  thumbnail_url?: string
  file_type?: string
  file_size?: number
  study_date?: string
  created_at?: string
}

const props = defineProps<{
  isOpen: boolean
  petId: string
  studies: ClinicalStudy[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'studyAdded', study: ClinicalStudy): void
  (e: 'studyDeleted', studyId: string): void
}>()

const selectedIndex = ref(props.initialIndex || 0)
const zoomLevel = ref(1)
const rotation = ref(0)
const isInverted = ref(false)
const isGrayscale = ref(false)

// Upload Modal State
const isUploadModalOpen = ref(false)
const isUploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const uploadForm = ref({
  category: 'radiografia' as const,
  title: '',
  findings: '',
  study_date: new Date().toISOString().split('T')[0],
  fileData: '',
  fileName: '',
  fileType: ''
})

watch(() => props.initialIndex, (val) => {
  if (val !== undefined && val >= 0 && val < props.studies.length) {
    selectedIndex.value = val
  }
})

watch(() => props.isOpen, (val) => {
  if (val) {
    resetViewerControls()
  }
})

const currentStudy = computed(() => {
  if (!props.studies || props.studies.length === 0) return null
  return props.studies[selectedIndex.value] || props.studies[0]
})

function resetViewerControls() {
  zoomLevel.value = 1
  rotation.value = 0
  isInverted.value = false
  isGrayscale.value = false
}

function zoomIn() {
  if (zoomLevel.value < 4) zoomLevel.value += 0.25
}

function zoomOut() {
  if (zoomLevel.value > 0.5) zoomLevel.value -= 0.25
}

function resetZoom() {
  zoomLevel.value = 1
  rotation.value = 0
}

function rotateRight() {
  rotation.value = (rotation.value + 90) % 360
}

function isImage(url?: string) {
  if (!url) return false
  return (
    url.startsWith('data:image') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.png') ||
    url.endsWith('.webp') ||
    url.includes('unsplash.com') ||
    url.includes('images')
  )
}

function isPdf(url?: string) {
  if (!url) return false
  return url.startsWith('data:application/pdf') || url.endsWith('.pdf')
}

function getCategoryIcon(cat?: string) {
  switch (cat) {
    case 'radiografia': return '🩻'
    case 'ecografia': return '🔊'
    case 'sangre': return '🩸'
    case 'orina': return '🧪'
    case 'biopsia': return '🔬'
    case 'informe_escaneado': return '📄'
    default: return '📁'
  }
}

function getCategoryName(cat?: string) {
  switch (cat) {
    case 'radiografia': return 'Radiografía RX'
    case 'ecografia': return 'Ecografía'
    case 'sangre': return 'Hemograma / Sangre'
    case 'orina': return 'Urianálisis'
    case 'biopsia': return 'Biopsia / Citología'
    case 'informe_escaneado': return 'Informe PDF'
    default: return 'Estudio Clínico'
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadForm.value.fileName = file.name
  uploadForm.value.fileType = file.type

  const reader = new FileReader()
  reader.onload = () => {
    uploadForm.value.fileData = reader.result as string
    if (!uploadForm.value.title) {
      uploadForm.value.title = file.name.replace(/\.[^/.]+$/, '')
    }
  }
  reader.readAsDataURL(file)
}

function clearSelectedFile() {
  uploadForm.value.fileData = ''
  uploadForm.value.fileName = ''
  uploadForm.value.fileType = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function handleUploadSubmit() {
  if (!uploadForm.value.fileData || !props.petId) return
  isUploading.value = true

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:3030'

    const response = await $fetch<ClinicalStudy>(`${apiBase}/clinical-upload`, {
      method: 'POST',
      body: {
        pet_id: props.petId,
        category: uploadForm.value.category,
        title: uploadForm.value.title,
        findings: uploadForm.value.findings,
        study_date: uploadForm.value.study_date,
        file_data: uploadForm.value.fileData,
        file_name: uploadForm.value.fileName
      }
    })

    emit('studyAdded', response)
    isUploadModalOpen.value = false
    clearSelectedFile()
    uploadForm.value.title = ''
    uploadForm.value.findings = ''
    selectedIndex.value = props.studies.length // point to newly added
  } catch (err: any) {
    console.error('Error al subir estudio clínico:', err)
    alert('Error al guardar el archivo: ' + (err.message || 'Error de conexión'))
  } finally {
    isUploading.value = false
  }
}

async function handleDeleteStudy() {
  if (!currentStudy.value?.id) return
  if (!confirm(`¿Está seguro de eliminar el estudio "${currentStudy.value.title}"?`)) return

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:3030'

    await $fetch(`${apiBase}/clinical-attachments/${currentStudy.value.id}`, {
      method: 'DELETE'
    })

    emit('studyDeleted', currentStudy.value.id)
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  } catch (err: any) {
    console.error('Error al eliminar estudio:', err)
    alert('Error al eliminar: ' + err.message)
  }
}
</script>

<style scoped>
.study-viewer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4, 10, 8, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.study-viewer-container {
  width: 100%;
  max-width: 1400px;
  height: 92vh;
  background: #091310;
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.1);
  overflow: hidden;
}

/* Header */
.viewer-header {
  height: 4.25rem;
  padding: 0 1.5rem;
  background: #0d1a15;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.viewer-title-group {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.viewer-category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.viewer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f0fdf4;
  margin: 0;
}

.viewer-date {
  font-size: 0.8125rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.viewer-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.viewer-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.viewer-btn:hover {
  background: #10b981;
  color: #042f20;
}

.viewer-btn--close {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 0.5rem 0.75rem;
}

.viewer-btn--close:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

/* Body Layout */
.viewer-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 340px;
  overflow: hidden;
}

/* Center Stage */
.viewer-stage {
  position: relative;
  background: #020605;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

/* Stage Tools Pill */
.stage-tools-bar {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.tools-pill {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  background: rgba(13, 26, 21, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 9999px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.tool-btn {
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.6rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.tool-btn:hover {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.tool-btn--active {
  background: #10b981;
  color: #042f20;
}

.tool-val {
  font-size: 0.75rem;
  color: #34d399;
  padding: 0 0.35rem;
  font-weight: 700;
}

.tool-sep {
  width: 1px;
  height: 1rem;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.2rem;
}

/* Viewport Area */
.media-viewport {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  user-select: none;
}

.image-canvas-wrapper {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90%;
  max-height: 90%;
}

.study-main-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

.pdf-wrapper, .pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.empty-study-state, .generic-file-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #94a3b8;
  padding: 2rem;
  text-align: center;
}

.empty-icon, .file-icon {
  font-size: 3.5rem;
}

/* Filmstrip */
.study-filmstrip {
  height: 6.5rem;
  background: #08110e;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  overflow-x: auto;
}

.filmstrip-thumb {
  flex: 0 0 5.5rem;
  height: 5rem;
  background: #0d1a15;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  padding: 0;
}

.filmstrip-thumb:hover {
  border-color: rgba(16, 185, 129, 0.5);
}

.filmstrip-thumb--active {
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  font-size: 1.5rem;
}

.thumb-caption {
  position: absolute;
  bottom: 0;
  inset-x: 0;
  background: rgba(0, 0, 0, 0.75);
  font-size: 0.625rem;
  color: #fff;
  padding: 0.15rem 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* Sidebar */
.viewer-sidebar {
  background: #0a1411;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-section--grow {
  flex: 1;
}

.sidebar-heading {
  font-size: 0.875rem;
  font-weight: 700;
  color: #f0fdf4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  background: #070e0c;
  padding: 0.75rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
}

.info-lbl {
  color: #94a3b8;
}

.info-val {
  color: #e2e8f0;
  font-weight: 600;
}

.findings-box {
  background: #070e0c;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.625rem;
  padding: 1rem;
  min-height: 120px;
  flex: 1;
}

.findings-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #e2e8f0;
  margin: 0;
  white-space: pre-wrap;
}

.findings-empty {
  font-size: 0.8125rem;
  color: #64748b;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Upload Modal Sub-dialog */
.upload-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.upload-modal-dialog {
  width: 100%;
  max-width: 580px;
  background: #0d1a15;
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
}

.upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.upload-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f0fdf4;
  margin: 0;
}

.upload-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #cbd5e1;
}

.form-input, .form-select, .form-textarea {
  background: #070e0c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: #f8fafc;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #10b981;
}

.drop-zone {
  border: 2px dashed rgba(16, 185, 129, 0.35);
  background: rgba(16, 185, 129, 0.03);
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drop-zone:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.drop-icon {
  font-size: 2rem;
}

.drop-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0.25rem 0;
}

.drop-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.hidden-file-input {
  display: none;
}

.file-preview-strip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #070e0c;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.preview-mini {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.25rem;
}

.preview-filename {
  flex: 1;
  font-size: 0.8125rem;
  color: #e2e8f0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-clear-file {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: bold;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-primary {
  background: #10b981;
  color: #042f20;
  font-weight: 700;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #34d399;
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-ghost:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.btn-outline-danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-outline-danger:hover {
  background: #ef4444;
  color: #fff;
}

.btn-block {
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 900px) {
  .viewer-body {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  .viewer-sidebar {
    height: 250px;
  }
}
</style>

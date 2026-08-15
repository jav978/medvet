import type { Application } from '../../declarations'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

export interface UploadPayload {
  pet_id: string
  medical_record_id?: string
  category: 'radiografia' | 'ecografia' | 'sangre' | 'orina' | 'biopsia' | 'informe_escaneado' | 'otro'
  title: string
  findings?: string
  study_date?: string
  file_data: string // base64 data url (e.g. data:image/png;base64,... or data:application/pdf;base64,...)
  file_name: string
}

export class ClinicalUploadService {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  async create(data: UploadPayload) {
    const {
      pet_id,
      medical_record_id,
      category = 'radiografia',
      title,
      findings,
      study_date,
      file_data,
      file_name
    } = data

    if (!pet_id || !file_data || !title) {
      throw new Error('Faltan datos requeridos: pet_id, title y file_data son obligatorios')
    }

    // Ensure uploads directory exists
    const uploadsDir = path.resolve(__dirname, '../../../public/uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Parse base64 string
    const matches = file_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    let buffer: Buffer
    let mimeType = 'image/jpeg'
    let extension = '.jpg'

    if (matches && matches.length === 3) {
      mimeType = matches[1]
      buffer = Buffer.from(matches[2], 'base64')
      if (mimeType.includes('png')) extension = '.png'
      else if (mimeType.includes('pdf')) extension = '.pdf'
      else if (mimeType.includes('webp')) extension = '.webp'
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = '.jpg'
    } else {
      buffer = Buffer.from(file_data, 'base64')
    }

    const uniqueId = crypto.randomUUID()
    const sanitizedFileName = `${category}_${uniqueId.slice(0, 8)}_${Date.now()}${extension}`
    const filePath = path.join(uploadsDir, sanitizedFileName)

    // Save to disk
    fs.writeFileSync(filePath, buffer)

    // Relative web URL
    const fileUrl = `/uploads/${sanitizedFileName}`
    const fileSize = buffer.length

    // Save in clinical_attachments table
    const attachmentData: any = {
      pet_id,
      category,
      title,
      findings: findings || '',
      file_url: fileUrl,
      thumbnail_url: fileUrl,
      file_type: mimeType,
      file_size: fileSize,
      study_date: study_date || new Date().toISOString().split('T')[0]
    }

    if (medical_record_id) {
      attachmentData.medical_record_id = medical_record_id
    }

    const createdAttachment = await this.app.service('clinical-attachments').create(attachmentData)

    return createdAttachment
  }
}

export const clinicalUpload = (app: Application) => {
  app.use('clinical-upload', new ClinicalUploadService(app), {
    methods: ['create']
  })
}

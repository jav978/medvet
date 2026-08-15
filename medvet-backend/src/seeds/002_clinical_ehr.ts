import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Check if we have pets and professionals
  const pet = await knex('pets').first()
  const professional = await knex('professionals').first()

  if (!pet || !professional) {
    console.log('No pet or professional found to seed EHR data.')
    return
  }

  // Clear existing EHR sample data
  await knex('clinical_attachments').del()
  await knex('vaccinations').del()
  await knex('surgeries').del()
  await knex('medical_records').del()
  await knex('shift_handovers').del()

  // 1. Create a complete Medical Record (Consulta General / Urgencia)
  const [record1] = await knex('medical_records').insert({
    pet_id: pet.id,
    professional_id: professional.id,
    record_type: 'consulta',
    reason_for_visit: 'Control anual y chequeo por claudicación leve en miembro posterior derecho.',
    weight_kg: 28.5,
    temperature: 38.6,
    heart_rate: 95,
    respiratory_rate: 24,
    mucous_membranes: 'Rosadas y húmedas',
    capillary_refill_time: '<2s',
    anamnesis: 'Paciente canino macho castrado, presenta molestia al levantarse por las mañanas desde hace 4 días. Mantiene buen apetito y actividad general.',
    physical_exam_findings: 'Palpación de articulación coxofemoral derecha con ligera molestia. Sin signos de crepitación evidente. Reflejos espinales normales. Auscultación cardiopulmonar sin soplos.',
    presumptive_diagnosis: 'Posible distensión muscular vs osteoartritis incipiente.',
    definitive_diagnosis: 'Distensión ligamentosa leve en extremidad posterior derecha.',
    treatment_plan: 'Reposo relativo por 7 días. Meloxicam oral y condroprotectores.',
    medical_prescription: '1. Meloxicam 0.1 mg/kg cada 24h por 5 días con comida.\n2. Condroprotector Glucosamina + Condroitina 1 comprimido diario por 30 días.',
    patient_status: 'estable',
    notes: 'Programar control en 10 días si persiste la molestia.'
  }).returning('*')

  // 2. Create Clinical Attachments (X-Ray study + Blood panel)
  await knex('clinical_attachments').insert([
    {
      pet_id: pet.id,
      medical_record_id: record1.id,
      category: 'radiografia',
      title: 'Radiografía Lateral Coxofemoral y Fémur Derecho',
      findings: 'Sin pérdida de congruencia articular. Espacio interarticular conservado, sin presencia de osteofitos ni fracturas óseas visibles.',
      file_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=400&q=80',
      file_type: 'image/jpeg',
      file_size: 2450000,
      study_date: new Date().toISOString().split('T')[0]
    },
    {
      pet_id: pet.id,
      medical_record_id: record1.id,
      category: 'sangre',
      title: 'Perfil Bioquímico y Hemograma Completo',
      findings: 'Hematocrito: 44% (Normal), Leucocitos: 8.500/uL (Normal), ALT y Creatinina dentro de rangos normales.',
      file_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
      file_type: 'image/jpeg',
      file_size: 1120000,
      study_date: new Date().toISOString().split('T')[0]
    }
  ])

  // 3. Create Vaccinations (Carnet digital de vacunación)
  await knex('vaccinations').insert([
    {
      pet_id: pet.id,
      professional_id: professional.id,
      vaccine_name: 'Antirrábica Canina (Rabisin)',
      type: 'vacuna',
      batch_number: 'RAB-2026-981A',
      manufacturer: 'Boehringer Ingelheim',
      applied_date: '2026-03-15',
      next_due_date: '2027-03-15',
      status: 'aplicada',
      notes: 'Buena tolerancia, sin reacciones adversas posvacunales.'
    },
    {
      pet_id: pet.id,
      professional_id: professional.id,
      vaccine_name: 'Séxtuple Canina (DHPPi/L4)',
      type: 'vacuna',
      batch_number: 'HEX-8874-B',
      manufacturer: 'Zoetis Vanguard Plus',
      applied_date: '2026-04-10',
      next_due_date: '2027-04-10',
      status: 'aplicada',
      notes: 'Refuerzo anual completado con éxito.'
    },
    {
      pet_id: pet.id,
      professional_id: professional.id,
      vaccine_name: 'Desparasitación Interna (Simparica Trio)',
      type: 'desparasitacion',
      batch_number: 'ST-5541',
      manufacturer: 'Zoetis',
      applied_date: '2026-07-01',
      next_due_date: '2026-10-01',
      status: 'aplicada',
      notes: 'Comprimido masticable para 20-40 kg.'
    },
    {
      pet_id: pet.id,
      professional_id: professional.id,
      vaccine_name: 'Tos de las Perreras (KC Bronchicine)',
      type: 'refuerzo',
      batch_number: 'KC-1092-C',
      manufacturer: 'MSD Animal Health',
      applied_date: '2026-08-10',
      next_due_date: '2027-08-10',
      status: 'aplicada',
      notes: 'Intranasal aplicada sin complicaciones.'
    }
  ])

  // 4. Create Surgery Record
  await knex('surgeries').insert({
    pet_id: pet.id,
    professional_id: professional.id,
    medical_record_id: record1.id,
    surgery_name: 'Profilaxis Dental y Tartrectomía por Ultrasonido',
    surgery_type: 'ambulatoria',
    pre_op_evaluation: 'ASA I. Análisis prequirúrgicos normales. Ayuno de 8 horas cumplido.',
    anesthesia_protocol: 'Inducción con Propofol + Mantenimiento con Isoflurano. Monitorización continua con capnografía y ECG.',
    surgical_technique: 'Limpieza dental ultrasónica completa supragingival y subgingival con posterior pulido dental con pasta fluorada.',
    post_op_orders: 'Recuperación anestésica suave en sala de hospitalización de día. Alta médica a las 17:00 con dieta blanda.',
    status: 'completada',
    surgery_date: '2026-05-20 10:00:00'
  })

  // 5. Create Shift Handover (Entrega de Guardia 24/7)
  await knex('shift_handovers').insert({
    outgoing_vet_id: professional.id,
    incoming_vet_id: professional.id,
    shift_type: 'guardia_24h',
    shift_date: new Date().toISOString().split('T')[0],
    admitted_patients_count: 3,
    surgeries_count: 2,
    emergencies_count: 4,
    discharges_count: 1,
    critical_patients_notes: 'Box 2: Paciente felino "Milo" con obstrucción uretral, sonda permeable y fluidoterapia a 15 ml/h. Monitorizar gasto urinario cada 2h.',
    pending_tasks: '1. Repetir hematocrito en Box 1 a las 06:00.\n2. Administrar analgesia a Canino "Luna" (postoperatorio piometra) a las 04:00.',
    shift_summary: 'Turno de noche con 4 ingresos de urgencia. Todos los pacientes estables en observación.'
  })

  console.log('Clinical EHR Seed data created successfully!')
}

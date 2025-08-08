// ws-server.ts
import { WebSocketServer } from 'ws'
import { QueueEvents } from 'bullmq'
import mongoose from 'mongoose'
import { redis } from './src/lib/redis'
import Service from './src/models/service'

// Conecta ao MongoDB
async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('✅ MongoDB conectado')
  }
}
connectDB()

// Servidor WebSocket
const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', (ws) => {
  console.log('🔌 Cliente WebSocket conectado')
  ws.on('close', () => console.log('❌ Cliente WebSocket desconectado'))
})

// Função para atualizar no Mongo e emitir evento
async function updateServiceStatus(jobId: string, status: string, extra?: object) {
  await Service.findOneAndUpdate(
    { jobId }, // ou outro campo que relacione com o serviço
    { status, updated_at: new Date(), ...extra },
    { new: true }
  )

  broadcast({ jobId, status, ...extra })
}

// Envia para todos os clientes
function broadcast(data: any) {
  const message = JSON.stringify(data)
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message)
    }
  })
  console.log('📢 Evento enviado para clientes:', data)
}

// BullMQ Queue Events
const queueEvents = new QueueEvents('service-jobs', { connection: redis })

queueEvents.on('waiting', ({ jobId }) => updateServiceStatus(jobId, 'pending'))
queueEvents.on('active', ({ jobId }) => updateServiceStatus(jobId, 'running'))
queueEvents.on('completed', ({ jobId }) => updateServiceStatus(jobId, 'completed'))
queueEvents.on('failed', ({ jobId, failedReason }) =>
  updateServiceStatus(jobId, 'failed', { error: failedReason })
)

console.log('✅ WebSocket + BullMQ listener rodando na porta 3001')

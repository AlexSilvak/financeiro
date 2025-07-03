import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { BackupLog } from '@/models/backupLog'
import { connectDB } from "@/lib/mongodb";
// Configurações
const DB_NAME = 'financeirodb'
const MONGO_URI = 'mongodb://localhost:27017'
const BACKUP_DIR = path.join(process.cwd(), 'backups')



export async function GET() {
    await connectDB()
  
    try {
      const logs = await BackupLog.find().sort({ criado_em: -1 }).lean()
      return NextResponse.json({ success: true, logs })
    } catch (error) {
      return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    }
  }


export async function POST() {
    await connectDB()
  
    try {
      if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true })
      }
  
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const outputDir = path.join(BACKUP_DIR, `backup-${timestamp}`)
      const command = `mongodump --uri="${MONGO_URI}" --db="${DB_NAME}" --out="${outputDir}"`
  
      return new Promise((resolve) => {
        exec(command, async (error, stdout, stderr) => {
          const log = {
            nome: `backup-${timestamp}`,
            caminho: outputDir,
            status: error ? 'erro' : 'sucesso',
            mensagem: error ? error.message : stdout,
          }
  
          await BackupLog.create(log)
  
          if (error) {
            return resolve(
              NextResponse.json({ success: false, error: error.message }, { status: 500 })
            )
          }
  
          return resolve(
            NextResponse.json({ success: true, path: outputDir, stdout })
          )
        })
      })
    } catch (err) {
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
    }
  }
import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { BackupLog } from '@/models/backupLog'
import { connectDB } from '@/lib/mongodb'

const DB_NAME = 'financeirodb'
const MONGO_URI = 'mongodb://localhost:27017'
const BACKUP_DIR = path.join(process.cwd(), 'backups')

export async function POST() {
  await connectDB()

  try {
    const backups = fs
      .readdirSync(BACKUP_DIR)
      .filter(name => name.startsWith('backup-'))
      .sort()
      .reverse()

    if (backups.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhum backup encontrado.' }, { status: 404 })
    }

    const lastBackup = backups[0]
    const restorePath = path.join(BACKUP_DIR, lastBackup, DB_NAME)

    if (!fs.existsSync(restorePath)) {
      return NextResponse.json({ success: false, error: 'Diretório do backup não encontrado.' }, { status: 404 })
    }

    const command = `mongorestore --uri="${MONGO_URI}" --db="${DB_NAME}" --drop "${restorePath}"`

    return new Promise((resolve) => {
      exec(command, async (error, stdout, stderr) => {
        const log = new BackupLog({
          nome: `restaurado-${new Date().toISOString()}`,
          caminho: restorePath,
          status: error ? 'erro' : 'restaurado',
          mensagem: error ? error.message : stdout,
        })

        await log.save()

        if (error) {
          return resolve(
            NextResponse.json({ success: false, error: error.message }, { status: 500 })
          )
        }

        return resolve(
          NextResponse.json({ success: true, path: restorePath })
        )
      })
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

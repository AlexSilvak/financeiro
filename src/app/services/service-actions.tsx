'use client'

import { Service } from './types'
import { Button } from '@/components/ui/button'
import { PlayIcon, RotateCwIcon, StopCircleIcon } from 'lucide-react'

interface Props {
  service: Service
}

export function ServiceActions({ service }: Props) {
  const handleStart = () => {
    console.log('Start service', service.id)
  }

  const handleStop = () => {
    console.log('Stop service', service.id)
  }

  const handleRestart = () => {
    console.log('Restart service', service.id)
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleStart}><PlayIcon className="w-4 h-4" /></Button>
      <Button size="sm" variant="outline" onClick={handleRestart}><RotateCwIcon className="w-4 h-4" /></Button>
      <Button size="sm" variant="outline" onClick={handleStop}><StopCircleIcon className="w-4 h-4" /></Button>
    </div>
  )
}

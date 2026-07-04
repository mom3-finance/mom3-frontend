'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { Button } from './button'

interface SwipeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

function PrimarySwipeButton({ children, asChild = false, className, ...props }: SwipeButtonProps) {
  return (
    <Button
      asChild={asChild}
      variant='gradient'
      className={cn(
        'relative h-10 overflow-hidden rounded-full px-6 text-base font-semibold text-white shadow-[inset_0_-3px_6px_0px_rgba(255,255,255,0.45),0_8px_20px_-8px_rgba(59,51,189,0.55)] ring-2 ring-[#3B33BD]/60 duration-500 text-shadow-xs hover:shadow-[inset_0_-3px_6px_-2px_rgba(255,255,255,0.45),0_10px_24px_-8px_rgba(59,51,189,0.65)] active:translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

function SecondarySwipeButton({ children, asChild = false, className, ...props }: SwipeButtonProps) {
  return (
    <Button
      asChild={asChild}
      className={cn(
        'relative h-10 overflow-hidden rounded-full bg-[#3B33BD]/10 px-6 text-base font-semibold text-[#3B33BD] shadow-[inset_0_-3px_6px_0px_rgba(255,255,255,1)] ring-2 ring-[#3B33BD]/60 duration-500 hover:bg-[#3B33BD]/15 hover:shadow-[inset_0_-3px_6px_-2px_rgba(255,255,255,1)] active:translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export { PrimarySwipeButton, SecondarySwipeButton, type SwipeButtonProps }

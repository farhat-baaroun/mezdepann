'use client';

import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={true}
      richColors
      theme="dark"
      toastOptions={{
        classNames: {
          toast: 'bg-charcoal border border-white/10 text-white',
          title: 'text-white',
          description: 'text-gray-400',
          success: 'bg-green-500/10 border-green-500/20 text-green-400',
          error: 'bg-red-500/10 border-red-500/20 text-red-400',
          actionButton: 'bg-accent hover:bg-accent/80',
          cancelButton: 'bg-gray-600 hover:bg-gray-700',
        },
        duration: 4000,
      }}
    />
  );
}


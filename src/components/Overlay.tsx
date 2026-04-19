import type { ReactNode } from 'react';

interface OverlayProps {
  visible: boolean;
  children: ReactNode;
  zIndex?: 'z-40' | 'z-50';
  interactive?: boolean;
}

export function Overlay({ visible, children, zIndex = 'z-40', interactive = false }: OverlayProps) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity ease-in-out ${
        interactive ? '' : 'pointer-events-none'
      } ${visible ? 'opacity-100 duration-150' : 'opacity-0 duration-500 pointer-events-none'}`}
    >
      <div
        className={`bg-white rounded-3xl px-14 py-10 text-center shadow-2xl transition-transform ease-in-out ${
          visible ? 'scale-100 duration-200' : 'scale-95 duration-500'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

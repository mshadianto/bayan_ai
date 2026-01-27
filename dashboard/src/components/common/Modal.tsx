import { ReactNode, useEffect, useCallback, useRef, useState } from 'react';
import { X, GripHorizontal } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  footer?: ReactNode;
}

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}: ModalProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      setPosition(null);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const modal = modalRef.current;
    if (!modal) return;

    const rect = modal.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left + rect.width / 2 - window.innerWidth / 2,
      initialY: rect.top + rect.height / 2 - window.innerHeight / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  if (!isOpen) return null;

  const transformStyle = position
    ? { transform: `translate(${position.x}px, ${position.y}px)` }
    : {};

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal wrapper - centers content */}
      <div className="min-h-full flex items-center justify-center p-4">
        {/* Modal content */}
        <div
          ref={modalRef}
          style={transformStyle}
          className={`relative bg-slate-800 rounded-2xl border border-slate-700 w-full ${SIZE_CLASSES[size]} max-h-[85vh] flex flex-col shadow-2xl animate-modal-slide-up`}
        >
          {/* Header - draggable */}
          <div
            className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800 rounded-t-2xl cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <GripHorizontal size={16} className="text-slate-500" />
              <h2 id="modal-title" className="text-lg font-semibold text-white pr-8 truncate">
                {title}
              </h2>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body - scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 overscroll-contain">
            {children}
          </div>

          {/* Footer - sticky */}
          {footer && (
            <div className="flex-shrink-0 p-4 border-t border-slate-700 flex justify-end gap-3 bg-slate-800 rounded-b-2xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Button presets for modal footer
export function ModalButton({
  children,
  onClick,
  variant = 'secondary',
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
    secondary: 'bg-slate-700 text-slate-300 hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

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
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      setPosition(null);
      positionRef.current = { x: 0, y: 0 };
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  // Unified move handler (mouse + touch)
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    const newX = positionRef.current.x + dx;
    const newY = positionRef.current.y + dy;
    setPosition({ x: newX, y: newY });
  }, []);

  // Unified end handler
  const handleEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Save final position for next drag
    setPosition(prev => {
      if (prev) positionRef.current = prev;
      return prev;
    });
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }, []);

  // Mouse event wrappers
  const onMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const onMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch event wrappers
  const onTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Start drag (mouse)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    // Save current position as starting point
    setPosition(prev => {
      positionRef.current = prev || { x: 0, y: 0 };
      return prev;
    });
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [onMouseMove, onMouseUp]);

  // Start drag (touch)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    isDragging.current = true;
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    setPosition(prev => {
      positionRef.current = prev || { x: 0, y: 0 };
      return prev;
    });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }, [onTouchMove, onTouchEnd]);

  if (!isOpen) return null;

  const transformStyle = position
    ? { transform: `translate(${position.x}px, ${position.y}px)` }
    : {};

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
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
      <div className="h-full flex items-center justify-center p-2 pointer-events-none">
        {/* Modal content */}
        <div
          ref={modalRef}
          style={transformStyle}
          className={`pointer-events-auto relative bg-input rounded-2xl border border-border w-full ${SIZE_CLASSES[size]} max-h-[96vh] flex flex-col shadow-2xl animate-modal-slide-up`}
        >
          {/* Header - draggable */}
          <div
            className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-input rounded-t-2xl cursor-grab active:cursor-grabbing select-none touch-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="flex items-center gap-2">
              <GripHorizontal size={16} className="text-content-muted" />
              <h2 id="modal-title" className="text-lg font-semibold text-content pr-8 truncate">
                {title}
              </h2>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-content-secondary hover:text-content hover:bg-hover transition-colors"
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
            <div className="flex-shrink-0 p-4 border-t border-border flex justify-end gap-3 bg-input rounded-b-2xl">
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
    secondary: 'bg-hover text-content-tertiary hover:bg-border-subtle',
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

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  caption: string;
  imageSrc?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  caption,
  imageSrc
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#161616]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-[#D8D8D3] rounded-2xl shadow-neu-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#D8D8D3]">
          <span className="font-display font-bold text-sm text-[#161616]">
            {caption || 'Gallery Item'}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#777777] hover:text-[#161616] cursor-pointer transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full h-80 rounded-xl bg-[#161616] flex items-center justify-center p-6 overflow-hidden">
          <img
            src={
              imageSrc ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAbeELhIPWjSf8CNYtdCMVuXWC-Cz_Lpgax7SF8KkNmvK1CVbKNkgLLvJImRINdXQGe4vY-02CPXq3BKsXDkZ5A3uqCjPlCnBYlVtDXOd2nI0w8MzwU-aNIZaUfJoCYijWueXiu_d1WiVaNL5x2OlwW6u0veK_fPfx8KPHU3j_FPIeTx81x0uiiC87gzNDQwYFkK8JDCIQo1wwwk3iQujdMZ3tr1I290QOaEJbH1oVjUsAxytAfIGglS2xkW2UwKSS03nc'
            }
            alt={caption}
            className="max-h-full object-contain filter grayscale contrast-110"
          />
        </div>

        <span className="text-xs text-[#777777] font-mono text-center">
          IES IEDC Institutional Photo Archive • APJ KTU & KSUM Certified
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { INITIAL_SITE_CONTENT } from '../constants';

interface FloatingWhatsAppButtonProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ whatsappNumber, whatsappMessage }) => {
  const finalWhatsappNumber = whatsappNumber || INITIAL_SITE_CONTENT.whatsappNumber;
  const finalWhatsappMessage = whatsappMessage || INITIAL_SITE_CONTENT.whatsappMessage || 'Olá! Tenho interesse nos seus produtos.';

  if (!finalWhatsappNumber) {
    return null;
  }
  
  const whatsappLink = `https://wa.me/${finalWhatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(finalWhatsappMessage)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 z-50 transition-transform transform hover:scale-110"
      aria-label="Contatar no WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
};
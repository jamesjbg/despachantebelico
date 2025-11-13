import React from 'react';
import { INSTAGRAM_URL } from '../constants';
import { InstagramIcon } from './icons/InstagramIcon';

interface FooterProps {
  companyName: string;
}

export const Footer: React.FC<FooterProps> = ({ companyName }) => {
  return (
    <footer className="bg-secondary text-base-content p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} {companyName}</p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-2 hover:text-accent"
          aria-label="Nosso Instagram"
        >
          <InstagramIcon />
          <span>Nos siga no Instagram</span>
        </a>
      </div>
    </footer>
  );
};

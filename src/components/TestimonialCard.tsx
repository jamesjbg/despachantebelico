
import React from 'react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md flex flex-col items-center text-center h-full">
      <div className="text-5xl text-accent mb-4">"</div>
      <p className="text-base-content/80 mb-4 flex-grow">{testimonial.text || 'Este cliente não deixou um comentário.'}</p>
      <div className="mt-auto pt-4">
        {testimonial.imageUrl && (
            <img 
                src={testimonial.imageUrl} 
                alt={testimonial.author || 'Foto do autor'} 
                className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
            />
        )}
        <h4 className="font-semibold text-base-content">{testimonial.author || 'Autor Anônimo'}</h4>
      </div>
    </div>
  );
};

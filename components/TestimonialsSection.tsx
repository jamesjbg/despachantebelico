
import React from 'react';
import { Testimonial } from '../types';
import { TestimonialCard } from './TestimonialCard';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (testimonials.length === 0) return null;
  
  return (
    <section className="bg-base-100 py-8 md:py-12">
        <div className="container mx-auto p-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-base-content">O que nossos clientes dizem</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
            </div>
        </div>
    </section>
  );
};

import React from 'react';

interface AboutSectionProps {
    content: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
    return (
        <section className="container mx-auto p-4 py-8 md:py-12">
            <div className="bg-secondary/50 p-8 rounded-lg shadow-sm text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Sobre Nós</h2>
                <p className="text-base-content max-w-3xl mx-auto leading-relaxed">
                    {content}
                </p>
            </div>
        </section>
    );
};

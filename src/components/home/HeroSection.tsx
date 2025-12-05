
import React from 'react';
import { Button } from '../ui/button';

interface HeroSectionProps {
  title?: string;
  content?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title = "Онлайн-школа для подготовки профессионалов в сфере IT", 
  content = "Все онлайн-школы говорят о высоком качестве\nМы так не говорим, за нас это сделают наши студенты"
}) => {
  const scrollToConsultation = () => {
    const consultationSection = document.getElementById('consultation');
    if (consultationSection) {
      consultationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-nsuem-dark/0 to-nsuem-dark pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/public/code.jpg')] bg-cover bg-center opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-7xl text-center z-10 animate-fade-in">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-regular leading-tight mb-10">
          {title}
        </h1>
        
        <p className="text-xl font-light text-gray-300 mb-16 whitespace-pre-line">
          {content}
        </p>

        <Button 
          onClick={scrollToConsultation}
          className="bg-nsuem-orange hover:bg-nsuem-orange/90 text-white font-light text-lg px-8 py-6 h-4 w-23 rounded-3xl"
        >
          Записаться на консультацию
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;

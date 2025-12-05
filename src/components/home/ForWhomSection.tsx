
import React from 'react';
// import { Star, Calendar, Book, Code, Gift, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

import starIcon from '/public/star.png';
import calendarIcon from '/public/calendar.png';
import folderIcon from '/public/folder.png';
import bookIcon from '/public/book.png';
import suitcaseIcon from '/public/suitcase.png';
import clockIcon from '/public/clock.png';

interface AudienceItem {
  id: number;
  title: string;
  description: string;
  icon: string | React.ReactNode;
}

const audienceItems: AudienceItem[] = [
  {
    id: 1,
    title: '',
    description: 'Желающие сменить профессию или расширить свои навыки',
    icon: <img src={starIcon} alt="Star Icon" className="w-12 h-12" />
  },
  {
    id: 2,
    title: '',
    description: 'Планирующие сменить сферу деятельности',
    icon: <img src={calendarIcon} alt="Star Icon" className="w-12 h-12" />
  },
  {
    id: 3,
    title: '',
    description: 'Желающие пополнить свои профессиональные знания',
    icon: <img src={folderIcon} alt="Star Icon" className="w-12 h-12" />
  },
  {
    id: 4,
    title: '',
    description: 'Для абсолютных новичков, которые будут делать первые шаги в IT',
    icon: <img src={bookIcon} alt="Star Icon" className="w-12 h-12" />
  },
  {
    id: 5,
    title: '',
    description: 'Начинающие программисты, которым необходимо пополнять знания',
    icon: <img src={suitcaseIcon} alt="Star Icon" className="w-12 h-12" />
  },
  {
    id: 6,
    title: '',
    description: 'Для людей, которым подходит индивидуальный темп обучения',
    icon: <img src={clockIcon} alt="Star Icon" className="w-12 h-12" />
  }
];

const ForWhomSection: React.FC = () => {
  return (
    <section className="py-20 px-8 bg-nsuem-gray">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold mb-16 text-left">
          <span className="text-nsuem-orange">ДЛЯ КОГО</span>
          <span className="text-white"> НАША ШКОЛА?</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audienceItems.map((item) => (
            <Card 
              key={item.id} 
              className="glass-card border-0 bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xl text-white">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;

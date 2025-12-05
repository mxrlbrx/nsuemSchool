
import React from 'react';

import petrovPhoto from '/public/mentors/1petrov_artem.png';
import pyatnizevPhoto from '/public/mentors/2pyatnizev_danil.png';
import kosyrevPhoto from '/public/mentors/3kosyrev_evgeniy.png';
import myroshnikovPhoto from '/public/mentors/4miroshnikov_andrey.png';
import stepanovPhoto from '/public/mentors/5stepanov_andrey.png';
import gorbenkoPhoto from '/public/mentors/6alexey_gorbenko.png';
import suhorukovPhoto from '/public/mentors/7suhorukov_konstantin.png';
import cherepovaPhoto from '/public/mentors/8cherepova_july.png';
import tereshenkoPhoto from '/public/mentors/9tereshenko_sergey.png';
import streltzovPhoto from '/public/mentors/10streltzov_evgeniy.png';
import kotovaPhoto from '/public/mentors/11kotova_anastasia.png';


interface MentorProps {
  name: string;
  photo: string;
  bio: string;
}

const mentors: MentorProps[] = [
  {
    name: 'Петров Артём',
    photo: petrovPhoto,
    bio: 'Занимаюсь обучением и развитием навыков заработка. Научу зарабатывать 100 000+ с первого курса'
  },
  {
    name: 'Пятницев Данил',
    photo: pyatnizevPhoto,
    bio: 'Создадим крутой сайт вместе и опубликуем его в интернете'
  },
  {
    name: 'Косырев Евгений',
    photo: kosyrevPhoto,
    bio: 'Расскажу, как стать senior в крутой компании с заработком от 400 000 и выше'
  },
  {
    name: 'Мирошников Андрей',
    photo: myroshnikovPhoto,
    bio: 'Познакомимся с основными алгоритмами машинного обучения и не только'
  },
  {
    name: 'Степанов Андрей',
    photo: stepanovPhoto,
    bio: 'Научу быстро программировать, делать стартапы в области БПЛА, создавать чат-бота и продвигать себя, как специалиста'
  },
  {
    name: 'Алексей Горбенко',
    photo: gorbenkoPhoto,
    bio: 'Создадим игру с нуля вместе и опубликем ее на различных платформах'
  },
  {
    name: 'Сухоруков Константин',
    photo: suhorukovPhoto,
    bio: 'Занимаюсь обучением начинающих предпринимателей. Вместе запустим стартап'
  },
  {
    name: 'Черепова Юлия',
    photo: cherepovaPhoto,
    bio: 'Обучу, как стать менеджером проекта в международной айти компании'
  },
  {
    name: 'Терещенко Сергей',
    photo: tereshenkoPhoto,
    bio: 'Расскажу, как выводить компанию на международный рынок и как искать работу за границей'
  },
  {
    name: 'Стрельцов Евгений',
    photo: streltzovPhoto,
    bio: 'Помогу выстроить и преодолеть roadmap для устройства python backend разработчиком в крупную IT компанию'
  },
  {
    name: 'Котова Анастасия',
    photo: kotovaPhoto,
    bio: 'Работаю в IT с 4 курса. Знаю, как без опыта начать строить карьеру и найти работу мечты'
  }
];

const MentorsSection: React.FC = () => {
  return (
    <section className="py-20 px-8 bg-nsuem-gray">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold mb-16 text-left">
          <span className="text-nsuem-orange">МЕНТОРЫ</span>
          <span className="text-white"> НАШЕЙ ШКОЛЫ</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <div 
              key={index}
              className="glass-card border-0 bg-[#1E1E1E] border-0 rounded-2xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
                <img 
                  src={mentor.photo} 
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">
                {mentor.name}
              </h3>
              <p className="text-gray-300">
                {mentor.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorsSection;

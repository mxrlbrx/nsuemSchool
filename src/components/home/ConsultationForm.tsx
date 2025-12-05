
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import PhoneInput from '../PhoneInput';
import { db } from '@/services/database';
import { toast } from 'sonner';

const ConsultationForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+7 ');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || phone.length < 10) {
      toast.error('Пожалуйста, заполните все поля формы');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await db.addConsultationRequest({
        fullName,
        email,
        phone
      });
      
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('+7 ');
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast.error('Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div>
        <Label htmlFor="fullName" className="text-white text-base mb-2 block">
          Ваше имя
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="bg-nsuem-gray/50 border-nsuem-gray text-white h-12"
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-white text-base mb-2 block">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-nsuem-gray/50 border-nsuem-gray text-white h-12"
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-white text-base mb-2 block">
          Телефон
        </Label>
        <PhoneInput
          value={phone}
          onChange={setPhone}
          required
          className="bg-nsuem-gray/50 border-nsuem-gray text-white h-12"
        />
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-nsuem-orange hover:bg-nsuem-orange/90 transition-colors text-white text-lg font-light rounded-3xl"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
      </Button>
    </form>
  );
};

export default ConsultationForm;

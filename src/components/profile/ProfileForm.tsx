import React, { useState } from 'react';
import { toast } from 'sonner';
import { User } from '../../services/database';
import { Input } from '@/components/ui/input';
import PhoneInput from '@/components/PhoneInput';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProfileFormProps {
  user: User;
  updateProfile: (user: User) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, updateProfile }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [username, setUsername] = useState(user.username || '');
  const [birthdate, setBirthdate] = useState(user.birthdate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      updateProfile({
        ...user,
        fullName,
        email,
        phone,
        username,
        birthdate
      });
      
      toast.success('Профиль обновлен успешно');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedBirthdate = birthdate ? new Date(birthdate) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setBirthdate(format(date, 'yyyy-MM-dd'));
    } else {
      setBirthdate('');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium mb-4">Личные данные</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block mb-1">ФИО</label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="text-black"
          />
        </div>
        
        <div>
          <label htmlFor="username" className="block mb-1">Логин</label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-black"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-1">E-mail</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block mb-1">Телефон</label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            required
          />
        </div>
        
        <div>
          <label htmlFor="birthdate" className="block mb-1">Дата рождения</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left font-normal h-10 px-3 py-2 text-black bg-background border border-input hover:bg-accent hover:text-accent-foreground",
                  !parsedBirthdate && "text-muted-foreground"
                )}
              >
                <span>
                  {parsedBirthdate ? format(parsedBirthdate, 'dd.MM.yyyy') : 'дд.мм.гггг'}
                </span>
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-full p-0 z-50" 
              align="start" 
              side="bottom"
              sideOffset={4}
              avoidCollisions={false}
            >
              <Calendar
                mode="single"
                selected={parsedBirthdate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1950}
                toYear={new Date().getFullYear()}
                className="p-3 pointer-events-auto w-full"
                classNames={{
                  months: "flex flex-col space-y-4",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "hidden",
                  caption_dropdowns: "flex justify-center gap-1",
                  dropdown: "relative inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  dropdown_month: "mr-2",
                  dropdown_year: "",
                  nav: "hidden",
                  nav_button: "hidden",
                  nav_button_previous: "hidden",
                  nav_button_next: "hidden",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                  ),
                  day_range_end: "day-range-end",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="nsuem-button-primary w-full"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить данные'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;

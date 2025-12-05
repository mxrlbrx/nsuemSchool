
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  username?: string;
  password: string;
  birthdate?: string;
  isAdmin?: boolean;
}

export interface ConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'Принят' | 'На рассмотрении' | 'Отклонен';
  date: string;
}

export interface SiteContent {
  id: string;
  section: string;
  title?: string;
  content?: string;
  imageUrl?: string;
}

class DatabaseService {
  private currentUserKey = 'nsuem_current_user';
  
  constructor() {
  }
  
  // User Authentication Methods
  async register(user: Omit<User, 'id' | 'isAdmin'>): Promise<User | null> {
    try {
      const { data: existingEmailUsers } = await supabase
        .from('NSUEM_users')
        .select('*')
        .eq('email', user.email);
      
      if (existingEmailUsers && existingEmailUsers.length > 0) {
        toast.error('Пользователь с таким email уже существует');
        return null;
      }

      if (user.username) {
        const { data: existingUsernameUsers } = await supabase
          .from('NSUEM_users')
          .select('*')
          .eq('username', user.username);
        
        if (existingUsernameUsers && existingUsernameUsers.length > 0) {
          toast.error('Пользователь с таким логином уже существует');
          return null;
        }
      }
      
      const { data, error } = await supabase
        .from('NSUEM_users')
        .insert([
          {
            full_name: user.fullName,
            email: user.email,
            tel: user.phone,
            username: user.username,
            password: user.password,
            birthdate: user.birthdate || null
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Registration error:', error);
        toast.error('Ошибка при регистрации: ' + error.message);
        return null;
      }
      
      const newUser: User = {
        id: data.id.toString(),
        fullName: data.full_name,
        email: data.email,
        phone: data.tel,
        username: data.username,
        password: data.password,
        birthdate: data.birthdate,
        isAdmin: false
      };
      
      localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
      
      toast.success('Регистрация успешна');
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Ошибка при регистрации');
      return null;
    }
  }
  
  async login(loginIdentifier: string, password: string): Promise<User | null> {
    try {
      if (loginIdentifier === "admin" && password === "nsuemadmin54") {
        const adminUser: User = {
          id: "admin",
          fullName: "Administrator",
          email: "admin@nsuem.ru",
          phone: "+7 (000) 000-00-00",
          username: "admin",
          password: "nsuemadmin54",
          isAdmin: true
        };
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(adminUser));
        toast.success('Вход выполнен успешно');
        return adminUser;
      }

      let { data, error } = await supabase
        .from('NSUEM_users')
        .select('*')
        .eq('email', loginIdentifier)
        .eq('password', password)
        .maybeSingle();
      
      if (!data) {
        const result = await supabase
          .from('NSUEM_users')
          .select('*')
          .eq('username', loginIdentifier)
          .eq('password', password)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      if (error || !data) {
        console.error('Login error:', error);
        return null;
      }
      
      const user: User = {
        id: data.id.toString(),
        fullName: data.full_name,
        email: data.email,
        phone: data.tel,
        username: data.username,
        password: data.password,
        birthdate: data.birthdate,
        isAdmin: false
      };
      
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      toast.success('Вход выполнен успешно');
      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ошибка при входе');
      return null;
    }
  }
  
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    toast.success('Выход выполнен успешно');
  }
  
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.currentUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }
  
  async updateCurrentUser(user: User): Promise<void> {
    try {
      if (user.id === "admin") {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        toast.success('Профиль обновлен');
        return;
      }
      
      const { error } = await supabase
        .from('NSUEM_users')
        .update({
          full_name: user.fullName,
          email: user.email,
          tel: user.phone,
          username: user.username,
          password: user.password,
          birthdate: user.birthdate || null
        })
        .eq('id', parseInt(user.id));
      
      if (error) {
        console.error('Update user error:', error);
        toast.error('Ошибка при обновлении профиля: ' + error.message);
        return;
      }
      
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      toast.success('Профиль обновлен');
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Ошибка при обновлении профиля');
    }
  }
  
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('NSUEM_users')
        .select('*');
      
      if (error) {
        console.error('Get users error:', error);
        toast.error('Ошибка при получении пользователей');
        return [];
      }
      
      return data.map(user => ({
        id: user.id.toString(),
        fullName: user.full_name,
        email: user.email,
        phone: user.tel,
        username: user.username,
        password: user.password,
        birthdate: user.birthdate,
        isAdmin: false
      }));
    } catch (error) {
      console.error('Get users error:', error);
      toast.error('Ошибка при получении пользователей');
      return [];
    }
  }
  
  async addUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      // Check if email already exists
      const { data: existingEmailUsers } = await supabase
        .from('NSUEM_users')
        .select('*')
        .eq('email', user.email);
      
      if (existingEmailUsers && existingEmailUsers.length > 0) {
        toast.error('Пользователь с таким email уже существует');
        throw new Error('Email already exists');
      }
      
      // Check if username already exists
      if (user.username) {
        const { data: existingUsernameUsers } = await supabase
          .from('NSUEM_users')
          .select('*')
          .eq('username', user.username);
        
        if (existingUsernameUsers && existingUsernameUsers.length > 0) {
          toast.error('Пользователь с таким логином уже существует');
          throw new Error('Username already exists');
        }
      }
      
      const { data, error } = await supabase
        .from('NSUEM_users')
        .insert([
          {
            full_name: user.fullName,
            email: user.email,
            tel: user.phone,
            username: user.username,
            password: user.password,
            birthdate: user.birthdate || null
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Add user error:', error);
        toast.error('Ошибка при добавлении пользователя: ' + error.message);
        throw error;
      }
      
      toast.success('Пользователь добавлен');
      
      return {
        id: data.id.toString(),
        fullName: data.full_name,
        email: data.email,
        phone: data.tel,
        username: data.username,
        password: data.password,
        birthdate: data.birthdate,
        isAdmin: user.isAdmin
      };
    } catch (error) {
      console.error('Add user error:', error);
      if (error instanceof Error && (error.message === 'Email already exists' || error.message === 'Username already exists')) {
        throw error;
      }
      toast.error('Ошибка при добавлении пользователя');
      throw error;
    }
  }
  
  async updateUser(user: User): Promise<void> {
    try {
      const { data: existingEmailUsers } = await supabase
        .from('NSUEM_users')
        .select('*')
        .eq('email', user.email)
        .neq('id', parseInt(user.id));
      
      if (existingEmailUsers && existingEmailUsers.length > 0) {
        toast.error('Пользователь с таким email уже существует');
        return;
      }
      
      if (user.username) {
        const { data: existingUsernameUsers } = await supabase
          .from('NSUEM_users')
          .select('*')
          .eq('username', user.username)
          .neq('id', parseInt(user.id));
        
        if (existingUsernameUsers && existingUsernameUsers.length > 0) {
          toast.error('Пользователь с таким логином уже существует');
          return;
        }
      }
      
      const { error } = await supabase
        .from('NSUEM_users')
        .update({
          full_name: user.fullName,
          email: user.email,
          tel: user.phone,
          username: user.username,
          password: user.password,
          birthdate: user.birthdate || null
        })
        .eq('id', parseInt(user.id)); // Convert string to number
      
      if (error) {
        console.error('Update user error:', error);
        toast.error('Ошибка при обновлении пользователя: ' + error.message);
        return;
      }
      
      toast.success('Пользователь обновлен');
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Ошибка при обновлении пользователя');
    }
  }
  
  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('NSUEM_users')
        .delete()
        .eq('id', parseInt(id)); // Convert string to number
      
      if (error) {
        console.error('Delete user error:', error);
        toast.error('Ошибка при удалении пользователя: ' + error.message);
        return;
      }
      
      toast.success('Пользователь удален');
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Ошибка при удалении пользователя');
    }
  }
  
  // Consultation Request Methods - now using Supabase
  async getConsultationRequests(): Promise<ConsultationRequest[]> {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Get consultation requests error:', error);
        toast.error('Ошибка при получении заявок');
        return [];
      }
      
      return data.map(request => ({
        id: request.id.toString(),
        fullName: request.full_name,
        email: request.email,
        phone: request.phone,
        status: request.status as 'Принят' | 'На рассмотрении' | 'Отклонен',
        date: request.date || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Get consultation requests error:', error);
      toast.error('Ошибка при получении заявок');
      return [];
    }
  }
  
  async addConsultationRequest(request: Omit<ConsultationRequest, 'id' | 'status' | 'date'>): Promise<ConsultationRequest> {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .insert({
          full_name: request.fullName,
          email: request.email,
          phone: request.phone,
          status: 'На рассмотрении',
          date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) {
        console.error('Add consultation request error:', error);
        toast.error('Ошибка при отправке заявки: ' + error.message);
        throw error;
      }
      
      toast.success('Заявка отправлена. Мы скоро свяжемся с вами!');
      
      return {
        id: data.id.toString(),
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        status: data.status as 'Принят' | 'На рассмотрении' | 'Отклонен',
        date: data.date
      };
    } catch (error) {
      console.error('Add consultation request error:', error);
      toast.error('Ошибка при отправке заявки');
      throw error;
    }
  }
  
  async updateConsultationRequest(request: ConsultationRequest): Promise<void> {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({
          full_name: request.fullName,
          email: request.email,
          phone: request.phone,
          status: request.status,
          date: request.date
        })
        .eq('id', parseInt(request.id));
        
      if (error) {
        console.error('Update consultation request error:', error);
        toast.error('Ошибка при обновлении заявки: ' + error.message);
        return;
      }
      
      toast.success('Заявка обновлена');
    } catch (error) {
      console.error('Update consultation request error:', error);
      toast.error('Ошибка при обновлении заявки');
    }
  }

  async updateConsultationRequestStatus(id: string, status: 'На рассмотрении' | 'Принят' | 'Отклонен'): Promise<void> {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status })
        .eq('id', parseInt(id));
        
      if (error) {
        console.error('Update consultation request status error:', error);
        toast.error('Ошибка при обновлении статуса заявки: ' + error.message);
        return;
      }
      
      toast.success('Статус заявки обновлен');
    } catch (error) {
      console.error('Update consultation request status error:', error);
      toast.error('Ошибка при обновлении статуса заявки');
    }
  }
  
  async deleteConsultationRequest(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .delete()
        .eq('id', parseInt(id));
        
      if (error) {
        console.error('Delete consultation request error:', error);
        toast.error('Ошибка при удалении заявки: ' + error.message);
        return;
      }
      
      toast.success('Заявка удалена');
    } catch (error) {
      console.error('Delete consultation request error:', error);
      toast.error('Ошибка при удалении заявки');
    }
  }
  
  // Site Content Methods - now using Supabase
  async getSiteContent(): Promise<SiteContent[]> {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');
        
      if (error) {
        console.error('Get site content error:', error);
        toast.error('Ошибка при получении контента');
        return [];
      }
      
      return data.map(content => ({
        id: content.id.toString(),
        section: content.section,
        title: content.title || '',
        content: content.content || '',
        imageUrl: content.image_url || ''
      }));
    } catch (error) {
      console.error('Get site content error:', error);
      toast.error('Ошибка при получении контента');
      return [];
    }
  }
  
  async updateSiteContent(content: SiteContent): Promise<void> {
    try {
      const { data: existingContent } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', content.section);
        
      if (existingContent && existingContent.length > 0) {
        // Update existing content
        const { error } = await supabase
          .from('site_content')
          .update({
            title: content.title,
            content: content.content,
            image_url: content.imageUrl
          })
          .eq('id', parseInt(content.id));
          
        if (error) {
          console.error('Update site content error:', error);
          toast.error('Ошибка при обновлении контента: ' + error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert([
            {
              section: content.section,
              title: content.title,
              content: content.content,
              image_url: content.imageUrl
            }
          ]);
          
        if (error) {
          console.error('Insert site content error:', error);
          toast.error('Ошибка при добавлении контента: ' + error.message);
          return;
        }
      }
      
      toast.success('Контент обновлен');
    } catch (error) {
      console.error('Update site content error:', error);
      toast.error('Ошибка при обновлении контента');
    }
  }
}

export const db = new DatabaseService();

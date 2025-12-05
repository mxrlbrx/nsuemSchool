
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Home,
  LogOut
} from 'lucide-react';

const menuItems = [
  {
    title: "На главную",
    url: "/",
    icon: Home,
  },
  {
    title: "Пользователи", 
    url: "/admin",
    icon: Users,
  },
  {
    title: "Заявки на консультацию",
    url: "/admin/consultation-requests",
    icon: MessageSquare,
  },
  {
    title: "Контент",
    url: "/admin/edit-content", 
    icon: Settings,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (url: string) => {
    if (url === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === url;
  };

  return (
    <div className="bg-nsuem-gray h-full">
      <Sidebar className="bg-nsuem-gray border-r border-white/10">
        <SidebarHeader className="p-6 bg-nsuem-gray">
          <Link to="/" className="flex items-center justify-center gap-2">
            <a href="#">
              <img src="/public/fullLogoLight.png" alt="nsuemLogo" />
            </a>
          </Link>
        </SidebarHeader>
        
        <SidebarContent className="bg-nsuem-gray">
          <SidebarGroup className="bg-nsuem-gray">
            <SidebarGroupContent className="bg-nsuem-gray">
              <SidebarMenu className="bg-nsuem-gray">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="bg-nsuem-gray">
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      className={`text-white/70 hover:text-white hover:bg-white/5 bg-nsuem-gray ${
                        isActive(item.url) ? 'bg-nsuem-orange text-white' : ''
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 p-3">
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-6 bg-nsuem-gray">
          <SidebarMenu className="bg-nsuem-gray">
            <SidebarMenuItem className="bg-nsuem-gray">
              <SidebarMenuButton 
                onClick={logout}
                className="text-white/70 hover:text-white hover:bg-white/5 bg-nsuem-gray"
              >
                <LogOut size={20} />
                <span>Выйти</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

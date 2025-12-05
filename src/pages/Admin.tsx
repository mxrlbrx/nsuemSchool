import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NewAdminLayout } from '../components/NewAdminLayout';
import { AddUserDialog } from '../components/AddUserDialog';
import { db, User } from '../services/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Loader2 } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccessAndLoad = async () => {
      if (user === null) {
        navigate('/');
        return;
      }
      
      if (user && !user.isAdmin) {
        navigate('/');
        return;
      }
      
      if (user && user.isAdmin) {
        setLoading(true);
        const usersData = await db.getUsers();
        setUsers(usersData);
        setLoading(false);
      }
    };
    
    checkAccessAndLoad();
  }, [user, navigate]);

  const loadUsers = async () => {
    const usersData = await db.getUsers();
    setUsers(usersData);
  };

  if (loading) {
    return (
      <NewAdminLayout title="Пользователи">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-nsuem-orange" />
          <span className="ml-2 text-white">Загрузка...</span>
        </div>
      </NewAdminLayout>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      await db.deleteUser(userId);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(userData =>
    userData.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.phone?.includes(searchTerm)
  );

  return (
    <NewAdminLayout title="Пользователи">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Управление пользователями</h2>
            <p className="text-white/70">Просмотр, добавление, редактирование и удаление пользователей системы.</p>
          </div>
          <AddUserDialog onUserAdded={loadUsers} />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-nsuem-orange/50 focus:border-nsuem-orange"
            />
          </div>
        </div>

        <div className="bg-nsuem-gray border border-white/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 bg-white/5">
                <TableHead className="text-white font-medium px-6 py-4">ФИО</TableHead>
                <TableHead className="text-white font-medium px-6 py-4">Email</TableHead>
                <TableHead className="text-white font-medium px-6 py-4">Телефон</TableHead>
                <TableHead className="text-white font-medium px-6 py-4">Логин</TableHead>
                <TableHead className="text-white font-medium px-6 py-4">Роль</TableHead>
                <TableHead className="text-white font-medium px-6 py-4">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((userData) => (
                <TableRow key={userData.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white px-6 py-4">{userData.fullName}</TableCell>
                  <TableCell className="text-white/90 px-6 py-4">{userData.email}</TableCell>
                  <TableCell className="text-white/90 px-6 py-4">{userData.phone}</TableCell>
                  <TableCell className="text-white/90 px-6 py-4">{userData.username}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant={userData.isAdmin ? "default" : "secondary"} 
                           className={userData.isAdmin ? "bg-nsuem-orange text-white" : "bg-white/10 text-white/70"}>
                      {userData.isAdmin ? 'Администратор' : 'Пользователь'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/20 bg-white text-nsuem-gray hover:bg-gray-700 hover:text-white"
                        title="Редактировать"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-400/30 hover:bg-red-300/20 text-red-400 hover:text-white"
                        onClick={() => handleDeleteUser(userData.id)}
                        title="Удалить"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </NewAdminLayout>
  );
};

export default Admin;
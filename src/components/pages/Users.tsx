import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users as UsersIcon, UserCheck, Calendar } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { UsersType } from '@/types';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import service from '@/services/configuration';
import { setUsers } from '@/app/features';

export function Users() {
  const users: UsersType[] | null = useSelector((state: RootState) => state.users.users);
  const dispatch = useDispatch();

  useEffect(() => {
    NProgress.configure({showSpinner: false});
    // Fetch user data from the backend API
    const fetchUserData = async () => {
      NProgress.start();
      try {
        const usersResponse = await service.getAllUsers();
        if(usersResponse) {
          dispatch(setUsers(usersResponse));
        } else {
          throw new Error('No users found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        NProgress.done();
      }
    };

    fetchUserData();
  }, [dispatch]);

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.bids.length > 0).length;
  const averageBids = Math.round(users.reduce((sum, user) => sum + user.bids.length, 0) / totalUsers);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage user accounts and track their activity
        </p>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Users with bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bids</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageBids}</div>
            <p className="text-xs text-muted-foreground">
              Per active user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Contact</TableHead>
                <TableHead>Total Bids</TableHead>
                <TableHead className="hidden md:table-cell">Registered</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.picture || '/placeholder.svg'}
                        alt={user?.name || 'User Avatar'}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium max-w-[100px] truncate sm:max-w-xs">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-xs">{user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div>
                      <p className="text-xs">{user.phone}</p>
                      <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.bids.length}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(user.createdAt, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.bids.length > 0 ? 'default' : 'secondary'}>
                      {user.bids.length > 0 ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
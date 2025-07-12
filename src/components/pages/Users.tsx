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
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { UsersType } from '@/types';

export function Users() {
  const users: UsersType[] | null = useSelector((state: RootState) => state.users.users);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Bids</TableHead>
                <TableHead>Registered</TableHead>
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
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{user.phone}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.bids.length}
                  </TableCell>
                  <TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
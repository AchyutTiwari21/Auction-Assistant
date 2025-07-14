import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Phone, PhoneCall, PhoneMissed, Clock } from 'lucide-react';
import { CallLog } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import service from '@/services/configuration';
import { setCallLogs } from '@/app/features';

export function CallLogs() {
  const callLogs: CallLog[] | null = useSelector((state: RootState) => state.callLogs.callLogs);

  const dispatch = useDispatch();

  useEffect(() => {
    NProgress.configure({showSpinner: false});
    // Fetch dashboard data from the backend API
    const fetchCallLogsData = async () => {
      NProgress.start();
      try {
        const callLogs = await service.getCallLogs();
        if(callLogs) {
          dispatch(setCallLogs(callLogs));
        } else {
          throw new Error("No Call logs found!");
        }
      } catch (error) {
        console.error('Error fetching call logs data:', error);
      } finally {
        NProgress.done();
      }
    };

    fetchCallLogsData();
  }, [dispatch]);

  const totalCalls = callLogs.length;
  const answeredCalls = callLogs.filter(log => log.status === 'completed').length;
  const missedCalls = callLogs.filter(log => log.status === 'missed').length;
  const ongoingCalls = callLogs.filter(log => log.status === 'ongoing').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Answered</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      case 'busy':
        return <Badge variant="secondary">Busy</Badge>;
      case 'ongoing':
        return <Badge variant="default" className="bg-blue-500">Ongoing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <PhoneCall className="h-4 w-4 text-green-500" />;
      case 'missed':
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      case 'busy':
        return <Phone className="h-4 w-4 text-yellow-500" />;
      case 'ongoing':
        return <Phone className="h-4 w-4 text-blue-500" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Call Logs</h2>
        <p className="text-muted-foreground">
          Track all incoming and outgoing calls with users
        </p>
      </div>

      {/* Call Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Answered</CardTitle>
            <PhoneCall className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{answeredCalls}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((answeredCalls / totalCalls) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed</CardTitle>
            <PhoneMissed className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{missedCalls}</div>
            <p className="text-xs text-muted-foreground">
              Need follow-up
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ongoingCalls}</div>
            <p className="text-xs text-muted-foreground">
              Active calls
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Call Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead className="hidden sm:table-cell">Ended At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(log.status)}
                      <div className="flex items-center space-x-2">
                        <img
                          src={log.user?.picture || '/placeholder.svg'}
                          alt={log.user?.name || 'User Avatar'}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium max-w-[100px] truncate sm:max-w-xs">{log.user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-xs">{log.user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {log.phone}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs">{format(log.startedAt, 'MMM dd, yyyy')}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(log.startedAt, 'HH:mm:ss')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {log.endedAt ? (
                      <div>
                        <p className="text-xs">{format(log.endedAt, 'MMM dd, yyyy')}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {format(log.endedAt, 'HH:mm:ss')}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(log.status)}
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
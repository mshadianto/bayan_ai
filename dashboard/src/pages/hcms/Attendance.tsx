import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, TableSkeleton } from '../../components/common';
import type { Attendance as AttendanceType } from '../../types';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, UserCheck, UserX, Clock3, Palmtree } from 'lucide-react';
import { hcmsApi } from '../../services/mockData/hcms';

export function Attendance() {
  const [records, setRecords] = useState<AttendanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hcmsApi.attendance.getAll();
        setRecords(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const weekSummary = [
    { day: 'Sun', present: 42, late: 3, absent: 2, leave: 1 },
    { day: 'Mon', present: 43, late: 2, absent: 1, leave: 2 },
    { day: 'Tue', present: 44, late: 1, absent: 2, leave: 1 },
    { day: 'Wed', present: 41, late: 4, absent: 1, leave: 2 },
    { day: 'Thu', present: 40, late: 2, absent: 3, leave: 3 },
  ];

  const todayStats = {
    present: records.filter(r => r.status === 'present').length,
    late: records.filter(r => r.status === 'late').length,
    absent: records.filter(r => r.status === 'absent').length,
    leave: records.filter(r => r.status === 'leave').length,
  };

  return (
    <div className="animate-fade-in">
      <Header title="Attendance" subtitle="Daily attendance tracking and overtime" />
      <div className="p-6">
        {/* Today's Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck size={18} className="text-emerald-400" />
              <p className="text-emerald-300 text-sm">Present</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.present}</p>
          </div>
          <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <Clock3 size={18} className="text-amber-400" />
              <p className="text-amber-300 text-sm">Late</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.late}</p>
          </div>
          <div className="bg-red-900/30 rounded-xl p-4 border border-red-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <UserX size={18} className="text-red-400" />
              <p className="text-red-300 text-sm">Absent</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.absent}</p>
          </div>
          <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <Palmtree size={18} className="text-blue-400" />
              <p className="text-blue-300 text-sm">On Leave</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.leave}</p>
          </div>
        </div>

        {/* Week Summary */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📅</span> This Week Summary
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {weekSummary.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-slate-400 text-sm mb-2">{day.day}</p>
                <div className="space-y-1">
                  <div className="bg-emerald-900/30 rounded px-2 py-1">
                    <span className="text-emerald-300 text-xs">{day.present} present</span>
                  </div>
                  <div className="bg-amber-900/30 rounded px-2 py-1">
                    <span className="text-amber-300 text-xs">{day.late} late</span>
                  </div>
                  <div className="bg-red-900/30 rounded px-2 py-1">
                    <span className="text-red-300 text-xs">{day.absent} absent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2 border border-slate-700">
            <Calendar size={20} className="text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white border-none focus:outline-none"
            />
          </div>
        </div>

        {/* Attendance Table */}
        {loading ? (
          <TableSkeleton rows={7} columns={6} />
        ) : (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Employee</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Check In</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Check Out</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Location</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Notes</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-t border-slate-700 hover:bg-slate-800/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{record.employee_name}</p>
                        <p className="text-sm text-slate-400">{record.employee_id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {record.check_in ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock size={16} className="text-slate-400" />
                          {record.check_in}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {record.check_out ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock size={16} className="text-slate-400" />
                          {record.check_out}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={record.status} variant="outline" />
                    </td>
                    <td className="p-4">
                      {record.location ? (
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <MapPin size={14} className="text-slate-400" />
                          {record.location}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-400">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Named export for backward compatibility
export default Attendance;

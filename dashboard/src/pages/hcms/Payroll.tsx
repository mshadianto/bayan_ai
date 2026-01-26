import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, SearchInput, TableSkeleton } from '../../components/common';
import type { PayrollRecord } from '../../types';
import { Download, Eye } from 'lucide-react';
import { hcmsApi } from '../../services/mockData/hcms';

export function Payroll() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hcmsApi.payroll.getAll();
        setRecords(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRecords = records.filter((record) =>
    record.employee_name.toLowerCase().includes(search.toLowerCase()) ||
    record.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPayroll = filteredRecords.reduce((sum, r) => sum + r.net_salary, 0);
  const totalGOSI = filteredRecords.reduce((sum, r) => sum + (r.gosi_employer || 0), 0);

  return (
    <div className="animate-fade-in">
      <Header title="Payroll" subtitle="Salary processing and compensation management" />
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <p className="text-sm text-slate-400">Total Payroll</p>
            <p className="text-2xl font-bold text-white">SAR {totalPayroll.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <p className="text-sm text-slate-400">GOSI Employer</p>
            <p className="text-2xl font-bold text-white">SAR {totalGOSI.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <p className="text-sm text-slate-400">Employees</p>
            <p className="text-2xl font-bold text-white">{filteredRecords.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <p className="text-sm text-slate-400">Period</p>
            <p className="text-2xl font-bold text-white">Jan 2024</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search employee..."
            />
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-indigo-500"
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors">
            <Download size={20} />
            Export
          </button>
        </div>

        {/* Payroll Table */}
        {loading ? (
          <TableSkeleton rows={7} columns={11} />
        ) : (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Employee</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Basic</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Housing</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Transport</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Other</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">OT</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Deductions</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">GOSI</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Net Salary</th>
                  <th className="text-center p-4 text-sm font-medium text-slate-400">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
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
                    <td className="p-4 text-right text-slate-300">{record.basic_salary.toLocaleString()}</td>
                    <td className="p-4 text-right text-slate-300">{(record.housing_allowance || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-slate-300">{(record.transport_allowance || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-slate-300">{(record.other_allowances || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-emerald-400">{(record.overtime_pay || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-red-400">-{record.deductions.toLocaleString()}</td>
                    <td className="p-4 text-right text-amber-400">-{(record.gosi_employee || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-white font-bold">{record.net_salary.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <StatusBadge status={record.status} variant="outline" />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                        aria-label="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-800 border-t border-slate-600">
                <tr>
                  <td className="p-4 text-white font-bold">Total</td>
                  <td className="p-4 text-right text-white font-bold">{filteredRecords.reduce((s, r) => s + r.basic_salary, 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-white font-bold">{filteredRecords.reduce((s, r) => s + (r.housing_allowance || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-white font-bold">{filteredRecords.reduce((s, r) => s + (r.transport_allowance || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-white font-bold">{filteredRecords.reduce((s, r) => s + (r.other_allowances || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">{filteredRecords.reduce((s, r) => s + (r.overtime_pay || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-red-400 font-bold">-{filteredRecords.reduce((s, r) => s + r.deductions, 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-amber-400 font-bold">-{filteredRecords.reduce((s, r) => s + (r.gosi_employee || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-white font-bold">{totalPayroll.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Named export for backward compatibility
export default Payroll;

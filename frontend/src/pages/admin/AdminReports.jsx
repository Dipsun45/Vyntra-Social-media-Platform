import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get('/admin/reports');
      setReports(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleUpdateStatus = async (reportId, status) => {
    try {
      await API.put(`/admin/reports/${reportId}`, { status });
      toast.success(`Report status changed to ${status}`);
      fetchReports();
    } catch (err) {
      toast.error('Could not update report status');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-red-400" /> Reports & Audits System
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 divide-y divide-slate-800">
        {reports.length === 0 ? (
          <p className="text-center py-8 text-slate-500 text-sm">No reports pending review.</p>
        ) : (
          reports.map(r => (
            <div key={r._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                    {r.reason}
                  </span>
                  <span className="text-xs text-slate-400">Target: {r.targetType}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Reported by: <span className="font-bold text-slate-200">@{r.reporter?.username}</span>
                </p>
                {r.details && <p className="text-sm text-slate-300 mt-1">"{r.details}"</p>}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase mr-2">Status: {r.status}</span>
                <button
                  onClick={() => handleUpdateStatus(r._id, 'resolved')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30"
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </button>

                <button
                  onClick={() => handleUpdateStatus(r._id, 'rejected')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { studentsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  FiUsers, FiUserCheck, FiAward, FiTrendingUp,
  FiArrowRight, FiBarChart2, FiRefreshCw,
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DEPT_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await studentsAPI.getStats();
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents, icon: <FiUsers />, color: 'blue' },
    { label: 'Active Students', value: stats.activeStudents, icon: <FiUserCheck />, color: 'emerald' },
    { label: 'Graduated', value: stats.graduatedStudents, icon: <FiAward />, color: 'purple' },
    { label: 'Avg GPA', value: stats.avgGpa, icon: <FiTrendingUp />, color: 'amber' },
  ] : [];

  const doughnutData = stats ? {
    labels: stats.departmentStats.map((d) => d._id),
    datasets: [{
      data: stats.departmentStats.map((d) => d.count),
      backgroundColor: DEPT_COLORS,
      borderColor: '#111827',
      borderWidth: 3,
      hoverOffset: 8,
    }],
  } : null;

  const barData = stats ? {
    labels: ['Active', 'Graduated', 'Inactive', 'Suspended'],
    datasets: [{
      label: 'Students',
      data: [
        stats.activeStudents || 0,
        stats.graduatedStudents || 0,
        stats.inactiveStudents || 0,
        stats.suspendedStudents || 0,
      ],
      backgroundColor: ['#10b981', '#3b82f6', '#94a3b8', '#ef4444'],
      borderRadius: 8,
      borderSkipped: false,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true },
    },
  };

  return (
    <>
      <Helmet>
        <title>Dashboard – StudRec</title>
        <meta name="description" content="View student statistics and analytics on the StudRec dashboard." />
      </Helmet>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Header */}
        <div className="flex-between fade-in" style={{ marginBottom: 28 }}>
          <div>
            <h1 style={{
              fontSize: '1.8rem', fontWeight: 800, marginBottom: 4,
              background: 'var(--gradient-blue)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Here's what's happening with your student records today
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={fetchStats}>
              <FiRefreshCw /> Refresh
            </button>
            <Link to="/students" className="btn btn-primary btn-sm">
              <FiUsers /> All Students <FiArrowRight />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <span>Loading statistics...</span>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="stats-grid fade-in-delay-1">
              {statCards.map((s) => (
                <div key={s.label} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                  <div className="stat-info">
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-grid fade-in-delay-2">
              {/* Dept Doughnut */}
              <div className="card chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Students by Department</h3>
                  <FiBarChart2 style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="chart-body">
                  {doughnutData && <Doughnut data={doughnutData} options={chartOptions} />}
                </div>
              </div>

              {/* Status Bar */}
              <div className="card chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Students by Status</h3>
                  <FiBarChart2 style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="chart-body">
                  {barData && <Bar data={barData} options={barOptions} />}
                </div>
              </div>
            </div>

            {/* Dept Table */}
            {stats?.departmentStats?.length > 0 && (
              <div className="card fade-in-delay-3" style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Top Departments</h3>
                <div className="table-wrapper" style={{ border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Department</th>
                        <th>Students</th>
                        <th>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.departmentStats.map((dept, i) => (
                        <tr key={dept._id}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td className="td-name">{dept._id}</td>
                          <td>{dept.count}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{
                                flex: 1, height: 6, background: 'var(--border)',
                                borderRadius: 3, overflow: 'hidden',
                              }}>
                                <div style={{
                                  width: `${(dept.count / stats.totalStudents * 100).toFixed(0)}%`,
                                  height: '100%', background: DEPT_COLORS[i], borderRadius: 3,
                                }} />
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 36 }}>
                                {(dept.count / stats.totalStudents * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .chart-card { padding: 20px; }
        .chart-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .chart-title { font-size: 0.95rem; font-weight: 700; }
        .chart-body { height: 240px; position: relative; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .charts-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </>
  );
}

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0 })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        axios.get('/api/leads/stats'),
        axios.get('/api/leads')
      ])
      setStats(statsRes.data)
      setRecentLeads(leadsRes.data.slice(0, 5))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Leads', value: stats.total, color: '#1e40af', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'New Leads', value: stats.new, color: '#3b82f6', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { label: 'Contacted', value: stats.contacted, color: '#f59e0b', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Converted', value: stats.converted, color: '#10b981', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  const getStatusStyle = (status) => {
    const styles = {
      'New': { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
      'Contacted': { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      'Converted': { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' }
    }
    return styles[status] || styles['New']
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '48px', height: '48px', border: '4px solid #e2e8f0',
            borderTop: '4px solid #1e40af', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b' }}>Loading dashboard...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {statCards.map((card, index) => (
          <div key={index} style={{
            background: 'white', borderRadius: '12px', padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            borderLeft: `4px solid ${card.color}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${card.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="24" height="24" fill="none" stroke={card.color} strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{card.value}</p>
            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{
          padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Recent Leads</h3>
          <Link to="/leads" style={{
            color: '#1e40af', fontWeight: 600, fontSize: '0.85rem',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            View All
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No leads yet. <Link to="/leads/add" style={{ color: '#1e40af' }}>Add your first lead</Link></p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Source</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, idx) => {
                  const statusStyle = getStatusStyle(lead.status)
                  return (
                    <tr key={lead._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.75rem', fontWeight: 700
                          }}>
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{lead.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.9rem' }}>{lead.email}</td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.9rem' }}>{lead.source}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                          fontSize: '0.75rem', fontWeight: 600,
                          background: statusStyle.bg, color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`
                        }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.85rem' }}>{formatDate(lead.followUpDate)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

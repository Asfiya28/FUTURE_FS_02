import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [deleteModal, setDeleteModal] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await axios.get('/api/leads')
      setLeads(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/leads/${id}`)
      setLeads(leads.filter(l => l._id !== id))
      setDeleteModal(null)
    } catch (err) {
      alert('Failed to delete lead')
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
                          lead.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus
    return matchesSearch && matchesStatus
  })

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
          <div style={{
            width: '48px', height: '48px', border: '4px solid #e2e8f0',
            borderTop: '4px solid #1e40af', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b' }}>Loading leads...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '16px',
        justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 40px',
                border: '2px solid #e2e8f0', borderRadius: '10px',
                fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 16px', border: '2px solid #e2e8f0', borderRadius: '10px',
              fontSize: '0.9rem', outline: 'none', cursor: 'pointer',
              background: 'white', color: '#334155', fontWeight: 500
            }}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
        <Link to="/leads/add" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white', textDecoration: 'none', borderRadius: '10px',
          fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(30,64,175,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,64,175,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(30,64,175,0.3)' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </Link>
      </div>

      {/* Leads Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lead</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Source</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notes</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Follow-up</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No leads found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const statusStyle = getStatusStyle(lead.status)
                  return (
                    <tr key={lead._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.8rem', fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', marginBottom: '2px' }}>{lead.name}</p>
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.9rem' }}>{lead.source}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-block', padding: '5px 14px', borderRadius: '20px',
                          fontSize: '0.75rem', fontWeight: 700,
                          background: statusStyle.bg, color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`
                        }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.85rem', maxWidth: '200px' }}>
                        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lead.notes || '—'}
                        </p>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.85rem' }}>{formatDate(lead.followUpDate)}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => navigate(`/leads/edit/${lead._id}`)}
                            style={{
                              padding: '8px', borderRadius: '8px', border: 'none',
                              background: '#dbeafe', color: '#1e40af', cursor: 'pointer',
                              transition: 'all 0.2s', display: 'flex', alignItems: 'center'
                            }}
                            title="Edit"
                            onMouseEnter={e => e.currentTarget.style.background = '#bfdbfe'}
                            onMouseLeave={e => e.currentTarget.style.background = '#dbeafe'}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteModal(lead)}
                            style={{
                              padding: '8px', borderRadius: '8px', border: 'none',
                              background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
                              transition: 'all 0.2s', display: 'flex', alignItems: 'center'
                            }}
                            title="Delete"
                            onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            maxWidth: '400px', width: '90%', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="28" height="28" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Delete Lead?</h3>
            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.9rem' }}>
              Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteModal(null)}
                style={{
                  padding: '10px 24px', borderRadius: '10px', border: '2px solid #e2e8f0',
                  background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal._id)}
                style={{
                  padding: '10px 24px', borderRadius: '10px', border: 'none',
                  background: '#dc2626', color: 'white', fontWeight: 600, cursor: 'pointer',
                  fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(220,38,38,0.3)'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leads

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'

const EditLead = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    source: 'Website',
    status: 'New',
    notes: '',
    followUpDate: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLead()
  }, [id])

  const fetchLead = async () => {
    try {
      const res = await axios.get(`/api/leads/${id}`)
      const lead = res.data
      setForm({
        name: lead.name,
        email: lead.email,
        source: lead.source,
        status: lead.status,
        notes: lead.notes || '',
        followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : ''
      })
    } catch (err) {
      setError('Failed to load lead')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        followUpDate: form.followUpDate ? new Date(form.followUpDate).toISOString() : null
      }
      await axios.put(`/api/leads/${id}`, payload)
      navigate('/leads')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lead')
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0',
    borderRadius: '10px', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', background: 'white'
  }

  const labelStyle = {
    display: 'block', marginBottom: '6px', fontWeight: 600,
    color: '#334155', fontSize: '0.9rem'
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
          <p style={{ color: '#64748b' }}>Loading lead...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/leads" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#1e40af', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Leads
        </Link>
      </div>

      <div style={{
        background: 'white', borderRadius: '16px', padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Edit Lead</h2>
        <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.9rem' }}>Update the lead information below.</p>

        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626', padding: '12px 16px',
            borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Source *</label>
              <select
                name="source" value={form.source} onChange={handleChange}
                required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
              >
                <option value="Website">Website</option>
                <option value="Social Media">Social Media</option>
                <option value="Referral">Referral</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status *</label>
              <select
                name="status" value={form.status} onChange={handleChange}
                required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Follow-up Date</label>
            <input
              type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes" value={form.notes} onChange={handleChange}
              rows="4"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Link to="/leads" style={{
              padding: '12px 24px', borderRadius: '10px', border: '2px solid #e2e8f0',
              background: 'white', color: '#64748b', fontWeight: 600,
              textDecoration: 'none', fontSize: '0.95rem', textAlign: 'center'
            }}>
              Cancel
            </Link>
            <button
              type="submit" disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: '10px', border: 'none',
                background: saving ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(30,64,175,0.3)', transition: 'all 0.2s'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLead

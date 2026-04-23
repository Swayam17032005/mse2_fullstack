import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ItemForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactInfo: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-secondary)', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>{initialData ? 'Update Item' : 'Report Item'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="form-input" required>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="3" required></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" required />
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Contact Info</label>
            <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="form-input" required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { MapPin, Calendar, User, Trash2, Edit } from 'lucide-react';

const ItemCard = ({ item, onUpdate, onDelete }) => {
  const { user } = useContext(AuthContext);

  // Safely check if the logged-in user is the owner
  const isOwner = user && (item.owner === user._id || (item.owner && item.owner._id === user._id));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.itemName}</h3>
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: item.type === 'Lost' ? '#FEE2E2' : '#D1FAE5',
            color: item.type === 'Lost' ? '#DC2626' : '#059669'
          }}>
            {item.type}
          </span>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {item.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} />
            <span>{item.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} />
            <span>Contact: {item.contactInfo}</span>
          </div>
        </div>
      </div>

      {isOwner && (
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem'
        }}>
          <button 
            onClick={() => onUpdate(item)}
            className="btn btn-outline"
            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
          >
            <Edit size={16} /> Update
          </button>
          <button 
            onClick={() => onDelete(item._id)}
            className="btn btn-danger"
            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;

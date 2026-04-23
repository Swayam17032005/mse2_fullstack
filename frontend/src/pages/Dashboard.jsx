import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axiosInstance from '../api/axios';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import { LogOut, Plus, Search, Package, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async (searchTerm = '') => {
    setLoading(true);
    try {
      const url = searchTerm ? `/items/search?name=${searchTerm}` : '/items';
      const response = await axiosInstance.get(url);
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(search);
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingItem) {
        await axiosInstance.put(`/items/${editingItem._id}`, formData);
      } else {
        await axiosInstance.post('/items', formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axiosInstance.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Package size={28} />
            <span>Lost & Found</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Welcome, {user?.name}</span>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mt-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, maxWidth: '500px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search items by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingRight: '3rem' }}
            />
            <button type="submit" style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </button>
          </form>

          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="btn btn-primary">
            <Plus size={20} /> Report New Item
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-6">Loading items...</div>
        ) : error ? (
          <div className="text-center mt-6 error-msg">{error}</div>
        ) : items.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={48} color="var(--text-muted)" />
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No items found. Try a different search or report something!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '4rem'
          }}>
            {items.map(item => (
              <ItemCard 
                key={item._id} 
                item={item} 
                onUpdate={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <ItemForm 
          initialData={editingItem} 
          onClose={() => { setIsModalOpen(false); setEditingItem(null); }} 
          onSubmit={handleCreateOrUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;

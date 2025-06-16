import { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = usePOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'cashier'
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }

    handleCloseModal();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const handleToggleStatus = (user) => {
    updateUser(user.id, { ...user, active: !user.active });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'cashier' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <Card>
        <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
          {users.map((user) => (
            <tr key={user.id} className="table-row">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`p-1 rounded ${
                      user.active
                        ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                        : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                    }`}
                  >
                    {user.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users available.
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required={!editingUser} // Only required when adding
              value={formData.password || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter password"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
import React, { useState } from 'react';
import UsersList from '../components/Users/UsersList';
import UserForm from '../components/Users/UserForm';
import UserDetails from '../components/Users/UserDetails';
import { FiDownload, FiUpload, FiUserPlus, FiFilter } from 'react-icons/fi';

export default function Users() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      // Implementation for deleting user
      console.log('Delete user:', user);
    }
  };

  const handleSaveUser = (userData) => {
    if (formMode === 'create') {
      // Implementation for creating new user
      console.log('Create user:', userData);
    } else {
      // Implementation for updating user
      console.log('Update user:', userData);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage customer accounts and user information</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-outline">
            <FiDownload />
            Export Users
          </button>
          <button className="btn btn-outline">
            <FiUpload />
            Import Users
          </button>
          <button className="btn btn-outline">
            <FiFilter />
            Advanced Filter
          </button>
        </div>
      </div>

      <div className="users-content">
        <UsersList
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
          onCreate={handleCreateUser}
        />
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={selectedUser}
          onClose={handleCloseForm}
          onSave={handleSaveUser}
        />
      )}

      {/* User Details Modal */}
      {showDetails && (
        <UserDetails
          user={selectedUser}
          onClose={handleCloseDetails}
          onEdit={handleEditUser}
        />
      )}
    </div>
  );
}
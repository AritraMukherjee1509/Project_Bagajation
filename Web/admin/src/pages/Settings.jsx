import React, { useState } from 'react';
import { 
  FiSave, 
  FiRefreshCw, 
  FiUser, 
  FiLock,
  FiBell,
  FiGlobe,
  FiShield,
  FiDatabase,
  FiMail,
  FiSmartphone,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'LG Smart Services',
    siteDescription: 'Professional home services platform',
    contactEmail: 'admin@bagajatin.com',
    contactPhone: '+91 98765 43210',
    address: '123 Tech Street, Smart City, SC 12345',
    
    // Profile Settings
    adminName: 'Admin User',
    adminEmail: 'admin@bagajatin.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    newBookingAlert: true,
    paymentAlert: true,
    reviewAlert: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async (category) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(`Saving ${category} settings:`, settings);
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  const resetSettings = (category) => {
    if (window.confirm('Are you sure you want to reset these settings to default?')) {
      // Reset logic here
      console.log(`Resetting ${category} settings`);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'system', label: 'System', icon: FiDatabase }
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your application settings and preferences</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="settings-main">
          {activeTab === 'general' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">General Settings</h2>
                <p className="section-description">Manage basic application settings</p>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                    className="form-textarea"
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <div className="input-with-icon">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <div className="input-with-icon">
                      <FiSmartphone className="input-icon" />
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Business Address</label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                    className="form-textarea"
                    rows={2}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-outline" 
                    onClick={() => resetSettings('general')}
                  >
                    <FiRefreshCw />
                    Reset
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSaveSettings('general')}
                    disabled={isSaving}
                  >
                    <FiSave />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">Profile Settings</h2>
                <p className="section-description">Update your admin profile information</p>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label className="form-label">Admin Name</label>
                  <input
                    type="text"
                    value={settings.adminName}
                    onChange={(e) => handleSettingChange('profile', 'adminName', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('profile', 'adminEmail', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="password-section">
                  <h3 className="subsection-title">Change Password</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div className="input-with-icon">
                      <FiLock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settings.currentPassword}
                        onChange={(e) => handleSettingChange('profile', 'currentPassword', e.target.value)}
                        className="form-input"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        value={settings.newPassword}
                        onChange={(e) => handleSettingChange('profile', 'newPassword', e.target.value)}
                        className="form-input"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        value={settings.confirmPassword}
                        onChange={(e) => handleSettingChange('profile', 'confirmPassword', e.target.value)}
                        className="form-input"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-outline" 
                    onClick={() => resetSettings('profile')}
                  >
                    <FiRefreshCw />
                    Reset
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSaveSettings('profile')}
                    disabled={isSaving}
                  >
                    <FiSave />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">Notification Settings</h2>
                <p className="section-description">Configure how you receive notifications</p>
              </div>

              <div className="settings-form">
                <div className="notification-groups">
                  <div className="notification-group">
                    <h3 className="group-title">Communication Preferences</h3>
                    
                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">Email Notifications</span>
                        <span className="toggle-description">Receive notifications via email</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">SMS Notifications</span>
                        <span className="toggle-description">Receive notifications via SMS</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">Push Notifications</span>
                        <span className="toggle-description">Receive browser push notifications</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="notification-group">
                    <h3 className="group-title">Alert Types</h3>
                    
                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">New Booking Alerts</span>
                        <span className="toggle-description">Get notified when new bookings are made</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.newBookingAlert}
                          onChange={(e) => handleSettingChange('notifications', 'newBookingAlert', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">Payment Alerts</span>
                        <span className="toggle-description">Get notified about payment updates</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.paymentAlert}
                          onChange={(e) => handleSettingChange('notifications', 'paymentAlert', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">Review Alerts</span>
                        <span className="toggle-description">Get notified about new reviews</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.reviewAlert}
                          onChange={(e) => handleSettingChange('notifications', 'reviewAlert', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-outline" 
                    onClick={() => resetSettings('notifications')}
                  >
                    <FiRefreshCw />
                    Reset
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSaveSettings('notifications')}
                    disabled={isSaving}
                  >
                    <FiSave />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">Security Settings</h2>
                <p className="section-description">Configure security and access controls</p>
              </div>

              <div className="settings-form">
                <div className="security-groups">
                  <div className="security-group">
                    <h3 className="group-title">Authentication</h3>
                    
                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">Two-Factor Authentication</span>
                        <span className="toggle-description">Add an extra layer of security to your account</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="form-input"
                          min="5"
                          max="120"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Max Login Attempts</label>
                        <input
                          type="number"
                          value={settings.loginAttempts}
                          onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                          className="form-input"
                          min="3"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-outline" 
                    onClick={() => resetSettings('security')}
                  >
                    <FiRefreshCw />
                    Reset
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSaveSettings('security')}
                    disabled={isSaving}
                  >
                    <FiSave />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">System Settings</h2>
                <p className="section-description">Manage system-wide configurations</p>
              </div>

              <div className="settings-form">
                <div className="system-groups">
                  <div className="system-group">
                    <h3 className="group-title">Maintenance</h3>
                    
                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">Maintenance Mode</span>
                        <span className="toggle-description">Put the site in maintenance mode</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-option">
                      <div className="toggle-info">
                        <span className="toggle-label">Auto Backup</span>
                        <span className="toggle-description">Automatically backup system data</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.autoBackup}
                          onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Backup Frequency</label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                        className="form-select"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-outline" 
                    onClick={() => resetSettings('system')}
                  >
                    <FiRefreshCw />
                    Reset
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSaveSettings('system')}
                    disabled={isSaving}
                  >
                    <FiSave />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
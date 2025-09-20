import React, { useState } from 'react';
import BookingsList from '../components/Bookings/BookingsList';
import BookingFilters from '../components/Bookings/BookingFilters';
import { FiDownload, FiPlus } from 'react-icons/fi';

export default function Bookings() {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    service: 'all'
  });

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Bookings Management</h1>
          <p className="page-subtitle">Manage all service bookings and appointments</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-outline">
            <FiDownload />
            Export
          </button>
          <button className="btn btn-primary">
            <FiPlus />
            New Booking
          </button>
        </div>
      </div>

      <div className="bookings-content">
        <BookingFilters filters={filters} setFilters={setFilters} />
        <BookingsList filters={filters} />
      </div>
    </div>
  );
}
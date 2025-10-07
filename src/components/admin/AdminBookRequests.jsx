import React from 'react';
import { useLibrary } from '../../contexts/LibraryContext';

const AdminBookRequests = () => {
  const { requests, handleApproveRequest, handleRejectRequest, handleCheckoutRequest } = useLibrary();

  const pendingAndApprovedRequests = requests.filter(r => r.status === 'pending' || r.status === 'approved');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">Book Borrow Requests</h2>
      {pendingAndApprovedRequests.length === 0 && <p>No requests found.</p>}
      {pendingAndApprovedRequests.map(req => (
        <div key={req._id} className="bg-white rounded shadow p-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <p><strong>Student:</strong> {req.studentName}</p>
            <p><strong>Book:</strong> {req.bookTitle}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${req.status === 'approved' ? 'text-green-600' : req.status === 'rejected' ? 'text-red-600' : ''}`}>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span></p>
            {req.status === 'approved' && (
              <>
                <p><strong>Pickup Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{req.token}</code></p>
                <p><strong>Pickup Deadline:</strong> {new Date(req.pickupDeadline).toLocaleDateString()}</p>
              </>
            )}
          </div>
          <div className="space-x-2">
            {req.status === 'pending' && (
              <>
                <button onClick={() => handleApproveRequest(req._id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Approve</button>
                <button onClick={() => handleRejectRequest(req._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
              </>
            )}
            {req.status === 'approved' && (
              <button onClick={() => handleCheckoutRequest(req._id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Checkout
              </button>
            )}
            {req.status === 'checked_out' && (
              <span className="text-green-700 font-semibold">Checked Out</span>
            )}
            {req.status === 'rejected' && (
              <span className="text-red-700 font-semibold">Rejected</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBookRequests;
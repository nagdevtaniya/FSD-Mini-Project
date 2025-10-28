import React from "react";
import { useLibrary } from "../../contexts/LibraryContext";

const AdminBookRequests = () => {
  const {
    requests,
    handleApproveRequest,
    handleRejectRequest,
    handleCheckoutRequest,
  } = useLibrary();

  const pendingAndApprovedRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "approved"
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200";
      case "checked_out":
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center border-b pb-4">
          Book Borrow Requests
        </h2>

        {pendingAndApprovedRequests.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No pending or approved requests found.
          </p>
        ) : (
          <div className="space-y-6">
            {pendingAndApprovedRequests.map((req) => (
              <div
                key={req._id}
                className={`border rounded-xl shadow-sm hover:shadow-md transition-all bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between`}
              >
                {/* Left Side: Info */}
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-bold text-gray-800">
                    {req.bookTitle}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Student:</strong> {req.studentName}
                  </p>
                  <p
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(
                      req.status
                    )}`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </p>

                  {req.status === "approved" && (
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <p>
                        <strong>Pickup Token:</strong>{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                          {req.token}
                        </code>
                      </p>
                      <p>
                        <strong>Pickup Deadline:</strong>{" "}
                        {new Date(req.pickupDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Side: Buttons */}
                <div className="flex flex-wrap gap-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApproveRequest(req._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {req.status === "approved" && (
                    <button
                      onClick={() => handleCheckoutRequest(req._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Checkout
                    </button>
                  )}

                  {req.status === "checked_out" && (
                    <span className="text-blue-700 font-semibold">
                      Checked Out
                    </span>
                  )}

                  {req.status === "rejected" && (
                    <span className="text-red-700 font-semibold">Rejected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookRequests;

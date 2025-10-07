import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const LibraryContext = createContext();

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notification, setNotification] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  // Socket.io client instance
  const [socket, setSocket] = useState(null);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
    }
  }, []);

  // Setup socket connection and event listeners on currentUser change (login/logout)
  useEffect(() => {
    if (!currentUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join', { userId: currentUser._id, role: currentUser.role });
    console.log(`Socket connected and joined room: ${currentUser._id}, role: ${currentUser.role}`);

    newSocket.on('requestStatus', (data) => {
      console.log('Current user id:', currentUser._id, 'data.studentId:', data.studentId);
      if (data.studentId === currentUser._id) {
        console.log('Received requestStatus event:', data);
        showNotification(data.message, data.status === 'approved' ? 'success' : 'error');
        fetchInitialData();
      }
    });

    // Listen for new book borrow requests (admin only)
    newSocket.on('newRequest', (data) => {
      console.log('Received newRequest event:', data);
      if (currentUser.role === 'admin') {
        showNotification(data.message);
        setRequests(prev => {
          // Avoid duplicate requests
          const exists = prev.some(req => req._id === data.request._id);
          if (exists) return prev;
          return [...prev, data.request];
        });
      }
    });

    // Listen for request updates (admin only)
    newSocket.on('requestUpdated', (data) => {
      if (currentUser.role === 'admin') {
        console.log('Received requestUpdated event:', data);
        setRequests(prev => {
          const updatedRequests = prev.map(req => req._id === data.request._id ? data.request : req);
          return updatedRequests;
        });
        showNotification(`Request for "${data.request.bookTitle}" updated.`);
      }
    });

    // Listen for book checked out events
    newSocket.on('bookCheckedOut', (data) => {
      console.log('Received bookCheckedOut event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

    // Listen for new book added
    newSocket.on('newBook', (data) => {
      console.log('Received newBook event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

    // Listen for book updated
    newSocket.on('bookUpdated', (data) => {
      console.log('Received bookUpdated event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

    // Listen for book returned
    newSocket.on('bookReturned', (data) => {
      console.log('Received bookReturned event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

    // Listen for book returned notification for admin side
    newSocket.on('bookReturnedAdmin', (data) => {
      console.log('bookReturnedAdmin event received, role:', currentUser.role);
      if (currentUser.role === 'admin') {
        console.log('Received bookReturnedAdmin event:', data);
        showNotification(data.message);
        fetchInitialData();
      }
    });

    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected');
    };
  }, [currentUser]);

  // Helper function to get headers with token
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const fetchInitialData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const booksRes = await fetch(`${API_URL}/books`, { headers: getHeaders() });
      const booksData = await booksRes.json();
      setBooks(Array.isArray(booksData) ? booksData : []);

      const requestsRes = await fetch(`${API_URL}/requests`, { headers: getHeaders() });
      const requestsData = await requestsRes.json();
      setRequests(Array.isArray(requestsData) ? requestsData : []);

      const usersRes = await fetch(`${API_URL}/auth/users`, { headers: getHeaders() });
      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData) ? usersData : []);

      // Update currentUser if they are logged in and data has been refreshed
      if (currentUser) {
        const updatedUser = usersData.find(u => u._id === currentUser._id);
        if (updatedUser) {
          setCurrentUser(updatedUser);
        }
      }

    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      showNotification('Failed to connect to the server.', 'error');
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };
  
  const handleLogin = async (email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentPage(data.user.role === 'student' ? 'bookList' : 'adminDashboard');
        await fetchInitialData();
        showNotification(data.message);
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Login failed. Server error.', 'error');
    }
  };

  const handleRegister = async (name, email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message);
        await fetchInitialData(); // Add this to update the users list
        return true;
      } else {
        showNotification(data.message, 'error');
        return false;
      }
    } catch (error) {
      showNotification('Registration failed. Server error.', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('home');
    showNotification('Logged out successfully.');
  };

  const handleBorrowBook = async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ bookId, studentId: currentUser._id }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchInitialData();
        showNotification('Borrow request submitted successfully!');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to submit request. Server error.', 'error');
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'approved', token: Math.floor(100000 + Math.random() * 900000).toString(), pickupDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchInitialData();
        showNotification('Request approved! Token and deadline generated.');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to approve request. Server error.', 'error');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'rejected' })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchInitialData();
        showNotification('Request rejected.');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to reject request. Server error.', 'error');
    }
  };

  const handleCheckoutRequest = async (requestId) => {
    try {
      const requestToCheckout = requests.find(req => req._id === requestId);
      if (!requestToCheckout) return;

      const bookId = requestToCheckout.bookId;
      const studentId = requestToCheckout.studentId;

      await fetch(`${API_URL}/requests/${requestId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'checked_out' })
      });

      const book = books.find(b => b._id === bookId);
      if (book.copies > 0) {
        await fetch(`${API_URL}/books/${bookId}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ copies: book.copies - 1 })
        });
      }

      const student = users.find(u => u._id === studentId);
      const borrowedDate = new Date();
      const dueDate = new Date(borrowedDate);
      dueDate.setDate(borrowedDate.getDate() + 14);
      const updatedBorrowed = [...student.borrowed, { bookId, borrowedDate, dueDate }];

      await fetch(`${API_URL}/auth/${studentId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ borrowed: updatedBorrowed })
      });

      await fetchInitialData();
      showNotification('Book checked out successfully!');

    } catch (error) {
      showNotification('Failed to checkout book. Server error.', 'error');
    }
  };


  const handleReturnBook = async (bookId) => {
    try {
      const studentId = currentUser._id;
      const bookToUpdate = books.find(b => b._id === bookId);
      const userToUpdate = users.find(u => u._id === studentId);

      const updatedBorrowed = userToUpdate.borrowed.filter(borrowedBook => borrowedBook.bookId !== bookId);
      const updatedHistory = [...userToUpdate.history, { bookId, returnedDate: new Date() }];

      await fetch(`${API_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ copies: bookToUpdate.copies + 1 })
      });

      const userResponse = await fetch(`${API_URL}/auth/${studentId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ borrowed: updatedBorrowed, history: updatedHistory })
      });

      const userData = await userResponse.json();

      if (userResponse.ok) {
        showNotification('Book returned successfully!');
        console.log('Emitting bookReturnedAdmin:', socket ? 'socket exists' : 'no socket');
        if (socket) {
          socket.emit('bookReturnedAdmin', {
            message: `Student ${currentUser.name} has returned "${bookToUpdate.title}".`,
            studentId: currentUser._id,
          });
        }
      } else {
        showNotification(userData.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to return book. Server error.', 'error');
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification('Book added successfully!');
        setCurrentPage('adminBookList');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to add book. Server error.', 'error');
    }
  };

  const handleUpdateBook = async (updatedBook) => {
    try {
      const response = await fetch(`${API_URL}/books/${updatedBook._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedBook)
      });
      const data = await response.json();
      if (response.ok) {
        await fetchInitialData();
        showNotification('Book stock updated successfully!');
        if (socket) {
          socket.emit('bookUpdated', {
            message: `Book "${data.title}" has been updated.`,
            book: data,
          });
        }
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to update book. Server error.', 'error');
    }
  };

  const getStudentHistory = () => {
    return currentUser ? currentUser.history : [];
  };

  const getStudentBorrowed = () => {
    return currentUser ? currentUser.borrowed : [];
  };

  const value = {
    currentPage,
    setCurrentPage,
    currentUser,
    users,
    books,
    requests,
    notification,
    showNotification,
    handleLogin,
    handleRegister,
    handleLogout,
    handleBorrowBook,
    handleApproveRequest,
    handleRejectRequest,
    handleCheckoutRequest,
    handleReturnBook,
    handleAddBook,
    handleUpdateBook,
    getStudentHistory,
    getStudentBorrowed,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};
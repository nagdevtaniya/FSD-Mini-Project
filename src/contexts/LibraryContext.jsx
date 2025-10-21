// src/contexts/LibraryContext.jsx
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

  // Use REACT_APP_ env vars at build time or fallback to localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api','') : 'http://localhost:5000');

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

    // Create socket with server URL
    const newSocket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    setSocket(newSocket);

    newSocket.emit('join', { userId: currentUser._id || currentUser.id, role: currentUser.role });
    console.log(`Socket connected and joined room: ${currentUser._id || currentUser.id}, role: ${currentUser.role}`);

    newSocket.on('requestStatus', (data) => {
      console.log('Current user id:', currentUser._id || currentUser.id, 'data.studentId:', data.studentId);
      if (data.studentId === (currentUser._id || currentUser.id)) {
        console.log('Received requestStatus event:', data);
        showNotification(data.message, data.status === 'approved' ? 'success' : 'error');
        fetchInitialData();
      }
    });

    newSocket.on('newRequest', (data) => {
      console.log('Received newRequest event:', data);
      if (currentUser.role === 'admin') {
        showNotification(data.message);
        setRequests(prev => {
          const exists = prev.some(req => req._id === data.request._id);
          if (exists) return prev;
          return [...prev, data.request];
        });
      }
    });

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

    newSocket.on('bookCheckedOut', (data) => {
      console.log('Received bookCheckedOut event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

    newSocket.on('newBook', (data) => {
      console.log('Received newBook event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

    newSocket.on('bookUpdated', (data) => {
      console.log('Received bookUpdated event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

    newSocket.on('bookReturned', (data) => {
      console.log('Received bookReturned event:', data);
      showNotification(data.message);
      fetchInitialData();
    });

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
    if (!token) {
      // Fetch books publicly if not logged in
      try {
        const booksRes = await fetch(`${API_URL}/books`);
        const booksData = await booksRes.json();
        setBooks(Array.isArray(booksData) ? booksData : []);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        showNotification('Failed to connect to the server.', 'error');
      }
      return;
    }

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

      // Update currentUser if logged in and user data refreshed
      if (currentUser) {
        const updatedUser = usersData.find(u => u._id === (currentUser._id || currentUser.id));
        if (updatedUser) {
          setCurrentUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
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
        showNotification(data.message || 'Login failed', 'error');
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
        await fetchInitialData();
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
        body: JSON.stringify({ bookId, studentId: currentUser._id || currentUser.id }),
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
      if (book && book.copies > 0) {
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
      const updatedBorrowed = [...(student.borrowed || []), { bookId, borrowedDate, dueDate }];

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
      const studentId = currentUser._id || currentUser.id;
      const bookToUpdate = books.find(b => b._id === bookId);
      const userToUpdate = users.find(u => u._id === studentId);

      const updatedBorrowed = (userToUpdate.borrowed || []).filter(borrowedBook => borrowedBook.bookId !== bookId);
      const updatedHistory = [...(userToUpdate.history || []), { bookId, returnedDate: new Date() }];

      if (bookToUpdate) {
        await fetch(`${API_URL}/books/${bookId}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ copies: (bookToUpdate.copies || 0) + 1 })
        });
      }

      const userResponse = await fetch(`${API_URL}/auth/${studentId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ borrowed: updatedBorrowed, history: updatedHistory })
      });

      const userData = await userResponse.json();

      if (userResponse.ok) {
        showNotification('Book returned successfully!');
        if (socket) {
          const returnedBook = books.find(b => b._id === bookId);
          const bookTitle = returnedBook ? returnedBook.title : 'Unknown Book';
          socket.emit('bookReturnedAdmin', {
            message: `Student ${currentUser.name} has returned the book "${bookTitle}".`,
            studentId: studentId,
          });
        }
        await fetchInitialData();
      } else {
        showNotification(userData.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to return book. Server error.', 'error');
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      if (!bookData.cover && bookData.isbn) {
        try {
          const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${bookData.isbn}&format=json`);
          const data = await response.json();
          const key = `ISBN:${bookData.isbn}`;
          if (data[key] && data[key].thumbnail_url) {
            bookData.cover = data[key].thumbnail_url;
          }
        } catch (fetchError) {
          console.warn('Failed to fetch book cover:', fetchError);
        }
      }

      if (!bookData.cover) {
        bookData.cover = 'https://via.placeholder.com/200x300?text=No+Cover';
      }

      // Ensure totalCopies exists
      if (!bookData.totalCopies) bookData.totalCopies = bookData.copies || 1;

      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification('Book added successfully!');
        await fetchInitialData();
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

  const handleRemoveBook = async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (response.ok) {
        await fetchInitialData();
        showNotification('Book removed successfully!');
        if (socket) {
          socket.emit('bookRemoved', {
            message: 'A book has been removed from the library.',
          });
        }
      } else {
        const data = await response.json();
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to remove book. Server error.', 'error');
    }
  };

  const handleDeleteHistory = async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/auth/history/${bookId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        showNotification('History item deleted successfully!');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to delete history item. Server error.', 'error');
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
    handleRemoveBook,
    handleDeleteHistory,
    getStudentHistory,
    getStudentBorrowed,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};


// Mock users database
const users = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    },
  ];
  
  // Mock data for studies and addresses
  const studiesData = {
    1: [
      { id: 1, institution: 'Harvard University', degree: 'Computer Science', year: 2015 },
      { id: 2, institution: 'MIT', degree: 'Master in AI', year: 2017 },
    ],
    2: [
      { id: 3, institution: 'Stanford University', degree: 'Software Engineering', year: 2018 },
    ],
  };
  
  const addressesData = {
    1: [
      { id: 1, street: '123 Main St', city: 'Boston', state: 'MA', zip: '02108', country: 'USA' },
    ],
    2: [
      { id: 2, street: '456 Oak Ave', city: 'San Francisco', state: 'CA', zip: '94102', country: 'USA' },
    ],
  };
  
  // Mock API functions
  export const login = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          resolve({
            success: true,
            token: 'mock-token-' + user.id,
            user: { id: user.id, name: user.name, email: user.email },
            role: user.role,
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid email or password',
          });
        }
      }, 500);
    });
  };
  
  export const getUsers = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users.map(user => ({ 
          id: user.id, 
          name: user.name, 
          email: user.email,
          role: user.role 
        })));
      }, 500);
    });
  };
  
  export const getUserStudies = async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(studiesData[userId] || []);
      }, 500);
    });
  };
  
  export const getUserAddresses = async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(addressesData[userId] || []);
      }, 500);
    });
  };
  
  export const createUser = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: users.length + 1,
          ...userData,
          password: 'defaultPassword', // In a real app, this would be hashed
        };
        users.push(newUser);
        resolve(newUser);
      }, 500);
    });
  };
import initialData from '../data/data.json';


const DB_KEY = 'user-management-app-data';


const loadDatabase = () => {
  const savedData = localStorage.getItem(DB_KEY);
  return savedData ? JSON.parse(savedData) : { 
    users: [...initialData.users],
    studiesData: {...initialData.studiesData},
    addressesData: {...initialData.addressesData}
  };
};

let database = loadDatabase();


const saveDatabase = () => {
  localStorage.setItem(DB_KEY, JSON.stringify(database));
};


export const authAPI = {

  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = database.users.find(u => 
          u.email === email && u.password === password
        );

        if (user) {
          resolve({
            success: true,
            token: `mock-token-${user.id}`,
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
  },


  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          database.users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }))
        );
      }, 500);
    });
  },

  getUserById: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = database.users.find(u => u.id === userId);
        resolve(user ? {...user, password: undefined} : null);
      }, 500);
    });
  },

  getUserProfile: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = database.users.find(u => u.id === userId);
        if (user) {
          resolve({
            ...user,
            password: undefined,
            studies: database.studiesData[userId] || [],
            addresses: database.addressesData[userId] || []
          });
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  createUser: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: database.users.length + 1,
          ...userData,
          password: userData.password || 'defaultPassword',
        };
        
        database.users.push(newUser);
        database.studiesData[newUser.id] = [];
        database.addressesData[newUser.id] = [];
        saveDatabase();
        
        resolve({
          ...newUser,
          password: undefined
        });
      }, 500);
    });
  },

  updateUser: async (userId, userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = database.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          database.users[userIndex] = {
            ...database.users[userIndex],
            ...userData,
            id: userId, 
            password: database.users[userIndex].password 
          };
          saveDatabase();
          resolve({...database.users[userIndex], password: undefined});
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  
  deleteUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
  
        if (database.users.length <= 1) {
          resolve(false);
          return;
        }
        
        const userIndex = database.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
  
          database.users.splice(userIndex, 1);
          
  
          if (database.studiesData[userId]) {
            delete database.studiesData[userId];
          }
          
          if (database.addressesData[userId]) {
            delete database.addressesData[userId];
          }
          
          saveDatabase();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  
  getUserStudies: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(database.studiesData[userId] || []);
      }, 500);
    });
  },

  getStudyById: async (userId, studyId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studies = database.studiesData[userId] || [];
        resolve(studies.find(s => s.id === studyId) || null);
      }, 500);
    });
  },

  addStudy: async (userId, studyData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!database.studiesData[userId]) {
          database.studiesData[userId] = [];
        }

        const newStudy = {
          id: database.studiesData[userId].length + 1,
          ...studyData
        };

        database.studiesData[userId].push(newStudy);
        saveDatabase();
        resolve(newStudy);
      }, 500);
    });
  },

  updateStudy: async (userId, studyId, studyData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studies = database.studiesData[userId] || [];
        const studyIndex = studies.findIndex(s => s.id === studyId);
        
        if (studyIndex !== -1) {
          database.studiesData[userId][studyIndex] = {
            ...database.studiesData[userId][studyIndex],
            ...studyData,
            id: studyId 
          };
          saveDatabase();
          resolve(database.studiesData[userId][studyIndex]);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  deleteStudy: async (userId, studyId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (database.studiesData[userId]) {
          database.studiesData[userId] = database.studiesData[userId].filter(s => s.id !== studyId);
          saveDatabase();
          resolve(true);
        }
        resolve(false);
      }, 500);
    });
  },

  
  getUserAddresses: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(database.addressesData[userId] || []);
      }, 500);
    });
  },

  getAddressById: async (userId, addressId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const addresses = database.addressesData[userId] || [];
        resolve(addresses.find(a => a.id === addressId) || null);
      }, 500);
    });
  },

  addAddress: async (userId, addressData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        
        if (!database.addressesData[userId]) {
          database.addressesData[userId] = [];
        }
        
        
        if (Object.isFrozen(database.addressesData[userId]) || 
            !Array.isArray(database.addressesData[userId])) {
          
          database.addressesData[userId] = [...(Array.isArray(database.addressesData[userId]) 
            ? database.addressesData[userId] 
            : [])];
        }

        const newAddress = {
          id: (database.addressesData[userId].length > 0 
            ? Math.max(...database.addressesData[userId].map(a => a.id)) + 1 
            : 1),
          ...addressData
        };

        database.addressesData[userId].push(newAddress);
        saveDatabase();
        resolve(newAddress);
      }, 500);
    });
  },

  updateAddress: async (userId, addressId, addressData) => {
    return new Promise((resolve) => {
      setTimeout(() => {        
        if (!database.addressesData[userId] || Object.isFrozen(database.addressesData[userId])) {
          database.addressesData[userId] = [...(database.addressesData[userId] || [])];
        }
        
        const addresses = database.addressesData[userId] || [];
        const addressIndex = addresses.findIndex(a => a.id === addressId);
        
        if (addressIndex !== -1) {
          database.addressesData[userId][addressIndex] = {
            ...database.addressesData[userId][addressIndex],
            ...addressData,
            id: addressId
          };
          saveDatabase();
          resolve(database.addressesData[userId][addressIndex]);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  deleteAddress: async (userId, addressId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (database.addressesData[userId]) {
          // Create a new array without the target address
          database.addressesData[userId] = database.addressesData[userId].filter(a => a.id !== addressId);
          saveDatabase();
          resolve(true);
        }
        resolve(false);
      }, 500);
    });
  },

  // Utilidades
  resetDatabase: () => {
    database = { 
      users: [...initialData.users],
      studiesData: {...initialData.studiesData},
      addressesData: {...initialData.addressesData}
    };
    saveDatabase();
    return database;
  },

  // Nuevo: Obtener toda la base de datos (solo para desarrollo)
  getDatabase: () => {
    return {...database};
  }
};
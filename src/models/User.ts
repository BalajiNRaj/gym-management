export interface IUser {
  _id?: string;
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  accountNumber: string;
  role: 'admin' | 'trainer' | 'user'; // user = member
  status: 'active' | 'inactive';
  avatar?: string;
  image?: string;
  
  // Physical attributes (for members/trainers)
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  gender?: 'male' | 'female';
  
  // Fitness specific (for members)
  goal?: 'gain_weight' | 'lose_weight' | 'get_fitter' | 'get_stronger' | 'get_healthier';
  level?: 'beginner' | 'intermediate' | 'advanced';
  
  // Relationships
  adminId?: string; // Reference to admin who created this user
  trainerId?: string; // For members - their assigned trainer
  
  // Activity tracking
  isActive?: boolean; // Online status
  lastActive?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced User type for sessions
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'user';
  accountNumber: string;
  isAdmin: boolean;
}

// Mock data for development (extended)
export const mockUsers: IUser[] = [
  {
    id: '1',
    name: 'Gym Admin',
    email: 'admin@gym.com',
    hashedPassword: 'hashed_password',
    accountNumber: '000000000001',
    role: 'admin',
    status: 'active',
    isActive: true,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'John Trainer',
    email: 'trainer@gym.com',
    hashedPassword: 'hashed_password',
    accountNumber: '000000000002',
    role: 'trainer',
    status: 'active',
    age: 28,
    gender: 'male',
    adminId: '1',
    isActive: false,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '3',
    name: 'Jane Member',
    email: 'member@gym.com',
    hashedPassword: 'hashed_password',
    accountNumber: '000000000003',
    role: 'user',
    status: 'active',
    age: 25,
    weight: 65,
    height: 170,
    gender: 'female',
    goal: 'get_fitter',
    level: 'beginner',
    adminId: '1',
    trainerId: '2',
    isActive: true,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01')
  }
];

/**
 * In a real application, this would be replaced with actual database calls.
 * For now, these are mock functions that simulate database operations.
 */

export const UserModel = {
  findAll: () => {
    // Comment: This would fetch all users from the database
    return Promise.resolve(mockUsers);
  },
  
  findById: (id: string) => {
    // Comment: This would fetch a user by ID from the database
    const user = mockUsers.find(user => user.id === id);
    return Promise.resolve(user || null);
  },
  
  create: (userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Comment: This would create a new user in the database
    const newUser = {
      ...userData,
      id: String(mockUsers.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    } as IUser;
    
    // In a real app, this would be saved to the database
    return Promise.resolve(newUser);
  },
  
  update: (id: string, userData: Partial<IUser>) => {
    // Comment: This would update a user in the database
    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return Promise.resolve(null);
    }
    
    // In a real app, this would update the record in the database
    return Promise.resolve({
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date()
    });
  },
  
  delete: (id: string) => {
    // Comment: This would delete a user from the database
    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return Promise.resolve(false);
    }
    
    // In a real app, this would delete the record from the database
    return Promise.resolve(true);
  }
};

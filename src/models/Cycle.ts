export interface ICycle {
  id: string;
  name: string;
  numDays: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for development
export const mockCycles: ICycle[] = [
  {
    id: '1',
    name: 'Monthly',
    numDays: 30,
    status: 'active',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: '2',
    name: 'Yearly',
    numDays: 365,
    status: 'active',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: '3',
    name: 'Quarterly',
    numDays: 90,
    status: 'active',
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2022-03-15')
  },
  {
    id: '4',
    name: 'Weekly',
    numDays: 7,
    status: 'active',
    createdAt: new Date('2022-05-10'),
    updatedAt: new Date('2022-05-10')
  }
];

/**
 * In a real application, this would be replaced with actual database calls.
 * For now, these are mock functions that simulate database operations.
 */

export const CycleModel = {
  findAll: () => {
    // Comment: This would fetch all cycles from the database
    return Promise.resolve(mockCycles);
  },
  
  findById: (id: string) => {
    // Comment: This would fetch a cycle by ID from the database
    const cycle = mockCycles.find(cycle => cycle.id === id);
    return Promise.resolve(cycle || null);
  },
  
  create: (cycleData: Omit<ICycle, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Comment: This would create a new cycle in the database
    const newCycle = {
      ...cycleData,
      id: String(mockCycles.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    } as ICycle;
    
    // In a real app, this would be saved to the database
    return Promise.resolve(newCycle);
  },
  
  update: (id: string, cycleData: Partial<ICycle>) => {
    // Comment: This would update a cycle in the database
    const cycleIndex = mockCycles.findIndex(cycle => cycle.id === id);
    
    if (cycleIndex === -1) {
      return Promise.resolve(null);
    }
    
    // In a real app, this would update the record in the database
    return Promise.resolve({
      ...mockCycles[cycleIndex],
      ...cycleData,
      updatedAt: new Date()
    });
  },
  
  delete: (id: string) => {
    // Comment: This would delete a cycle from the database
    const cycleIndex = mockCycles.findIndex(cycle => cycle.id === id);
    
    if (cycleIndex === -1) {
      return Promise.resolve(false);
    }
    
    // In a real app, this would delete the record from the database
    return Promise.resolve(true);
  }
};

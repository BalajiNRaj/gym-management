export interface IBranch {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for development
export const mockBranches: IBranch[] = [
  {
    id: '1',
    name: 'Downtown Branch',
    description: 'Our main branch in the city center',
    status: 'active',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: '2',
    name: 'Westside Branch',
    description: 'Located in the western suburbs',
    status: 'active',
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2022-03-15')
  },
  {
    id: '3',
    name: 'Northside Branch',
    description: 'Our newest branch in the northern district',
    status: 'active',
    createdAt: new Date('2022-06-20'),
    updatedAt: new Date('2022-06-20')
  }
];

/**
 * In a real application, this would be replaced with actual database calls.
 * For now, these are mock functions that simulate database operations.
 */

export const BranchModel = {
  findAll: () => {
    // Comment: This would fetch all branches from the database
    return Promise.resolve(mockBranches);
  },
  
  findById: (id: string) => {
    // Comment: This would fetch a branch by ID from the database
    const branch = mockBranches.find(branch => branch.id === id);
    return Promise.resolve(branch || null);
  },
  
  create: (branchData: Omit<IBranch, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Comment: This would create a new branch in the database
    const newBranch = {
      ...branchData,
      id: String(mockBranches.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    } as IBranch;
    
    // In a real app, this would be saved to the database
    return Promise.resolve(newBranch);
  },
  
  update: (id: string, branchData: Partial<IBranch>) => {
    // Comment: This would update a branch in the database
    const branchIndex = mockBranches.findIndex(branch => branch.id === id);
    
    if (branchIndex === -1) {
      return Promise.resolve(null);
    }
    
    // In a real app, this would update the record in the database
    return Promise.resolve({
      ...mockBranches[branchIndex],
      ...branchData,
      updatedAt: new Date()
    });
  },
  
  delete: (id: string) => {
    // Comment: This would delete a branch from the database
    const branchIndex = mockBranches.findIndex(branch => branch.id === id);
    
    if (branchIndex === -1) {
      return Promise.resolve(false);
    }
    
    // In a real app, this would delete the record from the database
    return Promise.resolve(true);
  }
};

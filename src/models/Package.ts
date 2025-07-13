export interface IPackage {
  id: string;
  name: string;
  description?: string;
  amount: number;
  status: 'active' | 'inactive';
  cycleId: string;
  services: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for development
export const mockPackages: IPackage[] = [
  {
    id: '1',
    name: 'Basic Membership',
    description: 'Access to basic gym facilities',
    amount: 29.99,
    status: 'active',
    cycleId: '1', // Monthly cycle
    services: ['1', '2'], // Basic services
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: '2',
    name: 'Premium Membership',
    description: 'Full access to all gym facilities and classes',
    amount: 49.99,
    status: 'active',
    cycleId: '1', // Monthly cycle
    services: ['1', '2', '3', '4'], // All services
    createdAt: new Date('2022-02-15'),
    updatedAt: new Date('2022-02-15')
  },
  {
    id: '3',
    name: 'Annual Basic',
    description: 'Yearly subscription for basic facilities',
    amount: 299.99,
    status: 'active',
    cycleId: '2', // Yearly cycle
    services: ['1', '2'],
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2022-03-10')
  }
];

/**
 * In a real application, this would be replaced with actual database calls.
 * For now, these are mock functions that simulate database operations.
 */

export const PackageModel = {
  findAll: () => {
    // Comment: This would fetch all packages from the database
    return Promise.resolve(mockPackages);
  },
  
  findById: (id: string) => {
    // Comment: This would fetch a package by ID from the database
    const packageItem = mockPackages.find(pkg => pkg.id === id);
    return Promise.resolve(packageItem || null);
  },
  
  create: (packageData: Omit<IPackage, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Comment: This would create a new package in the database
    const newPackage = {
      ...packageData,
      id: String(mockPackages.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    } as IPackage;
    
    // In a real app, this would be saved to the database
    return Promise.resolve(newPackage);
  },
  
  update: (id: string, packageData: Partial<IPackage>) => {
    // Comment: This would update a package in the database
    const packageIndex = mockPackages.findIndex(pkg => pkg.id === id);
    
    if (packageIndex === -1) {
      return Promise.resolve(null);
    }
    
    // In a real app, this would update the record in the database
    return Promise.resolve({
      ...mockPackages[packageIndex],
      ...packageData,
      updatedAt: new Date()
    });
  },
  
  delete: (id: string) => {
    // Comment: This would delete a package from the database
    const packageIndex = mockPackages.findIndex(pkg => pkg.id === id);
    
    if (packageIndex === -1) {
      return Promise.resolve(false);
    }
    
    // In a real app, this would delete the record from the database
    return Promise.resolve(true);
  }
};

export interface IService {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for development
export const mockServices: IService[] = [
  {
    id: '1',
    name: 'Gym Access',
    description: 'Access to all gym equipment',
    status: 'active',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: '2',
    name: 'Locker Access',
    description: 'Access to locker room facilities',
    status: 'active',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: '3',
    name: 'Group Classes',
    description: 'Access to all group fitness classes',
    status: 'active',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2022-01-15')
  },
  {
    id: '4',
    name: 'Personal Training',
    description: 'One-on-one training sessions',
    status: 'active',
    createdAt: new Date('2022-02-01'),
    updatedAt: new Date('2022-02-01')
  }
];

/**
 * In a real application, this would be replaced with actual database calls.
 * For now, these are mock functions that simulate database operations.
 */

export const ServiceModel = {
  findAll: () => {
    // Comment: This would fetch all services from the database
    return Promise.resolve(mockServices);
  },
  
  findById: (id: string) => {
    // Comment: This would fetch a service by ID from the database
    const service = mockServices.find(service => service.id === id);
    return Promise.resolve(service || null);
  },
  
  create: (serviceData: Omit<IService, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Comment: This would create a new service in the database
    const newService = {
      ...serviceData,
      id: String(mockServices.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    } as IService;
    
    // In a real app, this would be saved to the database
    return Promise.resolve(newService);
  },
  
  update: (id: string, serviceData: Partial<IService>) => {
    // Comment: This would update a service in the database
    const serviceIndex = mockServices.findIndex(service => service.id === id);
    
    if (serviceIndex === -1) {
      return Promise.resolve(null);
    }
    
    // In a real app, this would update the record in the database
    return Promise.resolve({
      ...mockServices[serviceIndex],
      ...serviceData,
      updatedAt: new Date()
    });
  },
  
  delete: (id: string) => {
    // Comment: This would delete a service from the database
    const serviceIndex = mockServices.findIndex(service => service.id === id);
    
    if (serviceIndex === -1) {
      return Promise.resolve(false);
    }
    
    // In a real app, this would delete the record from the database
    return Promise.resolve(true);
  }
};

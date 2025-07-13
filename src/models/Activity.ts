export interface IActivity {
  id: string;
  userId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for development
export const mockActivities: IActivity[] = [
  {
    id: '1',
    userId: '1',
    description: 'User logged in',
    createdAt: new Date('2023-06-01T09:00:00'),
    updatedAt: new Date('2023-06-01T09:00:00')
  },
  {
    id: '2',
    userId: '1',
    description: 'Profile updated',
    createdAt: new Date('2023-06-01T09:15:00'),
    updatedAt: new Date('2023-06-01T09:15:00')
  },
  {
    id: '3',
    userId: '2',
    description: 'New subscription purchased',
    createdAt: new Date('2023-06-02T14:30:00'),
    updatedAt: new Date('2023-06-02T14:30:00')
  }
];

/**
 * In a real application, this would be replaced with actual database calls.
 * For now, these are mock functions that simulate database operations.
 */

export const ActivityModel = {
  findAll: () => {
    // Comment: This would fetch all activities from the database
    return Promise.resolve(mockActivities);
  },
  
  findByUserId: (userId: string) => {
    // Comment: This would fetch activities for a specific user from the database
    const activities = mockActivities.filter(activity => activity.userId === userId);
    return Promise.resolve(activities);
  },
  
  create: (activityData: Omit<IActivity, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Comment: This would create a new activity in the database
    const newActivity = {
      ...activityData,
      id: String(mockActivities.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    } as IActivity;
    
    // In a real app, this would be saved to the database
    return Promise.resolve(newActivity);
  }
};

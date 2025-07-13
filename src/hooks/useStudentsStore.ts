import { useState, useCallback } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  membershipType: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastPayment?: string;
  image?: string;
}

export function useStudentsStore() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch students';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      
      const data = await response.json();
      setStudents(prev => [...prev, data.student]);
      return data.student;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add student';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (id: string, updates: Partial<Student>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      
      const data = await response.json();
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...data.student } : student
      ));
      return data.student;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update student';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete student';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    clearError,
  };
}

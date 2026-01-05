import { useState, useCallback } from 'react';
import { validateEmployee } from '@/utils/validators';

/**
 * Custom hook for managing employee list
 * @param {Array} initialEmployees - Initial employee list
 * @returns {Object} Employee management methods
 */
export function useEmployees(initialEmployees = []) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [errors, setErrors] = useState({});

  /**
   * Add new employee
   */
  const addEmployee = useCallback((employee) => {
    const validation = validateEmployee(employee);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }

    // Check for duplicate address
    const isDuplicate = employees.some(
      emp => emp.address.toLowerCase() === employee.address.toLowerCase()
    );

    if (isDuplicate) {
      const error = { address: 'This address already exists in the list' };
      setErrors(error);
      return { success: false, errors: error };
    }

    const newEmployee = {
      ...employee,
      id: Date.now(),
      addedAt: Date.now(),
    };

    setEmployees(prev => [...prev, newEmployee]);
    setErrors({});

    return { success: true, employee: newEmployee };
  }, [employees]);

  /**
   * Remove employee by ID
   */
  const removeEmployee = useCallback((id) => {
    const employee = employees.find(emp => emp.id === id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    return { success: true, employee };
  }, [employees]);

  /**
   * Update employee
   */
  const updateEmployee = useCallback((id, updates) => {
    setEmployees(prev =>
      prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
    );
  }, []);

  /**
   * Clear all employees
   */
  const clearEmployees = useCallback(() => {
    setEmployees([]);
    setErrors({});
  }, []);

  /**
   * Get total amount
   */
  const getTotalAmount = useCallback(() => {
    return employees.reduce((sum, emp) => sum + parseFloat(emp.amount || 0), 0);
  }, [employees]);

  /**
   * Get employee by ID
   */
  const getEmployeeById = useCallback((id) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  /**
   * Get addresses array
   */
  const getAddresses = useCallback(() => {
    return employees.map(emp => emp.address);
  }, [employees]);

  /**
   * Get amounts array (in Wei)
   */
  // Tìm hàm getAmounts và thay thế bằng:
  const getAmounts = useCallback(() => {
    return employees.map(emp => {
      // Sử dụng chuỗi để tránh lỗi số thực của JS
      const amountStr = emp.amount.toString();
      const parts = amountStr.split('.');
      let [whole, fraction = ''] = parts;
      fraction = fraction.padEnd(6, '0').slice(0, 6);
      return BigInt(whole + fraction);
    });
  }, [employees]);

  return {
    employees,
    errors,
    addEmployee,
    removeEmployee,
    updateEmployee,
    clearEmployees,
    getTotalAmount,
    getEmployeeById,
    getAddresses,
    getAmounts,
    count: employees.length,
  };
}
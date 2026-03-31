import Employee from '../models/Employee.js';
import { deleteFromCloudinary } from '../middleware/deleteFromCloudinary.js';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    
    // Map for frontend
    const mappedEmployees = employees.map(emp => ({
      ...emp._doc,
      imageUrl: emp.image // Mapping for frontend
    }));
    
    res.json(mappedEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  const { name, role, image, imageUrl } = req.body;

  try {
    const employee = new Employee({
      name,
      role,
      image: image || imageUrl,
    });

    const createdEmployee = await employee.save();
    res.status(201).json(createdEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  const { name, role, image, imageUrl } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = name || employee.name;
      employee.role = role || employee.role;
      employee.image = image || imageUrl || employee.image;

      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      if (employee.image) {
        await deleteFromCloudinary(employee.image);
      }
      await employee.deleteOne();
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

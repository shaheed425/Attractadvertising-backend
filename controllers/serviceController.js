import Service from '../models/Service.js';
import { deleteFromCloudinary } from '../middleware/deleteFromCloudinary.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  const { title, description, icon, price, isPremium, details } = req.body;

  try {
    const service = new Service({
      title,
      description,
      icon,
      price,
      isPremium,
      details,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  const { title, description, icon, price, isPremium, details } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.title = title || service.title;
      service.description = description || service.description;
      service.icon = icon || service.icon;
      service.price = price || service.price;
      service.isPremium = isPremium !== undefined ? isPremium : service.isPremium;
      service.details = details || service.details;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
  
      if (service) {
        // Delete image from Cloudinary if it exists
        if (service.icon) {
          await deleteFromCloudinary(service.icon);
        }
        await service.deleteOne();
        res.json({ message: 'Service removed' });
      } else {
        res.status(404).json({ message: 'Service not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

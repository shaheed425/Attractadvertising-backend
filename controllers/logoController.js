import Logo from '../models/Logo.js';

// @desc    Get all logos (clients)
// @route   GET /api/logos
// @access  Public
export const getLogos = async (req, res) => {
  try {
    const logos = await Logo.find({});

    // Map for frontend
    const mappedLogos = logos.map(item => {
      const obj = item.toObject();
      return {
        ...obj,
        clientName: obj.name,
        logoUrl: obj.logo
      };
    });

    res.json(mappedLogos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a logo
// @route   POST /api/logos
// @access  Private/Admin
export const createLogo = async (req, res) => {
  const { name, logo, clientName, logoUrl } = req.body;

  try {
    const clientLogo = new Logo({
      name: name || clientName,
      logo: logo || logoUrl,
    });

    const createdLogo = await clientLogo.save();
    res.status(201).json(createdLogo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a logo
// @route   DELETE /api/logos/:id
// @access  Private/Admin
export const deleteLogo = async (req, res) => {
    try {
      const logo = await Logo.findById(req.params.id);
  
      if (logo) {
        await logo.deleteOne();
        res.json({ message: 'Logo removed' });
      } else {
        res.status(404).json({ message: 'Logo not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

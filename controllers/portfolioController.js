import Portfolio from '../models/Portfolio.js';

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
export const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 });
    
    // Map internal fields to frontend expected fields
    const mappedPortfolios = portfolios.map(item => ({
      ...item._doc,
      imageUrl: item.media, // Mapping for frontend
      client: item.category, // Mapping for frontend
      metrics: item.description // Mapping for frontend
    }));
    
    res.json(mappedPortfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
// @access  Public
export const getPortfolioById = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (item) {
      res.json({
        ...item._doc,
        imageUrl: item.media,
        client: item.category,
        metrics: item.description
      });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a portfolio item
// @route   POST /api/portfolio
// @access  Private/Admin
export const createPortfolio = async (req, res) => {
  const { title, category, description, media, client, metrics, imageUrl, details } = req.body;

  try {
    const portfolio = new Portfolio({
      title,
      category: category || client || 'General',
      description: description || metrics || 'Project Description',
      media: media || imageUrl,
      details: details || '',
    });

    const createdPortfolio = await portfolio.save();
    res.status(201).json(createdPortfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
export const updatePortfolio = async (req, res) => {
  const { title, category, description, media, client, metrics, imageUrl, details } = req.body;

  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (portfolio) {
      portfolio.title = title || portfolio.title;
      portfolio.category = category || client || portfolio.category;
      portfolio.description = description || metrics || portfolio.description;
      portfolio.media = media || imageUrl || portfolio.media;
      portfolio.details = details !== undefined ? details : portfolio.details;

      const updatedPortfolio = await portfolio.save();
      res.json(updatedPortfolio);
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (portfolio) {
      await portfolio.deleteOne();
      res.json({ message: 'Portfolio item removed' });
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Contact from '../models/Contact.js';

// @desc    Submit a contact form
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { companyName, clientName, address, email, mobileNumber } = req.body;

    const contact = await Contact.create({
      companyName,
      clientName,
      address,
      email,
      mobileNumber,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid contact data' });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contact submission
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.deleteOne();
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { submitContact, getContacts, deleteContact };

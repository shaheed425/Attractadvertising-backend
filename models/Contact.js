import mongoose from 'mongoose';

const contactSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;

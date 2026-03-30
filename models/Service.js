import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String }, // Optional
  price: { type: String },
  isPremium: { type: Boolean, default: false },
  details: [
    {
      label: { type: String },
      content: { type: String }
    }
  ]
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

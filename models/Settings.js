import mongoose from 'mongoose';

const timeSlotSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  timeRange: { type: String, required: true },
  duration: { type: String, default: '3 Hours' },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
  tag: { type: String, default: '' },
  popular: { type: Boolean, default: false },
});

const settingsSchema = mongoose.Schema(
  {
    upiId: {
      type: String,
      required: true,
      default: '7034204464@ybl',
    },
    ownerName: {
      type: String,
      required: true,
      default: 'ATTRACT ADVERTISING',
    },
    qrImage: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: 'https://www.instagram.com/zynexta_/',
    },
    heroShowcaseImage: {
      type: String,
      default: '',
    },
    timeSlots: [timeSlotSchema],
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;

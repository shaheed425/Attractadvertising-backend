import mongoose from 'mongoose';

const scheduleSchema = mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 4000,
    },
    originalAmount: {
      type: Number,
      default: 4000,
    },
    couponCode: {
      type: String,
      default: '',
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 4000,
    },
    paymentScreenshot: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      default: 'Pending Confirmation',
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;

import mongoose from 'mongoose';

const testimonialSchema = mongoose.Schema(
  {
    clientName: {
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
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviewText: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;

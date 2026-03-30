import mongoose from 'mongoose';

const portfolioSchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  media: { type: String, required: true }, // URL for image or video
  details: { type: String }, // Long form case study or project details
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;

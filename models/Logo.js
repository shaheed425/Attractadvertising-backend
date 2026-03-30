import mongoose from 'mongoose';

const logoSchema = mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
}, { timestamps: true });

const Logo = mongoose.model('Logo', logoSchema);
export default Logo;

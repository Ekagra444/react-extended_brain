import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;
if(!process.env.MONGO_URI){
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
// Schema definitions
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const contentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    url: { type: String },
    type: { 
      type: String, 
      required: true, 
      enum: ['youtube', 'twitter', 'task', 'blog', 'other'] 
    },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
  });
  
  const shareSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    shareId: { type: String, required: true, unique: true },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  });
  const LinkSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });
  // Models
  export const User = mongoose.model('User', userSchema);
  export const Content = mongoose.model('Content', contentSchema);
  export const Share = mongoose.model('Share', shareSchema);



 

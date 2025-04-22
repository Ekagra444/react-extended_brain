import express, { raw } from 'express';
import { User,Content,Share } from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from './middleware';
import { Request, Response, NextFunction } from 'express';
// import {jwt} from 'jsonwebtoken';
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const app = express();
// Generate a random share ID
const generateShareId = () => {
    return Math.random().toString(36).substring(2, 10);
  };
// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.post('/api/v1/signup', async (req: Request, res: Response) :Promise<any>=> {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });
  
      await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
  
      res.status(201).json({
        message: 'User created successfully',
        token,
        userId: newUser._id,
        username: newUser.username
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error during signup' });
    }
  });
  
  app.post('/api/v1/login', async (req: Request, res: Response):Promise<any> => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Find user
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
  
      res.status(200).json({
        message: 'Login successful',
        token,
        userId: user._id,
        username: user.username
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });
  
  
  app.get('/api/v1/signin', (req: Request, res: Response) => {
    res.status(301).json({
      message: 'This endpoint is deprecated. Please use /api/v1/login instead.'
    });
  });
  interface AuthRequest extends Request {
    userId?: mongoose.Types.ObjectId;
  }
  
  app.get('/api/v1/content', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { type, search, tag } = req.query;
      const query: any = { userId: req.userId };
      const rawType = String(type || "").trim().toLowerCase();
      if (rawType && rawType !== 'all') {
        query.type = rawType;
      }

      // // Filter by content type if provided
      // if (type && type !== 'all') {
      //   query.type = type;
      // }
  
      // Search in title or content
      const rawSearch = String(search || "").trim().toLowerCase(); //had to do this 
      if (rawSearch) {
        query.$or = [
          { title: { $regex: rawSearch, $options: 'i' } },// ignore case
          { content: { $regex: rawSearch, $options: 'i' } }
        ];
      }
  
      // Filter by tag if provided
      const rawTag = String(tag || "").trim().toLowerCase();
      if (rawTag) {
        query.tags = { $in: [rawTag] };
      }
  
      const contents = await Content.find(query).populate('userId', 'username email ')  // only fetch username and email;
        .sort({ updatedAt: -1 }); //most recently updated one first

      console.log('userId from token:', req.userId);
      res.status(200).json(contents);
    } catch (error) {
      console.error('Content retrieval error:', error);
      res.status(500).json({ message: 'Server error while retrieving content' });
    }
  });

  app.get('/api/v1/content/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid content ID' });
      return
    }
  
    try {
      const content = await Content.findById(id);
  
      if (!content) {
        res.status(404).json({ message: 'Content not found' });
        return 
      }
  
      if (content.userId.toString() !== req.userId?.toString()) {
        res.status(403).json({ message: 'Not authorized to view this content' });
        return 
      }
  
      res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ message: 'Server error while fetching content' });
    }
  });
  
  
  app.post('/api/v1/content', authMiddleware,  async (req: AuthRequest, res: Response) => {
    try {
      const { userId, title, content, url, type, tags } = req.body;
  
      if (!title || !content || !type) {
          res.status(400).json({ message: 'Title, content, and type are required' });
          return 
    }
  
      const newContent = new Content({
        userId,// will have to do req.userId in the future in production 🚏🛑🛑🛑 spoofing might be possible if not corrected since userId may be faked by other users 
        title,
        content,
        url,
        type,
        tags: tags || []
      })
      
      
  

      await newContent.save();
  
      res.status(201).json({
        message: 'Content saved successfully',
        content: newContent
      });
    } catch (error) {
      console.error('Content creation error:', error);
      res.status(500).json({ message: 'Server error while saving content' });
    }
  });
  
  app.put('/api/v1/content/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content, url, type, tags } = req.body;
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid content ID' });
        return 
      }
  
      // Find content and check ownership
      const contentItem = await Content.findById(id);
      
      if (!contentItem) {
        res.status(404).json({ message: 'Content not found' });
        return
      }
      
      if (contentItem.userId.toString() !== req.userId?.toString()) {
        res.status(403).json({ message: 'Not authorized to update this content' });
        return 
      }
  
      // Update content
      const updatedContent = await Content.findByIdAndUpdate(
        id,
        {
          title,
          content,
          url,
          type,
          tags,
          updatedAt: new Date()
        },
        { new: true }
      );
  
      res.status(200).json({
        message: 'Content updated successfully',
        content: updatedContent
      });
    } catch (error) {
      console.error('Content update error:', error);
      res.status(500).json({ message: 'Server error while updating content' });
    }
  });
  
  app.delete('/api/v1/content/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid content ID' });
        return
      }
  
      // Find content and check ownership
      const contentItem = await Content.findById(id);
      
      if (!contentItem) {
        res.status(404).json({ message: 'Content not found' });
        return 
      }
      
      if (contentItem.userId.toString() !== req.userId?.toString()) {
        res.status(403).json({ message: 'Not authorized to delete this content' });
        return 
      }
  
      // Delete content
      await Content.findByIdAndDelete(id);
  
      // Also remove from any shares
      await Share.updateMany(
        { contentIds: id },
        { $pull: { contentIds: id } }
      );
  
      res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
      console.error('Content deletion error:', error);
      res.status(500).json({ message: 'Server error while deleting content' });
    }
  });
  
  app.post('/api/v1/brain/share', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { contentIds, expiresIn } = req.body;
      
      if (!contentIds || !Array.isArray(contentIds) || contentIds.length === 0) {
        res.status(400).json({ message: 'At least one content ID is required' });
        return 
      }
  
      // Verify all content belongs to user
      const contents = await Content.find({
        _id: { $in: contentIds },
        userId: req.userId
      });
  
      if (contents.length !== contentIds.length) {
        res.status(403).json({ message: 'You can only share your own content' });
        return 
      }
  
      // Generate unique share ID
      const shareId = generateShareId();
      
      // Calculate expiration date if provided
      let expiresAt = null;
      if (expiresIn) {
        expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
      }
  
      // Create share
      const newShare = new Share({
        userId: req.userId,
        contentIds,
        shareId,
        expiresAt
      });
  
      await newShare.save();
  
      res.status(201).json({
        message: 'Content shared successfully',
        shareId,
        shareLink: `${req.protocol}://${req.get('host')}/share/${shareId}`,
        expiresAt
      });
    } catch (error) {
      console.error('Share creation error:', error);
      res.status(500).json({ message: 'Server error while creating share' });
    }
  });
  
  app.get('/api/v1/brain/:shareId', async (req: Request, res: Response) => {
    try {
      const { shareId } = req.params;
      
      // Find share
      const share = await Share.findOne({ shareId });
      
      if (!share) {
        res.status(404).json({ message: 'Shared content not found' });
        return 
      }
  
      // Check if share is expired
      if (share.expiresAt && new Date() > share.expiresAt) {
        res.status(410).json({ message: 'This shared content has expired' });
        return 
      }
  
      // Get shared content
      const contents = await Content.find({ _id: { $in: share.contentIds } });
      
      // Get user info (just username)
      const user = await User.findById(share.userId, 'username');
  
      res.status(200).json({
        sharedBy: user?.username || 'Unknown user',
        contents
      });
    } catch (error) {
      console.error('Share retrieval error:', error);
      res.status(500).json({ message: 'Server error while retrieving shared content' });
    }
  });
  
  // Additional useful endpoints
  
  // Get tags for filtering (user's unique tags)
  app.get('/api/v1/tags', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const contents = await Content.find({ userId: req.userId });
      const tags = new Set<string>();
      
      contents.forEach(content => {
        if (content.tags && Array.isArray(content.tags)) {
          content.tags.forEach(tag => tags.add(tag));
        }
      });
      
      res.status(200).json(Array.from(tags));
    } catch (error) {
      console.error('Tags retrieval error:', error);
      res.status(500).json({ message: 'Server error while retrieving tags' });
    }
  });
  
  // Get user profile with content stats
  app.get('/api/v1/user/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return
      }
      
      // Get content stats
      const contentStats = await Content.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
        { $group: { 
          _id: '$type', 
          count: { $sum: 1 } 
        }}
      ]);
      
      res.status(200).json({
        user,
        stats: contentStats
      });
    } catch (error) {
      console.error('Profile retrieval error:', error);
      res.status(500).json({ message: 'Server error while retrieving profile' });
    }
  });
  
  // Update user profile
  app.put('/api/v1/user/profile', authMiddleware, async (req: AuthRequest, res: Response)=> {
    try {
      const { username, email, currentPassword, newPassword } = req.body;
      const updates: any = {};
      
      if (username) updates.username = username;
      if (email) updates.email = email;
      
      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) {
        res.status(400).json({ message: 'Current password is required to set new password' });
          return 
        }
        
        const user = await User.findById(req.userId);
        if (!user) {
        res.status(404).json({ message: 'User not found' });
          return
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
        res.status(401).json({ message: 'Current password is incorrect' });
          return 
        }
        
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(newPassword, salt);
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        updates,
        { new: true }
      ).select('-password');
      
      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  });
 

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  
  export default app;
const jwt = require('jsonwebtoken');
const { User, Restaurant } = require('../models');
const { validationResult } = require('express-validator');
const QRService = require('../services/qrService');
const EmailService = require('../services/emailService');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, restaurantName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: 'restaurant'
      });

      // Create restaurant
      const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
      const qrCodeUrl = await QRService.generateQRCode(slug);
      
      const restaurant = await Restaurant.create({
        userId: user.id,
        name: restaurantName,
        slug,
        qrCodeUrl
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ 
        where: { email },
        include: [{
          model: Restaurant,
          as: 'restaurant',
          required: false
        }]
      });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.status !== 'active') {
        return res.status(401).json({ message: 'Account is inactive' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        restaurant: user.restaurant ? {
          id: user.restaurant.id,
          name: user.restaurant.name,
          slug: user.restaurant.slug
        } : null
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Restaurant,
          as: 'restaurant',
          required: false
        }]
      });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        restaurant: user.restaurant ? {
          id: user.restaurant.id,
          name: user.restaurant.name,
          slug: user.restaurant.slug,
          logo: user.restaurant.logo,
          address: user.restaurant.address,
          themeColor: user.restaurant.themeColor,
          qrCodeUrl: user.restaurant.qrCodeUrl
        } : null
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, restaurantName, address, themeColor } = req.body;

      // Update user
      await User.update(
        { name, email },
        { where: { id: req.user.id } }
      );

      // Update restaurant if exists
      if (restaurantName) {
        await Restaurant.update(
          { 
            name: restaurantName,
            address: address || null,
            themeColor: themeColor || '#3B82F6'
          },
          { where: { userId: req.user.id } }
        );
      }

      // Get updated data
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Restaurant,
          as: 'restaurant',
          required: false
        }]
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        restaurant: user.restaurant ? {
          id: user.restaurant.id,
          name: user.restaurant.name,
          slug: user.restaurant.slug,
          logo: user.restaurant.logo,
          address: user.restaurant.address,
          themeColor: user.restaurant.themeColor,
          qrCodeUrl: user.restaurant.qrCodeUrl
        } : null
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
      }

      // Generate reset token
      const resetToken = require('crypto').randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });

      // Send email with reset link
      const emailSent = await EmailService.sendPasswordResetEmail(email, resetToken);
      
      if (emailSent) {
        res.json({
          message: 'Password reset email sent successfully',
          emailSent: true
        });
      } else {
        // Fallback: send token-only email
        const tokenEmailSent = await EmailService.sendPasswordResetToken(email, resetToken);
        
        if (tokenEmailSent) {
          res.json({
            message: 'Reset token sent to your email',
            emailSent: true,
            tokenOnly: true
          });
        } else {
          // Final fallback for development
          res.json({
            message: 'Email service unavailable. Use this token:',
            resetToken,
            emailSent: false
          });
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, password } = req.body;

      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Update password and clear reset token
      await user.update({
        password,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
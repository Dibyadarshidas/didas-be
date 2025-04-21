const Subscriber = require('../models/subscriber');
const emailService = require('../services/emailService');
const logger = require('../config/logger');

const newsletterController = {
  // Subscribe to newsletter
  async subscribe(req, res) {
    try {
      const { email, firstName, lastName } = req.body;
      
      // Validate required fields
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide an email address' 
        });
      }
      
      // Check if email already exists
      const existingSubscriber = await Subscriber.findOne({ email });
      
      if (existingSubscriber) {
        // If already active
        if (existingSubscriber.active) {
          return res.status(200).json({ 
            success: true, 
            message: 'You are already subscribed to our newsletter!' 
          });
        } 
        // If previously unsubscribed, reactivate
        else {
          existingSubscriber.active = true;
          await existingSubscriber.save();
          
          // Send welcome email again
          await emailService.sendWelcomeEmail(existingSubscriber);
          
          return res.status(200).json({ 
            success: true, 
            message: 'You have been resubscribed to our newsletter. Check your email for the AI tricks PDF!' 
          });
        }
      }
      
      // Create new subscriber
      const newSubscriber = new Subscriber({
        email,
        firstName,
        lastName
      });
      
      await newSubscriber.save();
      
      // Send welcome email with PDF
      await emailService.sendWelcomeEmail(newSubscriber);
      
      // Notify admin about new subscriber
      await emailService.sendSubscriberNotification(newSubscriber);
      
      logger.info(`New newsletter subscription: ${email}`);
      return res.status(201).json({ 
        success: true, 
        message: 'Successfully subscribed! Check your email for our AI tricks PDF.' 
      });
    } catch (error) {
      logger.error('Newsletter subscription error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to subscribe. Please try again later.' 
      });
    }
  },
  
  // Unsubscribe from newsletter
  async unsubscribe(req, res) {
    try {
      const { email, token } = req.query;
      
      if (!email || !token) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid unsubscribe request' 
        });
      }
      
      // Find subscriber by email and token
      const subscriber = await Subscriber.findOne({ 
        email, 
        unsubscribeToken: token 
      });
      
      if (!subscriber) {
        return res.status(404).json({ 
          success: false, 
          message: 'Invalid unsubscribe link' 
        });
      }
      
      // Deactivate subscriber
      subscriber.active = false;
      await subscriber.save();
      
      logger.info(`Unsubscribed: ${email}`);
      return res.status(200).json({ 
        success: true, 
        message: 'You have been successfully unsubscribed from our newsletter.' 
      });
    } catch (error) {
      logger.error('Unsubscribe error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to process unsubscribe request. Please try again later.' 
      });
    }
  }
};

module.exports = newsletterController;
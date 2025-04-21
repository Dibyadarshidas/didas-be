const Contact = require('../models/contact');
const emailService = require('../services/emailService');
const logger = require('../config/logger');

const contactController = {
  // Submit a new contact form
  async submitContact(req, res) {
    try {
      const { name, email, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide name, email, and message' 
        });
      }
      
      // Create and save contact entry
      const newContact = new Contact({
        name,
        email,
        message
      });
      
      await newContact.save();
      
      // Send email notification
      await emailService.sendContactNotification(newContact);
      
      logger.info(`New contact form submitted: ${email}`);
      return res.status(200).json({ 
        success: true, 
        message: 'Your message has been sent successfully! We will get back to you soon.' 
      });
    } catch (error) {
      logger.error('Contact form submission error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to submit your message. Please try again later.' 
      });
    }
  }
};

module.exports = contactController;
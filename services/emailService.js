const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger');
const crypto = require('crypto');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    logger.error('Email service error:', error);
  } else {
    logger.info('Email server is ready to send messages');
  }
});

const emailService = {
  // Send contact form notification to admin
  async sendContactNotification(contact) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New contact form submission from ${contact.name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>
          <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
        `
      });
      logger.info(`Contact notification sent for ${contact.email}`);
      return true;
    } catch (error) {
      logger.error('Error sending contact notification:', error);
      throw error;
    }
  },

  // Send welcome email with PDF to new subscriber
  async sendWelcomeEmail(subscriber) {
    try {
      // Generate unsubscribe token
      const unsubscribeToken = crypto.randomBytes(32).toString('hex');
      subscriber.unsubscribeToken = unsubscribeToken;
      await subscriber.save();
      
      // Get PDF file path
      const pdfPath = path.join(__dirname, '../assets/pdfs/ai-tricks.pdf');
      
      // Prepare email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: 'Welcome to Our AI Mentorship Newsletter!',
        html: `
          <h2>Thank you for subscribing!</h2>
          <p>We're excited to have you join our community of AI enthusiasts.</p>
          <p>You'll receive our regular newsletter with tips, tricks, and updates on AI development.</p>
          <p>Best regards,<br>Your Mentorship Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            If you'd like to unsubscribe, <a href="${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}&email=${subscriber.email}">click here</a>
          </p>
        `,
        attachments: []
      };
      
      // Check if PDF exists before attaching
      try {
        await fs.access(pdfPath);
        // PDF exists, add to attachments
        mailOptions.html = mailOptions.html.replace(
          "<p>You'll receive our regular newsletter with tips, tricks, and updates on AI development.</p>",
          "<p>Attached you'll find our PDF guide on \"AI Tricks for Developers\" that will help you get started.</p>" +
          "<p>You'll receive our regular newsletter with tips, tricks, and updates on AI development.</p>"
        );
        mailOptions.attachments.push({
          filename: 'AI-Tricks-Guide.pdf',
          path: pdfPath
        });
        subscriber.pdfSent = true;
      } catch (err) {
        // PDF doesn't exist, continue without attachment
        logger.warn(`PDF attachment not found: ${pdfPath}. Sending email without attachment.`);
        subscriber.pdfSent = false;
      }
      
      // Send the email
      await transporter.sendMail(mailOptions);
      
      // Update subscriber status
      await subscriber.save();
      
      logger.info(`Welcome email sent to ${subscriber.email}`);
      return true;
    } catch (error) {
      logger.error(`Error sending welcome email to ${subscriber.email}:`, error);
      throw error;
    }
  },
  
  // Send notification about new subscriber to admin
  async sendSubscriberNotification(subscriber) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Newsletter Subscriber',
        html: `
          <h3>New Newsletter Subscriber</h3>
          <p><strong>Email:</strong> ${subscriber.email}</p>
          <p><strong>Date:</strong> ${new Date(subscriber.subscriptionDate).toLocaleString()}</p>
        `
      });
      logger.info(`Admin notification sent for new subscriber: ${subscriber.email}`);
      return true;
    } catch (error) {
      logger.error('Error sending subscriber notification:', error);
      throw error;
    }
  }
};

module.exports = emailService;
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { rateLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form management
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     description: Submit a new contact form message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the sender
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the sender
 *               message:
 *                 type: string
 *                 description: The message content
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your message has been sent successfully! We will get back to you soon.
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide name, email, and message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to submit your message. Please try again later.
 */
router.post('/', rateLimiter, contactController.submitContact);

module.exports = router;
const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { rateLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Newsletter
 *   description: Newsletter subscription management
 */

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     description: Subscribe to the newsletter using an email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email to subscribe
 *               name:
 *                 type: string
 *                 description: Subscriber's name (optional)
 *     responses:
 *       200:
 *         description: Subscribed successfully
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
 *                   example: You have been subscribed to our newsletter!
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
 *                   example: Please provide a valid email address
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
 *                   example: Failed to subscribe. Please try again later.
 */
router.post('/subscribe', rateLimiter, newsletterController.subscribe);

/**
 * @swagger
 * /api/newsletter/unsubscribe:
 *   get:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     description: Unsubscribe from the newsletter using email and token
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email to unsubscribe
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Unsubscribe token
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
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
 *                   example: You have been unsubscribed from our newsletter.
 *       400:
 *         description: Invalid token or email
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
 *                   example: Invalid unsubscribe request
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
 *                   example: Failed to unsubscribe. Please try again later.
 */
router.get('/unsubscribe', newsletterController.unsubscribe);

module.exports = router;
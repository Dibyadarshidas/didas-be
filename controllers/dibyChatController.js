const axios = require('axios');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for interacting with Diby Chat AI
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: The message to send to the AI
 *       example:
 *         message: "What is machine learning?"
 *     ChatResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         data:
 *           type: string
 *           description: The AI's response
 *       example:
 *         success: true
 *         data: "Machine learning is a branch of artificial intelligence that focuses on building systems that learn from data..."
 */

/**
 * @swagger
 * /api/diby-chat/chat:
 *   post:
 *     summary: Chat with AI assistant
 *     tags: [Chat]
 *     description: Send a message to the AI assistant and get a response using Cohere's API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Successful response from AI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Bad request, message is missing
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
 *                   example: "Message is required"
 *       500:
 *         description: Server error while processing request
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
 *                   example: "Error processing chat request"
 *                 error:
 *                   type: string
 *                   example: "API connection error"
 */
// Function to handle chat requests
const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Using Cohere's API for chat
        const response = await axios.post(
            'https://api.cohere.com/v2/chat',
            {
                stream: false,
                model: "command-a-03-2025",
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract text from Cohere response format
        let responseText = "No response received";
        
        if (response.data && response.data.message && response.data.message.content) {
            // Handle array of content objects (each with type and text)
            if (Array.isArray(response.data.message.content)) {
                // Extract text from the first text type content object
                const textContent = response.data.message.content.find(item => item.type === 'text');
                if (textContent && textContent.text) {
                    responseText = textContent.text;
                }
            } 
            // Handle direct content string
            else if (typeof response.data.message.content === 'string') {
                responseText = response.data.message.content;
            }
        }
        
        res.status(200).json({
            success: true,
            data: responseText
        });
    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error processing chat request',
            error: error.message
        });
    }
};

module.exports = {
    handleChat
}; 
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test email configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP Configuration Error:', error);
    } else {
        console.log('SMTP Server is ready to send emails');
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, address, projectType, timeline, message } = req.body;

        // Validation
        if (!name || !email || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and phone are required fields' 
            });
        }

        // Email content for business
        const businessMailOptions = {
            from: `"Pergola Professionals Website" <${process.env.SMTP_USER}>`,
            to: process.env.BUSINESS_EMAIL || 'info@pergolaprofessionals.com',
            subject: `New Lead: ${name} - Pergola Inquiry`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #1a3c40; color: white; padding: 20px; text-align: center; }
                        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #1a3c40; }
                        .value { padding: 5px 0; }
                        .priority { background: #d4a762; color: #1a3c40; padding: 3px 8px; border-radius: 3px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>New Pergola Inquiry</h2>
                            <p>Website Lead Generation</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">Contact Information:</div>
                                <div class="value">${name} &lt;${email}&gt;</div>
                                <div class="value">Phone: ${phone}</div>
                                ${address ? `<div class="value">Address: ${address}</div>` : ''}
                            </div>
                            
                            <div class="field">
                                <div class="label">Project Details:</div>
                                <div class="value">Project Type: ${projectType || 'Not specified'}</div>
                                <div class="value">Timeline: <span class="priority">${timeline || 'Not specified'}</span></div>
                            </div>
                            
                            ${message ? `
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="value">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                            ` : ''}
                            
                            <div class="field">
                                <div class="label">Submission Time:</div>
                                <div class="value">${new Date().toLocaleString()}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Lead Source:</div>
                                <div class="value">Website Contact Form - pergolaprofessionals.com</div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Confirmation email to customer
        const customerMailOptions = {
            from: `"Pergola Professionals" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Thank you for your pergola inquiry!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #1a3c40; color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; background: white; }
                        .cta { background: #d4a762; color: #1a3c40; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
                        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Thank You, ${name}!</h1>
                            <p>Your Premium Pergola Journey Begins Here</p>
                        </div>
                        <div class="content">
                            <p>Dear ${name},</p>
                            
                            <p>Thank you for contacting <strong>Pergola Professionals</strong>. We've received your inquiry and one of our pergola specialists will contact you within <strong>24 hours</strong> to discuss your project.</p>
                            
                            <div class="cta">
                                <h3>What to Expect Next:</h3>
                                <p>1. Phone consultation to understand your needs</p>
                                <p>2. Free design consultation at your property</p>
                                <p>3. Custom 3D rendering of your pergola</p>
                                <p>4. Detailed quote with no hidden fees</p>
                            </div>
                            
                            <div class="contact-info">
                                <h3>Our Contact Information:</h3>
                                <p><strong>Phone:</strong> (555) 123-4567</p>
                                <p><strong>Email:</strong> info@pergolaprofessionals.com</p>
                                <p><strong>Service Area:</strong> All of New Jersey</p>
                            </div>
                            
                            <p>In the meantime, you can browse our portfolio or learn more about our premium aluminum pergolas on our website.</p>
                            
                            <p>Best regards,<br>
                            <strong>The Pergola Professionals Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>Pergola Professionals &copy; ${new Date().getFullYear()} | Serving All of New Jersey</p>
                            <p>Licensed & Insured | Satisfaction Guaranteed</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send both emails
        await transporter.sendMail(businessMailOptions);
        await transporter.sendMail(customerMailOptions);

        res.status(200).json({ 
            success: true, 
            message: 'Thank you! Your inquiry has been submitted successfully. We will contact you within 24 hours.' 
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while submitting your inquiry. Please try again or call us directly.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        service: 'Pergola Professionals Backend',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter based on environment
const createTransporter = () => {
  // For development: Log emails to console instead of sending
  if (process.env.EMAIL_SERVICE === 'console') {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  }

  // For production: Use real SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email utility
const sendEmail = async (options) => {
  try {
    // Check if email is configured for development mode
    const isDevelopment = process.env.EMAIL_SERVICE === 'console';

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'AutoSphere'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@autosphere.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    if (isDevelopment) {
      // Development mode: Log email to console
      console.log('\n' + '='.repeat(80));
      console.log('📧 EMAIL NOTIFICATION (Development Mode - Console Log)');
      console.log('='.repeat(80));
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('-'.repeat(80));
      console.log('HTML Content Preview:');
      console.log(options.html.substring(0, 500) + '...');
      console.log('='.repeat(80) + '\n');
      return { success: true, mode: 'console', messageId: `dev-${Date.now()}` };
    }

    // Production mode: Send actual email
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️  Email sent:', info.messageId);
    return { success: true, mode: 'smtp', messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
const templates = {
  // Welcome email
  welcome: (userName, userRole) => ({
    subject: 'Welcome to AutoSphere! 🚗',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7C2D12 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #991B1B; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to AutoSphere!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Thank you for joining AutoSphere, your premier destination for high-quality automotive accessories and parts.</p>
            <p>Your account has been successfully created as a <strong>${userRole}</strong>.</p>
            ${userRole === 'vendor' ? `
              <p><strong>Next Steps for Vendors:</strong></p>
              <ul>
                <li>Add your products to the marketplace</li>
                <li>Set up your vendor profile</li>
                <li>Start receiving orders from customers</li>
              </ul>
            ` : userRole === 'customer' ? `
              <p><strong>Start Shopping:</strong></p>
              <ul>
                <li>Browse our extensive catalog of automotive products</li>
                <li>Add items to your cart from multiple vendors</li>
                <li>Enjoy secure checkout and fast delivery</li>
              </ul>
            ` : ''}
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Go to Dashboard</a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy shopping! 🛒</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AutoSphere. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Password reset email
  passwordReset: (userName, resetToken, resetUrl) => ({
    subject: 'Your AutoSphere Password Reset Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7C2D12 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .otp-box { background: #ffffff; border: 3px solid #991B1B; padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .otp-code { font-family: 'Courier New', monospace; font-size: 48px; font-weight: bold; color: #991B1B; letter-spacing: 12px; margin: 15px 0; }
          .otp-label { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; }
          .expire-time { background: #FEE2E2; color: #991B1B; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2 style="color: #1E1E1E; margin-top: 0;">Hello ${userName},</h2>
            <p style="font-size: 16px;">We received a request to reset your password for your AutoSphere account.</p>

            <div class="otp-box">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${resetToken}</div>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Enter this code to reset your password</p>
            </div>

            <div class="expire-time">
              ⏰ This code will expire in 10 minutes
            </div>

            <div class="warning">
              <strong>⚠️ Security Tips:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Never share this code with anyone</li>
                <li>AutoSphere staff will never ask for this code</li>
                <li>If you didn't request this, ignore this email</li>
              </ul>
            </div>

            <p style="text-align: center; color: #888; font-size: 13px; margin-top: 30px;">
              Having trouble? Contact our support team at support@autosphere.com
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AutoSphere. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Order confirmation email
  orderConfirmation: (userName, orderId, orderDetails, grandTotal, vendorCount) => ({
    subject: `Order Confirmation #${orderId} - AutoSphere`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7C2D12 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #991B1B; }
          .total { background: #1E1E1E; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #991B1B; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Thank you for your order, ${userName}!</h2>
            <p>Your order has been received and is being processed.</p>
            <p><strong>Order ID:</strong> #${orderId}</p>
            ${vendorCount > 1 ? `<p><strong>Note:</strong> Your order contains items from ${vendorCount} vendors. Separate orders have been created for each vendor.</p>` : ''}
            <h3>Order Summary:</h3>
            ${orderDetails.map(item => `
              <div class="order-item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}
              </div>
            `).join('')}
            <div class="total">
              <h2 style="margin: 0;">Grand Total: $${grandTotal.toFixed(2)}</h2>
            </div>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/customer" class="button">Track Your Order</a>
            </div>
            <p>We'll send you another email when your order ships.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AutoSphere. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Order status update email
  orderStatusUpdate: (userName, orderId, status, vendorName) => ({
    subject: `Order Status Update #${orderId} - AutoSphere`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7C2D12 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #991B1B; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Status Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Your order status has been updated.</p>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Vendor:</strong> ${vendorName}</p>
            <div style="text-align: center;">
              <span class="status-badge" style="background: ${status === 'Completed' ? '#10B981' : status === 'Shipped' ? '#3B82F6' : status === 'Rejected' ? '#EF4444' : '#F59E0B'}; color: white;">
                ${status}
              </span>
            </div>
            ${status === 'Shipped' ? '<p>🚚 Your order is on its way! You should receive it soon.</p>' : ''}
            ${status === 'Completed' ? '<p>✅ Your order has been completed. Thank you for shopping with AutoSphere!</p>' : ''}
            ${status === 'Rejected' ? '<p>❌ Unfortunately, your order was rejected by the vendor. Please contact support for more information.</p>' : ''}
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/customer" class="button">View Order Details</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AutoSphere. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // 2FA setup email
  twoFactorSetup: (userName, qrCodeDataUrl) => ({
    subject: 'Two-Factor Authentication Setup - AutoSphere',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7C2D12 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .qr-code { text-align: center; margin: 30px 0; }
          .security-tip { background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Enable Two-Factor Authentication</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>You've requested to enable Two-Factor Authentication (2FA) for your AutoSphere account.</p>
            <p><strong>Follow these steps:</strong></p>
            <ol>
              <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>Scan the QR code below with your authenticator app</li>
              <li>Enter the 6-digit code from your app to complete setup</li>
            </ol>
            <div class="qr-code">
              <img src="${qrCodeDataUrl}" alt="2FA QR Code" style="max-width: 250px; border: 2px solid #ddd; padding: 10px; border-radius: 10px;" />
            </div>
            <div class="security-tip">
              <strong>🛡️ Security Tip:</strong>
              <p style="margin: 10px 0;">Keep your authenticator app secure and never share your 2FA codes with anyone.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AutoSphere. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send specific email types
const sendWelcomeEmail = async (to, userName, userRole) => {
  const emailContent = templates.welcome(userName, userRole);
  return await sendEmail({ to, ...emailContent });
};

const sendPasswordResetEmail = async (to, userName, resetToken, resetUrl) => {
  const emailContent = templates.passwordReset(userName, resetToken, resetUrl);
  return await sendEmail({ to, ...emailContent });
};

const sendOrderConfirmationEmail = async (to, userName, orderId, orderDetails, grandTotal, vendorCount) => {
  const emailContent = templates.orderConfirmation(userName, orderId, orderDetails, grandTotal, vendorCount);
  return await sendEmail({ to, ...emailContent });
};

const sendOrderStatusUpdateEmail = async (to, userName, orderId, status, vendorName) => {
  const emailContent = templates.orderStatusUpdate(userName, orderId, status, vendorName);
  return await sendEmail({ to, ...emailContent });
};

const sendTwoFactorSetupEmail = async (to, userName, qrCodeDataUrl) => {
  const emailContent = templates.twoFactorSetup(userName, qrCodeDataUrl);
  return await sendEmail({ to, ...emailContent });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendTwoFactorSetupEmail,
};

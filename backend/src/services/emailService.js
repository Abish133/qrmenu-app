const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'QRMenu Cloud <abishabi133@gmail.com>',
      replyTo: 'noreply@qrmenucloud.com',
      to: email,
      subject: '🔐 Reset Your QRMenu Cloud Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; max-width: 100%;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px 30px; text-align: center;">
                      <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 11.37a11.045 11.045 0 006.469 6.469l1.983-4.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                      </div>
                      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">QRMenu Cloud</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Digital Menu Management</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 50px 40px;">
                      <div style="text-align: center; margin-bottom: 40px;">
                        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);">
                          <svg width="50" height="50" viewBox="0 0 24 24" fill="#F59E0B">
                            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11C15.4 11 16 11.4 16 12V16C16 16.6 15.6 17 15 17H9C8.4 17 8 16.6 8 16V12C8 11.4 8.4 11 9 11V10C9 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.2 9 10.2 10V11H13.8V10C13.8 9 12.8 8.2 12 8.2Z"/>
                          </svg>
                        </div>
                        <h2 style="color: #1F2937; margin: 0 0 16px; font-size: 32px; font-weight: 800; line-height: 1.2;">Password Reset Request</h2>
                        <p style="color: #6B7280; margin: 0; font-size: 18px; line-height: 1.6;">We received a request to reset your password</p>
                      </div>
                      
                      <div style="background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); border-radius: 16px; padding: 30px; margin: 30px 0; border-left: 4px solid #3B82F6;">
                        <p style="color: #374151; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Click the button below to create a new password for your QRMenu Cloud account. This link is secure and will expire in <strong>10 minutes</strong>.</p>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">🔐 Reset My Password</a>
                        </div>
                        
                        <div style="background: white; border-radius: 8px; padding: 16px; margin-top: 20px;">
                          <p style="color: #6B7280; margin: 0 0 8px; font-size: 14px; font-weight: 600;">Or copy this link:</p>
                          <p style="color: #3B82F6; margin: 0; font-size: 14px; word-break: break-all; font-family: monospace; background: #F8FAFC; padding: 8px; border-radius: 4px;">${resetUrl}</p>
                        </div>
                      </div>
                      
                      <!-- Security Notice -->
                      <div style="background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #EF4444;">
                        <div style="display: flex; align-items: flex-start;">
                          <div style="background: #EF4444; width: 24px; height: 24px; border-radius: 50%; margin-right: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-size: 14px; font-weight: bold;">!</span>
                          </div>
                          <div>
                            <h4 style="color: #DC2626; margin: 0 0 8px; font-size: 16px; font-weight: 600;">Security Notice</h4>
                            <p style="color: #7F1D1D; margin: 0; font-size: 14px; line-height: 1.5;">If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div style="text-align: center; margin-top: 40px;">
                        <p style="color: #9CA3AF; margin: 0; font-size: 14px;">Need help? Contact our support team</p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #F9FAFB; padding: 30px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                      <div style="margin-bottom: 20px;">
                        <h3 style="color: #374151; margin: 0 0 8px; font-size: 18px; font-weight: 600;">QRMenu Cloud</h3>
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">Revolutionizing restaurant digital menus</p>
                      </div>
                      
                      <div style="border-top: 1px solid #E5E7EB; padding-top: 20px;">
                        <p style="color: #9CA3AF; margin: 0; font-size: 12px; line-height: 1.5;">
                          © 2025 QRMenu Cloud. All rights reserved.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  async sendPasswordResetToken(email, resetToken) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'QRMenu Cloud <abishabi133@gmail.com>',
      replyTo: 'noreply@qrmenucloud.com',
      to: email,
      subject: '🔐 Your Password Reset Token - QRMenu Cloud',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Token</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="500" cellpadding="0" cellspacing="0" style="background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; max-width: 100%;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 30px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">QRMenu Cloud</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Password Reset Token</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="margin-bottom: 30px;">
                        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 32px;">🔑</span>
                        </div>
                        <h2 style="color: #1F2937; margin: 0 0 12px; font-size: 24px; font-weight: 700;">Your Reset Token</h2>
                        <p style="color: #6B7280; margin: 0; font-size: 16px;">Use this token to reset your password</p>
                      </div>
                      
                      <!-- Token Display -->
                      <div style="background: #F8FAFC; border: 2px dashed #3B82F6; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <p style="color: #374151; margin: 0 0 12px; font-size: 14px; font-weight: 600;">Reset Token:</p>
                        <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; position: relative;">
                          <code style="color: #3B82F6; font-size: 18px; font-weight: 600; letter-spacing: 1px; word-break: break-all;">${resetToken}</code>
                        </div>
                        <button onclick="copyToken()" style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">📋 Copy Token</button>
                      </div>
                      
                      <div style="background: #FEF2F2; border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <p style="color: #DC2626; margin: 0; font-size: 14px; font-weight: 600;">⚠️ Token expires in 10 minutes</p>
                      </div>
                      
                      <p style="color: #6B7280; margin: 20px 0 0; font-size: 14px;">Go to the reset password page and enter this token</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #F9FAFB; padding: 20px; text-align: center;">
                      <p style="color: #9CA3AF; margin: 0; font-size: 12px;">© 2025 QRMenu Cloud. All rights reserved.</p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
          
          <script>
            function copyToken() {
              const token = '${resetToken}';
              navigator.clipboard.writeText(token).then(() => {
                alert('Token copied to clipboard!');
              }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = token;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Token copied to clipboard!');
              });
            }
          </script>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Token email send error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
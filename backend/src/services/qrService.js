const QRCode = require('qrcode');

class QRService {
  static async generateQRCode(restaurantSlug) {
    try {
      const menuUrl = `${process.env.FRONTEND_URL}/r/${restaurantSlug}`;
      const qrCodeDataURL = await QRCode.toDataURL(menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  static async generateQRCodeBuffer(restaurantSlug) {
    try {
      const menuUrl = `${process.env.FRONTEND_URL}/r/${restaurantSlug}`;
      const qrCodeBuffer = await QRCode.toBuffer(menuUrl, {
        width: 300,
        margin: 2
      });
      
      return qrCodeBuffer;
    } catch (error) {
      throw new Error('Failed to generate QR code buffer');
    }
  }
}

module.exports = QRService;
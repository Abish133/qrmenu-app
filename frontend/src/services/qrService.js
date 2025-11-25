// Simple QR code generation using QR Server API
export const generateQRCode = (text, size = 200) => {
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
};

// Create QR code with restaurant name and text
export const createQRWithText = (url, restaurantName, size = 400) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size + 120;
  
  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  return new Promise((resolve) => {
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      // Draw QR code
      ctx.drawImage(qrImg, 0, 60, size, size);
      
      // Restaurant name at top
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(restaurantName, size/2, 35);
      
      // "Scan QR to view menu" at bottom
      ctx.font = '18px Arial';
      ctx.fillText('Scan QR to view menu', size/2, size + 95);
      
      resolve(canvas.toDataURL('image/png'));
    };
    qrImg.src = generateQRCode(url, size);
  });
};

export const downloadQRCode = async (text, filename = 'qr-code') => {
  try {
    const qrUrl = generateQRCode(text, 300);
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw error;
  }
};

export const downloadQRWithText = async (url, restaurantName, filename = 'qr-code') => {
  try {
    const dataUrl = await createQRWithText(url, restaurantName);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code with text:', error);
    throw error;
  }
};

export const downloadQRPDF = async (url, restaurantName, filename = 'qr-code') => {
  try {
    const { jsPDF } = await import('jspdf');
    const dataUrl = await createQRWithText(url, restaurantName, 300);
    
    const pdf = new jsPDF();
    pdf.addImage(dataUrl, 'PNG', 55, 50, 100, 140);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error downloading QR PDF:', error);
    throw error;
  }
};


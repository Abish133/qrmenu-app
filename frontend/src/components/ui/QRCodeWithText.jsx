import React, { useState, useEffect } from 'react';
import { createQRWithText } from '@/services/qrService';

export const QRCodeWithText = ({ url, restaurantName, className }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  
  useEffect(() => {
    createQRWithText(url, restaurantName, 200).then(setQrDataUrl);
  }, [url, restaurantName]);
  
  return qrDataUrl ? <img src={qrDataUrl} alt="QR Code" className={className} /> : null;
};
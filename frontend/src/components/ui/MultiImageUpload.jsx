import React, { useState, useRef } from 'react';
import { Upload, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const MultiImageUpload = ({ 
  onImagesSelect, 
  currentImages = [], 
  label = "Upload Images",
  maxImages = 5 
}) => {
  const [images, setImages] = useState(
    currentImages.map(img => {
      if (typeof img === 'string') {
        return { url: img, isNew: false };
      }
      return img;
    })
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    files.forEach(file => {
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }
      
      if (file.type.startsWith('image/') && newImages.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = { file, preview: e.target.result, isNew: true };
          newImages.push(newImage);
          setImages([...newImages]);
          onImagesSelect?.(newImages);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setCurrentIndex(Math.max(0, Math.min(currentIndex, newImages.length - 1)));
    onImagesSelect?.(newImages);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-sm font-semibold text-gray-700 block">
          {label} ({images.length}/{maxImages})
        </label>
      )}
      
      {/* Main Image Display */}
      {images.length > 0 && (
        <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={images[currentIndex]?.preview || `http://localhost:5000/${images[currentIndex]?.url || images[currentIndex]}`}
              alt={`Image ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeImage(currentIndex)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                currentIndex === index ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
              )}
            >
              <img
                src={image.preview || `http://localhost:5000/${image.url || image}`}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Add More Images</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { MultiImageUpload };
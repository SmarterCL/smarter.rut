// src/components/ImageHolder.tsx
// Componente de holder de imagen para SmarterOS

import React from 'react';
import { IonImg, IonSkeletonText, IonCard, IonCardContent } from '@ionic/react';

interface ImageHolderProps {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  showPlaceholder?: boolean;
  skeleton?: boolean;
  rounded?: boolean;
  aspectRatio?: string;
}

const ImageHolder: React.FC<ImageHolderProps> = ({
  src,
  alt = "Imagen",
  width = "100%",
  height = "auto",
  className = "",
  showPlaceholder = true,
  skeleton = false,
  rounded = false,
  aspectRatio = "16/9"
}) => {
  const imageClasses = [
    className,
    rounded ? "rounded-lg" : "",
    skeleton ? "animate-pulse" : ""
  ].filter(Boolean).join(" ");

  const style = {
    width: width,
    height: height,
    aspectRatio: aspectRatio
  };

  if (skeleton) {
    return (
      <div 
        className={`bg-gray-200 ${imageClasses}`} 
        style={style}
      >
        <IonSkeletonText animated style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }

  if (!src || showPlaceholder) {
    return (
      <div 
        className={`bg-gradient-to-br from-odoo-purple to-odoo-purple-light flex items-center justify-center ${imageClasses}`} 
        style={style}
      >
        <div className="text-center p-4">
          <div className="mx-auto bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <p className="text-white text-sm font-medium">{alt || "Imagen"}</p>
          <p className="text-white/80 text-xs mt-1">No disponible</p>
        </div>
      </div>
    );
  }

  return (
    <IonImg 
      src={src} 
      alt={alt} 
      className={imageClasses}
      style={style}
    />
  );
};

export default ImageHolder;
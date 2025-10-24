import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { removeBackground } from "@/utils/backgroundRemoval";

interface ImageWithBackgroundRemovalProps {
  src: string;
  alt: string;
  className?: string;
  animate?: any;
  transition?: any;
}

const ImageWithBackgroundRemoval = ({ 
  src, 
  alt, 
  className,
  animate,
  transition 
}: ImageWithBackgroundRemovalProps) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processImage = async () => {
      try {
        setIsProcessing(true);
        
        // Load the image
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });

        // Remove background
        const blob = await removeBackground(img);
        const url = URL.createObjectURL(blob);
        setProcessedImageUrl(url);
      } catch (error) {
        console.error("Failed to process image:", error);
        // Fall back to original image
        setProcessedImageUrl(src);
      } finally {
        setIsProcessing(false);
      }
    };

    processImage();

    // Cleanup
    return () => {
      if (processedImageUrl && processedImageUrl !== src) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [src]);

  if (isProcessing) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-white">Processing image...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.img
      src={processedImageUrl || src}
      alt={alt}
      className={className}
      animate={animate}
      transition={transition}
    />
  );
};

export default ImageWithBackgroundRemoval;

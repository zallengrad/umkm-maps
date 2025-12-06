// frontend/src/components/LoadingSkeleton.jsx
import React from 'react';

// Skeleton untuk Card UMKM
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg w-full max-w-xs mx-auto animate-pulse">
      {/* Image skeleton */}
      <div className="h-[250px] w-full bg-gray-300"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        
        {/* Address skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
        
        {/* Button skeleton */}
        <div className="h-12 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
};

// Skeleton untuk Detail Page
export const DetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      {/* Header image skeleton */}
      <div className="h-80 bg-gray-300"></div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Category skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
        
        {/* Title skeleton */}
        <div className="h-8 bg-gray-300 rounded mb-3 w-1/2"></div>
        
        {/* Description skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
        
        {/* Info skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-3 w-1/3"></div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-300 rounded-lg w-48"></div>
      </div>
    </div>
  );
};

// Skeleton untuk Grid Cards
export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CardSkeleton;

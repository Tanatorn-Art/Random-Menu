import React from 'react';

interface RandomMenuButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const RandomMenuButton: React.FC<RandomMenuButtonProps> = ({ 
  onClick, 
  isLoading = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md 
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1'} 
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50`}
    >
      {isLoading ? 'กำลังโหลด...' : 'สุ่มเมนูใหม่'}
    </button>
  );
};

export default RandomMenuButton;

import React from 'react';

interface MenuItem {
  name: string;
  description: string;
}

interface MenuCardProps {
  menuItem: MenuItem | null;
  isLoading?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ menuItem, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md transform transition-all duration-300">
        <p className="text-center text-gray-500">กำลังโหลดเมนู...</p>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md transform transition-all duration-300">
        <p className="text-center text-gray-500">ไม่พบเมนู</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md transform transition-all duration-300 hover:scale-[1.02]">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-3">{menuItem.name}</h2>
      <p className="text-gray-700 text-center">{menuItem.description}</p>
    </div>
  );
};

export default MenuCard;

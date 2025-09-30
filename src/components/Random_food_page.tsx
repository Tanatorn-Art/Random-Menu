import React, { useState, useEffect, useRef } from 'react';
import {  Play, Pause } from 'lucide-react';
import menuData from '../config/menu.json';
import pathData from '../config/path.json';
import MenuButton from './button/MenuButton';
import MenuModal from './modal/Menu_modal';

interface MenuItem {
  name: string;
  description: string;
  category: string;
  id?: number;
  price?: number;
  image?: string;
}

interface PathData {
  name: string;
  path: string;
  desc: string;
  id?: number;
}

interface RandomMenuAppProps {
  onSpinComplete?: () => void;
}

const RandomMenuApp = ({ onSpinComplete }: RandomMenuAppProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen , setIsModalOpen] = useState(false);

  // Map emoji based on category
  const getEmojiForCategory = (category: string): string => {
    const emojiMap: Record<string, string> = {
      'เส้น': '🍜',
      'ต้ม': '🍲',
      'ส้มตำ': '🥗',
      'ข้าว': '🍚',
      'ผัด': '🍳',
      'แกง': '🥘',
      'ยำ': '🥙',
      'ปิ้งย่าง': '🍖',
      'ทอด': '🍤',
      'นึ่ง': '🐟',
      'ของหวาน': '🍧',
      'เครื่องดื่ม': '🧃'
    };
    return emojiMap[category] || '🍽️';
  };

  useEffect(() => {
    const processedPaths = pathData.pathItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setPaths(processedPaths);
  }, [])
  // Process and prepare menu data
  const processMenuData = () => {
    return menuData.menuItems.map((item, index) => ({
      ...item,
      id: index + 1,
      price: Math.floor(Math.random() * 150) + 30, // Random price between 30-180
      image: getEmojiForCategory(item.category)
    }));
  };

  useEffect(() => {
    const processedMenu = processMenuData();
    setMenuItems(processedMenu);
    setSelectedMenu(processedMenu[0]);
  }, []);

  const startSpin = () => {
    if (isSpinning || menuItems.length === 0) return;

    setIsSpinning(true);
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      let speed = 50; // Initial speed
      let currentIndex = 0;
      const totalItems = menuItems.length;

      // Create extended list for smooth scrolling effect
      const extendedItems: MenuItem[] = [];
      for (let i = 0; i < 3; i++) {
        extendedItems.push(...menuItems);
      }

      const spin = () => {
        currentIndex = (currentIndex + 1) % extendedItems.length;
        const item = extendedItems[currentIndex];
        setSelectedMenu(item);

        // Gradually slow down
        if (speed > 5) {
          speed *= 0.98;
        } else {
          speed *= 0.95;
        }

        if (speed > 2) {
          animationRef.current = setTimeout(spin, speed);
        } else {
          // Final selection
          const finalIndex = Math.floor(Math.random() * menuItems.length);
          setSelectedMenu(menuItems[finalIndex]);
          setIsSpinning(false);

          if (onSpinComplete) {
            onSpinComplete();
          }
        }
      };

      spin();
    }
  };


  return (
    <div className=" min-h-screen bg-gradient-to-br from-green-200 via-orange-100 to-yellow-200 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-300/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-300/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent"></div>
      {/* Floating Food Emojis */}
      <div className="absolute top-15  left-10 text-green-300 text-2xl animate-bounce">🍕</div>
      {/* <div className="absolute top-20 right-20 text-orange-300 text-xl animate-pulse">🍔</div> */}
      {/* <div className="absolute bottom-20 left-20 text-yellow-300 text-2xl animate-bounce delay-1000">🍜</div>
      <div className="absolute bottom-10 right-10 text-green-300 text-xl animate-pulse delay-500">🥗</div> */}
      <div className="max-w-md mx-auto bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl overflow-hidden mt-20 relative border-4 border-green-300 z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 via-orange-400 to-yellow-400 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-300/30 to-orange-300/30"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">🎲 Random Menu</h1>
            <p className="text-green-100 text-lg font-medium">สุ่มเมนูอาหารวันนี้!</p>
          </div>
        </div>

        {/* Slot Machine Display */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-green-100 to-orange-100 rounded-2xl p-6 mb-6 relative overflow-hidden border-4 border-green-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 to-orange-200/20"></div>

            {/* Menu Display */}
            <div ref={scrollRef} className="relative z-10 text-center">
              {selectedMenu && (
                <div className={`transition-all duration-300 ${isSpinning ? 'blur-sm scale-110' : 'scale-100'}`}>
                  <div className="text-8xl mb-4 mt-4 drop-shadow-lg">{selectedMenu.image || '🍽️'}</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">{selectedMenu.name}</h2>
                  <p className="text-orange-600 mb-1 font-medium">{selectedMenu.category}</p>
                  {/* <p className="text-gray-400 text-sm">{selectedMenu.description}</p>
                  {selectedMenu.price && (
                    <p className="text-yellow-400 font-semibold mt-2">
                      ฿{selectedMenu.price.toLocaleString()}
                    </p>
                  )} */}
                </div>
              )}
            </div>

            {/* Spinning Overlay */}
            {isSpinning && (
              <div className="absolute inset-0 bg-green-200/60 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center relative">
            <button
              ref={buttonRef}
              onClick={startSpin}
              disabled={isSpinning}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all ${
                isSpinning
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-green-400 to-orange-400 hover:from-green-500 hover:to-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-green-300 text-white hover:shadow-green-200/50'
              }`}
            >
              {isSpinning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isSpinning ? 'กำลังสุ่ม...' : 'สุ่มเมนู!'}
            </button>


            {/* {isSpinning && (
              <button
                onClick={stopSpin}
                className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <Pause className="w-5 h-5" />
                หยุด
              </button>
            )} */}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-100 to-orange-100 p-4 border-t-4 border-green-200">
          <div className="flex items-center">
            {/* ข้อความตรงกลาง */}
            <div className="flex-1 text-center">
              <p className="text-green-600 text-sm font-medium mr-[-30px]">
                กดปุ่มเพื่อสุ่มเมนูอาหารสำหรับมื้อนี้! 🍽️
              </p>
            </div>

            {/* ปุ่มชิดขวา */}
            <div className="ml-auto">
              <MenuButton onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>

        <MenuModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="เมนูทั้งหมด"
        >
          <div className="grid grid-cols-2 gap-4">
            {paths.slice(0, 4).map((item) => (
              <button
                key={item.id}
                data-path={item.path}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-4 text-gray-700 hover:bg-gray-100"
              >
                <span className="text-xl">{item.desc}</span>
              </button>
            ))}
          </div>
        </MenuModal>
      </div>
    </div>
  );
};

export default RandomMenuApp;
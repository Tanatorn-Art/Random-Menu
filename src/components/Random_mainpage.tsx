import React, { useState, useEffect, useRef } from 'react';
import { Shuffle, Play, Pause } from 'lucide-react';
import menuData from '../config/menu.json';

interface MenuItem {
  name: string;
  description: string;
  category: string;
  id?: number;
  price?: number;
  image?: string;
}

interface RandomMenuAppProps {
  onSpinComplete?: () => void;
}

const RandomMenuApp = ({ onSpinComplete }: RandomMenuAppProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

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

  const stopSpin = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-300 p-4 relative">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-20 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 via-red-400 to-red-500 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">🎲 Random Menu</h1>
          <p className="text-purple-100">สุ่มเมนูอาหารวันนี้!</p>
        </div>

        {/* Slot Machine Display */}
        <div className="p-6">
          <div className="bg-gray-900 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>

            {/* Menu Display */}
            <div ref={scrollRef} className="relative z-10 text-center">
              {selectedMenu && (
                <div className={`transition-all duration-300 ${isSpinning ? 'blur-sm scale-110' : 'scale-100'}`}>
                  <div className="text-6xl mb-4">{selectedMenu.image || '🍽️'}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedMenu.name}</h2>
                  <p className="text-gray-300 mb-1">{selectedMenu.category}</p>
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
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
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
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
              } text-white`}
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
        <div className="bg-gray-100 p-4 text-center">
          <p className="text-gray-600 text-sm">กดปุ่มเพื่อสุ่มเมนูอาหารสำหรับมื้อนี้!</p>
        </div>
      </div>
    </div>
  );
};

export default RandomMenuApp;
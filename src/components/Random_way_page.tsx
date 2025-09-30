import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import wayData from '../config/way.json';
import pathData from '../config/path.json';
import MenuButton from './button/MenuButton';
import MenuModal from './modal/Menu_modal';

interface wayItem {
  id?: number;
  way: string;
}

interface PathData {
  name: string;
  path: string;
  desc: string;
  id?: number;
}

interface RandomWayAppProps {
  onSpinComplete?: () => void;
}

const RandomMenuApp = ({ onSpinComplete }: RandomWayAppProps) => {
  const [wayItems, setWayItems] = useState<wayItem[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<wayItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen , setIsModalOpen] = useState(false);


  useEffect(() => {
    const processedPaths = pathData.pathItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setPaths(processedPaths);

    // Load way items from way.json
    const processedWayItems = wayData.wayItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setWayItems(processedWayItems);

    // Set the first way item as selected when component loads
    if (processedWayItems.length > 0) {
      setSelectedMenu(processedWayItems[0]);
    }
  }, [])


  const startSpin = () => {
    if (isSpinning || wayItems.length === 0) return;

    setIsSpinning(true);
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      let speed = 50; // Initial speed
      let currentIndex = 0;
      const totalItems = wayItems.length;

      // Create extended list for smooth scrolling effect
      const extendedItems: wayItem[] = [];
      for (let i = 0; i < 3; i++) {
        extendedItems.push(...wayItems);
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
          const finalIndex = Math.floor(Math.random() * wayItems.length);
          setSelectedMenu(wayItems[finalIndex]);
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
    <div className="mt-[-20px] min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-orange-200 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-300/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-yellow-300/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-300/20 via-transparent to-transparent"></div>
      {/* Floating Hearts */}
      <div className="absolute top-15 left-10 text-pink-300 text-2xl animate-bounce">💖</div>
      {/* <div className="absolute top-20 right-20 text-yellow-300 text-xl animate-pulse">✨</div> */}
      <div className="absolute bottom-20 left-20 text-purple-300 text-2xl animate-bounce delay-1000">💜</div>
      <div className="absolute bottom-10 right-10 text-pink-300 text-xl animate-pulse delay-500">🌸</div>
      <div className="max-w-md mx-auto bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-2xl overflow-hidden mt-20 relative border-4 border-pink-300 z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-300/30 to-purple-300/30"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">🧭 Random Way</h1>
            <p className="text-pink-100 text-lg font-medium">สุ่มทิศทางไปไหนดี!</p>
          </div>
        </div>

        {/* Slot Machine Display */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 mb-6 relative overflow-hidden border-4 border-pink-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 to-purple-200/20"></div>

            {/* Way Display */}
            <div ref={scrollRef} className="relative z-10 text-center">
              {selectedMenu && (
                <div className={`transition-all duration-300 ${isSpinning ? 'blur-sm scale-110' : 'scale-100'}`}>
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={selectedMenu.way}
                        alt={`Direction ${selectedMenu.id}`}
                        className="w-50 h-40 object-contain drop-shadow-lg filter brightness-110 contrast-110 mt-5"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full blur-lg"></div>
                    </div>
                  </div>
                  {/* <h2 className="text-2xl font-bold text-white mb-2">ทิศทางที่สุ่มได้</h2> */}
                  {/* <p className="text-gray-300 mb-1">ID: {selectedMenu.id}</p> */}
                </div>
              )}
            </div>

            {/* Spinning Overlay */}
            {isSpinning && (
              <div className="absolute inset-0 bg-pink-200/60 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
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
                  : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-pink-300 text-white hover:shadow-pink-200/50'
              }`}
            >
              {isSpinning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isSpinning ? 'กำลังสุ่ม...' : 'สุ่มทิศทาง!'}
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
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 border-t-4 border-pink-200">
          <div className="flex items-center">
            {/* ข้อความตรงกลาง */}
            <div className="flex-1 text-center">
              <p className="text-pink-600 text-sm font-medium mr-[-42px]">
                กดปุ่มเพื่อสุ่มทิศทางไปไหนดี! ✨
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
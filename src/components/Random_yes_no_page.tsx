import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import pathData from '../config/path.json';
import MenuButton from './button/MenuButton';
import MenuModal from './modal/Menu_modal';

interface PathData {
  name: string;
  path: string;
  desc: string;
  id?: number;
}

interface RandomYesNoAppProps {
  onSpinComplete?: () => void;
}

const RandomYesNoApp = ({ onSpinComplete }: RandomYesNoAppProps) => {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const answers = ['ใช่', 'ไม่'];

  useEffect(() => {
    const processedPaths = pathData.pathItems.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setPaths(processedPaths);
    setSelectedAnswer('ใช่');
  }, []);

  const startSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    let speed = 50; // Initial speed
    let currentIndex = 0;

    // Create extended list for smooth scrolling effect
    const extendedAnswers: string[] = [];
    for (let i = 0; i < 10; i++) {
      extendedAnswers.push(...answers);
    }

    const spin = () => {
      currentIndex = (currentIndex + 1) % extendedAnswers.length;
      const answer = extendedAnswers[currentIndex];
      setSelectedAnswer(answer);

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
        const finalAnswer = answers[Math.floor(Math.random() * answers.length)];
        setSelectedAnswer(finalAnswer);
        setIsSpinning(false);

        if (onSpinComplete) {
          onSpinComplete();
        }
      }
    };

    spin();
  };

  const stopSpin = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      setIsSpinning(false);
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-indigo-200 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-300/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-300/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-300/20 via-transparent to-transparent"></div>
      {/* Floating Question Emojis */}
      <div className="absolute top-15 left-10 text-blue-300 text-2xl animate-bounce">🤔</div>
      {/* <div className="absolute top-20 right-20 text-purple-300 text-xl animate-pulse">✅</div> */}
      {/* <div className="absolute bottom-20 left-20 text-indigo-300 text-2xl animate-bounce delay-1000">❌</div>
      <div className="absolute bottom-10 right-10 text-blue-300 text-xl animate-pulse delay-500">🤔</div> */}
      <div className="max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden mt-20 relative border-4 border-blue-300 z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 to-purple-300/30"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">❓ Random Yes/No</h1>
            <p className="text-blue-100 text-lg font-medium">สุ่มคำตอบใช่หรือไม่!</p>
          </div>
        </div>

        {/* Answer Display */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 mb-6 relative overflow-hidden border-4 border-blue-200 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-purple-200/20"></div>

            {/* Answer Display */}
            <div ref={scrollRef} className="relative z-10 text-center">
              {selectedAnswer && (
                <div className={`transition-all duration-300 ${isSpinning ? 'blur-sm scale-110' : 'scale-100'}`}>
                  <div className="text-9xl mb-7 mt-7 drop-shadow-lg">
                    {selectedAnswer === 'ใช่' ? '✅' : '❌'}
                  </div>
                  {/* <h2 className="text-5xl font-bold text-blue-800 mb-2">{selectedAnswer}</h2> */}
                </div>
              )}
            </div>

            {/* Spinning Overlay */}
            {isSpinning && (
              <div className="absolute inset-0 bg-blue-200/60 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
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
                  : 'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-blue-300 text-white hover:shadow-blue-200/50'
              }`}
            >
              {isSpinning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isSpinning ? 'กำลังสุ่ม...' : 'สุ่มคำตอบ!'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 border-t-4 border-blue-200">
          <div className="flex items-center">
            {/* ข้อความตรงกลาง */}
            <div className="flex-1 text-center">
              <p className="text-blue-600 text-sm font-medium mr-[-40px]">
                กดปุ่มเพื่อสุ่มคำตอบใช่หรือไม่! ❓
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

export default RandomYesNoApp;

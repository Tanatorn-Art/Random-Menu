import React from 'react';

interface LoadingProps {
  theme: 'food' | 'emoji' | 'yesno' | 'way';
}

const Loading: React.FC<LoadingProps> = ({ theme }) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'food':
        return {
          mainColor: 'from-green-400 to-yellow-400',
          iconEmoji: '🍽️',
          text: 'กำลังโหลดเมนูอาหาร...'
        };
      case 'emoji':
        return {
          mainColor: 'from-pink-400 to-purple-400',
          iconEmoji: '😊',
          text: 'กำลังโหลดอีโมจิ...'
        };
      case 'yesno':
        return {
          mainColor: 'from-blue-400 to-purple-400',
          iconEmoji: '❓',
          text: 'กำลังโหลดตัวเลือก...'
        };
      case 'way':
        return {
          mainColor: 'from-pink-400 to-indigo-400',
          iconEmoji: '🧭',
          text: 'กำลังโหลดทิศทาง...'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className={`text-6xl mb-4 animate-bounce`}>{styles.iconEmoji}</div>
        <div className={`bg-gradient-to-r ${styles.mainColor} p-1 rounded-full w-48 h-2 mb-4 relative overflow-hidden`}>
          <div className="absolute inset-0 animate-loading-shimmer bg-white/30"></div>
        </div>
        <p className={`text-lg font-medium bg-gradient-to-r ${styles.mainColor} bg-clip-text text-transparent`}>
          {styles.text}
        </p>
      </div>
    </div>
  );
};

export default Loading;

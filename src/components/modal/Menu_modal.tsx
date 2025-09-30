
import React from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
}

interface ButtonProps {
  'data-path'?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

interface GridContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, children, title }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 mt-[-280px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">{title || "เมนู"}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="ปิด"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {React.isValidElement(children) &&
           children.type === 'div' &&
           (children.props as GridContainerProps)?.className?.includes('grid') ? (
            React.cloneElement(children as React.ReactElement<GridContainerProps>, {
              children: React.Children.map((children.props as GridContainerProps)?.children, (child: React.ReactNode) => {
                if (React.isValidElement(child) && child.type === 'button') {
                  return React.cloneElement(child as React.ReactElement<ButtonProps>, {
                    onClick: () => {
                      const path = (child.props as ButtonProps)['data-path'];
                      if (path) {
                        handleNavigation(path);
                      }
                    }
                  });
                }
                return child;
              })
            })
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {/* <div className="flex justify-end border-t p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
          >
            ปิด
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default MenuModal;

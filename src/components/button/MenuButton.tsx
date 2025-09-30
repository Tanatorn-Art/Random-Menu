import React from "react";
import { Menu } from "lucide-react";

interface MenuButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  onClick,
  isLoading = false,
}) => {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? "..." : <Menu />}
    </button>
  );
};

export default MenuButton;

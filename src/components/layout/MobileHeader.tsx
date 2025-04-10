
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuOpen }) => {
  return (
    <div className="flex h-14 items-center border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuOpen}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="ml-4 font-semibold">OrderSparkHub</div>
    </div>
  );
};

export default MobileHeader;

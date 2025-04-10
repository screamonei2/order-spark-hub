
import React from "react";
import MobileHeader from "./MobileHeader";

interface MainContentProps {
  children: React.ReactNode;
  isMobile: boolean;
  onMenuOpen: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  children, 
  isMobile, 
  onMenuOpen 
}) => {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {isMobile && <MobileHeader onMenuOpen={onMenuOpen} />}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {children}
      </div>
    </main>
  );
};

export default MainContent;

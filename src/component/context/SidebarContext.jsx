import { createContext, createSignal, useContext } from 'solid-js';

const SidebarContext = createContext();

export function SidebarProvider(props) {
  const [isMobileOpen, setIsMobileOpen] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);

  // Function untuk toggle
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen());
  };

  const toggleDesktopSidebar = () => {
    setIsCollapsed(!isCollapsed());
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const checkMobile = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) {
      setIsMobileOpen(false);
    }
  };

  // Value yang akan di-share
  const value = {
    isMobileOpen,
    isCollapsed,
    isMobile,
    setIsMobile,
    toggleMobileSidebar,
    toggleDesktopSidebar,
    closeMobileSidebar,
    checkMobile,
  };

  return (
    <SidebarContext.Provider value={value}>
      {props.children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

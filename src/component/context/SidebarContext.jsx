import { createContext, createSignal, onMount, onCleanup, useContext } from 'solid-js';

const SidebarContext = createContext();

export function SidebarProvider(props) {
  const [isMobileOpen, setIsMobileOpen] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);

  // Cek mobile di provider
  onMount(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      console.log('checkMobile:', mobile);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    onCleanup(() => {
      window.removeEventListener('resize', checkMobile);
    });
  });

  const value = {
    // Getters
    isMobileOpen: () => isMobileOpen(),
    isCollapsed: () => isCollapsed(),
    isMobile: () => isMobile(),

    // Setters
    setIsMobileOpen,
    setIsCollapsed,

    // Actions
    toggleMobileSidebar: () => { setIsMobileOpen(prev =>!prev) },
      // console.log('toggleMobileSidebar from', isMobileOpen(), 'to', !isMobileOpen());
    toggleDesktopSidebar: () => setIsCollapsed(!isCollapsed()),
    closeMobileSidebar: () => setIsMobileOpen(false),
  };

  return (
    <SidebarContext.Provider value={value}>
      {props.children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

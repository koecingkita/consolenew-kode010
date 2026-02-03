import { createSignal, For, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { AiFillHome, AiFillFileText, AiOutlineFolderOpen, AiOutlineNumber, AiOutlineSetting, AiOutlineQuestionCircle  } from 'solid-icons/ai'
import { BsBoxArrowLeft, BsChevronLeft, BsChevronRight } from 'solid-icons/bs'
import { useSidebar } from '../context/SidebarContext';
import { A } from '@solidjs/router'
import { useLocation } from '@solidjs/router'

const Sidebar = () => {
  const location = useLocation();

  createEffect(() => {
    console.log("query aaa:", location.pathname.split("/")[1]); // cara ambil active nya gimana? untuk childnya
  })

  // kondisi saat ini active berdasarkan item.id, jika di id itu ada child, contoh , /artikel/create ? itu gimana supaya bisa active di artikel
  //
  const {
    isMobileOpen,
    isCollapsed,
    isMobile,
    toggleDesktopSidebar,
    closeMobileSidebar,
  } = useSidebar();

  const [menuItems, setMenuItems] = createSignal([
    { id: 1, name: 'Dashboard', icon: <AiFillHome />, path: '/' },
    { id: 2, name: 'Artikel', icon: <AiFillFileText />, path: '/artikel' },
    { id: 3, name: 'Kategori', icon: <AiOutlineFolderOpen/>, path: '/kategori' },
    { id: 4, name: 'Tag', icon: <AiOutlineNumber />, path: '/tag' },
    { id: 5, name: 'FAQ', icon: <AiOutlineQuestionCircle />, path: '/faq' },
    { id: 6, name: 'Settings', icon: <AiOutlineSetting />, path: '/setting' },
  ]);


  const isActive = (path) => {
    if(path === "/") return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  onMount(() => {
    console.log('Sidebar mounted');


    const handleClickOutside = (e) => {
      if (isMobile() && isMobileOpen()) {
        const sidebar = document.querySelector('.sidebar-container');
        const hamburgerButton = document.querySelector('.mobile-hamburger');

        // Cek apakah klik bukan di sidebar DAN bukan di tombol hamburger
        if (sidebar && !sidebar.contains(e.target) &&
            hamburgerButton && !hamburgerButton.contains(e.target)) {
          // console.log('Click outside, closing sidebar');
          closeMobileSidebar();
        }
      }
    };

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileOpen()) {
        console.log('Escape pressed, closing sidebar');
        closeMobileSidebar();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    onCleanup(() => {
      console.log('Sidebar cleanup');
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    });
  });

  const setActiveItem = (id) => {
    setMenuItems(items =>
      items.map(item => ({
        ...item,
        active: item.path === id
      }))
    );
    // Close mobile sidebar after selecting item
    if (isMobile()) {
      // console.log('Item selected, closing mobile sidebar');
      closeMobileSidebar();
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <Show when={isMobile() && isMobileOpen()}>
        <div
          class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      </Show>

      {/* Sidebar Container */}
      <aside class={`
        sidebar-container h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white
        transition-all duration-300 ease-in-out flex flex-col
        ${isMobile()
          ? `fixed top-0 left-0 z-50 transform ${isMobileOpen() ? 'translate-x-0' : '-translate-x-full'} shadow-2xl w-64`
          : 'relative'
        }
        ${!isMobile() && isCollapsed() ? 'w-20' : 'w-64'}
      `}>
        {/* Header */}
        <div class="p-4 border-b border-gray-700/50">
          <div class="flex items-center justify-between">
            <Show when={(!isMobile() && !isCollapsed()) || (isMobile() && isMobileOpen())}>
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SolidApp</h1>
              </div>
            </Show>

            {/* Desktop Collapse Button */}
            <Show when={!isMobile()}>
              <button
                onClick={toggleDesktopSidebar}
                class="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 active:scale-95"
                title={isCollapsed() ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Show when={isCollapsed()} fallback={<BsChevronLeft class="h-5 w-5" />}>
                  <BsChevronRight class="h-5 w-5" />
                </Show>
              </button>
            </Show>

            {/* Mobile Close Button */}
            <Show when={isMobile() && isMobileOpen()}>
              <button
                onClick={closeMobileSidebar}
                class="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 ml-auto"
                title="Close menu"
              >
                <BsChevronLeft class="h-5 w-5" />
              </button>
            </Show>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-2">
            <For each={menuItems()}>
              {(item) => (
                <li>
                  <A
                    href={item.path}
                    class={`
                      group flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-l-4 border-blue-500 shadow-md'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1'
                      }
                      ${(!isMobile() && isCollapsed()) ? 'justify-center' : 'space-x-3'}
                    `}
                    title={(!isMobile() && isCollapsed()) ? item.name : ''}
                  >
                    <div class={`
                      transition-transform duration-200 flex-shrink-0
                      ${item.active ? 'scale-110' : 'group-hover:scale-110'}
                    `}>
                      {item.icon}
                    </div>
                    <Show when={isMobile() || (!isMobile() && !isCollapsed())}>
                      <span class="font-medium transition-opacity duration-300">
                        {item.name}
                      </span>
                    </Show>
                    <Show when={(isMobile() || (!isMobile() && !isCollapsed())) && item.active}>
                      <div class="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    </Show>
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>

        {/* Footer Section */}
        <div class="p-4 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <Show
            when={isMobile() || (!isMobile() && !isCollapsed())}
            fallback={
              <button
                onClick={handleLogout}
                class="group w-full flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-600/20 hover:to-red-700/20 hover:shadow-lg hover:shadow-red-500/10 active:scale-95"
                title="Logout"
              >
                <BsBoxArrowLeft class="h-5 w-5 text-red-400 group-hover:scale-110 transition-transform duration-300" />
              </button>
            }
          >
            <div class="space-y-3">
              {/* User Info */}
              <div class="flex items-center space-x-3 px-2 py-2 rounded-lg">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600/50 flex-shrink-0">
                  <span class="font-bold text-gray-300">U</span>
                </div>
                <div class="overflow-hidden flex-1 min-w-0">
                  <p class="font-medium text-gray-200 truncate">User Admin</p>
                  <p class="text-xs text-gray-400 truncate">admin@example.com</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                class="group w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-600/20 hover:to-red-700/20 hover:shadow-lg hover:shadow-red-500/10 active:scale-95 border border-red-500/20 hover:border-red-400/30"
                title="Logout"
              >
                <BsBoxArrowLeft class="h-5 w-5 text-red-300 group-hover:text-red-200 group-hover:scale-110 transition-all duration-300" />
                <span class="font-medium text-red-300 group-hover:text-red-200 transition-colors duration-300">
                  Logout
                </span>
              </button>
            </div>
          </Show>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

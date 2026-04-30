import { createSignal, For, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { AiFillHome, AiFillFileText, AiOutlineNumber, AiOutlineSetting, AiOutlineQuestionCircle } from 'solid-icons/ai';
import { BsBoxArrowLeft, BsChevronLeft, BsChevronRight, BsChevronDown, BsListNested } from 'solid-icons/bs';
import { useSidebar } from '../context/SidebarContext';
import { A } from '@solidjs/router';
import { useLocation } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <AiFillHome />,
    path: '/',
    exactMatch: true,
  },
  {
    id: 'artikel',
    name: 'Artikel',
    icon: <AiFillHome />,
    // Parent ini akan aktif untuk semua child routes
    children: [
      {
        id: 'artikel-list',
        name: 'Daftar Artikel',
        icon: <AiFillFileText />,
        path: '/artikel',
        exactMatch: true, // Hanya aktif di /artikel
      },
      {
        id: 'artikel-create',
        name: 'Buat Artikel',
        icon: <AiFillFileText />,
        path: '/artikel/create',
        exactMatch: true,
      },
      {
        id: 'kategori',
        name: 'Kategori Produk',
        icon: <BsListNested />,
        path: '/kategori',
        exactMatch: true,
      },
      {
        id: 'tag',
        name: 'Tag',
        icon: <AiOutlineNumber />,
        path: '/tag',
        exactMatch: true,
      },
    ],
  },
  {
    id: 'faq',
    name: 'FAQ',
    icon: <AiOutlineQuestionCircle />,
    path: '/faq',
    exactMatch: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <AiOutlineSetting />,
    path: '/setting',
    exactMatch: true,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { AppName } = useAuth();
  const { isMobileOpen, isCollapsed, isMobile, toggleDesktopSidebar, closeMobileSidebar } = useSidebar();

  // Track which parent groups are open
  const [openGroups, setOpenGroups] = createSignal(new Set());

  const toggleGroup = (id) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Fungsi isActive untuk child menu
  const isChildActive = (child) => {
    const currentPath = location.pathname;

    if (child.exactMatch) {
      return currentPath === child.path;
    }

    return currentPath.startsWith(child.path);
  };

  // Fungsi isParentActive - untuk parent menu (seperti Artikel)
  // Parent aktif jika ada child manapun yang aktif, TERMASUK dynamic routes
  const isParentActive = (item) => {
    if (!item.children) {
      // Parent tanpa children (direct link)
      if (item.exactMatch) {
        return location.pathname === item.path;
      }
      return location.pathname.startsWith(item.path);
    }

    // Parent dengan children: aktif jika ada child yang path-nya match
    // Untuk dynamic routes seperti /artikel/update/xxx, tidak ada child yang exact match
    // TAPI tetap harus aktif karena masih di bawah parent "Artikel"
    const currentPath = location.pathname;

    // Cek apakah current path dimulai dengan base path parent
    // Base path parent diambil dari child pertama atau dari id
    let basePath = '';

    if (item.id === 'artikel') {
      basePath = '/artikel';
    } else if (item.children && item.children.length > 0) {
      // Ambil path dari child pertama sebagai base
      basePath = item.children[0]?.path?.split('/').slice(0, 2).join('/') || '';
    }

    if (basePath && currentPath.startsWith(basePath)) {
      return true;
    }

    // Fallback: cek apakah ada child yang aktif
    return item.children.some(child => isChildActive(child));
  };

  // Auto-expand parent if a child route is currently active
  createEffect(() => {
    const path = location.pathname;
    menuItems.forEach((item) => {
      if (item.children) {
        // Expand parent jika path saat ini dimulai dengan base path parent
        let shouldExpand = false;

        if (item.id === 'artikel' && path.startsWith('/artikel')) {
          shouldExpand = true;
        } else {
          // Cek child exact match
          shouldExpand = item.children.some((child) => {
            if (child.exactMatch) {
              return path === child.path;
            }
            return path.startsWith(child.path);
          });
        }

        if (shouldExpand) {
          setOpenGroups((prev) => new Set([...prev, item.id]));
        }
      }
    });
  });

  const isActiveForDirectLink = (item) => {
    if (item.exactMatch) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  onMount(() => {
    const handleClickOutside = (e) => {
      if (isMobile() && isMobileOpen()) {
        const sidebar = document.querySelector('.sidebar-container');
        const hamburger = document.querySelector('.mobile-hamburger');
        if (sidebar && !sidebar.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
          closeMobileSidebar();
        }
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileOpen()) closeMobileSidebar();
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    });
  });

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const collapsed = () => !isMobile() && isCollapsed();

  return (
    <>
      {/* Mobile Overlay */}
      <Show when={isMobile() && isMobileOpen()}>
        <div
          class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      </Show>

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
                <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {AppName}
                </h1>
              </div>
            </Show>

            <Show when={!isMobile()}>
              <button
                onClick={toggleDesktopSidebar}
                class="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 active:scale-95"
                title={isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Show when={isCollapsed()} fallback={<BsChevronLeft class="h-5 w-5" />}>
                  <BsChevronRight class="h-5 w-5" />
                </Show>
              </button>
            </Show>

            <Show when={isMobile() && isMobileOpen()}>
              <button
                onClick={closeMobileSidebar}
                class="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 ml-auto"
              >
                <BsChevronLeft class="h-5 w-5" />
              </button>
            </Show>
          </div>
        </div>

        {/* Navigation */}
        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-1">
            <For each={menuItems}>
              {(item) => (
                <li>
                  {/* ── Parent with children (accordion) ── */}
                  <Show when={item.children}>
                    <button
                      onClick={() => {
                        if (!collapsed()) toggleGroup(item.id);
                      }}
                      class={`
                        group w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                        ${isParentActive(item)
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-l-4 border-blue-500 shadow-md'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }
                        ${collapsed() ? 'justify-center' : 'justify-between'}
                      `}
                      title={collapsed() ? item.name : ''}
                    >
                      <div class="flex items-center gap-3">
                        <span class="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                          {item.icon}
                        </span>
                        <Show when={!collapsed()}>
                          <span class="font-medium">{item.name}</span>
                        </Show>
                      </div>
                      {/* Chevron arrow — hidden when collapsed */}
                      <Show when={!collapsed()}>
                        <BsChevronDown
                          class={`h-4 w-4 transition-transform duration-300 ${openGroups().has(item.id) ? 'rotate-180' : ''}`}
                        />
                      </Show>
                    </button>

                    {/* Child items — hidden when collapsed */}
                    <Show when={!collapsed() && openGroups().has(item.id)}>
                      <ul class="mt-1 ml-3 pl-3 border-l border-gray-700/60 space-y-1">
                        <For each={item.children}>
                          {(child) => (
                            <li>
                              <A
                                href={child.path}
                                onClick={() => isMobile() && closeMobileSidebar()}
                                class={`
                                  group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                                  ${isChildActive(child)
                                    ? 'bg-blue-600/20 text-blue-300 font-medium'
                                    : 'text-gray-400 hover:bg-gray-700/40 hover:text-white hover:translate-x-1'
                                  }
                                `}
                              >
                                <span class="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                                  {child.icon}
                                </span>
                                <span>{child.name}</span>
                                <Show when={isChildActive(child)}>
                                  <div class="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                </Show>
                              </A>
                            </li>
                          )}
                        </For>
                      </ul>
                    </Show>
                  </Show>

                  {/* ── Parent without children (direct link) ── */}
                  <Show when={!item.children}>
                    <A
                      href={item.path}
                      onClick={() => isMobile() && closeMobileSidebar()}
                      class={`
                        group flex items-center px-4 py-3 rounded-lg transition-all duration-200
                        ${isActiveForDirectLink(item)
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-l-4 border-blue-500 shadow-md'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1'
                        }
                        ${collapsed() ? 'justify-center' : 'space-x-3'}
                      `}
                      title={collapsed() ? item.name : ''}
                    >
                      <span class="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </span>
                      <Show when={!collapsed()}>
                        <span class="font-medium">{item.name}</span>
                      </Show>
                      <Show when={!collapsed() && isActiveForDirectLink(item)}>
                        <div class="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      </Show>
                    </A>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </nav>

        {/* Footer */}
        <div class="p-4 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <Show
            when={isMobile() || (!isMobile() && !isCollapsed())}
            fallback={
              <button
                onClick={handleLogout}
                class="group w-full flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-600/20 hover:to-red-700/20 active:scale-95"
                title="Logout"
              >
                <BsBoxArrowLeft class="h-5 w-5 text-red-400 group-hover:scale-110 transition-transform duration-300" />
              </button>
            }
          >
            <div class="space-y-3">
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
                class="group w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-600/20 hover:to-red-700/20 active:scale-95 border border-red-500/20 hover:border-red-400/30"
              >
                <BsBoxArrowLeft class="h-5 w-5 text-red-300 group-hover:text-red-200 group-hover:scale-110 transition-all duration-300" />
                <span class="font-medium text-red-300 group-hover:text-red-200 transition-colors duration-300">Logout</span>
              </button>
            </div>
          </Show>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

function Navbar() {
  return (
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          {/* Padding kiri extra untuk hamburger button */}
          <div class="md:pl-0 pl-14"> {/* 14 = 4 (default) + 10 (untuk hamburger) */}
            <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          {/* Notifications */}
          <button class="p-2 rounded-full hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* User Profile */}
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <span class="font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

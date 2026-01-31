function Setting() {
  const activities = [
    { user: 'John Smith', action: 'placed an order', time: '2 min ago', type: 'order' },
    { user: 'Emma Johnson', action: 'registered as new user', time: '15 min ago', type: 'user' },
    { user: 'Michael Brown', action: 'updated profile information', time: '1 hour ago', type: 'profile' },
    { user: 'Sarah Davis', action: 'wrote a product review', time: '3 hours ago', type: 'review' },
    { user: 'David Wilson', action: 'completed a purchase', time: '5 hours ago', type: 'purchase' },
  ];

  return (<>
    {/* Charts and Tables Grid */}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Revenue Overview</h3>
          <select class="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div class="h-64 flex flex-col items-center justify-center text-gray-400">
          <div class="text-5xl mb-4">📊</div>
          <p class="text-lg">Revenue Chart</p>
          <p class="text-sm mt-2 text-gray-500">Chart visualization area</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <button class="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
        </div>
        <div class="space-y-4">
          <For each={activities}>
            {(activity) => (
              <div class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div class={`h-10 w-10 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'user' ? 'bg-green-100 text-green-600' :
                  activity.type === 'profile' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {activity.type === 'order' ? '🛒' :
                   activity.type === 'user' ? '👤' :
                   activity.type === 'profile' ? '📝' : '⭐'}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">{activity.user}</p>
                  <p class="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span class="text-xs text-gray-500">{activity.time}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  </>)
}

export default Setting;

import { For } from 'solid-js';

function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$54,234', change: '+12.5%', icon: '💰', color: 'bg-blue-50 text-blue-600', trend: 'up' },
    { title: 'New Users', value: '2,345', change: '+5.2%', icon: '👥', color: 'bg-green-50 text-green-600', trend: 'up' },
    { title: 'Active Sessions', value: '1,234', change: '-2.1%', icon: '📊', color: 'bg-purple-50 text-purple-600', trend: 'down' },
    { title: 'Conversion Rate', value: '4.5%', change: '+0.8%', icon: '📈', color: 'bg-orange-50 text-orange-600', trend: 'up' },
  ];

  const activities = [
    { user: 'John Smith', action: 'placed an order', time: '2 min ago', type: 'order' },
    { user: 'Emma Johnson', action: 'registered as new user', time: '15 min ago', type: 'user' },
    { user: 'Michael Brown', action: 'updated profile information', time: '1 hour ago', type: 'profile' },
    { user: 'Sarah Davis', action: 'wrote a product review', time: '3 hours ago', type: 'review' },
    { user: 'David Wilson', action: 'completed a purchase', time: '5 hours ago', type: 'purchase' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', date: 'Today, 10:30 AM', amount: '$245.99', status: 'Completed' },
    { id: '#ORD-002', customer: 'Sarah Johnson', date: 'Today, 09:15 AM', amount: '$89.50', status: 'Processing' },
    { id: '#ORD-003', customer: 'Mike Brown', date: 'Yesterday, 3:45 PM', amount: '$156.75', status: 'Completed' },
    { id: '#ORD-004', customer: 'Emma Wilson', date: 'Yesterday, 11:20 AM', amount: '$299.99', status: 'Pending' },
  ];


  return (
    <>
        {/* Welcome Banner */}
        <div class="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-bold">Welcome back, John! 👋</h2>
              <p class="text-blue-100 mt-2">Here's what's happening with your store today.</p>
            </div>
            <button class="mt-4 md:mt-0 bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              View Reports
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <For each={stats}>
            {(stat) => (
              <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">{stat.title}</p>
                    <p class="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                    <div class="flex items-center mt-1">
                      <span class={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span class="text-gray-500 text-sm ml-2">from last month</span>
                    </div>
                  </div>
                  <div class={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

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

        {/* Recent Orders Table */}
        <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Recent Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <For each={recentOrders}>
                  {(order) => (
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.amount}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={`px-3 py-1 text-xs rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
    </>
  );

}

export default Dashboard;

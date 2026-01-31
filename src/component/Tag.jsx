function Tag() {
  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', date: 'Today, 10:30 AM', amount: '$245.99', status: 'Completed' },
    { id: '#ORD-002', customer: 'Sarah Johnson', date: 'Today, 09:15 AM', amount: '$89.50', status: 'Processing' },
    { id: '#ORD-003', customer: 'Mike Brown', date: 'Yesterday, 3:45 PM', amount: '$156.75', status: 'Completed' },
    { id: '#ORD-004', customer: 'Emma Wilson', date: 'Yesterday, 11:20 AM', amount: '$299.99', status: 'Pending' },
  ];

  return (<>
    <div class="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6  text-white">
    </div>

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
  </>)
}

export default Tag;

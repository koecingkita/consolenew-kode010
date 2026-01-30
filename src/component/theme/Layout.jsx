import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Content from "./Content";

function Layout(props) {
  return (
    <div class='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <Sidebar />

      <div class='flex-1 flex flex-col overflow-hidden w-full'>
        {/* Navbar dengan padding kiri extra untuk hamburger button */}
        <div class="relative">
          <Navbar />
        </div>

        <Content>
          {props.children}
        </Content>
      </div>
    </div>
  );
}

export default Layout;

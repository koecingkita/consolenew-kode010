import { SidebarProvider } from "../context/SidebarContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Content from "./Content";
import { createEffect } from "solid-js";

function Layout(props) {

  createEffect(() => {
    console.log("console logsss");
  })

  return (
    <SidebarProvider>
      <div class='flex h-screen bg-gray-100'>
        <Sidebar />

        <div class='flex-1 flex flex-col overflow-hidden w-full'>
          <Navbar />
          <Content>
            {props.children}
          </Content>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;

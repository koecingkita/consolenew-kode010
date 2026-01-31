function ContainerContent(props){
  return <main class='flex-1 overflow-y-auto bg-gray-50'>
    <div class='p-6'>{props.children}</div>
  </main>
}

export default ContainerContent;

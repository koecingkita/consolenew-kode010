

function Layout(props) {
  return (<div>
    <div>sidebar</div>
    <div>{props.children}</div>
  </div>);
}

export default Layout;

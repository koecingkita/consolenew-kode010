function Tooltip(props) {
  const positionClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClass = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-800",
  };

  const pos = props.position || "top";

  return (
    <div class="relative inline-flex group">
      {props.children}

      <div
        class={`
          absolute ${positionClass[pos]}
          scale-95 opacity-0
          group-hover:scale-100 group-hover:opacity-100
          transition-all duration-150
          z-50
        `}
      >
        <div class="relative bg-gray-800 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap">
          {props.text}

          <div
            class={`
              absolute w-0 h-0 border-4 border-transparent
              ${arrowClass[pos]}
            `}
          />
        </div>
      </div>
    </div>
  );
}

export default Tooltip;

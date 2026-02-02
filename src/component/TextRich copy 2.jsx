import { createSignal } from 'solid-js';

function TextRich() {
  const [content, setContent] = createSignal('');
  const [selectedText, setSelectedText] = createSignal('');
  const [showImageModal, setShowImageModal] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal('');
  const [imageSize, setImageSize] = createSignal('100');
  const [imageAlign, setImageAlign] = createSignal('left');
  const [savedRange, setSavedRange] = createSignal(null);

  let editorRef;

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }
  };

  const restoreCursorPosition = () => {
    const range = savedRange();
    if (range) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const openImageModal = () => {
    saveCursorPosition();
    setShowImageModal(true);
  };

  const execCommand = (command, value = null) => {
    editorRef.focus();
    document.execCommand(command, false, value);
  };

  const insertImage = () => {
    const url = imageUrl();
    if (url) {
      // Restore cursor position first
      restoreCursorPosition();
      editorRef.focus();

      const selection = window.getSelection();
      let range;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      } else {
        // Fallback: insert at the end
        range = document.createRange();
        range.selectNodeContents(editorRef);
        range.collapse(false);
      }

      // Create wrapper div for image alignment
      const imgWrapper = document.createElement('div');
      imgWrapper.style.margin = '10px 0';

      // Set alignment
      const align = imageAlign();
      if (align === 'center') {
        imgWrapper.style.textAlign = 'center';
      } else if (align === 'right') {
        imgWrapper.style.textAlign = 'right';
      } else {
        imgWrapper.style.textAlign = 'left';
      }

      // Create image element
      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = imageSize() + '%';
      img.style.height = 'auto';
      img.style.display = 'inline-block';

      imgWrapper.appendChild(img);

      // Insert image wrapper at cursor position
      range.deleteContents();
      range.insertNode(imgWrapper);

      // Create a paragraph after image for continued typing
      const p = document.createElement('p');
      p.innerHTML = '<br>'; // Empty paragraph with br to make it editable

      // Insert paragraph after image
      if (imgWrapper.nextSibling) {
        imgWrapper.parentNode.insertBefore(p, imgWrapper.nextSibling);
      } else {
        imgWrapper.parentNode.appendChild(p);
      }

      // Move cursor to the new paragraph
      range.setStart(p, 0);
      range.setEnd(p, 0);
      selection.removeAllRanges();
      selection.addRange(range);

      setImageUrl('');
      setImageSize('100');
      setImageAlign('left');
      setShowImageModal(false);
      setContent(editorRef.innerHTML);
    }
  };

  const setAlignment = (align) => {
    const alignMap = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight'
    };
    execCommand(alignMap[align]);
  };

  const formatBlock = (tag) => {
    editorRef.focus();

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let container = range.commonAncestorContainer;

      // Get the parent element if it's a text node
      if (container.nodeType === 3) {
        container = container.parentElement;
      }

      // Find the block level element
      while (container && container !== editorRef &&
             !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'DIV'].includes(container.tagName)) {
        container = container.parentElement;
      }

      if (container && container !== editorRef) {
        const newElement = document.createElement(tag.toUpperCase());
        newElement.innerHTML = container.innerHTML;

        // Copy styles if needed
        if (tag.toUpperCase() === 'BLOCKQUOTE') {
          newElement.style.borderLeft = '4px solid #ccc';
          newElement.style.paddingLeft = '16px';
          newElement.style.marginLeft = '0';
          newElement.style.fontStyle = 'italic';
          newElement.style.color = '#666';
        }

        container.parentNode.replaceChild(newElement, container);

        // Restore selection
        const newRange = document.createRange();
        newRange.selectNodeContents(newElement);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }

      setContent(editorRef.innerHTML);
    }
  };

  const setTextColor = (color) => {
    editorRef.focus();
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('foreColor', false, color);
    document.execCommand('styleWithCSS', false, false);
  };

  const toggleList = (listType) => {
    editorRef.focus();
    const command = listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(command, false, null);
    setContent(editorRef.innerHTML);
  };

  return (
    <div class="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* Toolbar */}
      <div class="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex flex-wrap gap-2">

        {/* Heading Styles */}
        <div class="flex gap-1 border-r pr-2">
          <button
            onClick={() => formatBlock('h1')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-bold"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => formatBlock('h2')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-bold"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => formatBlock('h3')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold"
            title="Heading 3"
          >
            H3
          </button>
          <button
            onClick={() => formatBlock('h4')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold"
            title="Heading 4"
          >
            H4
          </button>
          <button
            onClick={() => formatBlock('h5')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
            title="Heading 5"
          >
            H5
          </button>
          <button
            onClick={() => formatBlock('h6')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
            title="Heading 6"
          >
            H6
          </button>
          <button
            onClick={() => formatBlock('p')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
            title="Paragraph"
          >
            P
          </button>
        </div>

        {/* Text Formatting */}
        <div class="flex gap-1 border-r pr-2">
          <button
            onClick={() => execCommand('bold')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => execCommand('italic')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => execCommand('underline')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 underline"
            title="Underline"
          >
            U
          </button>
        </div>

        {/* Alignment */}
        <div class="flex gap-1 border-r pr-2">
          <button
            onClick={() => setAlignment('left')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            title="Align Left"
          >
            ⬅
          </button>
          <button
            onClick={() => setAlignment('center')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            title="Align Center"
          >
            ↔
          </button>
          <button
            onClick={() => setAlignment('right')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            title="Align Right"
          >
            ➡
          </button>
        </div>

        {/* Lists */}
        <div class="flex gap-1 border-r pr-2">
          <button
            onClick={() => toggleList('ul')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            title="Bullet List"
          >
            • List
          </button>
          <button
            onClick={() => toggleList('ol')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        {/* Quote */}
        <div class="flex gap-1 border-r pr-2">
          <button
            onClick={() => formatBlock('blockquote')}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            title="Quote"
          >
            " Quote
          </button>
        </div>

        {/* Image */}
        <div class="flex gap-1 border-r pr-2">
          <button
            onClick={openImageModal}
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            title="Insert Image"
          >
            🖼 Image
          </button>
        </div>

        {/* Text Color */}
        <div class="flex gap-1 border-r pr-2">
          <label class="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer">
            <span class="text-sm">Color</span>
            <input
              type="color"
              onChange={(e) => setTextColor(e.target.value)}
              class="w-6 h-6 cursor-pointer"
            />
          </label>
        </div>

        {/* Font Size */}
        <div class="flex gap-1 border-r pr-2">
          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            class="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm cursor-pointer"
          >
            <option value="">Size</option>
            <option value="1">Kecil</option>
            <option value="3">Normal</option>
            <option value="5">Besar</option>
            <option value="7">Sangat Besar</option>
          </select>
        </div>

        {/* Font Family */}
        <div class="flex gap-1">
          <select
            onChange={(e) => execCommand('fontName', e.target.value)}
            class="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm cursor-pointer"
          >
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
          </select>
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        class="min-h-[400px] p-4 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        innerHTML="<p>Mulai menulis di sini...</p>"
        style={{
          'overflow-wrap': 'break-word',
          'word-wrap': 'break-word'
        }}
      />

      {/* Image Modal */}
      {showImageModal() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 class="text-lg font-bold mb-4">Insert Image</h3>

            {/* Image URL */}
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="text"
                value={imageUrl()}
                onInput={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Size */}
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">
                Size: {imageSize()}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={imageSize()}
                onInput={(e) => setImageSize(e.target.value)}
                class="w-full cursor-pointer"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Image Alignment */}
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Alignment</label>
              <div class="flex gap-2">
                <button
                  onClick={() => setImageAlign('left')}
                  class={`flex-1 px-3 py-2 border rounded ${imageAlign() === 'left' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  ⬅ Left
                </button>
                <button
                  onClick={() => setImageAlign('center')}
                  class={`flex-1 px-3 py-2 border rounded ${imageAlign() === 'center' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  ↔ Center
                </button>
                <button
                  onClick={() => setImageAlign('right')}
                  class={`flex-1 px-3 py-2 border rounded ${imageAlign() === 'right' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  ➡ Right
                </button>
              </div>
            </div>

            <div class="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                  setImageSize('100');
                  setImageAlign('left');
                }}
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={insertImage}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview/Output (optional - untuk debugging) */}
      <div class="mt-4 p-4 bg-gray-50 rounded border border-gray-300">
        <h4 class="font-bold mb-2 text-sm text-gray-600">HTML Output:</h4>
        <pre class="text-xs overflow-auto max-h-40 bg-white p-2 rounded">
          {content()}
        </pre>
      </div>
    </div>
  );
}

export default TextRich;

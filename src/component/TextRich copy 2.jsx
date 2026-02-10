import { createSignal, onMount, createEffect } from 'solid-js';
import { AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight } from 'solid-icons/ai';

function TextRich(props) {
  const [blocks, setBlocks] = createSignal([]);
  const [showImageModal, setShowImageModal] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal('');
  const [imageSize, setImageSize] = createSignal('100');
  const [imageAlign, setImageAlign] = createSignal('left');
  const [savedRange, setSavedRange] = createSignal(null);

  let editorRef;

  // Generate unique ID
  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Save cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }
  };

  // Restore cursor position
  const restoreCursorPosition = () => {
    const range = savedRange();
    if (range) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Parse HTML node to block object
  const parseNodeToBlock = (node) => {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;

    const tagName = node.tagName.toLowerCase();
    const block = {
      id: node.getAttribute('data-block-id') || generateId(),
      type: '',
      content: '',
      styles: {},
      data: {}
    };

    // Extract text content (with formatting preserved)
    const getFormattedContent = (element) => {
      let html = element.innerHTML;
      return html;
    };

    // Extract inline styles
    const extractStyles = (element) => {
      const styles = {};
      const computedStyle = window.getComputedStyle(element);

      // Color
      if (element.style.color || computedStyle.color !== 'rgb(0, 0, 0)') {
        styles.color = element.style.color || computedStyle.color;
      }

      // Text alignment
      const textAlign = element.style.textAlign || computedStyle.textAlign;
      if (textAlign && textAlign !== 'start' && textAlign !== 'left') {
        styles.textAlign = textAlign;
      }

      // Font family
      if (element.style.fontFamily) {
        styles.fontFamily = element.style.fontFamily;
      }

      // Font size
      if (element.style.fontSize) {
        styles.fontSize = element.style.fontSize;
      }

      return styles;
    };

    switch (tagName) {
      case 'h1':
        block.type = 'heading1';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'h2':
        block.type = 'heading2';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'h3':
        block.type = 'heading3';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'h4':
        block.type = 'heading4';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'h5':
        block.type = 'heading5';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'h6':
        block.type = 'heading6';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'p':
        block.type = 'paragraph';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'blockquote':
        block.type = 'quote';
        block.content = getFormattedContent(node);
        block.styles = extractStyles(node);
        break;

      case 'ul':
        block.type = 'list';
        block.data.listType = 'unordered';
        block.data.items = Array.from(node.querySelectorAll('li')).map(li => li.innerHTML);
        block.styles = extractStyles(node);
        break;

      case 'ol':
        block.type = 'list';
        block.data.listType = 'ordered';
        block.data.items = Array.from(node.querySelectorAll('li')).map(li => li.innerHTML);
        block.styles = extractStyles(node);
        break;

      case 'div':
        // Check if it's an image wrapper
        const img = node.querySelector('img');
        if (img) {
          block.type = 'image';
          block.data.url = img.src;
          block.data.alt = img.alt || '';

          // Extract size from style
          const maxWidth = img.style.maxWidth;
          block.data.size = maxWidth ? parseInt(maxWidth) : 100;

          // Extract alignment from wrapper
          const align = node.style.textAlign;
          block.data.align = align || 'left';

          block.styles = extractStyles(node);
        } else {
          // Treat as paragraph
          block.type = 'paragraph';
          block.content = getFormattedContent(node);
          block.styles = extractStyles(node);
        }
        break;

      default:
        return null;
    }

    return block;
  };

  // Parse entire editor HTML to blocks
  const htmlToBlocks = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const blocks = [];
    Array.from(tempDiv.children).forEach(node => {
      const block = parseNodeToBlock(node);
      if (block && (block.content?.trim() || block.type === 'image' || block.data?.items?.length > 0)) {
        blocks.push(block);
      }
    });

    return blocks.length > 0 ? blocks : [
      {
        id: generateId(),
        type: 'paragraph',
        content: 'Mulai menulis di sini...',
        styles: {},
        data: {}
      }
    ];
  };

  // Convert block object to HTML element
  const blockToHtml = (block) => {
    const styleString = Object.entries(block.styles || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    const dataAttr = `data-block-id="${block.id}"`;

    switch (block.type) {
      case 'heading1':
        return `<h1 ${dataAttr} class="text-4xl font-bold my-6" style="${styleString}">${block.content}</h1>`;

      case 'heading2':
        return `<h2 ${dataAttr} class="text-3xl font-bold my-5" style="${styleString}">${block.content}</h2>`;

      case 'heading3':
        return `<h3 ${dataAttr} class="text-2xl font-bold my-4" style="${styleString}">${block.content}</h3>`;

      case 'heading4':
        return `<h4 ${dataAttr} class="text-xl font-bold my-4" style="${styleString}">${block.content}</h4>`;

      case 'heading5':
        return `<h5 ${dataAttr} class="text-lg font-bold my-3" style="${styleString}">${block.content}</h5>`;

      case 'heading6':
        return `<h6 ${dataAttr} class="text-base font-bold my-3" style="${styleString}">${block.content}</h6>`;

      case 'paragraph':
        return `<p ${dataAttr} class="my-4" style="${styleString}">${block.content || '<br>'}</p>`;

      case 'quote':
        const quoteStyles = `border-left: 4px solid #ccc; padding-left: 16px; margin-left: 0; font-style: italic; color: #666; ${styleString}`;
        return `<blockquote ${dataAttr} class="border-l-4 border-gray-300 pl-4 ml-0 italic text-gray-600 my-4" style="${quoteStyles}">${block.content}</blockquote>`;

      case 'list':
        const listTag = block.data.listType === 'ordered' ? 'ol' : 'ul';
        const listClass = block.data.listType === 'ordered' ? 'list-decimal' : 'list-disc';
        const items = (block.data.items || []).map(item => `<li class="my-2">${item}</li>`).join('');
        return `<${listTag} ${dataAttr} class="${listClass} pl-10 my-4" style="${styleString}">${items}</${listTag}>`;

      case 'image':
        const alignClass = block.data.align === 'center' ? 'text-center' :
                          block.data.align === 'right' ? 'text-right' : 'text-left';
        return `<div ${dataAttr} class="my-4 ${alignClass}" style="${styleString}"><img src="${block.data.url}" class="inline-block h-auto" style="max-width: ${block.data.size}%;" alt="${block.data.alt || ''}" /></div>`;

      default:
        return '';
    }
  };

  // Convert all blocks to HTML string
  const blocksToHtml = (blocksArray) => {
    return blocksArray.map(block => blockToHtml(block)).join('');
  };

  // Convert blocks to clean HTML (without data attributes) for final output
  const blocksToCleanHtml = (blocksArray) => {
    return blocksArray.map(block => {
      const styleString = Object.entries(block.styles || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

      switch (block.type) {
        case 'heading1':
          return `<h1 class="text-4xl font-bold my-6" style="${styleString}">${block.content}</h1>`;
        case 'heading2':
          return `<h2 class="text-3xl font-bold my-5" style="${styleString}">${block.content}</h2>`;
        case 'heading3':
          return `<h3 class="text-2xl font-bold my-4" style="${styleString}">${block.content}</h3>`;
        case 'heading4':
          return `<h4 class="text-xl font-bold my-4" style="${styleString}">${block.content}</h4>`;
        case 'heading5':
          return `<h5 class="text-lg font-bold my-3" style="${styleString}">${block.content}</h5>`;
        case 'heading6':
          return `<h6 class="text-base font-bold my-3" style="${styleString}">${block.content}</h6>`;
        case 'paragraph':
          return `<p class="my-4" style="${styleString}">${block.content}</p>`;
        case 'quote':
          const quoteStyles = `border-left: 4px solid #ccc; padding-left: 16px; margin-left: 0; font-style: italic; color: #666; ${styleString}`;
          return `<blockquote class="border-l-4 border-gray-300 pl-4 ml-0 italic text-gray-600 my-4" style="${quoteStyles}">${block.content}</blockquote>`;
        case 'list':
          const listTag = block.data.listType === 'ordered' ? 'ol' : 'ul';
          const listClass = block.data.listType === 'ordered' ? 'list-decimal' : 'list-disc';
          const items = (block.data.items || []).map(item => `<li class="my-2">${item}</li>`).join('');
          return `<${listTag} class="${listClass} pl-10 my-4" style="${styleString}">${items}</${listTag}>`;
        case 'image':
          const alignClass = block.data.align === 'center' ? 'text-center' :
                            block.data.align === 'right' ? 'text-right' : 'text-left';
          return `<div class="my-4 ${alignClass}" style="${styleString}"><img src="${block.data.url}" class="inline-block h-auto" style="max-width: ${block.data.size}%;" alt="${block.data.alt || ''}" /></div>`;
        default:
          return '';
      }
    }).join('');
  };

  // Update blocks when editor content changes
  const handleEditorInput = (e) => {
    const html = e.currentTarget.innerHTML;
    const newBlocks = htmlToBlocks(html);
    setBlocks(newBlocks);
  };

  // Open image modal
  const openImageModal = () => {
    saveCursorPosition();
    setShowImageModal(true);
  };

  // Execute command
  const execCommand = (command, value = null) => {
    editorRef.focus();
    document.execCommand(command, false, value);

    // Update blocks after command execution
    setTimeout(() => {
      const html = editorRef.innerHTML;
      const newBlocks = htmlToBlocks(html);
      setBlocks(newBlocks);
    }, 10);
  };

  // Insert image
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

      // Create new image block
      const newImageBlock = {
        id: generateId(),
        type: 'image',
        content: '',
        styles: {},
        data: {
          url: url,
          alt: '',
          size: parseInt(imageSize()),
          align: imageAlign()
        }
      };

      // Create wrapper div for image alignment
      const imgWrapper = document.createElement('div');
      imgWrapper.setAttribute('data-block-id', newImageBlock.id);
      imgWrapper.classList.add('my-4');

      // Set alignment with Tailwind classes
      const align = imageAlign();
      if (align === 'center') {
        imgWrapper.classList.add('text-center');
      } else if (align === 'right') {
        imgWrapper.classList.add('text-right');
      } else {
        imgWrapper.classList.add('text-left');
      }

      // Create image element
      const img = document.createElement('img');
      img.src = url;
      img.classList.add('inline-block', 'h-auto');
      img.style.maxWidth = imageSize() + '%';

      imgWrapper.appendChild(img);

      // Insert image wrapper at cursor position
      range.deleteContents();
      range.insertNode(imgWrapper);

      // Create a paragraph after image for continued typing
      const p = document.createElement('p');
      p.setAttribute('data-block-id', generateId());
      p.classList.add('my-4');
      p.innerHTML = '<br>';

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

      // Update blocks
      setTimeout(() => {
        const html = editorRef.innerHTML;
        const newBlocks = htmlToBlocks(html);
        setBlocks(newBlocks);
      }, 10);
    }
  };

  // Set alignment
  const setAlignment = (align) => {
    const alignMap = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight'
    };
    execCommand(alignMap[align]);
  };

  // Format block (heading, paragraph, quote)
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
        const oldBlockId = container.getAttribute('data-block-id');
        const newElement = document.createElement(tag.toUpperCase());
        newElement.innerHTML = container.innerHTML;
        newElement.setAttribute('data-block-id', oldBlockId || generateId());

        // Apply Tailwind classes based on tag
        const tagUpper = tag.toUpperCase();
        switch (tagUpper) {
          case 'H1':
            newElement.classList.add('text-4xl', 'font-bold', 'my-6');
            break;
          case 'H2':
            newElement.classList.add('text-3xl', 'font-bold', 'my-5');
            break;
          case 'H3':
            newElement.classList.add('text-2xl', 'font-bold', 'my-4');
            break;
          case 'H4':
            newElement.classList.add('text-xl', 'font-bold', 'my-4');
            break;
          case 'H5':
            newElement.classList.add('text-lg', 'font-bold', 'my-3');
            break;
          case 'H6':
            newElement.classList.add('text-base', 'font-bold', 'my-3');
            break;
          case 'P':
            newElement.classList.add('my-4');
            break;
          case 'BLOCKQUOTE':
            newElement.classList.add('border-l-4', 'border-gray-300', 'pl-4', 'ml-0', 'italic', 'text-gray-600', 'my-4');
            // Add inline styles for quote-specific properties
            newElement.style.borderLeft = '4px solid #ccc';
            newElement.style.paddingLeft = '16px';
            newElement.style.marginLeft = '0';
            newElement.style.fontStyle = 'italic';
            newElement.style.color = '#666';
            break;
        }

        // Copy existing inline styles
        if (container.style.cssText) {
          newElement.style.cssText += container.style.cssText;
        }

        container.parentNode.replaceChild(newElement, container);

        // Restore selection
        const newRange = document.createRange();
        newRange.selectNodeContents(newElement);
        selection.removeAllRanges();
        selection.addRange(newRange);

        // Update blocks
        setTimeout(() => {
          const html = editorRef.innerHTML;
          const newBlocks = htmlToBlocks(html);
          setBlocks(newBlocks);
        }, 10);
      }
    }
  };

  // Set text color
  const setTextColor = (color) => {
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (!range.collapsed) {
        // Create span with color
        const span = document.createElement('span');
        span.style.color = color;

        // Extract selected content
        const selectedContent = range.extractContents();
        span.appendChild(selectedContent);

        // Insert span
        range.insertNode(span);

        // Select the newly inserted content
        range.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // If cursor without selection, set for next typing
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, color);
        document.execCommand('styleWithCSS', false, false);
      }

      editorRef.focus();

      // Update blocks
      setTimeout(() => {
        const html = editorRef.innerHTML;
        const newBlocks = htmlToBlocks(html);
        setBlocks(newBlocks);
      }, 10);
    }
  };

  // Toggle list
  const toggleList = (listType) => {
    editorRef.focus();

    if (listType === 'ul') {
      document.execCommand('insertUnorderedList', false, null);
    } else if (listType === 'ol') {
      document.execCommand('insertOrderedList', false, null);
    }

    // Add Tailwind classes to the list after creation
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;

        if (container.nodeType === 3) {
          container = container.parentElement;
        }

        // Find the list element
        while (container && container !== editorRef && !['UL', 'OL'].includes(container.tagName)) {
          container = container.parentElement;
        }

        if (container && ['UL', 'OL'].includes(container.tagName)) {
          // Add Tailwind classes
          if (container.tagName === 'UL') {
            container.classList.add('list-disc', 'pl-10', 'my-4');
          } else {
            container.classList.add('list-decimal', 'pl-10', 'my-4');
          }

          // Add classes to list items
          const listItems = container.querySelectorAll('li');
          listItems.forEach(li => {
            li.classList.add('my-2');
          });
        }
      }

      const html = editorRef.innerHTML;
      const newBlocks = htmlToBlocks(html);
      setBlocks(newBlocks);
    }, 10);
  };

  // Reset editor
  const resetEditor = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua konten?')) {
      const initialBlocks = [
        {
          id: generateId(),
          type: 'paragraph',
          content: 'Mulai menulis di sini...',
          styles: {},
          data: {}
        }
      ];
      setBlocks(initialBlocks);
      editorRef.innerHTML = blocksToHtml(initialBlocks);
      editorRef.focus();
    }
  };

  // Get JSON output
  const getJsonOutput = () => {
    return {
      blocks: blocks(),
      body_html: blocksToCleanHtml(blocks())
    };
  };

  // Initialize editor
  onMount(() => {
    const initialBlocks = [
      {
        id: generateId(),
        type: 'paragraph',
        content: 'Mulai menulis di sini...',
        styles: {},
        data: {}
      }
    ];
    setBlocks(initialBlocks);

    // Set initial HTML content
    if (editorRef) {
      editorRef.innerHTML = blocksToHtml(initialBlocks);
    }
  });

  createEffect(() => {
    props.onInput?.({
      blocks: blocks(),
      body_html: blocksToCleanHtml(blocks())
    });
  });

  return (
    <div class="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {/* Toolbar */}
      <div class="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex flex-wrap gap-2">

        {/* Heading Styles */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => formatBlock('h1')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-bold transition-colors"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => formatBlock('h2')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-bold transition-colors"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => formatBlock('h3')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold transition-colors"
            title="Heading 3"
          >
            H3
          </button>
          <button
            onClick={() => formatBlock('h4')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold transition-colors"
            title="Heading 4"
          >
            H4
          </button>
          <button
            onClick={() => formatBlock('h5')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm transition-colors"
            title="Heading 5"
          >
            H5
          </button>
          <button
            onClick={() => formatBlock('h6')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm transition-colors"
            title="Heading 6"
          >
            H6
          </button>
          <button
            onClick={() => formatBlock('p')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm transition-colors"
            title="Paragraph"
          >
            P
          </button>
        </div>

        {/* Text Formatting */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => execCommand('bold')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold transition-colors"
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => execCommand('italic')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 italic transition-colors"
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => execCommand('underline')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 underline transition-colors"
            title="Underline"
          >
            U
          </button>
        </div>

        {/* Alignment */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => setAlignment('left')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="Align Left"
          >
            <AiOutlineAlignLeft class="w-4 h-4" />
          </button>
          <button
            onClick={() => setAlignment('center')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="Align Center"
          >
            <AiOutlineAlignCenter class="w-4 h-4" />
          </button>
          <button
            onClick={() => setAlignment('right')}
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="Align Right"
          >
            <AiOutlineAlignRight class="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => toggleList('ul')}
            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm transition-colors"
            title="Bullet List"
          >
            • List
          </button>
          <button
            onClick={() => toggleList('ol')}
            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm transition-colors"
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        {/* Quote */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => formatBlock('blockquote')}
            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm transition-colors"
            title="Quote"
          >
            " Quote
          </button>
        </div>

        {/* Image */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={openImageModal}
            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm transition-colors"
            title="Insert Image"
          >
            🖼 Image
          </button>
        </div>

        {/* Text Color */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <label
            class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer transition-colors"
            onMouseDown={(e) => {
              saveCursorPosition();
            }}
          >
            <span class="text-sm">Color</span>
            <input
              type="color"
              onChange={(e) => {
                restoreCursorPosition();
                setTextColor(e.target.value);
              }}
              class="w-5 h-5 cursor-pointer"
            />
          </label>
        </div>

        {/* Font Size */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm cursor-pointer w-28 transition-colors"
          >
            <option value="">Size</option>
            <option value="1">Kecil</option>
            <option value="3">Normal</option>
            <option value="5">Besar</option>
            <option value="7">Sangat Besar</option>
          </select>
        </div>

        {/* Font Family */}
        <div class="flex gap-1 border-r border-gray-300 pr-2">
          <select
            onChange={(e) => execCommand('fontName', e.target.value)}
            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm cursor-pointer w-32 transition-colors"
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

        {/* Reset Button */}
        <div class="flex gap-1">
          <button
            onClick={resetEditor}
            class="px-3 py-1.5 bg-red-500 text-white border border-red-600 rounded hover:bg-red-600 text-sm transition-colors"
            title="Reset / Clear All"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        class="min-h-[400px] p-4 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500 break-words"
        onInput={handleEditorInput}
      />

      {/* Image Modal */}
      {showImageModal() && (
        <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
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
              <div class="flex gap-2 w-1/2">
                <button
                  onClick={() => setImageAlign('left')}
                  class={`flex justify-center px-3 py-2 border rounded transition-colors ${imageAlign() === 'left' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  <AiOutlineAlignLeft />
                </button>
                <button
                  onClick={() => setImageAlign('center')}
                  class={`flex justify-center px-3 py-2 border rounded transition-colors ${imageAlign() === 'center' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  <AiOutlineAlignCenter />
                </button>
                <button
                  onClick={() => setImageAlign('right')}
                  class={`flex justify-center px-3 py-2 border rounded transition-colors ${imageAlign() === 'right' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  <AiOutlineAlignRight />
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
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertImage}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Output */}
      <div class="mt-4 p-4 bg-gray-50 rounded border border-gray-300">
        <h4 class="font-bold mb-2 text-sm text-gray-600">Blocks JSON:</h4>
        <pre class="text-xs overflow-auto max-h-40 bg-white p-2 rounded mb-4 border border-gray-200">
          {JSON.stringify(blocks(), null, 2)}
        </pre>

        <h4 class="font-bold mb-2 text-sm text-gray-600">Body HTML (Clean Output):</h4>
        <pre class="text-xs overflow-auto max-h-40 bg-white p-2 rounded border border-gray-200">
          {blocksToCleanHtml(blocks())}
        </pre>
      </div>
    </div>
  );
}

export default TextRich;

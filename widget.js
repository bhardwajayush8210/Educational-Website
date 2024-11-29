(() => {
    const script = document.currentScript;
    let openChatModal = false;
    const src =
      script.attributes["src"]?.nodeValue || "https://widget.cxgenie.ai";
    const url = new URL(src)?.origin;
    const apiUrl = "https://api.cxgenie.ai/api";
  
    const loadWidget = async () => {
      const agentId = script.attributes["data-aid"]?.nodeValue;
      const lang = script.attributes["data-lang"]?.nodeValue;
      const userToken = script.attributes["data-token"]?.nodeValue;
      const isMobile = JSON.parse(
        script.attributes["data-mobile"]?.nodeValue || "false"
      );
      const hideWidgetButton =
        script.attributes["data-hide-widget-button"]?.nodeValue || "";
  
      // * Add css file to website
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${url}/widget.css`;
      document.head.appendChild(link);
  
      if (!agentId) {
        return;
      }
  
      const bot = await fetch(`${apiUrl}/v1/bots/public/${agentId}`)
        .then((res) => res.json())
        .then((res) => res.data);
  
      if (!bot) {
        return;
      }
  
      const { chat_widget_icon: icon, auto_open_chat_in_web } = bot;
  
      const object = document.createElement("object");
      object.className = `cxgenie-chat-modal ${isMobile ? "mobile open" : ""} ${
        hideWidgetButton ? "hide-button" : ""
      }`;
      object.data = `${url}?agent-id=${agentId}&is-mobile=${isMobile}&user-token=${userToken}${
        lang ? `&lang=${lang}` : ""
      }`;
      object.ariaLabel = "Chat modal";
  
      // * Button to open / close chat
      const chatButton = document.createElement("div");
      chatButton.id = "cxgenie-chat-button";
      chatButton.className = "cxgenie-chat-button";
  
      const documentIcon = icon
        ? `
        <img 
        src="${icon}"
        width="100%"
        height="100%"
        style="border-radius: 100%; object-fit: cover;"
        />`
        : `<img src='${url}/document-icon.svg' class="document-icon" />`;
      const closeIcon = `<img src='${url}/close-icon.svg' class="close-icon" />`;
      chatButton.innerHTML = documentIcon;
  
      const CLOSE_ICON = document.createElement("div");
      CLOSE_ICON.innerHTML = `<img src='${url}/close-icon-small.svg' />`;
      CLOSE_ICON.className = `cxgenie-close-icon ${
        hideWidgetButton ? "hide-button" : ""
      }`;
  
      let shouldTriggerClick = true; // Variable to control click
  
      if (bot.is_widget_draggable) {
        let isDragging = false;
        let startX, startY, offsetX, offsetY;
        const dragThreshold = 5; // Threshold in pixels to determine is click event should run instead. So if the drag is less than 5 pixels, then click function should run.
  
        // Utility function to get clientX and clientY
        function getEventCoordinates(e) {
          if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
          return { x: e.clientX, y: e.clientY };
        }
  
        function startDrag(e) {
          isDragging = true;
          shouldTriggerClick = true; // Reset flag since shouldTriggerClick will be false if there is a previous drag.
  
          const { x, y } = getEventCoordinates(e);
          startX = x;
          startY = y;
          offsetX = x - chatButton.offsetLeft;
          offsetY = y - chatButton.offsetTop;
          e.preventDefault();
        }
  
        function drag(e) {
          if (isDragging) {
            handleCloseChatModal();
            const { x, y } = getEventCoordinates(e);
  
            let newX = x - offsetX;
            let newY = y - offsetY;
  
            // Constrain the chat button within the viewport
            newX = Math.max(
              0,
              Math.min(newX, window.innerWidth - chatButton.offsetWidth)
            );
            newY = Math.max(
              0,
              Math.min(newY, window.innerHeight - chatButton.offsetHeight)
            );
  
            chatButton.style.left = newX + "px";
            chatButton.style.top = newY + "px";
  
            positionChatModal();
  
            const moveX = Math.abs(x - startX);
            const moveY = Math.abs(y - startY);
  
            // If dragged beyond the threshold, cancel the click event
            if (moveX > dragThreshold || moveY > dragThreshold) {
              shouldTriggerClick = false;
            }
          }
          e.preventDefault();
        }
  
        function stopDrag(e) {
          if (isDragging) {
            chatButton.click(); //Required because for touch events, touchmove is skipped when there is no significant movement, therefore we open the modal when touch ends.
          }
          isDragging = false;
          e.preventDefault();
        }
  
        // Mouse events
        chatButton.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
  
        // Touch events
        chatButton.addEventListener("touchstart", startDrag);
        chatButton.addEventListener("touchmove", drag);
        chatButton.addEventListener("touchend", stopDrag);
      }
  
      function positionChatModal() {
        const chatButtonRect = chatButton.getBoundingClientRect();
  
        // Margins and dimensions for positioning
        const chatModalWidth = 400; // Width of the chat modal
        const chatModalHeight = 490; // Height of the chat modal
        const marginBetweenButtonAndModal = 20; // Distance between chat button and modal
        const chatButtonSize = 40;
  
        // Calculate available space
        const availableRightSpace = window.innerWidth - chatButtonRect.right;
        const availableBottomSpace = window.innerHeight - chatButtonRect.bottom;
        const availableLeftSpace = chatButtonRect.left;
        const availableTopSpace = chatButtonRect.top;
  
        let objectRight, objectBottom;
  
        // Prioritize positioning the chat modal to the right and bottom
        if (availableRightSpace >= chatModalWidth) {
          // Enough space on the right
          objectRight =
            availableRightSpace - chatModalWidth - marginBetweenButtonAndModal;
        } else if (availableLeftSpace >= chatModalWidth) {
          // Enough space on the left
          objectRight =
            window.innerWidth - chatButtonRect.left + marginBetweenButtonAndModal;
        } else {
          // Default to right-aligned with a minimum margin
          objectRight = Math.max(window.innerWidth - chatModalWidth - 10, 10);
        }
  
        if (availableBottomSpace >= chatModalHeight) {
          // Enough space below
          objectBottom =
            availableBottomSpace -
            chatModalHeight +
            chatButtonSize +
            marginBetweenButtonAndModal;
        } else if (availableTopSpace >= chatModalHeight) {
          // Enough space above
  
          objectBottom =
            window.innerHeight - chatButtonRect.bottom - chatModalHeight - 10;
        } else {
          // Default to bottom-aligned with a minimum margin
          objectBottom = Math.max(window.innerHeight - chatModalHeight - 10, 10);
        }
  
        // Apply positioning
        object.style.right = `${Math.max(objectRight, 10)}px`; // Ensure at least 10px margin
        object.style.bottom = `${Math.max(objectBottom, 10)}px`; // Ensure at least 10px margin
  
        // Update the close icon position
        CLOSE_ICON.style.right = `${Math.max(objectRight, 10) + 10}px`;
        CLOSE_ICON.style.bottom = `${Math.max(objectBottom, 10) + 450}px`;
      }
  
      const handleOpenChatModal = () => {
        setTimeout(() => {
          if (!hideWidgetButton) {
            positionChatModal();
          }
          object.classList.add("open");
          CLOSE_ICON.classList.add("open");
          openChatModal = true;
          chatButton.innerHTML = closeIcon;
        }, 0);
      };
  
      const handleCloseChatModal = () => {
        object.classList.remove("open");
        CLOSE_ICON.classList.remove("open");
        openChatModal = false;
        chatButton.innerHTML = documentIcon;
      };
  
      window.openCXGenieChatWidget = handleOpenChatModal;
      window.closeCXGenieChatWidget = handleCloseChatModal;
  
      CLOSE_ICON.onclick = () => {
        handleCloseChatModal();
      };
  
      chatButton.onclick = () => {
        if (!shouldTriggerClick) return;
        if (!openChatModal) {
          handleOpenChatModal();
        } else {
          handleCloseChatModal();
        }
      };
  
      const onClickOutside = (element, callback) => {
        document.addEventListener("click", (e) => {
          if (!element.contains(e.target)) callback();
        });
      };
  
      document.addEventListener("keydown", (event) => {
        if (event.code === "Escape") {
          handleCloseChatModal();
        }
      });
  
      if (!isMobile) {
        onClickOutside(object, () => {
          handleCloseChatModal();
        });
      }
  
      fetch(`${apiUrl}/v1/sites`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bot_id: agentId, domain: window.origin }),
      });
  
      const chatButtonStyle = chatButton.style;
      chatButtonStyle.background = bot.theme_color || "#364de7";
      chatButton.classList.add("open");
  
      if (isMobile) {
        const container = document.createElement("div");
        container.style.width = "100vw";
        container.style.height = "100vh";
        container.style.overflow = "hidden";
        container.appendChild(object);
        document.body.appendChild(container);
        document.body.classList.add("mobile");
      } else {
        document.body.appendChild(CLOSE_ICON);
        document.body.appendChild(object);
  
        if (!hideWidgetButton) {
          document.body.append(chatButton);
        }
      }
  
      if (auto_open_chat_in_web) {
        handleOpenChatModal();
      }
    };
  
    if (document.readyState === "complete") {
      loadWidget();
    } else {
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "complete") {
          loadWidget();
        }
      });
    }
  })();
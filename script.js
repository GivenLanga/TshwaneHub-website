document.addEventListener("DOMContentLoaded", () => {
  // Nav hover functionality
  const navItems = document.querySelectorAll(".nav-item, .dropdown .list");
  const images = document.querySelectorAll(".peice-container img");
  window.addEventListener("resize", () => {
    randomizePositions();
    dropPieces();
  });

  // Maps navigation items to corresponding image indices
  // Note: Image order must match DOM order in .peice-container
  const navToImageMap = {
    Home: 0, // Index 0, maps to home in the peice-cointainer to home in the navbar
    Shapers: 1,
    AboutUs: 2,
    Mission: 3,
    Projects: 4,
    Partners: 5,
    ContactUS: 6, //Index 6
  };
  // Theme toggle functionality
  const themeToggle = document.querySelector(".theme-toggle");
  const body = document.body;

  // Check localStorage for saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === "dark-mode" ? "💡" : "🌙";
  }

  themeToggle.addEventListener("click", () => {
    body.classList.add("transitioning");

    setTimeout(() => {
      body.classList.toggle("dark-mode");
      const isDarkMode = body.classList.contains("dark-mode");

      // Update toggle icon
      themeToggle.textContent = isDarkMode ? "💡" : "🌙";

      // Save to localStorage
      localStorage.setItem("theme", isDarkMode ? "dark-mode" : "");

      body.classList.remove("transitioning");
    }, 500);
  });
  // Handle nav hover effects
  const handleHover = (event, hover) => {
    const text = event.target.textContent.trim();
    const imageIndex = navToImageMap[text];
    /* This code changes the scale of the piece-img based on the user's intarection with the nav-bar*/
    if (imageIndex !== undefined && images[imageIndex]) {
      // cheking if the cursor position is on the nav
      // and on one of the left nav-items

      const img =
        images[
          imageIndex
        ]; /* imageIndex iterates through navToimage based on where the cursor is in the nav 
       bar, using the numbers to map pieces*/
      img.style.transform = hover ? "scale(1.2)" : "scale(1)";
      img.style.boxShadow = hover
        ? "0 6px 20px rgba(154, 154, 154, 0.3)"
        : "none";
    }
  };

  navItems.forEach((navItem) => {
    navItem.addEventListener("mouseover", (e) => handleHover(e, true));
    navItem.addEventListener("mouseout", (e) => handleHover(e, false));
  });

  // Piece animation functionality
  const container = document.querySelector(".peice-container");
  const pieces = document.querySelectorAll(".peice-container img");
  const imageSize = 100;
  const minDistance = imageSize * 1.2;
  const logoSize = 500;

  // Randomize positions with collision detection
  // Generates random positions for pieces while avoiding collisions and central area
  const randomizePositions = () => {
    // Get container dimensions and center point
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    // Set minimum distance between pieces (adaptive for mobile)
    const minDistance = window.innerWidth < 768 ? imageSize : imageSize * 1.2;
    const positions = [];

    // Process each piece individually
    pieces.forEach((piece) => {
      let collision,
        attempts = 0;
      let randomX, randomY;
      // Attempt position generation until valid or max attempts reached
      do {
        collision = false;
        // Generate random position within container bounds
        randomX = Math.random() * (containerRect.width - imageSize);
        randomY = Math.random() * (containerRect.height - imageSize);

        // Check if piece overlaps with central logo area
        const pieceCenterX = randomX + imageSize / 2;
        const pieceCenterY = randomY + imageSize / 2;

        // Calculate distance from center
        const distX = Math.abs(centerX - pieceCenterX);
        const distY = Math.abs(centerY - pieceCenterY);

        // Check if within 500x500 area (250px buffer from center)
        if (distX < 250 && distY < 250) {
          collision = true;
        }

        // Check other pieces collision:
        if (!collision) {
          for (const pos of positions) {
            const dx = pos.x - randomX;
            const dy = pos.y - randomY;
            // Flag collision if too close to another piece
            if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
              collision = true;
              break;
            }
          }
        }

        attempts++;
      } while (collision && attempts < 100);
      // Store and apply valid position
      positions.push({ x: randomX, y: randomY });
      piece.style.left = `${randomX}px`;
      piece.style.top = `${randomY}px`;
      piece.style.opacity = 0; // Start hidden for drop animation
    });
  };
  // Animate pieces dropping in
  const dropPieces = () => {
    pieces.forEach((piece, index) => {
      setTimeout(() => {
        piece.style.opacity = "1";
        piece.style.transform = "translateY(0)";
      }, index * 300);
    });
  };

  // Mouse movement effect: the code moves the pieces in the direction of the mouse cursor
  const movePieces = (event) => {
    // Get the bounding rectangle of the container
    const rect = container.getBoundingClientRect();
    // Calculate the mouse position relative to the container
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // Loop through each piece and apply a movement effect
    pieces.forEach((piece, index) => {
      const offsetX = (mouseX * (index + 1)) / 100;
      const offsetY = (mouseY * (index + 1)) / 100;

      piece.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  };

  // Initial
  // Randomly position the pieces before starting the animation
  randomizePositions();
  // Wait for 500 milliseconds, then trigger the function to drop the pieces into place
  setTimeout(dropPieces, 500);
  // Add an event listener to track mouse movement and move pieces accordingly
  container.addEventListener("mousemove", movePieces);

  // Check if touch events are supported (for mobile devices)
  if ("ontouchstart" in window) {
    // Loop through each image piece to add touch interaction effects
    pieces.forEach((img) => {
      // When a user touches a piece, slightly enlarge it and add a shadow effect
      img.addEventListener(
        "touchstart",
        () => {
          img.style.transform = "scale(1.1)";
          img.style.boxShadow = "0 4px 8px rgba(113, 114, 116, 0.8)";
        },
        { passive: true }
      );
      // When the user releases the touch, reset the size and remove the shadow
      img.addEventListener(
        "touchend",
        () => {
          img.style.transform = "scale(1)";
          img.style.boxShadow = "none";
        },
        { passive: true }
      );
    });
  }
});

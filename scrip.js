document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item, .dropdown .list");
  const images = document.querySelectorAll(".peice-container img");

  const navToImageMap = {
    Home: 0,
    Shapers: 1,
    AboutUs: 2,
    Mission: 3,
    Projects: 4,
    Partners: 5,
    ContactUS: 6,
  };

  // Hover effect handler
  const handleHover = (event, hover) => {
    const text = event.target.textContent.trim();
    const imageIndex = navToImageMap[text];

    if (imageIndex !== undefined && images[imageIndex]) {
      const correspondingImage = images[imageIndex];
      if (hover) {
        correspondingImage.style.transform = "scale(1.2)";
        correspondingImage.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
      } else {
        correspondingImage.style.transform = "scale(1)";
        correspondingImage.style.boxShadow = "none";
      }
    }
  };

  // Attach listeners
  navItems.forEach((navItem) => {
    navItem.addEventListener("mouseover", (e) => handleHover(e, true));
    navItem.addEventListener("mouseout", (e) => handleHover(e, false));
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".peice-container");
  const pieces = document.querySelectorAll(".peice-container img");

  // Randomize initial positions
  const randomizePositions = () => {
    const containerRect = container.getBoundingClientRect();

    pieces.forEach((piece) => {
      const randomX = Math.random() * containerRect.width - 75; // Subtract half size for centering
      const randomY = Math.random() * containerRect.height - 75;

      piece.style.position = "absolute";
      piece.style.left = `${randomX}px`;
      piece.style.top = `${randomY}px`;
      piece.style.opacity = 0;
    });
  };

  // Animate pieces dropping in 1 by 1
  const dropPieces = () => {
    pieces.forEach((piece, index) => {
      setTimeout(() => {
        piece.style.opacity = 1;
        piece.style.transform = `translateY(0)`;
        piece.style.transition =
          "transform 0.5s ease-out, opacity 0.5s ease-out";
      }, index * 300); // Delay based on index
    });
  };

  // Move pieces with mouse
  const movePieces = (event) => {
    const { clientX, clientY } = event;
    const rect = container.getBoundingClientRect();

    // Calculate mouse position relative to container
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    pieces.forEach((piece, index) => {
      const offsetX = (mouseX * (index + 1)) / 100;
      const offsetY = (mouseY * (index + 1)) / 100;
      piece.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  };

  randomizePositions();

  // Trigger dropping animation on load
  setTimeout(dropPieces, 500);

  // Add event listener for mouse movement
  container.addEventListener("mousemove", movePieces);
});

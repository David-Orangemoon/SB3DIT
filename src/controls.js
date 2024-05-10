(function() {
  const canvas = document.getElementById("blockDisplay");

  SB3DIT.dragging = false;

  /*canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    if (event.ctrlKey) {
    }
    else {
      SB3DIT.scroll[0] += event.deltaX / SB3DIT.zoom;
      SB3DIT.scroll[1] += event.deltaY / SB3DIT.zoom;
    }
  });

  canvas.addEventListener("mousedown", (event) => {
    event.preventDefault();
    if (event.button == 0) {
      SB3DIT.dragging = true;
    }
  })
  
  canvas.addEventListener("mouseup", (event) => {
    event.preventDefault();
    if (event.button == 0) {
      SB3DIT.dragging = false;
    }
  })

  canvas.addEventListener("mousemove", (event) => {
    if (SB3DIT.dragging) {
      SB3DIT.scroll[0] -= event.movementX / SB3DIT.zoom;
      SB3DIT.scroll[1] -= event.movementY / SB3DIT.zoom;
    }
  })*/
})();
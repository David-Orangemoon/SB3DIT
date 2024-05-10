(function() {
  //Check for document load
  window.onload = () => {
    //Render block display
    const animFrame = () => {
      SB3DIT.renderBlockDisplay();

      window.requestAnimationFrame(animFrame);
    };

    window.requestAnimationFrame(animFrame);
  }
})();
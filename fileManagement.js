(function() {
  SB3DIT.jszip = new JSZip();
  SB3DIT.project = null;
  SB3DIT.projectJSON = {};
  SB3DIT.projectLoaded = false;


  SB3DIT.openFile = () => {
    const fileOpener = document.createElement("input");
    fileOpener.type = "file";
    fileOpener.accept = ".sb3,.pmp";
    
    fileOpener.addEventListener("change", () => {
      let file = fileOpener.files[0];
      if (!file) {
        return;
      }
      
      SB3DIT.projectName = file.name;

      SB3DIT.jszip.loadAsync(file).then((zip) => {
        SB3DIT.project = zip;

        zip.files["project.json"].async('text').then((txt) => {
          SB3DIT.projectJSON = JSON.parse(txt);
          SB3DIT.projectLoaded = true;
          SB3DIT.editingSprite = SB3DIT.projectJSON.targets.length > 1 ? 1 : 0;
          SB3DIT.getPotentialHatBlocks(SB3DIT.editingSprite);
          SB3DIT.getProjectSprites();
        });
      });
    });

    fileOpener.click();
  }

  SB3DIT.saveFile = () => {
    if (SB3DIT.projectLoaded) {
      SB3DIT.project.file("project.json",JSON.stringify(SB3DIT.projectJSON));
      SB3DIT.project.generateAsync({type:"blob"})
      .then(function (blob) {
          saveAs(blob, SB3DIT.projectName);
      });
    }
  }
})();
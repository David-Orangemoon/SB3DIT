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

  SB3DIT.editAndSaveAsPMP = () => {
    if (SB3DIT.projectLoaded) {
      const parsing = JSON.parse(JSON.stringify(SB3DIT.projectJSON));

      parsing.targets.forEach(target => {
        Object.keys(target.blocks).forEach(blockID => {
          switch (target.blocks[blockID].opcode) {
            case "procedures_call":
              if (!target.blocks[blockID].mutation.return) break;
              switch (target.blocks[blockID].mutation.return) {
                case "1":
                  target.blocks[blockID].mutation.optype = "\"string\"";
                  target.blocks[blockID].mutation.returns = "true";
                  break;

                case "2":
                  target.blocks[blockID].mutation.optype = "\"boolean\"";
                  target.blocks[blockID].mutation.returns = "true";
                  break;
              
                default:
                  break;
              }
              console.log(target.blocks[blockID].mutation.optype)
              break;
          
            case "procedures_return":
              if (target.blocks[blockID].inputs) {
                if (target.blocks[blockID].inputs.VALUE) {
                  target.blocks[blockID].inputs.return = target.blocks[blockID].inputs.VALUE;
                  delete target.blocks[blockID].inputs.VALUE
                } 
              }
              console.log(target.blocks[blockID].inputs.return)
              break;

            default:
              break;
          }
        });
      });

      SB3DIT.project.file("project.json",JSON.stringify(parsing));
      SB3DIT.project.generateAsync({type:"blob"})
      .then(function (blob) {
          saveAs(blob, SB3DIT.projectName + ".pmp");
      });
    }
  }
})();
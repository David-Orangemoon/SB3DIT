(function() {
  //Get our block images
  SB3DIT.blockImages = {
    block:document.getElementById("block"),
    customBlock:document.getElementById("customBlock"),
    hatBlock:document.getElementById("hatBlock"),
    shadow_block:document.getElementById("shadowBlock"),
    shadow_customBlock:document.getElementById("shadowCustomBlock"),
    shadow_hatBlock:document.getElementById("shadowHatBlock")
  }

  SB3DIT.scroll = [0,0];
  SB3DIT.scrollTarget = [0,0];
  SB3DIT.editingSprite = 0;
  SB3DIT.zoom = 0.5;
  
  //Get our display
  SB3DIT.blockDisplay = document.getElementById("blockDisplay");

  //Resize canvas to fit screen without css
  SB3DIT.blockDisplay.width = SB3DIT.blockDisplay.clientWidth;
  SB3DIT.blockDisplay.height = SB3DIT.blockDisplay.clientHeight;

  document.addEventListener("resize", () => {
    SB3DIT.blockDisplay.width = SB3DIT.blockDisplay.clientWidth;
    SB3DIT.blockDisplay.height = SB3DIT.blockDisplay.clientHeight;
  })

  //Declare the GL
  SB3DIT.blockGL = SB3DIT.blockDisplay.getContext("2d");
  const gl = SB3DIT.blockGL;

  SB3DIT.drawBlock = (block,overideX,overideY,blockID,parentShadowed) => {
    overideX = (overideX || block.x || 0) - SB3DIT.scroll[0];
    overideY = (overideY || block.y || 0) - SB3DIT.scroll[1];

    gl.filter = (typeof SB3DIT.blockColors[block.opcode.split("_")[0]] == "object") ? `hue-rotate(${SB3DIT.blockColors[block.opcode.split("_")[0]][0]}deg) saturate(${SB3DIT.blockColors[block.opcode.split("_")[0]][1]}%)` : `hue-rotate(${SB3DIT.blockColors[block.opcode.split("_")[0]] !== undefined ? SB3DIT.blockColors[block.opcode.split("_")[0]] : SB3DIT.blockColors.sb3ditUnknownBlocks}deg)`;

    let image = SB3DIT.blockImages[`${block.shadow || parentShadowed ? "shadow_" : ""}block`];
    let offset = 0;

    if (block.topLevel) {
      image = SB3DIT.blockImages[`${block.shadow || parentShadowed ? "shadow_" : ""}hatBlock`];
      offset = 16;
    }

    if (block.opcode == "procedures_definition") {
      image = SB3DIT.blockImages[`${block.shadow || parentShadowed ? "shadow_" : ""}customBlock`];
      offset = 36;

      if (SB3DIT.projectJSON.targets[1].blocks[block.inputs.custom_block[1]]) {
        let mutation = SB3DIT.projectJSON.targets[1].blocks[block.inputs.custom_block[1]].mutation;
        
        if (mutation.colour) {
          gl.filter = `hue-rotate(${SB3DIT.hexToHSV(SB3DIT.projectJSON.targets[1].blocks[block.inputs.custom_block[1]].mutation.colour)[0]}deg`;
        }
        else if (mutation.color) {
          gl.filter = `hue-rotate(${SB3DIT.hexToHSV(JSON.parse(SB3DIT.projectJSON.targets[1].blocks[block.inputs.custom_block[1]].mutation.color)[0])[0]}deg`;
        }
      }
    }

    
    if (SB3DIT.selectedHat == blockID) {
      SB3DIT.scrollTarget[0] = overideX + SB3DIT.scroll[0] + image.width / 2;
      SB3DIT.scrollTarget[1] = overideY + SB3DIT.scroll[1] + image.height / 2;
    }

    if (
      ((overideX + image.width ) * SB3DIT.zoom  + (SB3DIT.blockDisplay.width / 2))> 0 &&  (overideX * SB3DIT.zoom < SB3DIT.blockDisplay.width   + (SB3DIT.blockDisplay.width / 2)) &&
      ((overideY + image.height) * SB3DIT.zoom + (SB3DIT.blockDisplay.width / 2)) > 0 && ( overideY * SB3DIT.zoom < SB3DIT.blockDisplay.height + (SB3DIT.blockDisplay.width / 2))
    ) {
      gl.drawImage(image, 
        (overideX * SB3DIT.zoom) + (SB3DIT.blockDisplay.width / 2), 
        (overideY * SB3DIT.zoom) + (SB3DIT.blockDisplay.height / 2),
        image.width * SB3DIT.zoom,
        image.height * SB3DIT.zoom
      );
    }

    return offset;
  }

  SB3DIT.renderBlocksFromTarget = (id) => {
    const spriteBlocks = SB3DIT.projectJSON.targets[id].blocks;

    const blockKeys = Object.keys(spriteBlocks);

    const drawRecursive = (blockID,x,y,stackheight,parentShadowed) => {
      const block = spriteBlocks[blockID];
      if (!block) return stackheight;
      
      let offset = SB3DIT.drawBlock(block,x,y,blockID,parentShadowed);
      
      if (block.inputs) {
        inputKeys = Object.keys(block.inputs);
        for (let inputID = 0; inputID < inputKeys.length; inputID++) {
          const inputKey = inputKeys[inputID];
          const input = block.inputs[inputKey];
          
          if (!input) continue;
          //console.log(input[0]);
          
          if (input[0] == 2) {
            offset += drawRecursive(input[1],x + 16,y + 48 + offset,0,block.shadow || parentShadowed);
          }
        }
      }

      if (block.next) {
        stackheight += drawRecursive(block.next,x,y + 48 + offset,0,block.shadow || parentShadowed);
      }

      stackheight += 48;
      
      return stackheight; 
    }

    blockKeys.forEach(blockKey => {
      const block = spriteBlocks[blockKey];
      if (block.topLevel == true) {
        drawRecursive(blockKey,block.x,block.y,0);
      }
    });
  }

  SB3DIT.renderBlockDisplay = () => {
    //Clear
    gl.fillStyle = "#111111";
    gl.fillRect(0,0,SB3DIT.blockDisplay.width,SB3DIT.blockDisplay.height);

    if (SB3DIT.projectLoaded) {
      const spriteBlocks = SB3DIT.projectJSON.targets[SB3DIT.editingSprite].blocks;

      SB3DIT.renderBlocksFromTarget(SB3DIT.editingSprite);

      if (spriteBlocks[SB3DIT.selectedHat]) {
        SB3DIT.scroll[0] += (SB3DIT.scrollTarget[0] - SB3DIT.scroll[0]) * 0.125;
        SB3DIT.scroll[1] += (SB3DIT.scrollTarget[1] - SB3DIT.scroll[1]) * 0.125;
      }
    }
    else {
      gl.fillStyle = "#efefef"
      gl.font = "24px monospace";
      gl.fillText("No Project Loaded",2,26);
    }
  }
})();
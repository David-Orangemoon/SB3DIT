(function() {
    SB3DIT.hatBlocks = [];
    SB3DIT.selectedHat = "";

    SB3DIT.hatPanel = document.getElementById("blockPanel");
    SB3DIT.spritePanel = document.getElementById("spritePanel");

    SB3DIT.getProjectSprites = () => {
        SB3DIT.spritePanel.innerHTML = ``;

        for (let index = 0; index < SB3DIT.projectJSON.targets.length; index++) {
            const target = SB3DIT.projectJSON.targets[index];

            const divElement = document.createElement("div");
            divElement.innerText = target.name;

            divElement.className = "spriteDiv";

            divElement.onclick = () => {
                SB3DIT.editingSprite = index;
                SB3DIT.getPotentialHatBlocks(SB3DIT.editingSprite);
            }
            
            SB3DIT.spritePanel.appendChild(divElement);
        }
    }

    SB3DIT.getPotentialHatBlocks = (id) => {
        SB3DIT.hatPanel.innerHTML = "";

        SB3DIT.hatBlocks = [];

        const spriteBlocks = SB3DIT.projectJSON.targets[id].blocks;

        const blockKeys = Object.keys(spriteBlocks);

        blockKeys.forEach(blockKey => {
            const block = spriteBlocks[blockKey];
            if (block.topLevel == true) {
                SB3DIT.hatBlocks.push(blockKey);

                const divElement = document.createElement("div");

                divElement.onmouseover = () => {
                    SB3DIT.selectedHat = blockKey;
                }

                divElement.innerHTML = `${block.opcode == "procedures_definition" ? spriteBlocks[block.inputs.custom_block[1]].mutation.proccode : block.opcode} : <br>
                <input type="checkbox" id="${blockKey}_hiddenCheck" ${block.shadow ? "checked" : ""}>Hidden</input><br>`;

                SB3DIT.hatPanel.appendChild(divElement);

                if (block.opcode == "procedures_definition") {
                    const mutation = SB3DIT.projectJSON.targets[id].blocks[SB3DIT.projectJSON.targets[id].blocks[blockKey].inputs.custom_block[1]].mutation;

                    divElement.innerHTML += `<input type="color" id="${blockKey}_blockColor" style="height:1em; padding:0px;" value="${mutation.colour || JSON.parse(mutation.color || "[]")[0] || "#ff6680"}">Color</input><br>
                    <input type="checkbox" id="${blockKey}_refreshCheck" ${mutation.warp == "true" ? "checked" : ""}>Run Without Screen Refresh</input><br><br>`;
                    
                    const blockColor = document.getElementById(`${blockKey}_blockColor`);
                    blockColor.onchange = () => {
                        SB3DIT.projectJSON.targets[id].blocks[SB3DIT.projectJSON.targets[id].blocks[blockKey].inputs.custom_block[1]].mutation.colour = blockColor.value;
                        SB3DIT.projectJSON.targets[id].blocks[SB3DIT.projectJSON.targets[id].blocks[blockKey].inputs.custom_block[1]].mutation.color = `["${blockColor.value}","${blockColor.value}","${blockColor.value}"]`;
                    }

                    const refreshCheck = document.getElementById(`${blockKey}_refreshCheck`);
                    refreshCheck.onchange = () => {
                        //Scratch has this as a string for some reason?
                        SB3DIT.projectJSON.targets[id].blocks[SB3DIT.projectJSON.targets[id].blocks[blockKey].inputs.custom_block[1]].mutation.warp = `${refreshCheck.checked}`;
                    }
                }
                else {
                    divElement.innerHTML += "<br>";
                }

                const hiddenCheckmark = document.getElementById(`${blockKey}_hiddenCheck`);
                hiddenCheckmark.onchange = () => {
                    SB3DIT.projectJSON.targets[id].blocks[blockKey].shadow = hiddenCheckmark.checked;
                }
            }
        });

        SB3DIT.selectedHat = SB3DIT.hatBlocks[0];
    }
})();
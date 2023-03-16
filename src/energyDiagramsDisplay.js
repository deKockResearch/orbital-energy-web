import p5 from "p5";
export function drawDiagram(eConfig, calcEnergy) {
    let sketch = (p) => {
        class SZlevel {
            constructor() { }
            // Make a singular orbital
            makeOrbital(eCount, center, unitL) {
                // main orbital line
                p.line(center[0] - unitL / 2, center[1], center[0] + unitL / 2, center[1]);
                let disp = unitL / 6;
                if (eCount >= 1) {
                    // first electron arrow
                    p.line(center[0] - disp, center[1] - unitL / 2, center[0] - disp, center[1] + unitL / 2);
                    // Arrowhead
                    p.line(center[0] - disp, center[1] - unitL / 2, center[0], center[1] - (disp * 3) / 2);
                    p.line(center[0] - disp, center[1] - unitL / 2, center[0] - 2 * disp, center[1] - (disp * 3) / 2);
                }
                if (eCount === 2) {
                    // second electron arrow
                    p.line(center[0] + disp, center[1] - unitL / 2, center[0] + disp, center[1] + unitL / 2);
                    // Arrowhead
                    p.line(center[0] + disp, center[1] + unitL / 2, center[0], center[1] + (disp * 3) / 2);
                    p.line(center[0] + disp, center[1] + unitL / 2, center[0] + 2 * disp, center[1] + (disp * 3) / 2);
                }
            }
            makeLevel(orbName, center, unitL, energyValue) {
                if (orbName.charAt(1) === "s") {
                    // 1s2
                    this.makeOrbital(Number(orbName.slice(2)), [center[0] + (unitL * 5) / 4, center[1]], unitL);
                }
                else if (orbName.charAt(1) === "p") {
                    // draw three lines and then populate it based off the electrons in the orbital
                    let eLoc = [0, 0, 0];
                    let eCount = Number(orbName.slice(2));
                    for (let i = 0; eCount > 0; i++) {
                        eLoc[i % 3] += 1;
                        eCount--;
                    }
                    this.makeOrbital(eLoc[0], center, unitL);
                    this.makeOrbital(eLoc[1], [center[0] + (unitL * 5) / 4, center[1]], unitL);
                    this.makeOrbital(eLoc[2], [center[0] + (unitL * 5) / 2, center[1]], unitL);
                }
                else {
                    console.log("Unsupported orbital type");
                }
                p.text(`${orbName.slice(0, 2)} Energy: ${energyValue}`, center[0] + unitL * 5, center[1] + unitL / 8);
            }
            makeAxis(center, unitL) {
                let lineStart = [center[0] / 2, center[1]];
                p.line(lineStart[0], lineStart[1], lineStart[0], lineStart[1] - unitL * 6);
                p.line(lineStart[0] - unitL / 6, lineStart[1] - unitL / 4 - (unitL * 11) / 2, lineStart[0], lineStart[1] - unitL / 2 - (unitL * 11) / 2);
                p.line(lineStart[0] + unitL / 6, lineStart[1] - unitL / 4 - (unitL * 11) / 2, lineStart[0], lineStart[1] - unitL / 2 - (unitL * 11) / 2);
                p.text("Energy", lineStart[0] - unitL * 2, lineStart[1] - unitL * 3);
            }
        }
        // Temporary canvas size
        let h = 800;
        let w = 800;
        // Basic p5 canvas setup
        p.setup = () => {
            p.createCanvas(w, h);
        };
        // Instructions to draw orbitals
        p.draw = () => {
            let newSZLevel = new SZlevel();
            let unitL = 40;
            let centerP = [w / 2, h / 2];
            let eList = eConfig.split(" ");
            // Set text size
            p.textSize(unitL / 3);
            // Create y-axis
            newSZLevel.makeAxis(centerP, unitL);
            // Draw orbitals lowest to highest
            for (let i = 0; i < eList.length; i++) {
                newSZLevel.makeLevel(eList[i], centerP, unitL, calcEnergy[i]);
                centerP = [w / 2, centerP[1] - (unitL * 5) / 4];
            }
        };
    };
    // Display canvas
    document.getElementById("eLevelsID").replaceChildren();
    new p5(sketch, document.getElementById("eLevelsID"));
}
//# sourceMappingURL=energyDiagramsDisplay.js.map
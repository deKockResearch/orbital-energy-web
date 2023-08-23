import p5 from "p5";

export function drawDiagram(eConfig: string, calcEnergies: string[][], matrixNames: string[]): void {
  let sketch = (p: p5) => {
    class SZlevel {
      constructor() { }

      // Make a singular orbital
      makeOrbital(eCount: number, center: number[], unitL: number) {
        // main orbital line
        p.line(center[0] - unitL / 2, center[1], center[0] + unitL / 2, center[1]);
        const disp = unitL / 6;

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

      makeLevel(orbName: string, center: number[], unitL: number) {
        if (orbName.charAt(1) === "s") {
          // 1s2
          this.makeOrbital(Number(orbName.slice(2)), [center[0] + (unitL * 5) / 4, center[1]], unitL);
        } else if (orbName.charAt(1) === "p") {
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
        } else {
          console.log("Unsupported orbital type: ", orbName.charAt(1));
        }
      }

      makeAxis(center: number[], unitL: number) {
        const lineStart = [100, center[1]];
        p.line(lineStart[0], lineStart[1], lineStart[0], lineStart[1] - unitL * 6);
        p.line(lineStart[0] - unitL / 6, lineStart[1] - unitL / 4 - (unitL * 11) / 2, lineStart[0], lineStart[1] - unitL / 2 - (unitL * 11) / 2);
        p.line(lineStart[0] + unitL / 6, lineStart[1] - unitL / 4 - (unitL * 11) / 2, lineStart[0], lineStart[1] - unitL / 2 - (unitL * 11) / 2);
        p.text("Energy", lineStart[0] - unitL * 2, lineStart[1] - unitL * 3);
      }
    }

    // Temporary canvas size
    const CANV_H = 375;
    const CANV_W = 1200;

    // Basic p5 canvas setup
    p.setup = () => {
      p.createCanvas(CANV_W, CANV_H);
      // TODO: remove next line to get interactivity
      p.noLoop();
    };

    // Instructions to draw orbitals
    p.draw = () => {
      let newSZLevel = new SZlevel();
      let unitL = 40;
      let eList = eConfig.split(" ");

      // Set text size
      p.textSize(unitL / 3);

      // Create y-axis
      let centerP = [200, CANV_H - 20];
      newSZLevel.makeAxis(centerP, unitL);

      // for each set of computed energies:
      let horizOffset = 0;
      for (let calcEnIdx = 0; calcEnIdx < calcEnergies.length; calcEnIdx++) {
        const calcEnergy = calcEnergies[calcEnIdx];
        let centerP = [200, CANV_H - 20];

        // Draw orbitals lowest to highest
        for (let i = 0; i < eList.length; i++) {
          newSZLevel.makeLevel(eList[i], centerP, unitL);
          p.text(`${eList[i].slice(0, 2)} Energy: ${calcEnergy[i]}`, horizOffset + centerP[0] + unitL * 5, centerP[1] + unitL / 8);
          centerP = [200, centerP[1] - (unitL * 5) / 4];   // subtracting from last position each time.
        }
        // Draw label on top
        p.text(matrixNames[calcEnIdx], horizOffset + centerP[0] + unitL * 5, centerP[1] - (unitL * 5) / 4);
        horizOffset += 200;
      }
    };
  };

  // Display canvas
  const elevelsIdElem = document.getElementById("eLevelsID")!;
  elevelsIdElem.replaceChildren();
  new p5(sketch, elevelsIdElem);
}

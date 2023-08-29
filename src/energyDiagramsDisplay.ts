import p5 from "p5";

export function drawDiagram(eConfig: string, calcEnergies: string[][], matrixNames: string[]): void {
  let sketch = (p: p5) => {
    const UNIT_L = 40;

    // max # of electrons in each orbital.
    const FULL_ORBITAL_CTS = [2, 2, 6, 2, 6];

    class SZlevel {

      constructor() { }

      // Make a singular orbital
      makeOrbital(isFullOrbital: boolean, centerX: number, centerY: number) {

        // main orbital line
        p.drawingContext.setLineDash([]);  // solid line
        p.line(centerX - UNIT_L / 2, centerY, centerX + UNIT_L / 2, centerY);
        const DISP = UNIT_L / 6;

        // make dashed line if the orbital is not full.
        if (! isFullOrbital) {
          p.drawingContext.setLineDash([5, 5]);
        }

        // first electron arrow
        p.line(centerX - DISP, centerY - UNIT_L / 2, centerX - DISP, centerY + UNIT_L / 2);
        // Arrowhead
        p.line(centerX - DISP, centerY - UNIT_L / 2, centerX, centerY - (DISP * 3) / 2);
        p.line(centerX - DISP, centerY - UNIT_L / 2, centerX - 2 * DISP, centerY - (DISP * 3) / 2);

        // second electron arrow
        p.line(centerX + DISP, centerY - UNIT_L / 2, centerX + DISP, centerY + UNIT_L / 2);
        // Arrowhead
        p.line(centerX + DISP, centerY + UNIT_L / 2, centerX, centerY + (DISP * 3) / 2);
        p.line(centerX + DISP, centerY + UNIT_L / 2, centerX + 2 * DISP, centerY + (DISP * 3) / 2);

      }

      makeLevel(orbName: string, level: number, centerX: number, centerY: number) {
        p.text(`${orbName} Energy: `, centerX - 100, centerY + UNIT_L / 8);
        const eCount = Number(orbName.slice(2));
        if (FULL_ORBITAL_CTS[level] === 2) {
          // if only 1 pair, it goes in the middle horizontally.
          this.makeOrbital(eCount === FULL_ORBITAL_CTS[level], centerX + (UNIT_L / 4 * 5), centerY);
        } else {
          // there is an orbital for every pair of electrons, so divide by 2
          for (let i = 0; i < FULL_ORBITAL_CTS[level] / 2; i++) {
            this.makeOrbital(eCount === FULL_ORBITAL_CTS[level], centerX + (UNIT_L / 4 * (i * 5)), centerY);
          }
        }
        // If the level is not full, add a message above.
        if (eCount !== FULL_ORBITAL_CTS[level]) {
          p.text(`occupied by ${eCount}/${FULL_ORBITAL_CTS[level]} of an electron`, centerX - 30, centerY - 30);
        }
      }

      makeAxis(_centerX: number, centerY: number) {
        const lineStart = [90, centerY];
        p.line(lineStart[0], lineStart[1], lineStart[0], lineStart[1] - UNIT_L * 6);
        p.line(lineStart[0] - UNIT_L / 6, lineStart[1] - UNIT_L / 4 - (UNIT_L * 11) / 2, lineStart[0], lineStart[1] - UNIT_L / 2 - (UNIT_L * 11) / 2);
        p.line(lineStart[0] + UNIT_L / 6, lineStart[1] - UNIT_L / 4 - (UNIT_L * 11) / 2, lineStart[0], lineStart[1] - UNIT_L / 2 - (UNIT_L * 11) / 2);
        p.text("Energy", lineStart[0] - UNIT_L * 1.5, lineStart[1] - UNIT_L * 3);
        p.text("Not to scale", lineStart[0] - UNIT_L * 1.5, lineStart[1] - UNIT_L / 2 - (UNIT_L * 11.5) / 2);
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
      // const unitL = 40;
      let eList = eConfig.split(" ");

      // Set text size
      p.textSize(UNIT_L / 3);

      // Create y-axis
      let centerX = 200;
      let centerY = CANV_H - 20;
      newSZLevel.makeAxis(centerX, centerY);

      // Draw orbitals lowest to highest
      for (let i = 0; i < eList.length; i++) {
        newSZLevel.makeLevel(eList[i], i, centerX, centerY);
        centerY = centerY - (UNIT_L * 5) / 4;   // subtracting from last position each time.
      }

      // for each set of computed energies:
      let horizOffset = 0;
      for (let calcEnIdx = 0; calcEnIdx < calcEnergies.length; calcEnIdx++) {
        const calcEnergy = calcEnergies[calcEnIdx];
        centerX = 200;
        centerY = CANV_H - 20;

        // print energy values
        for (let i = 0; i < eList.length; i++) {
          p.text(`${calcEnergy[i]}`, horizOffset + centerX + UNIT_L * 5, centerY + UNIT_L / 8);
          centerY = centerY - (UNIT_L * 5) / 4;   // subtracting from last position each time.
        }
        // Draw label on top
        p.text(matrixNames[calcEnIdx], horizOffset + centerX + UNIT_L * 5, centerY - (UNIT_L * 5) / 4);
        horizOffset += 200;
      }
    };
  };

  // Display canvas
  const elevelsIdElem = document.getElementById("eLevelsID")!;
  elevelsIdElem.replaceChildren();
  new p5(sketch, elevelsIdElem);
}

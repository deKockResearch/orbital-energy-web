import { computeMaxAtomicSizes } from "../scripts/orbitalEnergies";
import { selectedElement$ } from "../scripts/stores";
import { Chart } from "chart.js/auto";
import annotationPlugin from 'chartjs-plugin-annotation';
import { eLevels, type Orbital } from "./types";


Chart.register(annotationPlugin);

// When selected element changes...
selectedElement$.listen((selElem) => {
  if (!selElem || !selElem.selectedElementInfo) {
    return;
  }

  drawAtomicSizes();
});

import p5 from "p5";

function ionSpeciesSuffixes(numSpecies: number): string[] {
  const result = [''];
  for (let i = 1; i < numSpecies; i++) {
    if (i === 1) {
      result.push(`+`);
    } else {
      result.push(`${i}+`);
    }
  }
  return result;
}

// str comes before supStr, and will be written to the canvas at strx, stry. Compute the location
// where the superscript should be written and return that location.
export function computeSuperscriptLocation(p: p5, str: string, strx: number, stry: number, supStr: string): [number, number] {
  const strWidth = p.textWidth(str);
  const rightOfStr = strx + strWidth;
  const strHt = p.textAscent();
  return [rightOfStr, stry - strHt * 0.75];
}

export function drawAtomicSizes(): void {
  let sketch = (p: p5) => {

    // Basic p5 canvas setup
    const CANV_W = 800;
    const CANV_H = 600;
    const COLUMN_W = CANV_W / 5;
    const ROW_H = 120;
    const BOTTOM_OFFSET = 10;
    const LEFT_OFFSET = 50;
    const TOP_OFFSET = 20;
    // const SCALE_Y = (CANV_H - BOTTOM_OFFSET - TOP_OFFSET) / 13;
    const SCALE_Y = ROW_H / 4.0;    // scaling in the rows.

    p.setup = () => {
      p.createCanvas(CANV_W, CANV_H);
      p.noLoop();  // remove interactivity
    };

    const flipYAxis = (y: number) => {
      return CANV_H - y;
    }

    p.draw = () => {
      // draw for reference only.
      // draw axes: horizontal first, then vertical.
      // p.line(0, flipYAxis(0), CANV_W, flipYAxis(0));
      // p.line(0, flipYAxis(0), 0, flipYAxis(CANV_H));

      // draw a line just under the top labels.
      p.line(0, flipYAxis(CANV_H - TOP_OFFSET - 3), CANV_W, flipYAxis(CANV_H - TOP_OFFSET - 3));
      // draw a line just to the right of the left labels.
      p.line(30, flipYAxis(0), 30, flipYAxis(CANV_H));

      p.textStyle(p.BOLD);
      p.textSize(16);
      // draw 1s, 2s, 2p, etc. vertically along the y-axis.
      eLevels.forEach((e, index) => {
        p.text(e, 10, flipYAxis(BOTTOM_OFFSET + index * ROW_H));
      });

      // draw element species along the top.
      const elemSymbol = selectedElement$.get().selectedElementInfo?.symbol!;
      // only showing 5 ion species at most.
      const numSpecies = Math.min(5, selectedElement$.get().selectedElementInfo?.number!);

      // build list of species labels: you take away an eletron each time, so we
      // have B, B+, B2+, B3+, B4+ for Boron.
      const speciesSuffixes = ionSpeciesSuffixes(numSpecies);

      for (let i = 0; i < numSpecies; i++) {
        p.text(elemSymbol, LEFT_OFFSET + COLUMN_W * i, flipYAxis(CANV_H - TOP_OFFSET));
        const supLoc = computeSuperscriptLocation(p, elemSymbol, LEFT_OFFSET + COLUMN_W * i, flipYAxis(CANV_H - TOP_OFFSET), speciesSuffixes[i]);
        p.textSize(12);  // 75% of 16 pt font.
        p.text(speciesSuffixes[i], supLoc[0], supLoc[1]);
        p.textSize(16);
      }

      p.textStyle(p.NORMAL);

      // draw a line for each size, with the size value just above it.
      // the vertical location of the line must be to scale.
      // the vertical scale is 0 to 10. The CANV_H is 600.

      /* loop over the species, and for each species, loop over the orbitals. */
      const orbs: Orbital[] = selectedElement$.get().selectedElemOrbitals!;
      const newOrbitals = orbs.map(a => ({ ...a }));

      // 5 because there are most 5 orbitals: we store the values to
      // draw the dashed lines between the species, and the value to put
      // above the dashed line.
      let lastxs = [0, 0, 0, 0, 0];
      let lastys = [0, 0, 0, 0, 0];
      let lastVals = [0, 0, 0, 0, 0];

      // iterate over speciesSuffixes just because it indicates how many there are.
      speciesSuffixes.forEach((_, speciesIndex) => {

        // repeatedly subtract "speciesIndex" electrons from the atom, and then
        // compute the atomic sizes for that species
        if (speciesIndex > 0) {
          // find the last orbital with a non-zero number of electrons.
          let lastOrb = newOrbitals.length - 1;
          while (lastOrb >= 0 && newOrbitals[lastOrb].numElectrons === 0) {
            lastOrb--;
          }
          newOrbitals[lastOrb].numElectrons--;
          if (newOrbitals[lastOrb].numElectrons === 0) {
            newOrbitals.pop();
          }
        }
        // console.log('newOrbits: ', JSON.stringify(newOrbitals, null, 2));
        const res = computeMaxAtomicSizes(selectedElement$.get().selectedElementInfo?.number!, newOrbitals);

        newOrbitals.forEach((orb, index) => {
          // for drawing dashed lines between the species.

          const value = res[index];
          const valueAsString = value.toFixed(3);
          const xloc = LEFT_OFFSET + COLUMN_W * speciesIndex;
          const yloc = (ROW_H * index) + (value * SCALE_Y) + BOTTOM_OFFSET;
          const text_width = p.textWidth(`${valueAsString}`);
          p.text(`${valueAsString}`, xloc, flipYAxis(yloc));
          // draw line under the text with a little space between the text and the line.
          p.line(xloc, flipYAxis(yloc - 4), xloc + text_width, flipYAxis(yloc - 4));

          if (speciesIndex !== 0) {
            // set dashed lines
            p.drawingContext.setLineDash([5, 5]);
            p.line(lastxs[index], lastys[index], xloc, flipYAxis(yloc - 4));
            // no dashed lines anymore
            p.drawingContext.setLineDash([]);
            // write the difference in values.
            const diffText = (lastVals[index] - value).toFixed(3);
            const diffTextWidth = p.textWidth(diffText);
            p.text(diffText, ((lastxs[index] + xloc) / 2) - diffTextWidth / 2, (lastys[index] + flipYAxis(yloc)) / 2 - 4);
          }
          // store ending of the line for the next iteration.
          lastxs[index] = xloc + text_width;
          lastys[index] = flipYAxis(yloc - 4);
          lastVals[index] = value;
        });
      });
    };
  }

  // Display canvas
  const atomicSizeCanvas = document.getElementById("atomicSizeCanvasAttachPoint")!;
  atomicSizeCanvas.replaceChildren();
  new p5(sketch, atomicSizeCanvas);

}

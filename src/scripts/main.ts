import { elements } from './elements';
import { selectedElement$, matrixSelection$ } from './stores';
import { updateSelectableMatrixContents, watchCustomMatrixForChanges } from './selectableMatrix';
import { handleTabSwitching } from './tabHandling';
import { drawCharts } from './graphData';
import type { ElementType, Orbital } from './types';



/*
 * MAIN
 */
window.addEventListener("load", () => {

  // TODO: move the following to a script topTable.ts ?
  // periodic table interactions
  const pTableElements = document.querySelectorAll(".clickable > .element.ptable");
  for (let i = 0; i < pTableElements.length; i++) {
    pTableElements[i].addEventListener("click", toggleElement);
  }

  const matrixSelect = (document.getElementById("matrixSelector") as HTMLSelectElement);
  matrixSelect.addEventListener("change", () => {
    matrixSelection$.set(matrixSelect.value);
  });

  matrixSelection$.subscribe((sel: string) => {
    updateSelectableMatrixContents(sel);
    if (sel === 'custom') {
      watchCustomMatrixForChanges();
    }
  });

  handleTabSwitching();

  drawCharts();


});

function getElementByAtomicNumber(atomicNumber: number): ElementType {
  return elements.find((element) => element.number === atomicNumber)!;
}

function computeOrbitals(eConfigStr: string): Orbital[] {
  const res: Orbital[] = [];
  const groups = eConfigStr.split(" ");
  for (const group of groups) {
    const re = /(\d+)([sp])(\d+)/;
    const matches = group.match(re)!;
    res.push({
      level: Number(matches[1]),
      sOrP: matches[2],
      numElectrons: Number(matches[3]),
    });
  }
  return res;
}

function toggleElement(e: Event): void {
  const detailsTempText = document.getElementById("detailsTempText")!;
  const detailsElemBox = document.getElementById("detailsElemBox")!;

  const target =
    (e.target as HTMLElement).nodeName === "A"
      ? (e.target as HTMLElement)!
      : (e.target as HTMLElement).parentElement!;

  if (target.classList.contains("clicked")) {
    // remove selected element if already displayed
    target.classList.remove("clicked");

    // detailsElem.replaceChildren();
    detailsTempText.style.display = "block";
    detailsElemBox.style.display = "none";

    // clear the values changed when changing elements.
    selectedElement$.set({
      selectedHTMLElement: null,
      selectedElementInfo: null,
      selectedElemOrbitals: null,
    });

  } else {

    // TODO: can we improve this? Do we have the old "target"?
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let i = 0; i < pTableElements.length; i++) {
      pTableElements[i].classList.remove("clicked");
    }

    // add clicked class to element
    target.classList.add("clicked");

    // detailsElem.replaceChildren();
    // document.getElementById("energyLevels")?.replaceChildren();

    // retrieve element information
    const elementID = target.textContent!.replace(/\D/g, "");
    const selectedElementInfo = getElementByAtomicNumber(parseInt(elementID));

    // const eConfigInput = <HTMLInputElement>document.getElementById("eConfigInput");
    // eConfigInput.value = selectedElement!.eConfig;

    const selectedElemOrbitals = computeOrbitals(selectedElementInfo!.eConfig);

    // hide information and show element details.
    detailsTempText.style.display = "none";
    detailsElemBox.style.display = "block";

    // Set the state, which will trigger dependent components to update.
    selectedElement$.set({
      selectedHTMLElement: target,
      selectedElementInfo,
      selectedElemOrbitals,
    });
  }
}

import { elements } from './elements';
import { selectedElement$, matrixSelection$, unitsSelection$ } from './stores';
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

  // We have the unitSelector drop down in multiple places. We'll register call listeners here.
  // A change to any changes the store.
  const unitSelectors = document.getElementsByClassName("unit-selector") as HTMLCollectionOf<HTMLSelectElement>;
  for (let unitSelect of unitSelectors) {
    unitSelect.addEventListener("change", () => {
      unitsSelection$.set(unitSelect.value);
    });
  };
  // When the store changes, update all the selectors to show the new value.
  unitsSelection$.listen(us => {
    for (let unitSelect of unitSelectors) {
      unitSelect.value = us;
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
  const detailsTempTexts = document.getElementsByClassName("detailsTempText")!;
  const detailsElemBoxes = document.getElementsByClassName("detailsElemBox")!;

  const target =
    (e.target as HTMLElement).nodeName === "A"
      ? (e.target as HTMLElement)!
      : (e.target as HTMLElement).parentElement!;

  // User clicked on the already-selected element...
  if (target.classList.contains("clicked")) {

    // Remove 'clicked' to all the elements with the same innerHTML as the actual
    // clicked element. (Necessary because we have the ElementTable in multiple
    // tabs).
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let pTableElem of pTableElements) {
      if (pTableElem.classList.contains("clicked")) {
        pTableElem.classList.remove("clicked");
      }
    }

    for (let detailsTempText of detailsTempTexts) {
      (<HTMLElement>detailsTempText).style.display = "block";
      for (let detailsElemBox of detailsElemBoxes) {
        (<HTMLElement>detailsElemBox).style.display = "none";
      }
    }

    // clear the values changed when changing elements.
    selectedElement$.set({
      selectedHTMLElement: null,
      selectedElementInfo: null,
      selectedElemOrbitals: null,
    });

  } else {
    // User clicked on an element (and perhaps another element was already clicked).
    // So, they are switching target elements.
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let pTableElem of pTableElements) {
      if (pTableElem.classList.contains("clicked")) {
        pTableElem.classList.remove("clicked");
      }
      // Add clicked to all the elements with the same innerHTML as the actual
      // clicked element. (Necessary because we have the ElementTable in multiple
      // tabs).
      if (pTableElem.innerHTML === target.innerHTML) {
        pTableElem.classList.add("clicked");
      }
    }

    // retrieve element information
    const elementID = target.textContent!.replace(/\D/g, "");
    const selectedElementInfo = getElementByAtomicNumber(parseInt(elementID));

    // const eConfigInput = <HTMLInputElement>document.getElementById("eConfigInput");
    // eConfigInput.value = selectedElement!.eConfig;

    const selectedElemOrbitals = computeOrbitals(selectedElementInfo!.eConfig);

    // hide information and show element details.
    for (let detailsTempText of detailsTempTexts) {
      (<HTMLElement>detailsTempText).style.display = "none";
    }
    for (let detailsElemBox of detailsElemBoxes) {
      (<HTMLElement>detailsElemBox).style.display = "block";
    }

    // Set the state, which will trigger dependent components to update.
    selectedElement$.set({
      selectedHTMLElement: target,
      selectedElementInfo,
      selectedElemOrbitals,
    });
  }
}

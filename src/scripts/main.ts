import { elements } from './elements';
import { selectedElement$, matrixSelection$, unitsSelection$ } from './stores';
import { updateSelectableMatrixContents, watchCustomMatrixForChanges } from './selectableMatrix';
import { handleTabSwitching } from './tabHandling';
import { drawCharts } from './graphData';
import type { ElementType, Orbital } from './types';
import { computeOrbitals } from './orbitalEnergies';
// import { drawAtomicSizesCharts } from './atomicSize';



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

  const pTableRowElements = document.querySelectorAll(".clickable > .element.row-selector");
  for (let i = 0; i < pTableRowElements.length; i++) {
    pTableRowElements[i].addEventListener("click", toggleElemRow);
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
  // drawAtomicSizesCharts();
});

function getElementByAtomicNumber(atomicNumber: number): ElementType {
  return elements.find((element) => element.number === atomicNumber)!;
}

function unSelectAllElements(): void {
  const pTableElements = document.getElementsByClassName("element ptable");
  for (let pTableElem of pTableElements) {
    if (pTableElem.classList.contains("clicked")) {
      pTableElem.classList.remove("clicked");
    }
  }
}

function toggleElement(e: Event): void {

  // console.log("toggleElement called!");

  const target =
    (e.target as HTMLElement).nodeName === "A"
      ? (e.target as HTMLElement)!
      : (e.target as HTMLElement).parentElement!;

  // User clicked on the already-selected element
  if (target.classList.contains("clicked")) {

    unSelectAllElements();

    // clear the values changed when changing elements.
    selectedElement$.set({
      selectedHTMLElement: null,
      selectedElementInfo: null,
      selectedElemOrbitals: null,
      rowSelected: null,
    });

  } else {

    unSelectAllElements();

    // User clicked on an element (and perhaps another element was already clicked).
    // So, they are switching target elements.
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let pTableElem of pTableElements) {
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
    const selectedElemOrbitals = computeOrbitals(selectedElementInfo!.eConfig);

    // Set the state, which will trigger dependent components to update.
    selectedElement$.set({
      selectedHTMLElement: target,
      selectedElementInfo,
      selectedElemOrbitals,
      rowSelected: null,
    });
  }
}

function toggleElemRow(e: Event): void {

  // console.log("toggleElemRow called!");

  let rowNum: number | null = parseInt((e.target as HTMLElement).innerText);

  unSelectAllElements();

  // row was already selected, so toggle off.
  if (selectedElement$.get().rowSelected === rowNum) {
    rowNum = null;
  }

  selectedElement$.set({
    selectedHTMLElement: null,
    selectedElementInfo: null,
    selectedElemOrbitals: null,
    rowSelected: rowNum,
  });

  if (rowNum === null) {
    return;
  }

  const className = "row" + rowNum;
  const rowElements = document.getElementsByClassName(className);
  for (let i = 0; i < rowElements.length; i++) {
    const element = rowElements[i];
    element.classList.toggle("clicked");
  }

  const selElem = selectedElement$.get();

  selectedElement$.set({
    ...selElem,
    rowSelected: rowNum,
  });

}


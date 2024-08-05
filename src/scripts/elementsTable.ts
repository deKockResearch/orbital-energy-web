import { selectedElement$ } from "./stores";
import type { ElementType } from "./types";
import { elements } from './elements';
import { computeOrbitals } from "./orbitalEnergies";

// periodic table interactions
console.log('elementsTable.ts: adding click listeners to elements');
const pTableElements = document.querySelectorAll(".clickable > .element.ptable");
for (let i = 0; i < pTableElements.length; i++) {
  pTableElements[i].addEventListener("click", toggleElement);
}

console.log('elementsTable.ts: adding click listeners to row elements');
const pTableRowElements = document.querySelectorAll(".clickable > .element.row-selector");
console.log('pTableRowElements: ', pTableRowElements);
for (let i = 0; i < pTableRowElements.length; i++) {
  pTableRowElements[i].addEventListener("click", toggleElemRow);
}


export function unSelectAllElements(): void {
  const pTableElements = document.getElementsByClassName("element ptable");
  for (let pTableElem of pTableElements) {
    if (pTableElem.classList.contains("clicked")) {
      pTableElem.classList.remove("clicked");
    }
  }
}

function getElementByAtomicNumber(atomicNumber: number): ElementType {
  return elements.find((element) => element.number === atomicNumber)!;
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
    selectedElement$.set({
      selectedHTMLElement: null,
      selectedElementInfo: null,
      selectedElemOrbitals: null,
      rowSelected: null,
    });
    return;
  }

  // new row selected.
  const className = "row" + rowNum;
  const rowElements = document.getElementsByClassName(className);
  for (let i = 0; i < rowElements.length; i++) {
    const element = rowElements[i];
    element.classList.toggle("clicked");
  }

  selectedElement$.set({
    selectedHTMLElement: null,
    selectedElementInfo: null,
    selectedElemOrbitals: null,
    rowSelected: rowNum,
  });

}


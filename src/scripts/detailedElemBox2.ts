import { elements, startElemInPeriodicTableRows } from "./elements";
import { selectedElement2$ } from "./stores";


selectedElement2$.listen(() => displayDetailedElementBox());

// Take the electron configuration, e.g., '1s2, 2s2 2p6', and convert to
// HTML with the number after the s or p a superscript.
// We also elide the beginning of the string to use the notation [El]
// to represent the eConfig string of the last element in the row above.
// E.g., instead of Bismuth's "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d6 6s2 6p3"
// we replace the beginning with [Xe] since Xe's string is
// "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6" and Xe is the last element of the previous row.
//
function convertElectronConfigToHTML(): string {
  const aNumber = selectedElement2$.get().selectedElementInfo?.number!;
  let i = 0;
  for (; i < startElemInPeriodicTableRows.length; i++) {
    if (startElemInPeriodicTableRows[i] >= aNumber) {
      break;
    }
  }
  i--;   // We want the index of the elem that is last in the previous row.
  let numOrbitalsInLastElem = 0;
  let htmlRes = "";
  if (i > 0) {
    const lastElemInPreviousRow = elements[startElemInPeriodicTableRows[i] - 1];
    numOrbitalsInLastElem = lastElemInPreviousRow.eConfig.split(' ').length;
    htmlRes = `[${lastElemInPreviousRow.symbol}] `;
  }

  for (const orb of selectedElement2$.get().selectedElemOrbitals!.slice(numOrbitalsInLastElem)) {
    htmlRes += `${orb.level}${orb.sOrP}<sup>${orb.numElectrons}</sup> `;
  }
  return htmlRes;
}

/*
 * Displays a box with the element's data
 */
function displayDetailedElementBox(): void {

  // console.log("displayDetailedElementBox called!");

  const detailsTempTexts = document.getElementsByClassName("detailsTempText")!;
  const detailsElemBoxes = document.getElementsByClassName("detailsElemBox")!;

  const selectedElement = selectedElement2$.get().selectedElementInfo;
  const row = selectedElement2$.get().rowSelected;
  if (!selectedElement && !row) {   // nothing selected

    // show the instructions and hide the details box(es).
    for (let detailsTempText of detailsTempTexts) {
      (<HTMLElement>detailsTempText).style.display = "block";
    }
    for (let detailsElemBox of detailsElemBoxes) {
      (<HTMLElement>detailsElemBox).style.display = "none";
    }
  } else {
    // hide information and show element details.
    for (let detailsTempText of detailsTempTexts) {
      (<HTMLElement>detailsTempText).style.display = "none";
    }
    for (let detailsElemBox of detailsElemBoxes) {
      (<HTMLElement>detailsElemBox).style.display = "block";
    }
  }

  if (row) {
    for (let detailsElemBox of detailsElemBoxes) {
      const rowSelElem = detailsElemBox.querySelector(".rowSelectedInfo")!;
      rowSelElem.textContent = `Row ${row} selected.`;
      detailsElemBox.querySelector("#aNumber")!.textContent = "";
      detailsElemBox.querySelector(".aSymbol")!.textContent = "";
      detailsElemBox.querySelector("#aMass")!.textContent = "";
      detailsElemBox.querySelector(".aEconfig")!.textContent = "";
      detailsElemBox.querySelector("#density")!.textContent = "";
      detailsElemBox.querySelector("#meltingPoint")!.textContent = "";
      detailsElemBox.querySelector("#boilingPoint")!.textContent = "";
      detailsElemBox.querySelector("#oxidationStates")!.textContent = "";
      detailsElemBox.querySelector("#electronegativityPauling")!.textContent = "";
      detailsElemBox.querySelector("#electronegativityTandO")!.textContent = "";
      detailsElemBox.querySelector("#firstIonizationEnergy")!.textContent = "";
      detailsElemBox.querySelector("#valenceAtomicRadiusRDK")!.textContent = "";
      detailsElemBox.querySelector("#valenceAtomicRadiusClement")!.textContent = "";
      detailsElemBox.querySelector("#R001AtomicRadius")!.textContent = "";
      detailsElemBox.querySelector("#vanderWallRadius")!.textContent = "";
      detailsElemBox.querySelector("#metallicRadius")!.textContent = "";
      detailsElemBox.querySelector("#covalentRadius")!.textContent = "";
      detailsElemBox.querySelector("#valenceEffectiveNuclearChargeRDK")!.textContent = "";
      detailsElemBox.querySelector("#valenceEffectiveNuclearChargeGuerra")!.textContent = "";
      detailsElemBox.querySelector("#electricalConductivity")!.textContent = "";
      detailsElemBox.querySelector("#thermalConductivity")!.textContent = "";
      detailsElemBox.classList.add("detailedViewRowSelected");
    }
    return;
  }

  if (!selectedElement) {
    return;
  }

  const selectedHTMLElem = selectedElement2$.get().selectedHTMLElement!;

  for (let detailsElemBox of detailsElemBoxes) {

    detailsElemBox.className = ""; // remove all classes.
    // add "detailsElemBox", "showcase", and copy the color styling (e.g., group-nm) to the details box.
    detailsElemBox.classList.add("detailsElemBox", "showcase", selectedHTMLElem.classList[2]);

    detailsElemBox.querySelector(".rowSelectedInfo")!.textContent = "";

    detailsElemBox.querySelector("#aNumber")!.textContent = String(selectedElement.number);
    detailsElemBox.querySelector(".aSymbol")!.textContent = selectedElement.symbol;
    detailsElemBox.querySelector("#aMass")!.textContent = String(selectedElement.aMass) + selectedElement.amassunc;
    detailsElemBox.querySelector(".aEconfig")!.innerHTML = convertElectronConfigToHTML();
    detailsElemBox.querySelector("#density")!.innerHTML = selectedElement.density;
    detailsElemBox.querySelector("#meltingPoint")!.innerHTML = selectedElement.meltingPoint;
    detailsElemBox.querySelector("#boilingPoint")!.innerHTML = selectedElement.boilingPoint;
    detailsElemBox.querySelector("#oxidationStates")!.innerHTML = selectedElement.oxidationStates;
    detailsElemBox.querySelector("#electronegativityPauling")!.innerHTML = selectedElement.electronegativityPauling;
    detailsElemBox.querySelector("#electronegativityTandO")!.innerHTML = selectedElement.electronegativityTandO;
    detailsElemBox.querySelector("#firstIonizationEnergy")!.innerHTML = selectedElement.firstIonizationEnergy;
    detailsElemBox.querySelector("#valenceAtomicRadiusRDK")!.innerHTML = selectedElement.valenceAtomicRadiusRDK;
    detailsElemBox.querySelector("#valenceAtomicRadiusClement")!.innerHTML = selectedElement.valenceAtomicRadiusClement;
    detailsElemBox.querySelector("#R001AtomicRadius")!.innerHTML = selectedElement.R001AtomicRadius;
    detailsElemBox.querySelector("#vanderWallRadius")!.innerHTML = selectedElement.vanderWallRadius;
    detailsElemBox.querySelector("#metallicRadius")!.innerHTML = selectedElement.metallicRadius;
    detailsElemBox.querySelector("#covalentRadius")!.innerHTML = selectedElement.covalentRadius;
    detailsElemBox.querySelector("#valenceEffectiveNuclearChargeRDK")!.innerHTML = selectedElement.valenceEffectiveNuclearChargeRDK;
    detailsElemBox.querySelector("#valenceEffectiveNuclearChargeGuerra")!.innerHTML = selectedElement.valenceEffectiveNuclearChargeGuerra;
    detailsElemBox.querySelector("#electricalConductivity")!.innerHTML = selectedElement.electricalConductivity;
    detailsElemBox.querySelector("#thermalConductivity")!.innerHTML = selectedElement.thermalConductivity;
  }
}
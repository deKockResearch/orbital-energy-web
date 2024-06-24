import { selectedElement$ } from "./stores";


selectedElement$.listen(() => displayDetailedElementBox());

// Take the electron configuration, e.g., '1s2, 2s2 2p6', and convert to
// HTML with the number after the s or p a superscript.
function convertElectronConfigToHTML(): string {
  let htmlRes = "";
  for (const orb of selectedElement$.get().selectedElemOrbitals!) {
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

  const selectedElement = selectedElement$.get().selectedElementInfo;
  const row = selectedElement$.get().rowSelected;
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
      detailsElemBox.querySelector(".aNumber")!.textContent = "";
      detailsElemBox.querySelector(".aSymbol")!.textContent = "";
      detailsElemBox.querySelector(".aName")!.textContent = "";
      detailsElemBox.querySelector(".aMass")!.textContent = "";
      detailsElemBox.querySelector(".aEconfig")!.textContent = "";
      detailsElemBox.classList.add("detailedViewRowSelected");
    }
    return;
  }

  if (!selectedElement) {
    return;
  }

  const selectedHTMLElem = selectedElement$.get().selectedHTMLElement!;

  for (let detailsElemBox of detailsElemBoxes) {

    detailsElemBox.className = ""; // remove all classes.
    // add "detailsElemBox", "showcase", and copy the color styling (e.g., group-nm) to the details box.
    detailsElemBox.classList.add("detailsElemBox", "showcase", selectedHTMLElem.classList[2]);

    const aNumber = detailsElemBox.querySelector(".aNumber")!;
    const aSymbol = detailsElemBox.querySelector(".aSymbol")!;
    const aName = detailsElemBox.querySelector(".aName")!;
    const aMass = detailsElemBox.querySelector(".aMass")!;
    const aEconfig = detailsElemBox.querySelector(".aEconfig")!;
    detailsElemBox.querySelector(".rowSelectedInfo")!.textContent = "";

    aNumber.textContent = String(selectedElement.number);
    aSymbol.textContent = selectedElement.symbol;
    aName.textContent = selectedElement.name;
    aMass.textContent = String(selectedElement.aMass);
    aEconfig.innerHTML = convertElectronConfigToHTML();
  }
}
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
  const detailsElemBox = document.getElementById("detailsElemBox")!;

  const selectedElement = selectedElement$.get().selectedElementInfo;
  if (!selectedElement) {
    return;
  }
  const selectedHTMLElem = selectedElement$.get().selectedHTMLElement!;

  detailsElemBox.className = ""; // remove all classes.
  // add "showcase" and copy the color styling (e.g., group-nm) to the details box.
  detailsElemBox.classList.add("showcase", selectedHTMLElem.classList[2]);

  const aNumber = detailsElemBox.querySelector(".aNumber")!;
  const aSymbol = detailsElemBox.querySelector(".aSymbol")!;
  const aName = detailsElemBox.querySelector(".aName")!;
  const aMass = detailsElemBox.querySelector(".aMass")!;
  const aEconfig = detailsElemBox.querySelector(".aEconfig")!;

  aNumber.textContent = String(selectedElement.number);
  aSymbol.textContent = selectedElement.symbol;
  aName.textContent = selectedElement.name;
  aMass.textContent = String(selectedElement.aMass);
  aEconfig.innerHTML = convertElectronConfigToHTML();
}
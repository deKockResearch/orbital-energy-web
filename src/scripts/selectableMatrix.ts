import { customMatrix, name2Matrix } from "../scripts/matrices";
import { customMatrixVers$, matrixSelection$, selectedElement$ } from "../scripts/stores";

let prevCustomMatrixVers = -1;
let currCustomMatrixVers = 0;

let intervalHandle: any; // NodeJS.Timeout;

// Every 1 second, check if the user is still changing the matrix contents.
// When the user stops changing it, then recompute energies, etc.
function checkIfChangesHaveStopped() {
  // user switched away from showing the custom matrix, so stop watching it.
  if (matrixSelection$.get() !== "custom") {
    clearInterval(intervalHandle);
    return;
  }
  // User was changing value but didn't in the last 1 second...
  // console.log(`line 18: ${prevCustomMatrixVers} ${!customMatrixVers$.get()} ${selectedElement$.get() !== null}`);
  if (prevCustomMatrixVers < currCustomMatrixVers && selectedElement$.get() !== null) {
    getCustomMatrixValuesFromDOM();
    // tell the world we changed the custom matrix.
    customMatrixVers$.set(currCustomMatrixVers);
  }
  prevCustomMatrixVers = customMatrixVers$.get();
}

export function watchCustomMatrixForChanges() {
  intervalHandle = setInterval(checkIfChangesHaveStopped, 1000);

  let custMatTableElem = document.getElementById("selectableMatrix")!;

  const mutationOptions: MutationObserverInit = {
    childList: true,
    subtree: true,
    characterData: true,
  };

  function callback(_mutations: MutationRecord[]) {
    currCustomMatrixVers++;
  }

  const observer = new MutationObserver(callback);
  observer.observe(custMatTableElem, mutationOptions);
}

function getCustomMatrixValuesFromDOM() {
  // console.log("getCustomMatrixValuesFromDOM");
  const dataRowElems = document.getElementsByClassName("selectableMatrixRow");
  let row = 0;
  for (const rowElem of dataRowElems) {
    let col = 0;
    for (const child of rowElem.children) {
      if (child.tagName === "TD") {
        // skip th elements
        customMatrix[row][col] = Number(child.textContent);
        col++;
      }
    }
    row++;
  }
  // console.table(customMatrix);
}


export function updateSelectableMatrixContents(matrixName: string) {
  let matrix = name2Matrix[matrixName];

  const matrixElem = document.getElementsByClassName('selectableMatrixRow');
  for (let i = 0; i < matrixElem.length; i++) {
    const row = matrixElem[i].getElementsByClassName('selectableMatrixCell');
    for (let j = 0; j < row.length; j++) {
      row[j].textContent = matrix[i][j].toString();
      row[j].setAttribute('contenteditable', String(matrixName === 'custom'));
    }
  }
}
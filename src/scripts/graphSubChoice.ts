const elems = {
  x: {
    subChoice: document.getElementById('x-method-and-orbital-subchoice')!,
    ionizationChoice: document.getElementById('x-ionization-choice')!,
    electroNegChoice: document.getElementById('x-electronegativity-choice')!,
    slaterColumns: Array.from(document.getElementsByClassName('x-slater')!),
  },
  y: {
    subChoice: document.getElementById('y-method-and-orbital-subchoice')!,
    ionizationChoice: document.getElementById('y-ionization-choice')!,
    electroNegChoice: document.getElementById('y-electronegativity-choice')!,
    slaterColumns: Array.from(document.getElementsByClassName('y-slater')!),
  }
}


export function displaySubChoice(xOrY: 'x' | 'y', subChoice: string) {
  // hide all subchoice blocks.
  elems[xOrY].ionizationChoice.style.display = 'none';
  elems[xOrY].subChoice.style.display = 'none';
  elems[xOrY].electroNegChoice.style.display = 'none';

  if (subChoice === 'effnuccharge') {
    // display zeff choices
    elems[xOrY].subChoice.style.display = 'block';
    (elems[xOrY].slaterColumns as HTMLElement[]).forEach((slater: HTMLElement) => slater.style.display = 'block');
  }
  // For Atomic radius, kinetic energy, potential energy, and total energy, we have only Guerra and RDK, not Slater
  else if (subChoice === 'atomrad' || subChoice === 'ke' || subChoice === 'pe' || subChoice === 'te') {
    // enable / disable Rp choices.
    (elems[xOrY].slaterColumns as HTMLElement[]).forEach((slater: HTMLElement) => slater.style.display = 'none');
    elems[xOrY].subChoice.style.display = 'block';
  } else if (subChoice === 'ie') {    // ionization energy: there are 10 choices.
    elems[xOrY].ionizationChoice.style.display = 'block';
  } else if (subChoice === 'electroneg') {
    elems[xOrY].electroNegChoice.style.display = 'block';
  }
}


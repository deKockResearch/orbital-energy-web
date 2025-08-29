const elems = {
  x: {
    methodAndOrbChoice: document.getElementById('x-method-and-orbital-subchoice')!,
    ionizationChoice: document.getElementById('x-ionization-choice')!,
    electroNegChoice: document.getElementById('x-electronegativity-choice')!,
    slaterColumns: Array.from(document.getElementsByClassName('x-slater')!),
    atomicRadChoice: document.getElementById('x-atomicrad-choice')!,
  },
  y: {
    methodAndOrbChoice: document.getElementById('y-method-and-orbital-subchoice')!,
    ionizationChoice: document.getElementById('y-ionization-choice')!,
    electroNegChoice: document.getElementById('y-electronegativity-choice')!,
    slaterColumns: Array.from(document.getElementsByClassName('y-slater')!),
    atomicRadChoice: document.getElementById('y-atomicrad-choice')!,
  }
}


export function displaySubChoice(xOrY: 'x' | 'y', subChoice: string) {
  // hide all subchoice blocks.
  elems[xOrY].ionizationChoice.style.display = 'none';
  elems[xOrY].methodAndOrbChoice.style.display = 'none';
  elems[xOrY].electroNegChoice.style.display = 'none';
  elems[xOrY].atomicRadChoice.style.display = 'none';

  if (subChoice === 'effnuccharge') {
    // display zeff choices
    elems[xOrY].methodAndOrbChoice.style.display = 'block';
    (elems[xOrY].slaterColumns as HTMLElement[]).forEach((slater: HTMLElement) => slater.style.display = 'block');
  }
  // For Atomic radius, kinetic energy, potential energy, and total energy, we have only Guerra and RDK, not Slater
  else if (subChoice === 'orbrad' || subChoice === 'ke' || subChoice === 'pe' || subChoice === 'te') {
    (elems[xOrY].slaterColumns as HTMLElement[]).forEach((slater: HTMLElement) => slater.style.display = 'none');
    elems[xOrY].methodAndOrbChoice.style.display = 'block';
  } else if (subChoice === 'ie') {
    elems[xOrY].ionizationChoice.style.display = 'block';
  } else if (subChoice === 'electroneg') {
    elems[xOrY].electroNegChoice.style.display = 'block';
  } else if (subChoice === 'atomrad') {
    elems[xOrY].atomicRadChoice.style.display = 'block';
  }
}


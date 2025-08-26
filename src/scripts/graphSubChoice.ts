// import { xGraphChoice, yGraphChoice } from "./graphData2";


// This is for when the user has to pick Guerra or Slater or RDK sub-choices.
const ySubChoice = document.getElementById('y-method-and-orbital-subchoice')!;
const yIonizationChoice = document.getElementById('y-ionization-choice')!;
const yElectroNegChoice = document.getElementById('y-electronegativity-choice')!;
const ySlaterColumns = Array.from(document.getElementsByClassName('slater')!);

export function displaySubChoice(subChoice: string) {

  yIonizationChoice.style.display = 'none';
  ySubChoice.style.display = 'none';
  yElectroNegChoice.style.display = 'none';

  if (subChoice === 'effnuccharge') {
    // display zeff choices
    ySubChoice.style.display = 'block';
    (ySlaterColumns as HTMLElement[]).forEach((slater: HTMLElement) => slater.style.display = 'block');
  }
  // For Atomic radius, kinetic energy, potential energy, and total energy, we have only Guerra and RDK, not Slater
  else if (subChoice === 'atomrad' || subChoice === 'ke' || subChoice === 'pe' || subChoice === 'te') {
    // enable / disable Rp choices.
    (ySlaterColumns as HTMLElement[]).forEach((slater: HTMLElement) => slater.style.display = 'none');
    ySubChoice.style.display = 'block';
  } else if (subChoice === 'ie') {    // ionization energy: there are 10 choices.
    yIonizationChoice.style.display = 'block';
  } else if (subChoice === 'electroneg') {
    yElectroNegChoice.style.display = 'block';
  }
}



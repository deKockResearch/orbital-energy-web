/*
 *
 *
 */
import {} from "p5/global";
import * as p5 from "p5";

const elements = [
  {
    name: "Hydrogen",
    symbol: "H",
    number: 1,
    aMass: 1.008,
    eConfig: "1s1",
  },
  {
    name: "Helium",
    symbol: "He",
    aMass: 4.0026,
    number: 2,
    eConfig: "1s2",
  },
  {
    name: "Lithium",
    symbol: "Li",
    aMass: 6.94,
    number: 3,
    eConfig: "1s2 2s1",
  },
  {
    name: "Beryllium",
    symbol: "Be",
    aMass: 9.0122,
    number: 4,
    eConfig: "1s2 2s2",
  },
  {
    name: "Boron",
    symbol: "B",
    aMass: 10.81,
    number: 5,
    eConfig: "1s2 2s2 2p",
  },
  {
    name: "Carbon",
    symbol: "C",
    aMass: 12.011,
    number: 6,
    eConfig: "1s2 2s2 2p2",
  },
  {
    name: "Nitrogen",
    symbol: "N",
    aMass: 14.007,
    number: 7,
    eConfig: "1s2 2s2 2p3",
  },
  {
    name: "Oxygen",
    symbol: "O",
    aMass: 15.999,
    number: 8,
    eConfig: "1s2 2s2 2p4",
  },
  {
    name: "Fluorine",
    symbol: "F",
    aMass: 18.998,
    number: 9,
    eConfig: "1s2 2s2 2p5",
  },
  {
    name: "Neon",
    symbol: "Ne",
    aMass: 20.18,
    number: 10,
    eConfig: "1s2 2s2 2p6",
  },
  {
    name: "Sodium",
    symbol: "Na",
    aMass: 14.007,
    number: 11,
    eConfig: "1s2 2s2 2p6 3s",
  },
  {
    name: "Magnesium",
    symbol: "Mg",
    aMass: 24.305,
    number: 12,
    eConfig: "1s2 2s2 2p6 3s2",
  },
  {
    name: "Aluminum",
    symbol: "Al",
    aMass: 26.982,
    number: 13,
    eConfig: "1s2 2s2 2p6 3s 3p",
  },
  {
    name: "Silicon",
    symbol: "Si",
    aMass: 28.085,
    number: 14,
    eConfig: "1s2 2s2 2p6 3s 3p2",
  },
  {
    name: "Phosphorus",
    symbol: "P",
    aMass: 30.974,
    number: 15,
    eConfig: "1s2 2s2 2p6 3s2 3p3",
  },
  {
    name: "Sulfur",
    symbol: "S",
    aMass: 32.06,
    number: 16,
    eConfig: "1s2 2s2 2p6 3s2 3p4",
  },
  {
    name: "Chlorine",
    symbol: "Cl",
    aMass: 35.45,
    number: 17,
    eConfig: "1s2 2s2 2p6 3s2 3p5",
  },
  {
    name: "Argon",
    symbol: "Ar",
    aMass: 39.948,
    number: 18,
    eConfig: "1s2 2s2 2p6 3s2 3p6",
  },
  {
    name: "Potassium",
    symbol: "K",
    aMass: 39.098,
    number: 19,
    eConfig: "1s2 2s2 2p6 3s2 3p6 4s",
  },
  {
    name: "Calcium",
    symbol: "Ca",
    aMass: 40.078,
    number: 20,
    eConfig: "1s2 2s2 2p6 3s2 3p6 4s2",
  },
  {
    name: "Scandium",
    symbol: "Sc",
    aMass: 44.956,
    number: 21,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d 4s2",
  },
  {
    name: "Titanium",
    symbol: "Ti",
    aMass: 47.867,
    number: 22,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d2 4s2",
  },
  {
    name: "Vanadium",
    symbol: "V",
    aMass: 50.942,
    number: 23,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d3 4s2",
  },
  {
    name: "Chromium",
    symbol: "Cr",
    aMass: 51.996,
    number: 24,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d5 4s",
  },
  {
    name: "Manganese",
    symbol: "Mn",
    aMass: 54.938,
    number: 25,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d5 4s2",
  },
  {
    name: "Iron",
    symbol: "Fe",
    aMass: 55.845,
    number: 26,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d6 4s2",
  },
  {
    name: "Cobalt",
    symbol: "Co",
    aMass: 58.933,
    number: 27,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d7 4s2",
  },
  {
    name: "Nickel",
    symbol: "Ni",
    aMass: 58.693,
    number: 28,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d8 4s2",
  },
  {
    name: "Copper",
    symbol: "Cu",
    aMass: 63.546,
    number: 29,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s",
  },
  {
    name: "Zinc",
    symbol: "Zn",
    aMass: 65.38,
    number: 30,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s2",
  },
  {
    name: "Gallium",
    symbol: "Ga",
    aMass: 69.723,
    number: 31,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p",
  },
  {
    name: "Germanium",
    symbol: "Ge",
    aMass: 72.63,
    number: 32,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p2",
  },
  {
    name: "Arsenic",
    symbol: "As",
    aMass: 74.922,
    number: 33,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p3",
  },
  {
    name: "Selenium",
    symbol: "Se",
    aMass: 78.971,
    number: 34,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p4",
  },
  {
    name: "Bromine",
    symbol: "Br",
    aMass: 79.904,
    number: 35,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p5",
  },
  {
    name: "Krypton",
    symbol: "Kr",
    aMass: 83.798,
    number: 36,
    eConfig: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6",
  },
  {
    name: "Rubidium",
    symbol: "Rb",
    aMass: 85.468,
    number: 37,
    eConfig: "[Kr]5s",
  },
  {
    name: "Strontium",
    symbol: "Sr",
    aMass: 87.62,
    number: 38,
    eConfig: "[Kr]5s2",
  },
  {
    name: "Yttrium",
    symbol: "Y",
    aMass: 88.906,
    number: 39,
    eConfig: "[Kr]4d 5s2",
  },
  {
    name: "Zirconium",
    symbol: "Zr",
    aMass: 91.224,
    number: 40,
    eConfig: "[Kr]4d2 5s2",
  },
  {
    name: "Niobium",
    symbol: "Nb",
    aMass: 92.906,
    number: 41,
    eConfig: "[Kr]4d4 5s",
  },
  {
    name: "Molybdenum",
    symbol: "Mo",
    aMass: 95.95,
    number: 42,
    eConfig: "[Kr]4d5 5s",
  },
  {
    name: "Technetium",
    symbol: "Tc",
    aMass: "(97)",
    number: 43,
    eConfig: "[Kr]4d5 5s2",
  },
  {
    name: "Ruthenium",
    symbol: "Ru",
    aMass: 101.07,
    number: 44,
    eConfig: "[Kr]4d7 5s",
  },
  {
    name: "Rhodium",
    symbol: "Rh",
    aMass: 102.91,
    number: 45,
    eConfig: "[Kr]4d8 5s2",
  },
  {
    name: "Palladium",
    symbol: "Pd",
    aMass: 106.42,
    number: 46,
    eConfig: "[Kr]4d10",
  },
  {
    name: "Silver",
    symbol: "Ag",
    aMass: 107.87,
    number: 47,
    eConfig: "[Kr]4d10 5s",
  },
  {
    name: "Cadmium",
    symbol: "Cd",
    aMass: 112.41,
    number: 48,
    eConfig: "[Kr]4d10 5s2",
  },
  {
    name: "Indium",
    symbol: "In",
    aMass: 114.82,
    number: 49,
    eConfig: "[Kr]4d10 5s2 5p",
  },
  {
    name: "Tin",
    symbol: "Sn",
    aMass: 118.71,
    number: 50,
    eConfig: "[Kr]4d10 5s2 5p2",
  },
  {
    name: "Antimony",
    symbol: "Sb",
    aMass: 121.76,
    number: 51,
    eConfig: "[Kr]4d10 5s2 5p3",
  },
  {
    name: "Tellerium",
    symbol: "Te",
    aMass: 127.6,
    number: 52,
    eConfig: "[Kr]4d10 5s2 5p4",
  },
  {
    name: "Iodine",
    symbol: "I",
    aMass: 126.9,
    number: 53,
    eConfig: "[Kr]4d10 5s2 5p5",
  },
  {
    name: "Xenon",
    symbol: "Xe",
    aMass: 131.29,
    number: 54,
    eConfig: "[Kr]4d10 5s2 5p6",
  },
  {
    name: "Caesium",
    symbol: "Cs",
    aMass: 132.91,
    number: 55,
    eConfig: "[Xe]6s",
  },
  {
    name: "Barium",
    symbol: "Ba",
    aMass: 137.33,
    number: 56,
    eConfig: "[Xe]6s2",
  },
  {
    name: "Lanthanum",
    symbol: "La",
    aMass: 138.91,
    number: 57,
    eConfig: "[Xe]5d 6s2",
  },
  {
    name: "Cerium",
    symbol: "Ce",
    aMass: 140.12,
    number: 58,
    eConfig: "[Xe]4f 5d 6s2",
  },
  {
    name: "Preseodymium",
    symbol: "Pr",
    aMass: 140.91,
    number: 59,
    eConfig: "[Xe]4f3 6s2",
  },
  {
    name: "Neodymium",
    symbol: "Nd",
    aMass: 144.24,
    number: 60,
    eConfig: "[Xe]4f4 6s2",
  },
  {
    name: "Promethium",
    symbol: "Pm",
    aMass: 145,
    number: 61,
    eConfig: "[Xe]4f5 6s2",
  },
  {
    name: "Samarium",
    symbol: "Sm",
    aMass: 150.36,
    number: 62,
    eConfig: "[Xe]4f6 6s2",
  },
  {
    name: "Europium",
    symbol: "Eu",
    aMass: 151.96,
    number: 63,
    eConfig: "[Xe]4f7 6s2",
  },
  {
    name: "Gadolinium",
    symbol: "Gd",
    aMass: 157.25,
    number: 64,
    eConfig: "[Xe]4f7 5d 6s2",
  },
  {
    name: "Terbium",
    symbol: "Tb",
    aMass: 158.93,
    number: 65,
    eConfig: "[Xe]4f9 6s2",
  },
  {
    name: "Dysprosium",
    symbol: "Dy",
    aMass: 162.5,
    number: 66,
    eConfig: "[Xe]4f10 6s2",
  },
  {
    name: "Holmium",
    symbol: "Ho",
    aMass: 164.93,
    number: 67,
    eConfig: "[Xe]4f11 6s2",
  },
  {
    name: "Erbium",
    symbol: "Er",
    aMass: 167.26,
    number: 68,
    eConfig: "[Xe]4f12 6s2",
  },
  {
    name: "Thulium",
    symbol: "Tm",
    aMass: 168.93,
    number: 69,
    eConfig: "[Xe]4f13 6s2",
  },
  {
    name: "Ytterbium",
    symbol: "Yb",
    aMass: 173.05,
    number: 70,
    eConfig: "[Xe]4f14 6s2",
  },
  {
    name: "Lutetium",
    symbol: "Lu",
    aMass: 174.97,
    number: 71,
    eConfig: "[Xe]4f14 5d 6s2",
  },
  {
    name: "Hafnium",
    symbol: "Hf",
    aMass: 178.49,
    number: 72,
    eConfig: "[Xe]4f14 5d2 6s2",
  },
  {
    name: "Tantalum",
    symbol: "Ta",
    aMass: 180.95,
    number: 73,
    eConfig: "[Xe]4f14 5d3 6s2",
  },
  {
    name: "Tungsten",
    symbol: "W",
    aMass: 183.84,
    number: 74,
    eConfig: "[Xe]4f14 5d4 6s2",
  },
  {
    name: "Rhenium",
    symbol: "Re",
    aMass: 186.21,
    number: 75,
    eConfig: "[Xe]4f14 5d5 6s2",
  },
  {
    name: "Osmium",
    symbol: "Os",
    aMass: 190.23,
    number: 76,
    eConfig: "[Xe]4f14 5d6 6s2",
  },
  {
    name: "Iridium",
    symbol: "Ir",
    aMass: 192.22,
    number: 77,
    eConfig: "[Xe]4f14 5d7 6s2",
  },
  {
    name: "Platinum",
    symbol: "Pt",
    aMass: 195.08,
    number: 78,
    eConfig: "[Xe]4f14 5d9 6s",
  },
  {
    name: "Gold",
    symbol: "Au",
    aMass: 196.97,
    number: 79,
    eConfig: "[Xe]4f14 5d10 6s2",
  },
  {
    name: "Mercury",
    symbol: "Hg",
    aMass: 200.59,
    number: 80,
    eConfig: "[Xe]4f14 5d6 6s2",
  },
  {
    name: "Thallium",
    symbol: "Tl",
    aMass: 204.38,
    number: 81,
    eConfig: "[Hg]6p",
  },
  {
    name: "Lead",
    symbol: "Pb",
    aMass: 207.2,
    number: 82,
    eConfig: "[Hg]6p2",
  },
  {
    name: "Bismuth",
    symbol: "Bi",
    aMass: 208.98,
    number: 83,
    eConfig: "[Hg]6p3",
  },
  {
    name: "Polonium",
    symbol: "Po",
    aMass: 209,
    number: 84,
    eConfig: "[Hg]6p4",
  },
  {
    name: "Astatine",
    symbol: "At",
    aMass: 210,
    number: 85,
    eConfig: "[Hg]6p5",
  },
  {
    name: "Radon",
    symbol: "Rn",
    aMass: 222,
    number: 86,
    eConfig: "[Hg]6p6",
  },
  {
    name: "Francium",
    symbol: "Fr",
    aMass: 223,
    number: 87,
    eConfig: "[Rn]7s",
  },
  {
    name: "Radium",
    symbol: "Ra",
    aMass: 226,
    number: 88,
    eConfig: "[Rn]7s2",
  },
  {
    name: "Actinium",
    symbol: "Ac",
    aMass: 227,
    number: 89,
    eConfig: "[Rn]6d 7s2",
  },
  {
    name: "Thorium",
    symbol: "Th",
    aMass: 232.04,
    number: 90,
    eConfig: "[Rn]6d2 7s2",
  },
  {
    name: "Protactinium,",
    symbol: "Pa",
    aMass: 231.04,
    number: 91,
    eConfig: "[Rn]5f3 6d 7s2",
  },
  {
    name: "Uranium",
    symbol: "U",
    aMass: 238.03,
    number: 92,
    eConfig: "[Rn]5f3 6d 7s2",
  },
  {
    name: "Neptunium",
    symbol: "Np",
    aMass: 237,
    number: 93,
    eConfig: "[Rn]5f4 6d 7s2",
  },
  {
    name: "Plutonium",
    symbol: "Pu",
    aMass: 244,
    number: 94,
    eConfig: "[Rn]5f6 7s2",
  },
  {
    name: "Americium",
    symbol: "Am",
    aMass: 243,
    number: 95,
    eConfig: "[Rn]5f7 7s2",
  },
  {
    name: "Curium",
    symbol: "Cm",
    aMass: 247,
    number: 96,
    eConfig: "[Rn]5f7 6d 7s2",
  },
  {
    name: "Berkelium",
    symbol: "Bk",
    aMass: 247,
    number: 97,
    eConfig: "[Rn]5f9 7s2",
  },
  {
    name: "Californium",
    symbol: "Cf",
    aMass: 251,
    number: 98,
    eConfig: "[Rn]5f10 7s2",
  },
  {
    name: "Einsteinium",
    symbol: "Es",
    aMass: 252,
    number: 99,
    eConfig: "[Rn]5f11 7s2",
  },
  {
    name: "Fermium",
    symbol: "Fm",
    aMass: 257,
    number: 100,
    eConfig: "[Rn]5f12 7s2",
  },
  {
    name: "Mendelevium",
    symbol: "Md",
    aMass: 258,
    number: 101,
    eConfig: "[Rn]5f13 7s2",
  },
  {
    name: "Nobelium",
    symbol: "No",
    aMass: 259,
    number: 102,
    eConfig: "[Rn]5f14 6d 7s2",
  },
  {
    name: "Lawrencium",
    symbol: "Lr",
    aMass: 266,
    number: 103,
    eConfig: "[Rn]5f14 7s2 7p",
  },
  {
    name: "Rutherfordium",
    symbol: "Rf",
    aMass: 267,
    number: 104,
    eConfig: "[Rn]5f14 6d2 7s2",
  },
  {
    name: "Dubnium",
    symbol: "Db",
    aMass: 268,
    number: 105,
    eConfig: "[Rn]5f14 6d3 7s2",
  },
  {
    name: "Seaborgium",
    symbol: "Sg",
    aMass: 269,
    number: 106,
    eConfig: "[Rn]5f14 642 7s2",
  },
  {
    name: "Bohrium",
    symbol: "Bh",
    aMass: 270,
    number: 107,
    eConfig: "[Rn]5f14 6d5 7s2",
  },
  {
    name: "Hassium",
    symbol: "Hs",
    aMass: 269,
    number: 108,
    eConfig: "[Rn]5f14 6d6 7s2",
  },
  {
    name: "Meitnerium",
    symbol: "Mt",
    aMass: 268,
    number: 109,
    eConfig: "",
  },
  {
    name: "Darmstadium",
    symbol: "Ds",
    aMass: 281,
    number: 110,
    eConfig: "",
  },
  {
    name: "Roentgenium",
    symbol: "Rg",
    aMass: 282,
    number: 111,
    eConfig: "",
  },
  {
    name: "Copernicium",
    symbol: "Cn",
    aMass: 285,
    number: 112,
    eConfig: "",
  },
  {
    name: "Nihonium",
    symbol: "Nh",
    aMass: 286,
    number: 113,
    eConfig: "",
  },
  {
    name: "Flerovium",
    symbol: "Fl",
    aMass: 289,
    number: 114,
    eConfig: "",
  },
  {
    name: "Moscovium",
    symbol: "Mc",
    aMass: 289,
    number: 115,
    eConfig: "",
  },
  {
    name: "Livermorium",
    symbol: "Lv",
    aMass: 293,
    number: 116,
    eConfig: "",
  },
  {
    name: "Tennessine",
    symbol: "Ts",
    aMass: 294,
    number: 117,
    eConfig: "",
  },
  {
    name: "Oganesson",
    symbol: "Og",
    aMass: 294,
    number: 118,
    eConfig: "",
  },
];

const faussurierMatrix = [
  [0.31, 0.0135, 0.0003, 0.0, 0.0, 0.0, 0.0],
  [0.7388, 0.3082, 0.2522, 0.0, 0.0, 0.0, 0.0],
  [0.9461, 0.3481, 0.3495, 0.0392, 0.021, 0.0007, 0.0097],
  [0.9511, 0.8511, 0.648, 0.3106, 0.2496, 0.1676, 0.0477],
  [0.9696, 0.855, 0.7916, 0.3002, 0.3136, 0.3226, 0.0513],
  [0.9987, 0.9865, 0.9413, 0.4847, 0.323, 0.3786, 0.0743],
  [0.934, 0.7502, 0.85, 0.6718, 0.6068, 0.6547, 0.2983],
];

const mendozaMatrix = [
  [0.31, 0.0268, 0.0047, 0.0046, 0.0, 0.0, 0.0],
  [0.6874, 0.2761, 0.2686, 0.2663, 0.0136, 0.0012, 0.0068],
  [0.9282, 0.3264, 0.3465, 0.3398, 0.0365, 0.0066, 0.0229],
  [0.9312, 0.5774, 0.5652, 0.5651, 0.2604, 0.1751, 0.0718],
  [0.9457, 0.8394, 0.7401, 0.7373, 0.3122, 0.3211, 0.0876],
  [0.9938, 0.9894, 0.9393, 0.9367, 0.3189, 0.3773, 0.095],
  [0.9462, 0.8092, 0.7443, 0.7282, 0.5256, 0.6104, 0.3019],
];
/*
 * Gets element's data from element list based on atomic number
 * Input: atomic number
 * Output: element data with the atomic number given
 */
function getElementByAtomicNumber(atomicNumber: number) {
  return elements.find((element) => element.number === atomicNumber);
}

window.addEventListener("load", () => {
  // periodic table interactions
  const pTableElements = document.getElementsByClassName("element ptable");
  for (let i = 0; i < pTableElements.length; i++) {
    pTableElements[i].addEventListener("click", toggleElement);
  }

  // hide function
  document.getElementById("hide").addEventListener("click", () => {
    const energyLevels = document.querySelector(".energyLevels") as HTMLElement;
    if (energyLevels.style.display === "") {
      energyLevels.style.display = "none";
    } else {
      energyLevels.style.display = "";
    }
  });

  // tab functionality
  document.querySelector(".tablinks")?.addEventListener("click", (e: Event) => {
    let target = e.target as HTMLElement;
    target.classList.add("active");
    for (let sibling of target.parentNode!.children) {
      if (sibling !== target) sibling.classList.remove("active");
    }

    document.querySelector(".tabcontent")!.classList.remove("active");
    document
      .querySelector("[name='" + target.getAttribute("name") + "']")
      .classList.add("active");
  });

  drawMatrix("matrix-1", false);
  drawMatrix("matrix-2", false);
  drawMatrix("matrix-3", true);

  P5Stuff();
});

/*
 * Main function
 * Check if element is already in display:
 *      Removes it if present
 *      Appends it if absent
 */
function toggleElement(e: Event): void {
  let target =
    (e.target as HTMLElement).nodeName === "A"
      ? (e.target as HTMLElement)
      : (e.target as HTMLElement).parentElement;
  const elementID = target.textContent!.replace(/\D/g, "");

  if (target.classList.contains("clicked")) {
    // remove selected element if already displayed
    target.classList.remove("clicked");

    document.getElementById("details").replaceChildren();
    document.getElementById("energyLevels").replaceChildren();

    // place instruction text in detailedView div
    let div = document.createElement("div");
    div.id = "tempText";
    let tempText = document.createElement("p");
    tempText.textContent =
      "Select an element from the periodic table for more details";
    div.appendChild(tempText);
    document.getElementById("details").appendChild(div);

    /* Checks if the selected element box is empty
              if (!$('.detailedView').html().trim().length) {
                  $("<div></div>").attr('id', 'tempText').appendTo('.detailedView');
                  $("#tempText").append('<p>Select an element from the periodic table for more details</p>');
              }
              */
  } else {
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let i = 0; i < pTableElements.length; i++) {
      pTableElements[i].classList.remove("clicked");
    }
    document.getElementById("details").replaceChildren();
    document.getElementById("energyLevels")?.replaceChildren();
    elementBox(target);
  }
}

/*
 * Displays a box with the element's data
 * Input: selected, object clicked on in HTML
 * Output: element data with thatomic number given
 */
function elementBox(selected): void {
  // retrieve element information
  const elementID = selected.textContent.replace(/\D/g, "");
  const selectedElement = getElementByAtomicNumber(parseInt(elementID));

  // temporary spot to update eConfigInput
  const eConfigInput = <HTMLInputElement>(
    document.getElementById("eConfigInput")
  );
  eConfigInput.value = selectedElement.eConfig;

  // add clicked class to element
  selected.classList.add("clicked");

  // create elements to populate
  let div = document.createElement("div");
  let aNumber = document.createElement("div");
  let aSymbol = document.createElement("div");
  let aName = document.createElement("div");
  let aMass = document.createElement("div");
  let textInput = document.createElement("div");

  // assign classes to elements
  div.classList.add("showcase", selected.classList[2]);
  aNumber.classList.add("aNumber");
  aSymbol.classList.add("aSymbol");
  aName.classList.add("aName");
  aMass.classList.add("aMass");
  textInput.classList.add("textInput");

  // add text content
  aNumber.textContent = String(selectedElement.number);
  aSymbol.textContent = selectedElement.symbol;
  aName.textContent = selectedElement.name;
  aMass.textContent = String(selectedElement.aMass);
  textInput.textContent = selectedElement.eConfig;

  // append elements
  div.appendChild(aNumber);
  div.appendChild(aSymbol);
  div.appendChild(aName);
  div.appendChild(aMass);
  div.appendChild(textInput);
  document.getElementById("details").appendChild(div);
  configParser(selectedElement.eConfig);
}

function configParser(eConfig: string): void {
  // variables used in for loop
  let eCount: number;
  let orbital: string;
  let subShell: string;
  let imgCount: number;

  // change eConfig into a list
  const configList = eConfig.split(" ");

  // loop back to front
  for (let i = configList.length; i > 0; i--) {
    eCount = parseInt(configList[i - 1].substring(2));
    orbital = configList[i - 1].substring(0, 2);
    subShell = orbital.substring(1);
    switch (subShell) {
      case "s":
        imgCount = 1;
        break;
      case "p":
        imgCount = 3;
        break;
      case "d":
        imgCount = 5;
      case "f":
        break;
    }
    drawSZLevel(imgCount!, eCount, orbital);
  }
}

function drawSZLevel(imgCount: number, eCount: number, orbital: string): void {
  let div = document.createElement("div");
  div.classList.add("orbital");
  div.id = orbital;
  document.getElementById("energyLevels")?.appendChild(div);

  let img = document.createElement("img");
  img.src = "/static/symbol.png";

  for (let i = 0; i < imgCount; i++) {
    document.getElementById(orbital)?.appendChild(img);
  }

  let pOrbital = document.createElement("p");
  pOrbital.textContent = orbital;

  document.getElementById(orbital).appendChild(pOrbital);
}

function drawMatrix(id, editable): void {
  let tableLocation = document.getElementById(id);
  const eLevels = ["1s", "2s", "2p", "3s", "3p", "3d", "4s"];

  for (let i = 0; i <= eLevels.length; i++) {
    let tableRow = document.createElement("tr");
    for (let j = 0; j <= eLevels.length; j++) {
      let tableData = document.createElement("td");
      let tableHeader = document.createElement("th");
      if (j == 0 && i == 0) {
        tableRow.appendChild(tableData);
      } else if (i == 0) {
        tableHeader.textContent = eLevels[j - 1];
        tableRow.appendChild(tableHeader);
      } else if (j == 0) {
        tableHeader.textContent = eLevels[i - 1];
        tableRow.appendChild(tableHeader);
      } else {
        if (editable) {
          tableData.contentEditable = "true";
        } else {
          tableData.contentEditable = "false";
        }
        console.log(id);
        if (id === "matrix-1") {
          tableData.textContent = faussurierMatrix[i - 1][j - 1].toString();
        } else if (id === "matrix-2") {
          tableData.textContent = mendozaMatrix[i - 1][j - 1].toString();
        } else {
          tableData.textContent = "0.01";
        }
        tableRow.appendChild(tableData);
      }
    }
    tableLocation.appendChild(tableRow);
  }
}

// P5 stuff - put in separate file!!!!!!!!!
function P5Stuff() {
  class SZlevel {
    constructor() {}

    makeOrbital(eCount, center, lineLength) {
      // main orbital line
      line(
        center[0] - lineLength / 2,
        center[1],
        center[0] + lineLength / 2,
        center[1]
      );

      if (eCount >= 1) {
        // first electron arrow
        line(
          center[0] - lineLength / 6,
          center[1] - lineLength / 2,
          center[0] - lineLength / 6,
          center[1] + lineLength / 2
        );
        line(
          center[0] - lineLength / 6,
          center[1] - lineLength / 2,
          center[0] - (5 * lineLength) / 12,
          center[1] - lineLength / 6
        );
      }
      if (eCount === 2) {
        // second electron arrow
        line(
          center[0] + lineLength / 6,
          center[1] - lineLength / 2,
          center[0] + lineLength / 6,
          center[1] + lineLength / 2
        );
        line(
          center[0] + lineLength / 6,
          center[1] + lineLength / 2,
          center[0] + (5 * lineLength) / 12,
          center[1] + lineLength / 6
        );
      }
    }

    makeLevel(orbName, center, lineLength) {
      if (orbName.charAt(1) === "s") {
        // 1s2
        this.makeOrbital(Number(orbName.slice(2)), center, lineLength);
      } else if (orbName.charAt(1) === "p") {
        // draw three lines and then populate it based off the electrons in the orbital
        let eLoc = [0, 0, 0];
        let eCount = Number(orbName.slice(2));
        for (let i = 0; eCount > 0; i++) {
          eLoc[i % 3] += 1;
          eCount--;
        }

        this.makeOrbital(eLoc[0], center, lineLength);
        this.makeOrbital(eLoc[1], [center[0] + 125, center[1]], lineLength);
        this.makeOrbital(eLoc[2], [center[0] + 250, center[1]], lineLength);
      } else {
        console.log("Unsupported orbital type");
      }
    }
  }

  let sketch = (p: p5) => {
    let h = 800;
    let w = 800;
    p.setup = () => {
      p.createCanvas(w, h);
    };
    p.draw = () => {
      p.background(0);
      let newSZLevel = new SZlevel();
      let eConfig = "1s1 2s1 3s2";
      let lineLength = 100;
      let centerP = [w / 2, h / 2];
      let eList = eConfig.split(" ");

      for (let i = 0; i < eList.length; i++) {
        newSZLevel.makeLevel(eList[i], centerP, lineLength);
        centerP = [w / 2, centerP[1] - (lineLength * 5) / 4];
      }
    };
  };
  console.log('P5!');
  new p5(sketch, document.getElementById("eLevelsID"));
}

/* TO DO LIST!
 * Handle selecting elements after Kr
 * Handle selecting Transition metals
 * Figure out fractional electrons
 * Populate matrices with correct values
 * Unable to change electron config if matrix 1 or 2 is selected
 * Matrix beautification
 * Get num electrons in each orbital
 * Invalid electron configuration
 *
 * Questions for prof:
 * Clarification on equations - relationship btn J and K terms, and why they don't show up in total energy equation
 * alpha beta name?
 * Display canonical orbital energy?
 * Link to how the matrices were generated?
 */

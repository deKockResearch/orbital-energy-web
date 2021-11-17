$(document).ready(function(){
	$(".element").hover(function(){
		$('.eConfig').attr('readonly', true);

		for(i = 0; i < elements.length; i++){
			if($(this).text() === elements[i].symbol){
				var name = elements[i].name;
				var AMU = elements[i].atomic_mass;
				var Config = elements[i].configuration;
				var number = i + 1;
			}
		}
		$('.box').css('background-color', $(this).css('background-color'));

		$(this).css("transform", "scale(1.05)");
		$(this).css("box-shadow", "0 10px 20px");
		
		$('.hoveredName').text(name);
		$('.hoveredSymbol').text($(this).text());
		$('.hoveredAMU').text(AMU);
		$('.eConfig').val(Config);
		$('.hoveredNumber').text(number);
	},
	function(){
		$(this).css("transform", "scale(1)");
		$(this).css("box-shadow", "");
	});

	$('.element').click(function(){
		for(i = 0; i < elements.length; i++){
			if($(this).text() === elements[i].symbol){
				if(!elements[i].clicked){
					elements[i].clicked = true
					$(this).animate({opacity: 0.5});
				}else{
					elements[i].clicked = false;
					$(this).animate({opacity: 1})
				}
			}
		}
	});
});

var elements = [
	{
		name: "Hydrogen",
		symbol: "H",
		atomic_mass: 1.008,
		number: 1,
		configuration: "1s1",
		clicked: false
	},
	{
		name: "Helium",
		symbol: "He",
	    atomic_mass: 4.0026,
	    number: 2,
	    configuration: "1s2",
	    clicked: false
	},
	{
		name: "Lithium",
		symbol: "Li",
		atomic_mass: 6.94,
		number: 3,
		configuration: "1s2 2s1",
		clicked: false
	},
	{
		name: "Beryllium",
		symbol: "Be",
		atomic_mass: 9.0122,
		number: 4,
		configuration: "1s2 2s2",
		clicked: false

	},
	{
		name: "Boron",
		symbol: "B",
		atomic_mass: 10.81,
		number: 5,
		configuration: "1s2 2s2 2p",
		clicked: false
	},
	{
		name: "Carbon",
		symbol: "C",
		atomic_mass: 12.011,
		number: 6,
		configuration: "1s2 2s2 2p2",
		clicked: false
	},
	{
		name: "Nitrogen",
		symbol: "N",
		atomic_mass: 14.007,
		number: 7,
		configuration: "1s2 2s2 2p3",
		clicked: false
	},
	{
		name: "Oxygen",
		symbol: "O",
		atomic_mass: 15.999,
		number: 8,
		configuration: "1s2 2s2 2p4",
		clicked: false
	},
	{
		name: "Fluorine",
		symbol: "F",
		atomic_mass: 18.998,
		number: 9,
		configuration: "1s2 2s2 2p5",
		clicked: false
	},
	{
		name: "Neon",
		symbol: "Ne",
		atomic_mass: 20.180,
		number: 10,
		configuration: "1s2 2s2 2p6",
		clicked: false
	},
	{
		name: "Sodium",
		symbol: "Na",
		atomic_mass: 14.007,
		number: 11,
		configuration: "[Ne]3s",
		clicked: false
	},
	{
		name: "Magnesium",
		symbol: "Mg",
		atomic_mass: 24.305,
		number: 12,
		configuration: "[Ne]3s2",
		clicked: false
	},
	{
		name: "Aluminum",
		symbol: "Al",
		atomic_mass: 26.982,
		number: 13,
		configuration: "[Ne]3s 3p",
		clicked: false
	},
	{
		name: "Silicon",
		symbol: "Si",
		atomic_mass: 28.085,
		number: 14,
		configuration: "[Ne]3s 3p2",
		clicked: false
	},
	{
		name: "Phosphorus",
		symbol: "P",
		atomic_mass: 30.974,
		number: 15,
		configuration: "[Ne]3s2 3p3",
		clicked: false
	},
	{
		name: "Sulfur",
		symbol: "S",
		atomic_mass: 32.06,
		number: 16,
		configuration: "[Ne]3s2 3p4",
		clicked: false
	},
	{
		name: "Chlorine",
		symbol: "Cl",
		atomic_mass: 35.45,
		number: 17,
		configuration: "[Ne]3s2 3p5",
		clicked: false
	},
	{
		name: "Argon",
		symbol: "Ar",
		atomic_mass: 39.948,
		number: 18,
		configuration: "[Ne]3s2 3p6",
		clicked: false
	},
	{
		name: "Potassium",
		symbol: "K",
		atomic_mass: 39.098,
		number: 19,
		configuration: "[Ar]4s",
		clicked: false
	},
	{
		name: "Calcium",
		symbol: "Ca",
		atomic_mass: 40.078,
		number: 20,
		configuration: "[Ar]4s2",
		clicked: false
	},
	{
		name: "Scandium",
		symbol: "Sc",
		atomic_mass: 44.956,
		number: 21,
		configuration: "[Ar]3d 4s2",
		clicked: false
	},
	{
		name: "Titanium",
		symbol: "Ti",
		atomic_mass: 47.867,
		number: 22,
		configuration: "[Ar]3d2 4s2",
		clicked: false
	},
	{
		name: "Vanadium",
		symbol: "V",
		atomic_mass: 50.942,
		number: 23,
		configuration: "[Ar]3d3 4s2",
		clicked: false
	},
	{
		name: "Chromium",
		symbol: "Cr",
		atomic_mass: 51.996,
		number: 24,
		configuration: "[Ar]3d5 4s",
		clicked: false
	},
	{
		name: "Manganese",
		symbol: "Mn",
		atomic_mass: 54.938,
		number: 25,
		configuration: "[Ar]3d5 4s2",
		clicked: false
	},
	{
		name: "Iron",
		symbol: "Fe",
		atomic_mass: 55.845,
		number: 26,
		configuration: "[Ar]3d6 4s2",
		clicked: false
	},
	{
		name: "Coblat",
		symbol: "Co",
		atomic_mass: 58.933,
		number: 27,
		configuration: "[Ar]3d7 4s2",
		clicked: false
	},
	{
		name: "Nickel",
		symbol: "Ni",
		atomic_mass: 58.693,
		number: 28,
		configuration: "[Ar]3d8 4s2",
		clicked: false
	},
	{
		name: "Copper",
		symbol: "Cu",
		atomic_mass: 63.546,
		number: 29,
		configuration: "[Ar]3d10 4s",
		clicked: false
	},
	{
		name: "Zinc",
		symbol: "Zn",
		atomic_mass: 65.38,
		number: 30,
		configuration: "[Ar]3d10 4s2",
		clicked: false
	},
	{
		name: "Gallium",
		symbol: "Ga",
		atomic_mass: 69.723,
		number: 31,
		configuration: "[Ar]3d10 4s2 4p",
		clicked: false
	},
	{
		name: "Germanium",
		symbol: "Ge",
		atomic_mass: 72.630,
		number: 32,
		configuration: "[Ar]3d10 4s2 4p2",
		clicked: false
	},
	{
		name: "Arsenic",
		symbol: "As",
		atomic_mass: 74.922,
		number: 33,
		configuration: "[Ar]3d10 4s2 4p3",
		clicked: false
	},
	{
		name: "Selenium",
		symbol: "Se",
		atomic_mass: 78.971,
		number: 34,
		configuration: "[Ar]3d10 4s2 4p4",
		clicked: false
	},
	{
		name: "Bromine",
		symbol: "Br",
		atomic_mass: 79.904,
		number: 35,
		configuration: "[Ar]3d10 4s2 4p5",
		clicked: false
	},
	{
		name: "Krypton",
		symbol: "Kr",
		atomic_mass: 83.798,
		number: 36,
		configuration: "[Ar]3d10 4s2 4p6",
		clicked: false
	},
	{
		name: "Rubidium",
		symbol: "Rb",
		atomic_mass: 85.468,
		number: 37,
		configuration: "[Kr]5s",
		clicked: false
	},
	{
		name: "Strontium",
		symbol: "Sr",
		atomic_mass: 87.62,
		number: 38,
		configuration: "[Kr]5s2",
		clicked: false
	},
	{
		name: "Yttrium",
		symbol: "Y",
		atomic_mass: 88.906,
		number: 39,
		configuration: "[Kr]4d 5s2",
		clicked: false
	},
	{
		name: "Zirconium",
		symbol: "Zr",
		atomic_mass: 91.224,
		number: 40,
		configuration: "[Kr]4d2 5s2",
		clicked: false
	},
	{
		name: "Niobium",
		symbol: "Nb",
		atomic_mass: 92.906,
		number: 41,
		configuration: "[Kr]4d4 5s",
		clicked: false
	},
	{
		name: "Molybdenum",
		symbol: "Mo",
		atomic_mass: 95.95,
		number: 42,
		configuration: "[Kr]4d5 5s",
		clicked: false
	},
	{
		name: "Technetium",
		symbol: "Tc",
		atomic_mass: "(97)",
		number: 43,
		configuration: "[Kr]4d5 5s2",
		clicked: false
	},
	{
		name: "Ruthenium",
		symbol: "Ru",
		atomic_mass: 101.07,
		number: 44,
		configuration: "[Kr]4d7 5s",
		clicked: false
	},
	{
		name: "Rhodium",
		symbol: "Rh",
		atomic_mass: 102.91,
		number: 45,
		configuration: "[Kr]4d8 5s2",
		clicked: false
	},
	{
		name: "Palladium",
		symbol: "Pd",
		atomic_mass: 106.42,
		number: 46,
		configuration: "[Kr]4d10",
		clicked: false
	},
	{
		name: "Silver",
		symbol: "Ag",
		atomic_mass: 107.87,
		number: 47,
		configuration: "[Kr]4d10 5s",
		clicked: false
	},
	{
		name: "Cadmium",
		symbol: "Cd",
		atomic_mass: 112.41,
		number: 48,
		configuration: "[Kr]4d10 5s2",
		clicked: false
	},
	{
		name: "Indium",
		symbol: "In",
		atomic_mass: 114.82,
		number: 49,
		configuration: "[Kr]4d10 5s2 5p",
		clicked: false
	},
	{
		name: "Tin",
		symbol: "Sn",
		atomic_mass: 118.71,
		number: 50,
		configuration: "[Kr]4d10 5s2 5p2",
		clicked: false
	},
	{
		name: "Antimony",
		symbol: "Sb",
		atomic_mass: 121.76,
		number: 51,
		configuration: "[Kr]4d10 5s2 5p3",
		clicked: false
	},
	{
		name: "Tellerium",
		symbol: "Te",
		atomic_mass: 127.60,
		number: 52,
		configuration: "[Kr]4d10 5s2 5p4",
		clicked: false
	},
	{
		name: "Iodine",
		symbol: "I",
		atomic_mass: 126.90,
		number: 53,
		configuration: "[Kr]4d10 5s2 5p5",
		clicked: false
	},
	{
		name: "Xenon",
		symbol: "Xe",
		atomic_mass: 131.29,
		number: 54,
		configuration: "[Kr]4d10 5s2 5p6",
		clicked: false
	},
	{
		name: "Caesium",
		symbol: "Cs",
		atomic_mass: 132.91,
		number: 55,
		configuration: "[Xe]6s"
	},
	{
		name: "Barium",
		symbol: "Ba",
		atomic_mass: 137.33,
		number: 56,
		configuration: "[Xe]6s2"
	},
	{
		name: "Lanthanum",
		symbol: "La",
		atomic_mass: 138.91,
		number: 57,
		configuration: "[Xe]5d 6s2"
	},
	{
		name: "Cerium",
		symbol: "Ce",
		atomic_mass: 140.12,
		number: 58,
		configuration: "[Xe]4f 5d 6s2"
	},
	{
		name: "Preseodymium",
		symbol: "Pr",
		atomic_mass: 140.91,
		number: 59,
		configuration: "[Xe]4f3 6s2"
	},
	{
		name: "Neodymium",
		symbol: "Nd",
		atomic_mass: 144.24,
		number: 60,
		configuration: "[Xe]4f4 6s2"
	},
	{
		name: "Promethium",
		symbol: "Pm",
		atomic_mass: 145,
		number: 61,
		configuration: "[Xe]4f5 6s2"
	},
	{
		name: "Samarium",
		symbol: "Sm",
		atomic_mass: 150.36,
		number: 62,
		configuration: "[Xe]4f6 6s2"
	},
	{
		name: "Europium",
		symbol: "Eu",
		atomic_mass: 151.96,
		number: 63,
		configuration: "[Xe]4f7 6s2"
	},
	{
		name: "Gadolinium",
		symbol: "Gd",
		atomic_mass: 157.25,
		number: 64,
		configuration: "[Xe]4f7 5d 6s2"
	},
	{
		name: "Terbium",
		symbol: "Tb",
		atomic_mass: 158.93,
		number: 65,
		configuration: "[Xe]4f9 6s2"
	},
	{
		name: "Dysprosium",
		symbol: "Dy",
		atomic_mass: 162.5,
		number: 66,
		configuration: "[Xe]4f10 6s2"
	},
	{
		name: "Holmium",
		symbol: "Ho",
		atomic_mass: 164.93,
		number: 67,
		configuration: "[Xe]4f11 6s2"
	},
	{
		name: "Erbium",
		symbol: "Er",
		atomic_mass: 167.26,
		number: 68,
		configuration: "[Xe]4f12 6s2"
	},
	{
		name: "Thulium",
		symbol: "Tm",
		atomic_mass: 168.93,
		number: 69,
		configuration: "[Xe]4f13 6s2"
	},
	{
		name: "Ytterbium",
		symbol: "Yb",
		atomic_mass: 173.05,
		number: 70,
		configuration: "[Xe]4f14 6s2"
	},
	{
		name: "Lutetium",
		symbol: "Lu",
		atomic_mass: 174.97,
		number: 71,
		configuration: "[Xe]4f14 5d 6s2"
	},
	{
		name: "Hafnium",
		symbol: "Hf",
		atomic_mass: 178.49,
		number: 72,
		configuration: "[Xe]4f14 5d2 6s2"
	},
	{
		name: "Tantalum",
		symbol: "Ta",
		atomic_mass: 180.95,
		number: 73,
		configuration: "[Xe]4f14 5d3 6s2"
	},
	{
		name: "Tungsten",
		symbol: "W",
		atomic_mass: 183.84,
		number: 74,
		configuration: "[Xe]4f14 5d4 6s2"
	},
	{
		name: "Rhenium",
		symbol: "Re",
		atomic_mass: 186.21,
		number: 75,
		configuration: "[Xe]4f14 5d5 6s2"
	},
	{
		name: "Osmium",
		symbol: "Os",
		atomic_mass: 190.23,
		number: 76,
		configuration: "[Xe]4f14 5d6 6s2"
	},
	{
		name: "Iridium",
		symbol: "Ir",
		atomic_mass: 192.22,
		number: 77,
		configuration: "[Xe]4f14 5d7 6s2"
	},
	{
		name: "Platinum",
		symbol: "Pt",
		atomic_mass: 195.08,
		number: 78,
		configuration: "[Xe]4f14 5d9 6s"
	},
	{
		name: "Gold",
		symbol: "Au",
		atomic_mass: 196.97,
		number: 79,
		configuration: "[Xe]4f14 5d10 6s2"
	},
	{
		name: "Mercury",
		symbol: "Hg",
		atomic_mass: 200.59,
		number: 80,
		configuration: "[Xe]4f14 5d6 6s2"
	},
	{
		name: "Thallium",
		symbol: "Tl",
		atomic_mass: 204.38,
		number: 81,
		configuration: "[Hg]6p"
	},
	{
		name: "Lead",
		symbol: "Pb",
		atomic_mass: 207.2,
		number: 82,
		configuration: "[Hg]6p2"
	},
	{
		name: "Bismuth",
		symbol: "Bi",
		atomic_mass: 208.98,
		number: 83,
		configuration: "[Hg]6p3"
	},
	{
		name: "Polonium",
		symbol: "Po",
		atomic_mass: 209,
		number: 84,
		configuration: "[Hg]6p4"
	},
	{
		name: "Astatine",
		symbol: "At",
		atomic_mass: 210,
		number: 85,
		configuration: "[Hg]6p5"
	},
	{
		name: "Radon",
		symbol: "Rn",
		atomic_mass: 222,
		number: 86,
		configuration: "[Hg]6p6"
	},
	{
		name: "Francium",
		symbol: "Fr",
		atomic_mass: 223,
		number: 87,
		configuration: "[Rn]7s"
	},
	{
		name: "Radium",
		symbol: "Ra",
		atomic_mass: 226,
		number: 88,
		configuration: "[Rn]7s2"
	},
	{
		name: "Actinium",
		symbol: "Ac",
		atomic_mass: 227,
		number: 89,
		configuration: "[Rn]6d 7s2"
	},
	{
		name: "Thorium",
		symbol: "Th",
		atomic_mass: 232.04,
		number: 90,
		configuration: "[Rn]6d2 7s2"
	},
	{
		name: "Protactinium,",
		symbol: "Pa",
		atomic_mass: 231.04,
		number: 91,
		configuration: "[Rn]5f3 6d 7s2"
	},
	{
		name: "Uranium",
		symbol: "U",
		atomic_mass: 238.03,
		number: 92,
		configuration: "[Rn]5f3 6d 7s2"
	},
	{
		name: "Neptunium",
		symbol: "Np",
		atomic_mass: 237,
		number: 93,
		configuration: "[Rn]5f4 6d 7s2"
	},
	{
		name: "Plutonium",
		symbol: "Pu",
		atomic_mass: 244,
		number: 94,
		configuration: "[Rn]5f6 7s2"
	},
	{
		name: "Americium",
		symbol: "Am",
		atomic_mass: 243,
		number: 95,
		configuration: "[Rn]5f7 7s2"
	},
	{
		name: "Curium",
		symbol: "Cm",
		atomic_mass: 247,
		number: 96,
		configuration: "[Rn]5f7 6d 7s2"
	},
	{
		name: "Berkelium",
		symbol: "Bk",
		atomic_mass: 247,
		number: 97,
		configuration: "[Rn]5f9 7s2"
	},
	{
		name: "Californium",
		symbol: "Cf",
		atomic_mass: 251,
		number: 98,
		configuration: "[Rn]5f10 7s2"
	},
	{
		name: "Einsteinium",
		symbol: "Es",
		atomic_mass: 252,
		number: 99,
		configuration: "[Rn]5f11 7s2"
	},
	{
		name: "Fermium",
		symbol: "Fm",
		atomic_mass: 257,
		number: 100,
		configuration: "[Rn]5f12 7s2"
	},
	{
		name: "Mendelevium",
		symbol: "Md",
		atomic_mass: 258,
		number: 101,
		configuration: "[Rn]5f13 7s2"
	},
	{
		name: "Nobelium",
		symbol: "No",
		atomic_mass: 259,
		number: 102,
		configuration: "[Rn]5f14 6d 7s2"
	},
	{
		name: "Lawrencium",
		symbol: "Lr",
		atomic_mass: 266,
		number: 103,
		configuration: "[Rn]5f14 7s2 7p"
	},
	{
		name: "Rutherfordium",
		symbol: "Rf",
		atomic_mass: 267,
		number: 104,
		configuration: "[Rn]5f14 6d2 7s2"
	},
	{
		name: "Dubnium",
		symbol: "Db",
		atomic_mass: 268,
		number: 105,
		configuration: "[Rn]5f14 6d3 7s2"
	},
	{
		name: "Seaborgium",
		symbol: "Sg",
		atomic_mass: 269,
		number: 106,
		configuration: "[Rn]5f14 642 7s2"
	},
	{
		name: "Bohrium",
		symbol: "Bh",
		atomic_mass: 270,
		number: 107,
		configuration: "[Rn]5f14 6d5 7s2"
	},
	{
		name: "Hassium",
		symbol: "Hs",
		atomic_mass: 269,
		number: 108,
		configuration: "[Rn]5f14 6d6 7s2"
	},
	{
		name: "Meitnerium",
		symbol: "Mt",
		atomic_mass: 268,
		number: 109,
		configuration: ""
	},
	{
		name: "Darmstadium",
		symbol: "Ds",
		atomic_mass: 281,
		number: 110,
		configuration: ""
	},
	{
		name: "Roentgenium",
		symbol: "Rg",
		atomic_mass: 282,
		number: 111,
		configuration: ""
	},
	{
		name: "Copernicium",
		symbol: "Cn",
		atomic_mass: 285,
		number: 112,
		configuration: ""
	},
	{
		name: "Nihonium",
		symbol: "Nh",
		atomic_mass: 286,
		number: 113,
		configuration: ""
	},
	{
		name: "Flerovium",
		symbol: "Fl",
		atomic_mass: 289,
		number: 114,
		configuration: ""
	},
	{
		name: "Moscovium",
		symbol: "Mc",
		atomic_mass: 289,
		number: 115,
		configuration: ""
	},
	{
		name: "Livermorium",
		symbol: "Lv",
		atomic_mass: 293,
		number: 116,
		configuration: ""
	},
	{
		name: "Tennessine",
		symbol: "Ts",
		atomic_mass: 294,
		number: 117,
		configuration: ""
	},
	{
		name: "Oganesson",
		symbol: "Og",
		atomic_mass: 294,
		number: 118,
		configuration: ""
	}
]
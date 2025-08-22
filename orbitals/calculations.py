"""
Orbital energy calculations ported from TypeScript
"""

import re
from typing import List, Dict, Any


class Orbital:
    """Represents an atomic orbital"""
    def __init__(self, level: int, s_or_p: str, num_electrons: int):
        self.level = level
        self.s_or_p = s_or_p
        self.num_electrons = num_electrons


# Dynamic matrix from the original calc.py and TypeScript
DYNAMIC_23_MATRIX = [
    [0.31, 0.0067, 0.0054, 0.0032, 0.0031],
    [0.8139, 0.3128, 0.275, 0.0061, 0.0061],
    [0.9351, 0.3134, 0.3417, 0.0127, 0.0125],
    [0.9564, 0.8851, 0.757, 0.3616, 0.2076],
    [0.9627, 0.8608, 0.8357, 0.3457, 0.3107],
]


def compute_orbitals(e_config_str: str) -> List[Orbital]:
    """
    Parse electron configuration string into orbital objects
    Example: "1s2 2s2 2p4" -> [Orbital(1, 's', 2), Orbital(2, 's', 2), Orbital(2, 'p', 4)]
    """
    orbitals = []
    groups = e_config_str.split(" ")
    
    for group in groups:
        # Match pattern like "1s2", "2p4", etc.
        match = re.match(r'(\d+)([sp])(\d+)', group)
        if match:
            level = int(match.group(1))
            s_or_p = match.group(2)
            num_electrons = int(match.group(3))
            orbitals.append(Orbital(level, s_or_p, num_electrons))
    
    return orbitals


def total_orbital_energy(atomic_number: int, orbital_list: List[Orbital], 
                        matrix: List[List[float]] = None) -> List[float]:
    """
    Compute the orbital energies and total energy
    Returns: [total_energy, energy_orbital_1, energy_orbital_2, ...]
    """
    if matrix is None:
        matrix = DYNAMIC_23_MATRIX
    
    energy = 0
    energy_array = []
    
    for i, orbital_i in enumerate(orbital_list):
        n_i = orbital_i.level
        N_i = orbital_i.num_electrons
        
        Z_i = atomic_number
        for j, orbital_j in enumerate(orbital_list):
            Z_i -= (orbital_j.num_electrons - (1 if i == j else 0)) * matrix[i][j]
        
        orbital_energy = -(Z_i * Z_i) / (2 * n_i * n_i)
        energy_array.append(orbital_energy)
        energy -= N_i * ((Z_i * Z_i) / (2 * n_i * n_i))
    
    return [energy] + energy_array


def calculate_element_energy(atomic_number: int, e_config: str) -> Dict[str, Any]:
    """
    Calculate orbital energies for a given element
    """
    orbitals = compute_orbitals(e_config)
    energies = total_orbital_energy(atomic_number, orbitals)
    
    return {
        'atomic_number': atomic_number,
        'electron_config': e_config,
        'orbitals': [
            {
                'level': orb.level,
                'type': orb.s_or_p,
                'electrons': orb.num_electrons
            } for orb in orbitals
        ],
        'total_energy': energies[0],
        'orbital_energies': energies[1:],
    }


# Example usage with oxygen (atomic number 8)
if __name__ == "__main__":
    # Test with oxygen
    oxygen_config = "1s2 2s2 2p4"
    result = calculate_element_energy(8, oxygen_config)
    print(f"Oxygen energy calculation: {result}")
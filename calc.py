"""
const orbitalList = eConfig.split(' ');
    let atomicNumber = 0;
    for (let num = 0; num < orbitalList.length; num++) {
        atomicNumber += Number(orbitalList[num].slice(2));
    }
    
    let energy = 0;
    for (let i = 0; i < orbitalList.length; i++) {
        let n_i = Number(orbitalList[i].charAt(0));
        let N_i = Number(orbitalList[i].slice(2));
        
        let Z_i = atomicNumber;
        for (let j = 0; j < orbitalList.length; j++) {
            Z_i -= (N_i - (i === j ? 1 : 0)) * mx[i][j];
            console.log(N_i);
            console.log(mx[i][j]);
        }

        energy -= N_i * ((Z_i * Z_i) / (2 * n_i * n_i));
    }
"""
dynamic23Matrix = [
  [0.31, 0.0067, 0.0054, 0.0032, 0.0031],
  [0.8139, 0.3128, 0.275, 0.0061, 0.0061],
  [0.9351, 0.3134, 0.3417, 0.0127, 0.0125],
  [0.9564, 0.8851, 0.757, 0.3616, 0.2076],
  [0.9627, 0.8608, 0.8357, 0.3457, 0.3107],
]
eConfig = "1s2 2s2 2p4"
orbLst = eConfig.split(' ')
aNum = 8 # Need to dynamically change this accroding to element

e = 0

for i in range(len(orbLst)):
    n_i = int(orbLst[i][0])
    N_i = int(orbLst[i][2])
    Z_i = aNum

    for j in range(len(orbLst)):

        Z_i -= (int(orbLst[j][2]) - (1 if i == j else 0)) * dynamic23Matrix[i][j]
        print( dynamic23Matrix[i][j])
        print(Z_i)
    
    e -= (N_i * (Z_i * Z_i) / (2 * n_i * n_i))
    print(N_i * (Z_i * Z_i) / (2 * n_i * n_i))

print(e)
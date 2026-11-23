const matriz=[];

function agregarVaMatriz(){
    for (let i=0; i<matriz.length; i++){
        matriz[i].push(0);
    }

    const nuevaF=[];

    for (let j=0; j<matriz.length +1; j++){
        nuevaF.push(0);
    }
    matriz.push(nuevaF);
}

function agregarA(i, j, peso){
    matriz[i][j]=peso;
    matriz[j][i]=peso;
}

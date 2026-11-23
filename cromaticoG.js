const traduccion={
  rojo:"red",
  azul:"blue",
  verde:"green",
  amarillo:"yellow",
  naranja:"orange",
  morado:"purple",
  rosa:"pink",
  celeste:"skyblue",
  gris:"gray",
  cafe:"saddlebrown",
};

function colorV(color){
  const prueba=new Option().style;
  prueba.color=color;
  return prueba.color!== "";
}

function leerC(texto){
  const pedazos=texto.split(",");
  const validos=[];
  const invalidos=[];

  for (let i=0; i<pedazos.length; i++){
    const nom=pedazos[i].trim().toLowerCase();
    if (nom===""){
      continue;
    }

    const color=traduccion[nom] ? traduccion[nom]:nom;

    if (!colorV(color)){
      invalidos.push(nom);
    } else if (!validos.includes(color)){
      validos.push(color);
    }
  }

  return {validos:validos, invalidos:invalidos};
}

function lados(i){
  const lista=[];
  for (let j=0; j<matriz.length; j++){
    if (matriz[i][j]>0){
      lista.push(j);
    }
  }
  return lista;
}

function siValido(i, c, asignacion){
  const lista=lados(i);
  for (let k=0; k<lista.length; k++){
    if (asignacion[lista[k]] === c){
      return false;
    }
  }
  return true;
}

function colorear(i, k, asignacion){
  if (i===vertices.length){
    return true;
  }

  for (let c=0; c<k; c++){
    if (siValido(i, c, asignacion)){
      asignacion[i]=c;

      if (colorear(i+1, k, asignacion)){
        return true;
      }
      asignacion[i]=-1;
    }
  }
  return false;
}

function gradoCromatico(maxColores){
  const pasos=[];

  for (let k=1; k<=maxColores; k++){
    const asignacion=new Array(vertices.length).fill(-1);

    if (colorear(0, k, asignacion)){
      pasos.push("Proceso del Color: con "+k+" colores si existe una asignacion valida");
      for (let i=0; i<vertices.length; i++){
        pasos.push("Proceso del Color: "+vertices[i].nom+" recibe el color "+(asignacion[i]+1));
      }
      return { k:k, asignacion:asignacion, pasos:pasos };
    }

    pasos.push("Proceso del Color: con "+k+" colores no es posible");
  }

  return { k:null, asignacion:null, pasos:pasos};
}

function limpiarC(){
  for (let i=0; i<vertices.length; i++){
    vertices[i].color=null;
  }
}
function dks(origen, destino){
  const n=vertices.length;
  const marcado=new Array(n).fill(false);
  const camino=[origen];
  const pasos=[];
  let peso=0;
  marcado[origen]=true;

  while (camino[camino.length-1]!==destino){
    const actual=camino[camino.length-1];
    let mejor=-1;
    for (let j=0; j<n; j++){
      if (matriz[actual][j]>0 && !marcado[j]){
        if (mejor===-1 || matriz[actual][j]<matriz[actual][mejor]){
          mejor=j;
        }
      }
    }
    if (mejor===-1){
      if (camino.length===1){
        pasos.push("Proceso Dijkstra: "+vertices[actual].nom+" no tiene mas salidas, no hay camino");
        return {camino:null, peso:0, pasos:pasos};
      }
      camino.pop();
      const anterior=camino[camino.length-1];
      peso-=matriz[anterior][actual];
      pasos.push("Proceso Dijkstra: "+vertices[actual].nom+" no tiene salida, se regresa a "+vertices[anterior].nom);
      continue;
    }
    marcado[mejor]=true;
    camino.push(mejor);
    peso+=matriz[actual][mejor];
    pasos.push("Proceso Dijkstra: desde "+vertices[actual].nom+" se elige "+vertices[mejor].nom+" (arista menor = "+matriz[actual][mejor]+")");
  }
  return {camino:camino, peso:peso, pasos:pasos};
}

function textoDKS(origen, destino, d){
  const lineas=["Proceso Dijkstra desde "+vertices[origen].nom+" hasta "+vertices[destino].nom+":"];
  for (let i=0; i<d.pasos.length; i++){
    lineas.push(d.pasos[i]);
  }
  return lineas;
}

function buscar(actual, destino, visitado, camino, peso, lista){
  if (actual===destino){
    lista.push({camino:camino.slice(), peso:peso});
    return;
  }
  for (let j=0; j<vertices.length; j++){
    if (matriz[actual][j]>0 && !visitado[j]){
      visitado[j]=true;
      camino.push(j);
      buscar(j, destino, visitado, camino, peso+matriz[actual][j], lista);
      camino.pop();
      visitado[j]=false;
    }
  }
}

function tLosCaminos(origen, destino){
  const visitado=new Array(vertices.length).fill(false);
  visitado[origen]=true;
  const lista=[];
  buscar(origen, destino, visitado, [origen], 0, lista);
  lista.sort(function (a, b){
    return a.peso-b.peso;
  });
  return lista;
}

function textoRuta(ruta){
  const nombres=[];
  for (let i=0; i<ruta.camino.length; i++){
    nombres.push(vertices[ruta.camino[i]].nom);
  }
  return nombres.join("→")+" (peso "+ruta.peso+")";
}
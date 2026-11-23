function mNoVisitado(distancia, visitado){
  let mejor=-1;
  for (let i=0; i<distancia.length; i++){
    if (!visitado[i] && distancia[i]!==Infinity){
      if (mejor===-1 || distancia[i]<distancia[mejor]){
        mejor=i;
      }
    }
  }
  return mejor;
}

function dks(origen){
  const n=vertices.length;
  const distancia=new Array(n).fill(Infinity);
  const anterior=new Array(n).fill(-1);
  const visitado=new Array(n).fill(false);
  const orden=[];
  const pasos=[];

  distancia[origen] = 0;

  for (let paso=0; paso<n; paso++){
    const u=mNoVisitado(distancia, visitado);
    if (u === -1){
      break;
    }
    visitado[u] = true;
    orden.push(u);

    const cambios=[];
    for (let j=0; j<n; j++){
      if (matriz[u][j]>0 && !visitado[j]){
        const nueva=distancia[u]+matriz[u][j];
        if (nueva<distancia[j]){
          distancia[j]=nueva;
          anterior[j]=u;
          cambios.push(vertices[j].nom+"="+nueva);
        }
      }
    }

    pasos.push(
      "Proceso Dijkstra paso "+(paso+1)+": se elige "+vertices[u].nom+
      " (distancia "+distancia[u]+")"+
      (cambios.length>0? ", actualiza "+cambios.join(", "): ", sin cambios")
    );
  }

  return {distancia: distancia, anterior: anterior, orden: orden, pasos: pasos};
}

function textoDKS(origen, d){
  const lineas=["Proceso Dijkstra desde "+vertices[origen].nom+":"];

  for (let i=0; i<d.pasos.length; i++){
    lineas.push(d.pasos[i]);
  }

  const nombres=[];
  for (let i=0; i<d.orden.length; i++){
    nombres.push(vertices[d.orden[i]].nom);
  }
  lineas.push("Proceso Dijkstra orden de visita: "+nombres.join(", "));

  const distancias=[];
  for (let i=0; i<vertices.length; i++){
    const valor=d.distancia[i]===Infinity ? "inalcanzable" : d.distancia[i];
    distancias.push(vertices[i].nom+"="+valor);
  }
  lineas.push("Proceso Dijkstra distancias: "+distancias.join(", "));

  return lineas;
}

function reconstruir(anterior, origen, destino){
  const camino=[];
  let actual=destino;

  while (actual!==-1){
    camino.unshift(actual);
    actual=anterior[actual];
  }

  if (camino[0]!==origen){
    return null;
  }
  return camino;
}

function buscar(actual, destino, visitado, camino, peso, lista){
  if (actual===destino){
    lista.push({camino: camino.slice(), peso: peso});
    return;
  }

  for (let j=0; j<vertices.length; j++){
    if (matriz[actual][j]>0 && !visitado[j]){
      visitado[j]=true;
      camino.push(j);

      buscar(j, destino, visitado, camino, peso + matriz[actual][j], lista);

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
  return nombres.join("→")+" (peso " + ruta.peso + ")";
}
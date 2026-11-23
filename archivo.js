const registro=[];

function generarText(){
  const lineas=[];

  lineas.push("GRAFO");
  lineas.push("Deira Castillo - Proyecto Final");
  lineas.push("VERTICES "+vertices.length);

  for (let i=0; i<vertices.length; i++){
    const color=vertices[i].color ? vertices[i].color : "-";
    lineas.push(
      vertices[i].nom + " " +
      Math.round(vertices[i].x) + " " +
      Math.round(vertices[i].y) + " " +
      color
    );
  }

  lineas.push("MATRIZ");

  for (let i=0; i<matriz.length; i++){
    lineas.push(matriz[i].join(" "));
  }

  lineas.push("RESULTADOS");

  for (let i=0; i<registro.length; i++){
    lineas.push(registro[i]);
  }

  return lineas.join("\n");
}

function anotar(prefijo, lineasNuevas){
  for (let i=registro.length-1; i>= 0; i--){
    if (registro[i].startsWith(prefijo)){
      registro.splice(i, 1);
    }
  }
  for (let i=0; i<lineasNuevas.length; i++){
    registro.push(lineasNuevas[i]);
  }
}

function mRegistro(){
  resultado.innerHTML = "";

  const grupos = [
    { titulo: "Grado cromático", prefijo: "Grado",            plegable: false },
    { titulo: "Rutas",           prefijo: "Ruta",             plegable: false },
    { titulo: "Proceso del coloreado", prefijo: "Proceso del Color", plegable: true },
    { titulo: "Proceso de Dijkstra",   prefijo: "Proceso Dijkstra",  plegable: true }
  ];

  for (let g = 0; g < grupos.length; g++){
    const grupo = grupos[g];
    const lineas = [];

    for (let i = 0; i < registro.length; i++){
      if (registro[i].startsWith(grupo.prefijo)){
        lineas.push(registro[i]);
      }
    }

    if (lineas.length === 0){
      continue;
    }

    const tarjeta = document.createElement("section");
    tarjeta.className = "bloque";

    const contenedor = grupo.plegable
      ? document.createElement("details")
      : document.createElement("div");

    const encabezado = grupo.plegable
      ? document.createElement("summary")
      : document.createElement("h3");
    encabezado.textContent = grupo.titulo;
    contenedor.appendChild(encabezado);

    for (let i = 0; i < lineas.length; i++){
      const p = document.createElement("p");
      p.textContent = lineas[i];
      contenedor.appendChild(p);
    }

    tarjeta.appendChild(contenedor);
    resultado.appendChild(tarjeta);
  }
}

function descargarArch(nombre, texto){
  const blob=new Blob([texto], {type: "text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);

  const enlace=document.createElement("a");
  enlace.href=url;
  enlace.download=nombre;
  enlace.click();

  URL.revokeObjectURL(url);
}

function grafoLeidoV(verticesLeidos, matrizLeida){
  if (verticesLeidos.length===0){
    return false;
  }

  if (matrizLeida.length!==verticesLeidos.length){
    return false;
  }

  for (let i=0; i<verticesLeidos.length; i++){
    if (isNaN(verticesLeidos[i].x) || isNaN(verticesLeidos[i].y)){
      return false;
    }
  }

  for (let i=0; i<matrizLeida.length; i++){
    if (matrizLeida[i].length !==verticesLeidos.length){
      return false;
    }

    for (let j=0; j<matrizLeida[i].length; j++){
      if (isNaN(matrizLeida[i][j]) || matrizLeida[i][j]<0){
        return false;
      }
      if (matrizLeida[i][j] !== matrizLeida[j][i]){
        return false;
      }
    }
  }

  return true;
}

  function cargarTexto(texto){
  const lineas=texto.split("\n");
  const nVertices=[];
  const nMatriz=[];
  const nResultados=[];
  let seccion="";

  for (let i=0; i<lineas.length; i++){
    const linea=lineas[i].trim();

    if (linea===""){
      continue;
    }
    if (linea==="GRAFO"){
      continue;
    }
    if (linea.startsWith("VERTICES")){
      seccion="vertices";
      continue;
    }
    if (linea==="MATRIZ"){
      seccion="matriz";
      continue;
    }
    if (linea==="RESULTADOS"){
      seccion="resultados";
      continue;
    }

    if (seccion==="vertices"){
      const partes=linea.split(" ");
      nVertices.push({
        nom: partes[0],
        x: Number(partes[1]),
        y: Number(partes[2]),
        color: partes[3]==="-" ? null: partes[3]
      });
    } else if (seccion==="matriz"){
      const partes=linea.split(" ");
      const fila=[];
      for (let j=0; j<partes.length; j++){
        fila.push(Number(partes[j]));
      }
      nMatriz.push(fila);
    } else if (seccion==="resultados"){
      nResultados.push(linea);
    }
  }

  if (!grafoLeidoV(nVertices, nMatriz)){
    mEstado("Archivo no valido.", "error");
    return false;
  }

  vertices.length=0;
  matriz.length=0;
  registro.length=0;

  for (let i=0; i<nVertices.length; i++){
    vertices.push(nVertices[i]);
  }
  for (let i=0; i<nMatriz.length; i++){
    matriz.push(nMatriz[i]);
  }
  for (let i=0; i<nResultados.length; i++){
    registro.push(nResultados[i]);
  }

  origen=-1;
  rdibujar();
  mRegistro();

  mEstado("Grafo cargado.", "ok");
  return true;
}

function guardarA(){
  try{
    if (vertices.length===0){
      localStorage.removeItem("grafo");
    } else {
      localStorage.setItem("grafo", generarText());
    }
  } catch (e) {
    console.log("No se pudo guardar automaticamente.");
  }
}

function recuAuto(){
  try{
    const texto=localStorage.getItem("grafo");
    if (!texto){
      return;
    }
    if (!cargarTexto(texto)){
      localStorage.removeItem("grafo");
    }
  } catch (e){
    console.log("No se pudo recuperar el grafo.");
  }
}

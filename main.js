const canvas=document.getElementById("boceto");
const pincel=canvas.getContext("2d");

const vertices=[];
let modo="vertice";
let origen= -1;

const btnVertice=document.getElementById("btnVertice");
const btnArista=document.getElementById("btnArista");
const btnBorrar=document.getElementById("btnBorrar");
const estado=document.getElementById("estado");
const btnPintar=document.getElementById("btnPintar");
const inColores=document.getElementById("colores");
const resultado=document.getElementById("resultado");   
const selOrigen=document.getElementById("selOrigen");
const selDestino=document.getElementById("selDestino");
const btnRutas=document.getElementById("btnRutas");
const btnGuardar=document.getElementById("btnGuardar");
const btnCargar=document.getElementById("btnCargar");
const archEntrada=document.getElementById("archEntrada");
const cajaComando=document.getElementById("caComando");
const comando=document.getElementById("comando");
const btnCopiar=document.getElementById("btnCopiar");
const contador=document.getElementById("contador");

function mEstado(texto, tipo){
    estado.textContent=texto;
    estado.className="estado";
    if (tipo){
        estado.classList.add("estado-" +tipo);
    }
}

function actuModo(){
    btnVertice.classList.toggle("activo", modo==="vertice");
    btnArista.classList.toggle("activo", modo==="arista");
    canvas.dataset.modo=modo;
}


function dibujarN(vertice, seleccionado){
    pincel.beginPath();
    pincel.arc(vertice.x, vertice.y, 30, 0, 2 * Math.PI);

    pincel.fillStyle=vertice.color ? vertice.color:"white";
    pincel.fill();

    pincel.strokeStyle=seleccionado ? "#2563eb": "#333";
    pincel.lineWidth=seleccionado ? 4: 2;
    pincel.stroke();

    pincel.fillStyle="black";
    pincel.font="20px Arial";
    pincel.textAlign="center";
    pincel.textBaseline="middle";
    pincel.fillText(vertice.nom, vertice.x, vertice.y);
}

function actuSelectores(){
  const origenPrevio=selOrigen.value;
  const destinoPrevio=selDestino.value;

  selOrigen.innerHTML="";
  selDestino.innerHTML="";

  for (let i=0; i<vertices.length; i++){
    selOrigen.add(new Option(vertices[i].nom, i));
    selDestino.add(new Option(vertices[i].nom, i));
  }

  if (origenPrevio !== "" && origenPrevio<vertices.length){
    selOrigen.value=origenPrevio;
  }
  if (destinoPrevio !== "" && destinoPrevio<vertices.length){
    selDestino.value=destinoPrevio;
  } else if (vertices.length>1){
    selDestino.value=vertices.length-1;
  }
}

function mMatriz(){
    const caja=document.getElementById("tablaMatriz");
    if (vertices.length===0){
        caja.innerHTML="";
        return;
    }
    let html="<table><tr><th></th>";
    for (let j=0; j<vertices.length; j++){
        html+="<th>"+vertices[j].nom+"</th>";
    }
    html+="</tr>";
    for (let i=0; i<matriz.length; i++){
        html+="<tr><th>"+vertices[i].nom+"</th>";
        for (let j=0; j<matriz[i].length; j++){
            html+="<td>"+matriz[i][j]+"</td>";
        }
        html+="</tr>";
    }
    caja.innerHTML=html+"</table>";
}

function rdibujar() {
    pincel.clearRect(0, 0, canvas.width, canvas.height);
    dibujarA();
    for (let i=0; i<vertices.length; i++){
        dibujarN(vertices[i], i===origen);
    }
    actuSelectores();
    guardarA();
    mMatriz();
    actuContador();
}

function dibujarA(){
    pincel.strokeStyle="#555";
    pincel.lineWidth=2;

    for (let i=0; i<matriz.length; i++){
       for (let j =i +1; j<matriz.length; j++){
            if (matriz[i][j]>0) {
                const x1=vertices[i].x;
                const y1=vertices[i].y;
                const x2=vertices[j].x;
                const y2=vertices[j].y;

                pincel.beginPath();
                pincel.moveTo(x1, y1);
                pincel.lineTo(x2, y2);
                pincel.stroke();

                const medioX=(x1 + x2)/2;
                const medioY=(y1 + y2)/2;

                pincel.fillStyle="white";
                pincel.fillRect(medioX-14, medioY-11, 28, 22);

                pincel.fillStyle="black";
                pincel.font="16px Arial";
                pincel.textAlign="center";
                pincel.textBaseline="middle";
                pincel.fillText(matriz[i][j], medioX, medioY);
            }
        }
    }
}

function buscarV(x,y){
    for (let i=0; i<vertices.length; i++){
        const dx=x-vertices[i].x;
        const dy=y-vertices[i].y;
        const dist=Math.sqrt(dx*dx + dy*dy); 
        if (dist<30){
            return i;
        }
    }
    return -1;
}

function rResultados(){
    limpiarC();
    registro.length=0;
    resultado.innerHTML="";
}

function actuContador(){
    let aristas=0;
    for (let i=0; i<matriz.length; i++){
        for (let j=i+1; j<matriz.length; j++){
            if (matriz[i][j]>0){
                aristas++;
            }
        }
    }
    contador.textContent="Vertices: "+vertices.length + " | Aristas: " +aristas;
}

btnVertice.addEventListener("click", function(){
    modo="vertice";
    origen=-1;
    actuModo();
    mEstado("Modo: Vertice. Haz click en la pantalla para crear un nuevo vertice.");
    rdibujar();
});

btnArista.addEventListener("click", function(){
    modo="arista";
    origen=-1;
    actuModo();
    mEstado("Modo: Arista. Para crear una arista elige un vertice como origen.");
    rdibujar();
});

btnBorrar.addEventListener("click", function(){
    vertices.length=0;
    matriz.length=0;
    registro.length=0;
    resultado.innerHTML="";
    origen=-1;
    mEstado("Lienzo limpio. Agrega vertices para empezar.");
    rdibujar();
});

btnPintar.addEventListener("click", function(){
    modo="ninguno";
    origen=-1;
    actuModo();

    if (vertices.length===0){
        mEstado("Primero debes agregar vertices al espacio de la pantalla marcado.", "error");
        return;
    }

    const lectura=leerC(inColores.value);

    if (lectura.invalidos.length>0){
        mEstado("No se reconocen esos colores: " + lectura.invalidos.join(", ") + ".", "error");
        return;
    }

    const colores=lectura.validos;

    if (colores.length===0){
        mEstado("Escribe al menos un color.", "error");
        return;
    }

    const res=gradoCromatico(colores.length);

    if (res===null){
        limpiarC();
        anotar("Grado", []);
        anotar("Proceso del Color", ["Proceso del Color: no hay asignacion valida con " + colores.length + " colores"]);
        anotar("Proceso del Color", []);
        guardarA();
        mRegistro();
        rdibujar();
        mEstado("Con " + colores.length + " colores no alcanza. Agregar mas colores.", "error");
        return;
    }

    for (let i=0; i<vertices.length; i++){
        vertices[i].color=colores[res.asignacion[i]];
    }

    anotar("Grado", ["Grado cromatico: " + res.k + " (utilizaste " + res.k + " de " + colores.length + " colores)."]);
    mRegistro();
    rdibujar();
    mEstado("Grado cromatico: " + res.k + " (utilizaste " + res.k + " de " + colores.length + " colores).", "ok");
});

btnRutas.addEventListener("click", function(){
    if (vertices.length<2){
        mEstado("Necesitas al menos dos vertices para continuar.", "error");
        return;
    }

    const o=Number(selOrigen.value);
    const dest=Number(selDestino.value);

    if (o===dest){
        mEstado("Elige un vertice origen y un vertice destino distintos.", "error");
        return;
    }

    const d=dks(o);
    anotar("Proceso Dijkstra", textoDKS(o, d));

    const caminoD=reconstruir(d.anterior, o, dest);

    if (caminoD===null){
        anotar("Ruta", []);
        guardarA();
        mRegistro();
        mEstado("No existe camino entre " + vertices[o].nom + " y " + vertices[dest].nom + ".", "error");
        return;
    }

    const lista=tLosCaminos(o, dest);
    const rutaD={ camino: caminoD, peso: d.distancia[dest]};
    const optima=lista[0];

    let critica=null;
    let nota="";

    if (lista.length===1){
        critica=lista[0];
        nota="Es el unico camino posible, valor ya fue encontrado.";
    } else {
        critica=lista[1];
        if (critica.peso===optima.peso){
            nota="Mismo peso que en la ruta optima, pero con otro camino.";
        }
    }

    const lineasR=[
        "Ruta Dijkstra: " + textoRuta(rutaD),
        "Ruta optima: " + textoRuta(optima),
        "Ruta critica: " + textoRuta(critica)
    ];

    if (nota!==""){
        lineasR.push("Ruta nota: " + nota);
    }

    lineasR.push("Ruta caminos posibles encontrados: " + lista.length);
    anotar("Ruta", lineasR);
    guardarA();
    mRegistro();

    if (d.distancia[dest]!==optima.peso){
        console.log("Aviso: Dijkstra y la ruta optima no coinciden.");
    }

    mEstado("Rutas calculadas.", "ok");
});

btnGuardar.addEventListener("click", function(){
    if (vertices.length===0){
        mEstado("No hay nada que guardar.", "error");
        return;
    }

    descargarArch("grafo.txt", generarText());
    cajaComando.hidden=false;
    mEstado("Archivo guardado en tu carpeta de Descargas.", "ok");
});

btnCopiar.addEventListener("click", function(){
    navigator.clipboard.writeText(comando.textContent)
      .then(function(){mEstado("Comando copiado.", "ok");})
      .catch(function(){mEstado("No se logro copiar. Seleccionalo y copialo a mano.", "error");});
});

btnCargar.addEventListener("click", function(){
    archEntrada.click();
});

archEntrada.addEventListener("change", function(){
    const archivo=archEntrada.files[0];

    if (!archivo){
        return;
    }

    const lector=new FileReader();

    lector.onload=function(){
        cargarTexto(lector.result);
    };

    lector.onerror=function(){
        mEstado("No se pudo leer el archivo.", "error");
    };

    lector.readAsText(archivo);
    archEntrada.value="";
});

canvas.addEventListener("click", function(usuario){
    const rect=canvas.getBoundingClientRect();
    const x=usuario.clientX-rect.left;
    const y=usuario.clientY-rect.top;

    if (modo==="vertice"){
        const nom=String.fromCharCode(65+vertices.length);
        vertices.push({ nom: nom, x:x, y:y, color:null});
        agregarVaMatriz();
        rResultados();
        rdibujar();
    } else if (modo==="arista"){
        const i=buscarV(x, y);

        if (i===-1){
            return;
        }

        if (origen===-1){
            origen=i;
            mEstado("Origen: " + vertices[i].nom + ". Elige el vertice destino.");
            rdibujar();
        } else if (i!==origen){
            const texto=prompt("Peso de la arista " + vertices[origen].nom + " - " + vertices[i].nom + ":");
            const peso=Number(texto);

            if (isNaN(peso) || peso<=0){
                mEstado("Peso no valido. Elige el vertice de origen de nuevo.", "error");
            } else {
                agregarA(origen, i, peso);
                rResultados();
                mEstado("Arista creada. Elige el vertice de origen.", "ok");
            }
            origen=-1;
            rdibujar();
        }
    }
});

actuModo();
recuAuto();

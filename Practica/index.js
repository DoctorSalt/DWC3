$(window).on("load", function() {
    $("#btnBusqueda").on("click", function() {
        let inputIdNumero = $("#idSeleccionado").val();
        let inputNameNombre = $("#nombreSeleccionado").val();
        let inputIdJS = $("#idSeleccionadoJS");
        let inputNameJS = $("#nombreSeleccionadoJS");
        if ((isEmpty(inputIdNumero)) && (isEmpty(inputNameNombre))) {
            errorMensaje("01");
        } else {
            if ((!isEmpty(inputIdNumero)) && (isEmpty(inputNameNombre))) {
                if (isNaN(inputIdNumero)) {
                    errorMensaje("02")
                } else {
                    console.log(inputIdJS);
                    inputIdJS.val(inputIdNumero);
                    $.ajax({
                        url: 'pokedex.json',
                        beforeSend: function(jqXHR) {
                            jqXHR.overrideMimeType('application/json');
                        },
                        success: procesarRespuesta,
                        dataType: 'json'
                    });
                }
            } else {
                if (!isEmpty(inputNameNombre)) {
                    inputNameJS.val(inputNameNombre);
                    $.ajax({
                        url: 'pokedex.json',
                        beforeSend: function(jqXHR) {
                            jqXHR.overrideMimeType('application/json');
                        },
                        success: realizarBusqueda,
                        dataType: 'json'
                    });
                } else {
                    errorMensaje("03");
                }
            }
        }
    });
    $("#btnMostrar").on("click", function() {
        alaConsulta();
    });
});

function errorMensaje(cadena) {
    let divMensaje = document.getElementById('mensajeResultado');
    divMensaje.innerText = "";
    let mensajeError = '<div class="col-12 p-3  bg-danger text-white text-center">';
    switch (cadena) {
        case "01":
            mensajeError += "No ha introducido nada";
            console.log("No ha introducido nada");
            break;
        case "02":
            mensajeError += "Introduzca un numero en Id";
            console.log("Introduzca un numero en Id");
            break;
        case "03":
            mensajeError += "No programado XD";
            console.log("No programado XD");
            break
        case "04":
            mensajeError += "No ha seleccionado un id valido";
            console.log("No ha seleccionado un id valido");
            break;
        case "05":
            mensajeError += "No hay un pokemon con ese nombre";
            console.log("No hay un pokemon con ese nombre");
            break;
        case "06":
            mensajeError += "No hay Registros guardados";
            console.log("No hay Registros guardados");
            break;
    }
    mensajeError += '</div></div>';
    divMensaje.innerHTML = mensajeError;
}

function borradoExito() {
    let divMensaje = document.getElementById('mensajeResultado');
    divMensaje.innerText = "";
    let mensajeFunciona = '<div class="col-12 p-3 bg-success text-white text-center">';
    mensajeFunciona += "Borrado Exitoso";
    mensajeFunciona += '</div></div>';

}

function realizarBusqueda(datosJSON, statusText, jqXHR) {
    let pokemonsLista = datosJSON;
    let nombreElegido = document.getElementById("nombreSeleccionadoJS").getAttribute("value");
    let pokemonElegidoDatos = [];
    for (let i = 0; i < pokemonsLista.length; i++) {
        console.log(nombreElegido);
        if (pokemonsLista[i].name.english.includes(nombreElegido)) {
            pokemonElegidoDatos.push(pokemonsLista[i]["id"]);
            pokemonElegidoDatos.push(pokemonsLista[i].name.english);
            pokemonElegidoDatos.push(pokemonsLista[i]["type"]);
            i = pokemonsLista.length;
        }
    }
    if (pokemonElegidoDatos.length == 0) {
        errorMensaje("05");
    } else {
        let divTabla = document.getElementById("tablaResultado");
        divTabla.innerText = "";
        let laTablaHTML = '<table class="table text-center"><thead><tr><th scope="col">Id</th><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Opcion</th></tr></thead>' + '<tbody id="elTBody">';
        laTablaHTML += "<tr>";
        laTablaHTML += "<td id='numeroIdPokemon1'>";
        laTablaHTML += pokemonElegidoDatos[0];
        laTablaHTML += "</td>";
        laTablaHTML += "<td id='nombrePokemon1'>";
        laTablaHTML += pokemonElegidoDatos[1];
        laTablaHTML += "</td>";
        laTablaHTML += "<td>";
        if (pokemonElegidoDatos[2].length == 2) {
            laTablaHTML += '<div class="container"><div class="row">';
            laTablaHTML += '<div class="col-6">';
            laTablaHTML += devolverTipoChulo(pokemonElegidoDatos[2][0]);
            laTablaHTML += '</div>';
            laTablaHTML += '<div class="col-6">';
            laTablaHTML += devolverTipoChulo(pokemonElegidoDatos[2][1]);
            laTablaHTML += '</div>';
            laTablaHTML += '</div></div>';
        } else {
            laTablaHTML += devolverTipoChulo(pokemonElegidoDatos[2][0]);
        }
        laTablaHTML += "</td>";
        laTablaHTML += "<td>";
        laTablaHTML += '<a class="btn btn-success botonSeleccionar" data-code="1">Seleccionar</a>';
        laTablaHTML += "</td>";
        laTablaHTML += "</tr>";
        laTablaHTML += "</tbody></table>";
        divTabla.innerHTML = laTablaHTML;
        $(".botonSeleccionar").on("click", function() {
            let code = $(this).data('code');
            let tdId = $('#numeroIdPokemon' + code);
            let tdNombre = $('#nombrePokemon' + code);
            let numeroIdPokemonSelccionado = tdId.text();
            let nombrePokemonSeleccionado = tdNombre.text();
            console.log(numeroIdPokemonSelccionado, nombrePokemonSeleccionado)
            laFuncionBotonesPokemon(numeroIdPokemonSelccionado, nombrePokemonSeleccionado);

        });
    }
}

function procesarRespuesta(datosJSON, statusText, jqXHR) {
    let pokemonsLista = datosJSON;
    let numeroElegido = document.getElementById("idSeleccionadoJS").getAttribute("value");
    let numeroPokimonLista = [];
    let nombrePokimonLista = [];
    let tipoPokimonLista = [];
    for (let i = 1; i <= numeroElegido; i++) {
        numeroPokimonLista.push(pokemonsLista[i - 1]["id"]);
        nombrePokimonLista.push(pokemonsLista[i - 1]["name"]["english"]);
        tipoPokimonLista.push(pokemonsLista[i - 1]["type"]);
    }
    if (numeroPokimonLista.length == 0) {
        errorMensaje("04");
    } else {
        let divTabla = document.getElementById("tablaResultado");
        divTabla.innerText = "";
        let laTablaHTML = '<table class="table text-center"><thead><tr><th scope="col">Id</th><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Opcion</th></tr></thead>' + '<tbody id="elTBody">';
        for (let a = 0; a < numeroPokimonLista.length; a++) {
            laTablaHTML += "<tr>";
            laTablaHTML += "<td id='numeroIdPokemon" + (a + 1) + "'>";
            laTablaHTML += numeroPokimonLista[a];
            laTablaHTML += "</td>";
            laTablaHTML += "<td id='nombrePokemon" + (a + 1) + "'>";
            laTablaHTML += nombrePokimonLista[a];
            laTablaHTML += "</td>";
            laTablaHTML += "<td>";
            if (tipoPokimonLista[a].length == 2) {
                laTablaHTML += '<div class="container"><div class="row">';
                laTablaHTML += '<div class="col-6">';
                laTablaHTML += devolverTipoChulo(tipoPokimonLista[a][0]);
                laTablaHTML += '</div>';
                laTablaHTML += '<div class="col-6">';
                laTablaHTML += devolverTipoChulo(tipoPokimonLista[a][1]);
                laTablaHTML += '</div>';
                laTablaHTML += '</div></div>';
            } else {
                laTablaHTML += devolverTipoChulo(tipoPokimonLista[a][0]);
            }
            laTablaHTML += "</td>";
            laTablaHTML += "<td>";
            laTablaHTML += '<a class="btn btn-success botonSeleccionar" data-code="' + (a + 1) + '">Seleccionar</a>';
            laTablaHTML += "</td>";
            laTablaHTML += "</tr>";
        }
        laTablaHTML += "</tbody></table>";
        divTabla.innerHTML = laTablaHTML;
        let tablaBody = document.getElementById('elTBody');
        $(".botonSeleccionar").on("click", function() {
            let code = $(this).data('code');
            let tdId = $('#numeroIdPokemon' + code);
            let tdNombre = $('#nombrePokemon' + code);
            let numeroIdPokemonSelccionado = tdId.text();
            let nombrePokemonSeleccionado = tdNombre.text();
            laFuncionBotonesPokemon(numeroIdPokemonSelccionado, nombrePokemonSeleccionado);
        });
    }
}

function isEmpty(x) {
    let result = false;
    switch (x) {
        case null:
        case '':
        case " ":
        case undefined:
            result = true;
            break;
    }
    return result;
}

function devolverTipoChulo(tipo) {
    let cuadradoTipo = "";
    switch (tipo) {
        case "Normal":
            cuadradoTipo = cuadradoHecho("normal", tipo);
            break;
        case "Fire":
            cuadradoTipo = cuadradoHecho("fire", tipo);
            break;
        case "Water":
            cuadradoTipo = cuadradoHecho("water", tipo);
            break;
        case "Grass":
            cuadradoTipo = cuadradoHecho("grass", tipo);
            break;
        case "Electric":
            cuadradoTipo = cuadradoHecho("electric", tipo);
            break;
        case "Ice":
            cuadradoTipo = cuadradoHecho("ice", tipo);
            break;
        case "Fighting":
            cuadradoTipo = cuadradoHecho("fighting", tipo);
            break;
        case "Poison":
            cuadradoTipo = cuadradoHecho("poison", tipo);
            break;
        case "Ground":
            cuadradoTipo = cuadradoHecho("ground", tipo);
            break;
        case "Flying":
            cuadradoTipo = cuadradoHecho("flying", tipo);
            break;
        case "Psychic":
            cuadradoTipo = cuadradoHecho("psychic", tipo);
            break;
        case "Bug":
            cuadradoTipo = cuadradoHecho("bug", tipo);
            break;
        case "Rock":
            cuadradoTipo = cuadradoHecho("rock", tipo);
            break;
        case "Ghost":
            cuadradoTipo = cuadradoHecho("ghost", tipo);
            break;
        case "Dark":
            cuadradoTipo = cuadradoHecho("dark", tipo);
            break;
        case "Dragon":
            cuadradoTipo = cuadradoHecho("dragon", tipo);
            break;
        case "Steel":
            cuadradoTipo = cuadradoHecho("steel", tipo);
            break;
        case "Fairy":
            cuadradoTipo = cuadradoHecho("fairy", tipo);
            break;
    }
    return cuadradoTipo;
}

function cuadradoHecho(nombreClase, nombreTipo) {
    return '<span class="tipo ' + nombreClase + '">' +
        nombreTipo +
        '<span>';
}

function laFuncionBotonesPokemon(tdIdDato, tdNombreDato) {
    alert("Se ha guardado el Pokimon");
    $.get("conexion.php?tipoConsulta=" + 1 + "&idDefinitivo=" + tdIdDato + "&nombreDefinitivo=" + tdNombreDato, function(datos) {
        $("#mensajeResultado").html(datos);
    });
}

function alaConsulta() {
    let divResultado = $("#tablaResultado");
    divResultado.text("");
    let enviarPHPCompleto1 = "conexion.php?tipoConsulta=" + 2;
    $.get(enviarPHPCompleto1, function(datos) {
        $("#tablaResultado").html(datos);
        let datosVueltas = $("#tablaResultado").text();
        if (datosVueltas == "No hay Registros guardado") {
            $("#tablaResultado").html("");
            errorMensaje()
        } else {
            $(".botonBorrar").on("click", function() {
                let code = $(this).data('code');
                let tdId = $('#numeroIdPokemonGuardado' + code);
                let numeroIdPokemonSelccionado = tdId.text();
                let enviarPHPCompleto2 = "conexion.php?tipoConsulta=" + 3 + "&idDefinitivo=" + numeroIdPokemonSelccionado;
                $.get(enviarPHPCompleto2, function(datos) {
                    $("#mensajeResultado").html(datos);
                    alaConsulta();
                });
            });
        }
    });
}
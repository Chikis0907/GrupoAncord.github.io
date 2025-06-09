// =============================================
// FUNCIONALIDAD DE NAVEGACIÓN ENTRE PÁGINAS
// =============================================

document.addEventListener("DOMContentLoaded", function () {
    // Mapeo de botones y sus páginas destino
    const botonesNavegacion = {
        "btn_aceptar_costoGenerales": "MAQUINADOS_11_resumenCostos.html"
    };

    // Configurar event listeners para navegación
    Object.entries(botonesNavegacion).forEach(([id, pagina]) => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener("click", () => window.location.href = pagina);
        }
    });
});

// Costos generales
document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos del DOM
    const txtCostoKg = document.getElementById('txt_costoKg');
    const txtCostoOperacion = document.getElementById('txt_costoTotal');
    const txtLogistica = document.getElementById('txt_logistica');
    const txtAdministracion = document.getElementById('txt_administracion');
    const txtUtilidad = document.getElementById('txt_utilidad');
    const txtIVA = document.getElementById('txt_IVA');
    const contenedorAcabados = document.getElementById("inputs-acabados");
    const txtCostoFinalsinIVA = document.getElementById('txt_costoFinalsinIVA');
    const txtCostoFinalconIVA = document.getElementById('txt_costoFinalconIVA');
    const btnLimpiar = document.getElementById('btn_limpiar_costoGenerales');

    function guardarValores() {
        if (txtLogistica && txtLogistica.value) {
            localStorage.setItem('logistica', txtLogistica.value);
        }
        if (txtAdministracion && txtAdministracion.value) {
            localStorage.setItem('administracion', txtAdministracion.value);
        }
    }

    // Event listeners para inputs
    txtLogistica?.addEventListener('input', function () {
        calcularCostosFinales();
        guardarValores();
    });

    txtAdministracion?.addEventListener('input', function () {
        calcularCostosFinales();
        guardarValores();
    });
    // Agregar event listeners a todos los inputs relevantes
    const inputsCalculo = [txtCostoKg, txtCostoOperacion, txtLogistica, txtAdministracion, txtUtilidad, txtIVA];
    inputsCalculo.forEach(input => {
        if (input) {
            input.addEventListener('input', calcularCostosFinales);
        }
    });

    // Event delegation para inputs dinámicos de acabados
    if (contenedorAcabados) {
        contenedorAcabados.addEventListener('input', function (e) {
            if (e.target && e.target.classList.contains('form-control')) {
                calcularCostosFinales();
            }
        });
    }

    // Función para cargar datos iniciales
    function cargarDatos() {
        // Cargar costo por kg desde localStorage
        const costoKg = localStorage.getItem('costoKg');
        if (costoKg && txtCostoKg) {
            txtCostoKg.value = parseFloat(costoKg).toFixed(2);
        }
        const costoOperacion = parseFloat(localStorage.getItem('costoOperacion')) || 0;

        // Asignar al campo correcto (txt_CostoTotalOperacion según tu HTML)
        const campoResumen = document.getElementById('txt_costoTotal');
        if (campoResumen) {
            campoResumen.value = costoOperacion.toFixed(4);
        }

        // Cargar acabados especiales
        const acabadosEspeciales = JSON.parse(localStorage.getItem('acabadosEspeciales')) || [];
        if (contenedorAcabados) {
            contenedorAcabados.innerHTML = '';
            acabadosEspeciales.forEach(nombre => {
                const div = document.createElement("div");
                div.className = "col-md-6 mb-3";
        
                const label = document.createElement("label");
                label.className = "form-label";
                label.textContent = nombre;
        
                // Crear el contenedor input-group
                const inputGroup = document.createElement("div");
                inputGroup.className = "input-group";
        
                // Crear el span con el símbolo $
                const span = document.createElement("span");
                span.className = "input-group-text";
                span.textContent = "$";
        
                // Crear el input
                const input = document.createElement("input");
                input.type = "number";
                input.className = "form-control";
                input.placeholder = "Ingrese el costo";
                input.id = "txt_" + nombre.replace(/\s+/g, '_');
                input.addEventListener('input', calcularCostosFinales);
        
                // Agregar el span y el input al input-group
                inputGroup.appendChild(span);
                inputGroup.appendChild(input);
        
                // Agregar el label y el input-group al div principal
                div.appendChild(label);
                div.appendChild(inputGroup);
        
                // Agregar el div al contenedor principal
                contenedorAcabados.appendChild(div);
            });
        }

        calcularCostosFinales();
    }

    // Función principal de cálculo
    function calcularCostosFinales() {
        // 1. Obtener todos los costos base
        const costoKg = parseFloat(txtCostoKg.value) || 0;
        const costoOperacion = parseFloat(txtCostoOperacion.value) || 0;
        const logistica = parseFloat(txtLogistica.value) || 0;
        const administracion = parseFloat(txtAdministracion.value) || 0;

        // 2. Sumar costos de acabados especiales
        let costosAcabados = 0;
        const acabadosParaTabla = [];


        if (contenedorAcabados) {
            const inputsAcabados = contenedorAcabados.querySelectorAll("input");
            const labelsAcabados = contenedorAcabados.querySelectorAll("label");

            inputsAcabados.forEach((input, index) => {
                const costo = parseFloat(input.value) || 0;
                costosAcabados += costo;

                // Guardar datos para la tabla
                if (labelsAcabados[index]) {
                    acabadosParaTabla.push({
                        nombre: labelsAcabados[index].textContent,
                        costo: costo
                    });
                }
            });

            // Guardar en localStorage para la tabla
            localStorage.setItem('costosAcabados', JSON.stringify(acabadosParaTabla));
        }

        // 3. Obtener porcentajes (utilidad e IVA son porcentajes)
        const porcentajeUtilidad = parseFloat(txtUtilidad.value) || 0;
        const porcentajeIVA = parseFloat(txtIVA.value) || 16;

        // 4. Calcular costo base (suma de todos los costos directos)
        const costoBase = costoKg + costoOperacion + logistica + administracion + costosAcabados;

        // 5. Aplicar utilidad (porcentaje)
        const costoConUtilidad = costoBase * (1 + porcentajeUtilidad / 100);

        // 6. Aplicar IVA (porcentaje sobre el costo con utilidad)
        const costoConIVA = costoConUtilidad * (1 + porcentajeIVA / 100);

        // 7. Mostrar resultados
        if (txtCostoFinalsinIVA) txtCostoFinalsinIVA.value = costoConUtilidad.toFixed(2);
        if (txtCostoFinalconIVA) txtCostoFinalconIVA.value = costoConIVA.toFixed(2);
        localStorage.setItem('costoTotalConIVA', costoConIVA.toFixed(2));
    }

    // Función para limpiar todos los campos
    function limpiarCampos() {
        // Limpiar inputs estáticos
        const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
        inputs.forEach(input => {
            if (input.id === 'txt_IVA') {
                input.value = '16';
            } else if (input.id !== 'txt_costoKg' && input.id !== 'txt_costoTotal') {
                input.value = '';
            }
        });

        // Limpiar inputs dinámicos de acabados
        if (contenedorAcabados) {
            const inputsAcabados = contenedorAcabados.querySelectorAll("input");
            inputsAcabados.forEach(input => {
                input.value = '';
            });
        }

        calcularCostosFinales();
    }

    // Configurar botón de limpiar
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarCampos);
    }

    // Inicializar
    cargarDatos();
});



// ========================================================
// RESUMEN COSTOS
// ========================================================

document.addEventListener("DOMContentLoaded", function () {
    // Función principal para recuperar todos los datos
    function recuperarDatosCompletos() {
        // 1. Recuperar y mostrar tipos de maquinado
        const listaMaquinados = document.getElementById("lista-maquinados");
        const maquinados = JSON.parse(localStorage.getItem("tiposmaquinados")) || [];

        if (listaMaquinados) {
            listaMaquinados.innerHTML = '';
            maquinados.forEach(nombre => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = nombre;
                listaMaquinados.appendChild(li);
            });
        }

        // 2. Recuperar tipo de material
        const tipo = localStorage.getItem("selectorTipoMaterial");
        const subtipo = localStorage.getItem("selectorSubtipoMaterial");
        if (tipo && subtipo) {
            const resultado = document.getElementById("txt_tipoMaterial");
            if (resultado) resultado.value = `${tipo} : ${subtipo}`;
        }

        // 3. Recuperar costos varios
        const costoKg = parseFloat(localStorage.getItem('costoKg')) || 0;
        setValue('txt_CostoKg', costoKg);


        const costoOperacion = parseFloat(localStorage.getItem('costoOperacion')) || 0;

        // Asignar al campo correcto (txt_CostoTotalOperacion según tu HTML)
        const campoResumen = document.getElementById('txt_CostoTotalOperacion');
        if (campoResumen) {
            campoResumen.value = costoOperacion.toFixed(4);
        }
        const costoGuardado = localStorage.getItem('costoTotalConIVA') || '0';

        // Asigna el valor al input
        const inputCostoTotal = document.getElementById('txt_costoTotalGral');
        if (inputCostoTotal) {
            inputCostoTotal.value = costoGuardado;
        }
        const txt_TiempoMaquinado = parseFloat(localStorage.getItem("txt_TiempoMaquinado")) || 0;
        setValue('txt_TiempoMaquinado', txt_TiempoMaquinado);

        const costoHerramientas = parseFloat(localStorage.getItem('costoHerramientas')) || 0;
        setValue('txt_CostoTotalHerramienta', costoHerramientas);

        const volumenesGuardados = JSON.parse(localStorage.getItem('volumenesFinales')) || {};
        const txtVolumenFinalElement = document.getElementById('txt_VolumenFinal');

        if (volumenesGuardados.volumenTotal && txtVolumenFinalElement) {
            // Asignamos directamente al value del input
            txtVolumenFinalElement.value = parseFloat(volumenesGuardados.volumenTotal).toFixed(3);

            // Si necesitas mostrar la unidad también
            if (volumenesGuardados.unidad) {
                txtVolumenFinalElement.value += ` ${volumenesGuardados.unidad}`;
            }
        }
        // 4. Recuperar logística y administración (CORREGIDO)
        const logistica = parseFloat(localStorage.getItem('logistica')) || 0;
        setValue('txt_logistica2', logistica);

        const administracion = parseFloat(localStorage.getItem('administracion')) || 0;
        setValue('txt_administracion2', administracion);

        // 5. Recuperar volumen y avance
        const volumenFinal = localStorage.getItem('volumenFinalGuardado');
        if (volumenFinal) {
            setTextContent('volumenFinalMostrado', volumenFinal);
        }

        const avanceGuardado = localStorage.getItem('txt_avance');
        const txtAvanceElement = document.getElementById('txt_avance');

        if (avanceGuardado && txtAvanceElement) {
            // Usamos .value en lugar de .textContent para inputs
            txtAvanceElement.value = avanceGuardado;

            // Opcional: Si también quieres mostrar las unidades
            const unidadAvanceGuardada = JSON.parse(localStorage.getItem('resultadosMaquinado'))?.unidadAvance;
            if (unidadAvanceGuardada) {
                txtAvanceElement.value += ` ${unidadAvanceGuardada}`;
            }
        }

        // 6. Mostrar tabla de acabados
        const costosAcabados = JSON.parse(localStorage.getItem('costosAcabados')) || [];
        const tablaCostos = document.getElementById('tabla-costos-acabados')?.querySelector('tbody');

        if (tablaCostos) {
            tablaCostos.innerHTML = '';
            costosAcabados.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.nombre}</td>
                    <td>$${item.costo.toFixed(2)}</td>
                `;
                tablaCostos.appendChild(tr);
            });
        }
    }

    // Función auxiliar para asignar valores a inputs
    function setValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.value = value.toFixed(3);
    }

    // Función auxiliar para asignar texto a elementos
    function setTextContent(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text;
    }

    // Función auxiliar para obtener valores de inputs
    function getValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.value : '0';
    }

    // Event listeners para los botones
    document.getElementById('btn_guardar_resumenCosto')?.addEventListener('click', function () {
        Swal.fire({
            title: 'Resumen guardado',
            text: 'Los datos del resumen se han almacenado',
            icon: 'success'
        });
    });

    document.getElementById('btn_Regresar_Menu')?.addEventListener('click', function () {
        window.location.href = 'index.html'; 
    });

    // Inicializar
    recuperarDatosCompletos();
});

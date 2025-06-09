// =============================================
// FUNCIONALIDAD DE NAVEGACIÓN ENTRE PÁGINAS
// =============================================

document.addEventListener("DOMContentLoaded", function () {
    // Mapeo de botones y sus páginas destino
    const botonesNavegacion = {
        "btn_aceptar_depreciacionMaquina": "MAQUINADOS_9_costoOperacion.html",
        "btn_aceptar_costoOperacion": "MAQUINADOS_10_costosGenerales.html",
        "btn_aceptar_costoGenerales": "MAQUINADOS_11_resumenCostos.html",
    };

    // Configurar event listeners para navegación
    Object.entries(botonesNavegacion).forEach(([id, pagina]) => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener("click", () => window.location.href = pagina);
        }
    });
});


// DEPRECIACION MAQUINARIA HORA - HOMBRE
// ========================================================

document.addEventListener("DOMContentLoaded", function () {
    // Variables locales solo para mostrar
    let wo = 0;

    // Página 1 – Calcular valorM y guardar
    function calcularvalorM() {
        const sueldoSemanal = parseFloat(document.getElementById('txt_sueldo').value) || 0;
        const porcentaje_wo = parseFloat(document.getElementById('txt_porcentajeTrabajador').value) || 0;
        const costoMaquinaria = parseFloat(document.getElementById('txt_costoMaquina').value) || 0;
        const porcentaje_mt = parseFloat(document.getElementById('txt_porcentajeMaquinaria').value) || 0;

        const horasPorSemana = 48;
        const minutosPorHora = 60;
        wo = sueldoSemanal / (horasPorSemana * minutosPorHora); // Pago por minuto

        const minutosEnUnAnio = 52 * 48 * 60;
        const mt = costoMaquinaria / minutosEnUnAnio; // Costo máquina por minuto

        const valorM = wo + (porcentaje_wo / 100) * wo + mt + (porcentaje_mt / 100) * mt;

        // Guardar sin redondear
        // Página 1 – Al guardar en localStorage
        localStorage.setItem("valorM", parseFloat(valorM.toFixed(3)));
        localStorage.setItem("mt", parseFloat(mt.toFixed(3)));

        console.log("mt guardado:", mt);
        console.log("valorM guardado:", valorM);

        // Mostrar con redondeo visual
        const campoSueldoMin = document.getElementById('txt_sueldoMinuto');
        if (campoSueldoMin) campoSueldoMin.value = wo.toFixed(3);

        const campoMaquinaMin = document.getElementById('txt_costoHoraHombre');
        if (campoMaquinaMin) campoMaquinaMin.value = mt.toFixed(3);

        const campoM = document.getElementById('txt_valorM');
        if (campoM) campoM.value = valorM.toFixed(3);
    }
    function redondear(num, decimales) {
        const factor = Math.pow(10, decimales);
        return Math.floor(num * factor) / factor;
    }
    // Función para limpiar todos los campos del formulario
    function limpiarFormularioDepreciacion() {
        // Campos de entrada
        document.getElementById("txt_sueldo").value = "";
        document.getElementById("txt_porcentajeTrabajador").value = "";
        document.getElementById("txt_costoMaquina").value = "";
        document.getElementById("txt_porcentajeMaquinaria").value = "";

        // Campos de resultados
        document.getElementById("txt_sueldoMinuto").value = "";
        document.getElementById("txt_costoHoraHombre").value = "";
        document.getElementById("txt_valorM").value = "";
    }

    // Asignar la función al botón limpiar
    document.getElementById("btn_limpiar_depreciacionMaquina")?.addEventListener("click", limpiarFormularioDepreciacion);

    // Costos Operación

    function calcularCostosOperacion() {
        const valorM = parseFloat(localStorage.getItem("valorM")) || 0;
        const mt = parseFloat(localStorage.getItem("mt")) || 0;  //tiempo de maquinado, de volumen 
        const tiempoOcio = parseFloat(document.getElementById('txt_tiempoOcio').value) || 0;
        const tiempoCambio = parseFloat(document.getElementById('txt_tiempoCambio').value) || 0;
        const numeroPzs = parseFloat(document.getElementById('txt_numeroPzs').value) || 0;
        const numeroHerramientas = parseFloat(document.getElementById('txt_numeroHerramientas').value) || 0;
        const costoHerramientas = parseFloat(document.getElementById('txt_costoHerramientas').value) || 0;
        const riesgo = parseFloat(document.getElementById('txt_riesgo').value) || 0;
        const costoTotal = ((valorM * ((numeroPzs * tiempoOcio) + (numeroPzs * mt) + (numeroHerramientas * tiempoCambio))) + (numeroHerramientas * costoHerramientas)) * (riesgo / 100);

        localStorage.setItem('costoHerramientas', costoHerramientas.toFixed(3));


        const costoRedondeado = redondear(costoTotal, 4);

        // Guardar en el campo del formulario (si existe)
        const campoCostosOperacion = document.getElementById('txt_costoTotal_costoOperacion');
        if (campoCostosOperacion) {
            campoCostosOperacion.value = costoRedondeado;
        }

        // Guardar en localStorage (siempre)
        localStorage.setItem('costoOperacion', costoRedondeado);

    }

    // Listeners para actualizar los valores al cambiar inputs
    const camposMetodo1 = ['txt_sueldo', 'txt_porcentajeTrabajador', 'txt_costoMaquina', 'txt_porcentajeMaquinaria'];
    camposMetodo1.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function () {
                calcularvalorM();
                calcularCostosOperacion();
            });
        }
    });

    const camposMetodo2 = ['txt_tiempoOcio', 'txt_tiempoCambio',
        'txt_numeroPzs', 'txt_numeroHerramientas', 'txt_costoHerramientas', 'txt_riesgo'];
    camposMetodo2.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calcularCostosOperacion);
        }
    });
    function limpiarCampos() {
        // Lista de IDs de campos a limpiar (excluyendo los que muestran valores calculados o de localStorage)
        const camposALimpiar = [
            'txt_sueldo', 'txt_porcentajeTrabajador', 'txt_costoMaquina', 'txt_porcentajeMaquinaria',
            'txt_tiempoOcio', 'txt_tiempoCambio', 'txt_numeroPzs', 'txt_numeroHerramientas',
            'txt_costoHerramientas', 'txt_riesgo'
        ];

        camposALimpiar.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                campo.value = ''; // Limpiar el campo
            }
        });

        // Volver a calcular para actualizar los campos que dependen de los valores limpiados
        calcularvalorM();
        calcularCostosOperacion();
    }

    // Asignar la función al botón de limpiar
    const btnLimpiar = document.getElementById('btn_limpiar_costoOperacion');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarCampos);
    }

    // Cálculo inicial
    calcularvalorM();
    calcularCostosOperacion();


});



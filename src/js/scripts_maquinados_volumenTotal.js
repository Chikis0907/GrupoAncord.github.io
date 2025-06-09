document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const txtAvance = document.getElementById('txt_avance');
    const unidadAvance = document.getElementById('unidad_avance');
    const txtVelocidadCorte = document.getElementById('txt_velocidadCorte');
    const unidadVelocidad = document.getElementById('unidad_velocidad');
    const txtTiempoMaquinado = document.getElementById('txt_tiempoMaquinado');
    const mostrarVolumenInicial = document.getElementById('mostrar_volumenInicial');
    const mostrarVolumenFinal = document.getElementById('mostrar_volumenFinal');
    const mostrarDiferencia = document.getElementById('mostrar_diferencia');
    const unidadVolumen = document.getElementById('unidad_volumen');
    const btnAceptar = document.getElementById('btn_aceptar_tiempoMaquina');
    const btnLimpiar = document.getElementById('btn_limpiar_tiempoMaquinado');

    // Factores de conversión
    const factoresVolumen = {
       '1e-9': 1,           // mm³ (factor 1, sin conversión)
    '1e-6': 1e-3,        // cm³ (1 cm³ = 1000 mm³)
    '0.001': 1e-6,       // dm³ (1 dm³ = 1,000,000 mm³)
    '1': 1e-9,           // m³ (1 m³ = 1,000,000,000 mm³)
    '1.6387064e-5': 1/16387.064, // in³ (1 in³ = 16387.064 mm³)
    '0.028316846592': 1/28316846.592, // ft³ (1 ft³ = 28316846.592 mm³)
    '0.764554857984': 1/764554857.984, // yd³ (1 yd³ = 764554857.984 mm³)
    '1e-3': 1e-3,        // ml (1 ml = 1 cm³ = 1000 mm³)
    '0.001': 1e-6        // l (1 l = 1 dm³ = 1,000,000 mm³)
    };

    // Cargar datos iniciales
    cargarDatosVolumenes();

    // Event listeners para cálculos en tiempo real
    txtAvance.addEventListener('input', calcularTiempoMaquinado);
    txtVelocidadCorte.addEventListener('input', calcularTiempoMaquinado);
    unidadAvance.addEventListener('change', calcularTiempoMaquinado);
    unidadVelocidad.addEventListener('change', calcularTiempoMaquinado);
    unidadVolumen.addEventListener('change', actualizarUnidadesVolumen);
    
    // Evento para el botón limpiar
    btnLimpiar.addEventListener('click', limpiarFormulario);

    // Evento para el botón aceptar
    btnAceptar.addEventListener('click', function() {
        if (validarDatos()) {
            guardarResultados();
            window.location.href = 'MAQUINADOS_8_depreciacionMaquinaria.html';
        }
    });

    // Función para cargar datos de volúmenes desde localStorage
    function cargarDatosVolumenes() {
        const volumenInicial = parseFloat(localStorage.getItem('volumenInicial')) || 0;
        
        // Obtener los volúmenes finales del localStorage
        let volumenFinal = 0;
        const volumenesFinalesData = localStorage.getItem('volumenesFinales');
        if (volumenesFinalesData) {
            try {
                const parsedData = JSON.parse(volumenesFinalesData);
                // Asegurarnos de que estamos accediendo al volumenTotal correctamente
                volumenFinal = parseFloat(parsedData.volumenTotal) || 0;

                // Guardar el volumen final acumulado por si se necesita después
                localStorage.setItem('volumenFinalAcumulado', volumenFinal.toString());
            } catch (e) {
                console.error('Error al parsear volúmenes finales:', e);
            }
        }
        
        // Para depuración - muestra los valores obtenidos

        // Mostrar valores iniciales
        actualizarUnidadesVolumen();
    }

    // Función para convertir y mostrar los volúmenes
    function actualizarUnidadesVolumen() {
        const factorConversion = factoresVolumen[unidadVolumen.value] || 1;
        
        // Obtener valores en mm³ (que es como están almacenados)
        const volumenInicial = parseFloat(localStorage.getItem('volumenInicial')) || 0;
        
        let volumenFinal = 0;
        const volumenesFinalesData = localStorage.getItem('volumenesFinales');
        if (volumenesFinalesData) {
            try {
                const parsedData = JSON.parse(volumenesFinalesData);
                volumenFinal = parseFloat(parsedData.volumenTotal) || 0;
            } catch (e) {
                console.error('Error al parsear volúmenes finales:', e);
            }
        }
        
        const diferencia = volumenInicial - volumenFinal;
    
        // Aplicar el factor de conversión (de mm³ a la unidad seleccionada)
        mostrarVolumenInicial.value = (volumenInicial * factorConversion).toFixed(3);
        mostrarVolumenFinal.value = (volumenFinal * factorConversion).toFixed(3);
        mostrarDiferencia.value = (diferencia * factorConversion).toFixed(3);
    
        // Recalcular tiempo cuando cambian las unidades
        calcularTiempoMaquinado();
    }


    // Función para calcular el tiempo de maquinado
    function calcularTiempoMaquinado() {
        const avance = parseFloat(txtAvance.value);
        const velocidad = parseFloat(txtVelocidadCorte.value);
        const diferencia = parseFloat(mostrarDiferencia.value);
        
        if (isNaN(avance) || isNaN(velocidad) || isNaN(diferencia) || diferencia <= 0) {
            txtTiempoMaquinado.value = '';
            return;
        }

        // Convertir avance a mm/min según la unidad seleccionada
        let avanceMmMin;
        switch(unidadAvance.value) {
            case 'mm_rev':
                // Para convertir mm/rev a mm/min necesitamos RPM, pero no tenemos
                // Asumimos que el usuario ya ingresó el valor correcto en mm/min
                avanceMmMin = avance;
                break;
            case 'mm_min':
                avanceMmMin = avance;
                break;
            case 'in_rev':
                avanceMmMin = avance * 25.4; // Convertir pulg/rev a mm/rev
                break;
            case 'in_min':
                avanceMmMin = avance * 25.4; // Convertir pulg/min a mm/min
                break;
        }

        // Convertir velocidad a mm/min
        let velocidadMmMin;
        switch(unidadVelocidad.value) {
            case 'm_min':
                velocidadMmMin = velocidad * 1000; // m/min a mm/min
                break;
            case 'mm_min':
                velocidadMmMin = velocidad;
                break;
            case 'ft_min':
                velocidadMmMin = velocidad * 304.8; // pies/min a mm/min
                break;
            case 'in_min':
                velocidadMmMin = velocidad * 25.4; // pulg/min a mm/min
                break;
        }

        // Calcular tiempo de maquinado (min)
        // Tiempo = Volumen removido (mm³) / (Avance (mm/min) * Velocidad (mm/min))
        const tiempo = diferencia / (avanceMmMin * velocidadMmMin);
        
        txtTiempoMaquinado.value = tiempo.toFixed(4);
    }

    // Función para validar los datos antes de continuar
    function validarDatos() {
        if (!txtAvance.value || !txtVelocidadCorte.value || !txtTiempoMaquinado.value) {
            Swal.fire({
                icon: 'error',
                title: 'Datos incompletos',
                text: 'Por favor complete todos los campos requeridos',
                confirmButtonColor: '#3085d6',
            });
            return false;
        }
        
        const diferencia = parseFloat(mostrarDiferencia.value);
        if (diferencia <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Volumen inválido',
                text: 'El volumen final debe ser menor que el volumen inicial',
                confirmButtonColor: '#3085d6',
            });
            return false;
        }
        
        return true;
    }

    // Función para guardar resultados en localStorage
    function guardarResultados() {
        const avanceValue = txtAvance.value;
    
        const resultados = {
            avance: avanceValue,
            unidadAvance: unidadAvance.options[unidadAvance.selectedIndex].text,
            velocidadCorte: txtVelocidadCorte.value,
            unidadVelocidad: unidadVelocidad.options[unidadVelocidad.selectedIndex].text,
            tiempoMaquinado: txtTiempoMaquinado.value,
            volumenInicial: mostrarVolumenInicial.value,
            volumenFinal: mostrarVolumenFinal.value,
            diferenciaVolumen: mostrarDiferencia.value,
            unidadVolumen: unidadVolumen.options[unidadVolumen.selectedIndex].text
        };
        
        // Guardar el objeto completo de resultados
        localStorage.setItem('resultadosMaquinado', JSON.stringify(resultados));
        
        // Guardar el tiempo de maquinado individualmente
        localStorage.setItem('txt_TiempoMaquinado', txtTiempoMaquinado.value);
        
        // Guardar el avance individualmente (CORRECCIÓN: usando avanceValue en lugar de avance)
        localStorage.setItem('txt_avance', avanceValue);
    }

    // Función para limpiar el formulario
    function limpiarFormulario() {
        txtAvance.value = '';
        txtVelocidadCorte.value = '';
        txtTiempoMaquinado.value = '';
        unidadAvance.selectedIndex = 1; // mm/min
        unidadVelocidad.selectedIndex = 1; // mm/min
        
    }
});
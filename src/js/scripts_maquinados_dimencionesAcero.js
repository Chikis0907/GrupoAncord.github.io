
document.addEventListener("DOMContentLoaded", function() {
    // Mapeo de botones y sus páginas destino
 const botonesNavegacion = {
        "btn_aceptar_dimencionAcero": "MAQUINADOS_5_volumenInicial.html",
        // "btn_aceptar_dimencionAcero": "MAQUINADOS_10_costosGenerales.html",
        //  "btn_aceptar_dimencionAcero": "MAQUINADOS_11_resumenCostos.html",
    };

    // Configurar event listeners para navegación
    Object.entries(botonesNavegacion).forEach(([id, pagina]) => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener("click", () => window.location.href = pagina);
        }
    });
});

// =============================================
// CALCULADORA DE DIMENSIONES DE ACERO
// =============================================
document.addEventListener("DOMContentLoaded", function () {
    // =============================================
    // CONFIGURACIONES Y CONSTANTES
    // =============================================
    const CONFIG = {
        imagenes: {
            1: '../img/hexagono.png',
            2: '../img/redondo.png',
            3: '../img/tubo_redondo.png',
            4: '../img/cuadrado.png',
            5: '../img/tubo_cuadrado.png',
            6: '../img/perfil_t.png',
            7: '../img/perfil_doble_t.png',
            8: '../img/perfil_u.png',
            9: '../img/angulo.png',
            10: '../img/pletina.png',
            11: '../img/chapa.png'
        },
        densidades: {
            'acero': 7.85,
            'aluminio': 2.73,
            'laton': 8.55,
            'cobre': 8.93,
            'bronce': 8.88,
            'zinc': 7.2,
            'chromo': 7.1,
            'dirigir': 11.37,
            'hierro': 7.86,
            'oro': 19.36,
            'magnesio': 1.7,
            'niquel': 8.85,
            'titanio': 4.5,
            'estano': 7.26,
            'teflon': 2.2,
            'plata': 10.5,
            'platino': 21.45,
            'inox_304_310': 7.92,
            'inox_316_321': 7.94,
            'inox_410_430': 7.71,
            'circonio': 6.51,
            'molibdeno': 10.28
        },
        camposPorFigura: {
            1: { // HEXÁGONO
                longitud: ['ancho B', 'longitud', 'cantidad'],
                peso: ['ancho B', 'peso', 'cantidad']
            },
            2: { // REDONDO
                longitud: ['diametro D', 'longitud', 'cantidad'],
                peso: ['diametro D', 'peso', 'cantidad']
            },
            3: { // TUBO REDONDO
                longitud: ['diametro D', 'espesor T', 'longitud', 'cantidad'],
                peso: ['diametro D', 'espesor T', 'peso', 'cantidad']
            },
            4: { // CUADRADO
                longitud: ['alto A', 'longitud', 'cantidad'],
                peso: ['alto A', 'peso', 'cantidad']
            },
            5: { // TUBO CUADRADO
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            },
            6: { // PERFIL T
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            },
            7: { // PERFIL DOBLE T
                longitud: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'peso', 'cantidad']
            },
            8: { // PERFIL U
                longitud: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'espesor S', 'peso', 'cantidad']
            },
            9: { // ANGULO
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            },
            10: { // PLETINA
                longitud: ['alto A', 'ancho B', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'peso', 'cantidad']
            },
            11: { // CHAPA
                longitud: ['alto A', 'ancho B', 'espesor T', 'longitud', 'cantidad'],
                peso: ['alto A', 'ancho B', 'espesor T', 'peso', 'cantidad']
            }
        },
        conversionUnidades: {
            '1': val => val,       // mm
            '2': val => val * 10,   // cm
            '3': val => val * 25.4,  // in
            '4': val => val * 304.8,  // ft
            '5': val => val * 1000,    // m
            '6': val => val * 914.4    // yd
        }
    };

    // =============================================
    // ELEMENTOS DEL DOM
    // =============================================
    const elementos = {
        selecFigura: document.getElementById('selec_figura'),
        imgFigura: document.getElementById('img_figura'),
        btnLimpiar: document.getElementById('btn_limpiar_dimencionAcero'),
        inputs: {
            diametro: document.getElementById('number_diametro'),
            alto: document.getElementById('number_alto'),
            ancho: document.getElementById('number_ancho'),
            espesorT: document.getElementById('number_espesorT'),
            espesorS: document.getElementById('number_espesorS'),
            longitud: document.getElementById('number_longitud'),
            peso: document.getElementById('number_peso'),
            cantidad: document.getElementById('number_cantidad'),
            precio: document.getElementById('number_precio')
        },
        botonesModo: {
            longitud: document.getElementById('btn_por_longitud'),
            peso: document.getElementById('btn_por_peso')
        },
        densidadMaterial: document.getElementById('densidad_material'),
        selecMaterial: document.getElementById('selec_material'),
        resultados: {
            longitud: document.getElementById('resultados_longitud'),
            peso: document.getElementById('resultados_peso')
        }
    };

    // =============================================
    // ESTADO DE LA APLICACIÓN
    // =============================================
    let estado = {
        modoCalculo: 'longitud',
        figuraActual: '1',
        materialActual: 'acero'
    };

    // =============================================
    // FUNCIONES UTILITARIAS
    // =============================================
    const getValorInput = (input, conUnidad = false) => {
        const valor = parseFloat(input.value) || 0;
        if (!conUnidad) return valor;
    
        const unidad = document.querySelector(`#${input.id} + select`)?.value || '1';
        return CONFIG.conversionUnidades[unidad](valor); // Asegurar que esto convierta a mm
    };

    const mostrarElementos = (elementosMostrar) => {
        // Ocultar todos los campos dinámicos primero
        document.querySelectorAll('.input-dinamico').forEach(el => {
            el.style.display = 'none';
            el.querySelector('input').required = false;
        });

        // Mostrar solo los campos necesarios y marcarlos como requeridos
        elementosMostrar.forEach(campo => {
            const elemento = document.querySelector(`[data-campo="${campo}"]`);
            if (elemento) {
                elemento.style.display = 'block';
                elemento.querySelector('input').required = true;
            }
        });

        // Mostrar siempre el campo de cantidad
        document.querySelector('[data-campo="cantidad"]').style.display = 'block';
    };

    const limpiarCamposDinamicos = () => {
        document.querySelectorAll('.input-dinamico input').forEach(input => {
            input.value = '';
        });
        document.getElementById('resultado_peso').value = '';
        document.getElementById('resultado_peso_total').value = '';
        document.getElementById('resultado_precio_total').value = '';
    };
    
    // =============================================
    // FUNCIONES PRINCIPALES
    // =============================================
    const cambiarModoCalculo = (nuevoModo) => {
        if (estado.modoCalculo !== nuevoModo) {
            estado.modoCalculo = nuevoModo;
            limpiarCamposDinamicos();
            actualizarInterfaz();
        }
    };
    const cambiarFigura = (nuevaFigura) => {
        estado.figuraActual = nuevaFigura;
        elementos.imgFigura.src = CONFIG.imagenes[nuevaFigura];
        limpiarCamposDinamicos();
        actualizarInterfaz();
    };

    elementos.botonesModo.longitud.addEventListener('click', () => cambiarModoCalculo('longitud'));
    elementos.botonesModo.peso.addEventListener('click', () => cambiarModoCalculo('peso'));
    elementos.selecFigura.addEventListener('change', (e) => cambiarFigura(e.target.value));



    const actualizarInterfaz = () => {
        // Actualizar campos visibles
        const campos = CONFIG.camposPorFigura[estado.figuraActual][estado.modoCalculo];
        mostrarElementos(campos);

        elementos.resultados.longitud.style.display = estado.modoCalculo === 'longitud' ? 'block' : 'none';
        elementos.resultados.peso.style.display = estado.modoCalculo === 'peso' ? 'block' : 'none';

        // Actualizar visibilidad de precio (solo visible en modo longitud)
        document.getElementById('precio-kg-container').style.display =
            estado.modoCalculo === 'longitud' ? 'block' : 'none';

        // Actualizar clases activas de los botones
        elementos.botonesModo.longitud.classList.toggle('active', estado.modoCalculo === 'longitud');
        elementos.botonesModo.peso.classList.toggle('active', estado.modoCalculo === 'peso');
    };

    const calcularPorLongitud = (valores, densidad) => {
        const { altoA, anchoB, diametro, espesorT, espesorS, longitud, cantidad, precioKg } = valores;
        let pesoUnitario = 0;

        switch (estado.figuraActual) {
            case '1': // HEXÁGONO
            const ladoHexagono = anchoB / Math.sqrt(3); // B = s × √3 → s = B/√3
            const areaHexagono_mm2 = (3 * Math.sqrt(3) / 2) * Math.pow(ladoHexagono, 2);
            const longitud_mm = longitud; // Ya está en mm por la conversión de unidades
            const volumen_mm3 = areaHexagono_mm2 * longitud_mm;
            pesoUnitario = (volumen_mm3 / 1000) * (densidad / 1000);
            break;
            case '2': // REDONDO
                pesoUnitario = (Math.PI * (diametro ** 2) / 4 * longitud * densidad) / 1000000;
                break;
            case '3': // TUBO REDONDO
                const diametroInterior = diametro - 2 * espesorT;
                pesoUnitario = (Math.PI * (diametro ** 2 - diametroInterior ** 2) / 4 * longitud * densidad) / 1000000;
                break;
            case '4': // CUADRADO
                pesoUnitario = (altoA * altoA * longitud * densidad) / 1000000;
                break;
            case '5': // TUBO CUADRADO
                const areaExterior = altoA * anchoB;
                const areaInterior = (altoA - 2 * espesorT) * (anchoB - 2 * espesorT);
                pesoUnitario = ((areaExterior - areaInterior) * longitud * densidad) / 1000000;
                break;
            case '6': // PERFIL T
            case '9': // ANGULO
                pesoUnitario = ((altoA * espesorT) + ((anchoB - espesorT) * espesorT)) * longitud * densidad / 1000000;
                break;
            case '7': // PERFIL DOBLE T
                pesoUnitario = ((anchoB * espesorS * 2) + ((altoA - 2 * espesorS) * espesorT)) * longitud * densidad / 1000000;
                break;
            case '8': // PERFIL U
            pesoUnitario = ((anchoB * espesorS * 2) + (altoA - 2 * espesorS) * espesorT) * longitud * densidad / 1000000;
                break;
            case '10': // PLETINA
                pesoUnitario = (altoA * anchoB * longitud * densidad) / 1000000;
                break;
            case '11': // CHAPA
                pesoUnitario = (altoA * anchoB * espesorT * densidad) / 1000;
                break;
        }

        const pesoTotal = pesoUnitario * cantidad;
    const precioTotal = pesoTotal * precioKg;
    const pesoLibras = pesoUnitario * 2.20462;
    const pesoTotalLibras = pesoTotal * 2.20462;

    document.getElementById('resultado_peso').value = `${pesoUnitario.toFixed(2)} kg / ${pesoLibras.toFixed(2)} lb`;
    document.getElementById('resultado_peso_total').value = `${pesoTotal.toFixed(2)} kg / ${pesoTotalLibras.toFixed(2)} lb`;
    document.getElementById('resultado_precio_total').value = precioKg ? `$${precioTotal.toFixed(2)}` : '';
    localStorage.setItem('costoKg', parseFloat(precioTotal).toFixed(2));

};

    const calcularPorPeso = (valores, densidad) => {
        const { altoA, anchoB, diametro, espesorT, espesorS, peso, cantidad } = valores;
        let longitud = 0;

        switch (estado.figuraActual) {
            case '1': // HEXÁGONO
            const ladoHexagono = anchoB / Math.sqrt(3); // B = s × √3 → s = B/√3
            const areaHexagono_mm2 = (3 * Math.sqrt(3) / 2) * Math.pow(ladoHexagono, 2);
            longitud = (peso * 1000000) / (areaHexagono_mm2 * densidad);
            break;
            case '2': // REDONDO
                longitud = (peso * 1000000) / (Math.PI * (diametro ** 2) / 4 * densidad);
                break;
            case '3': // TUBO REDONDO
                const diametroInterior = diametro - 2 * espesorT;
                longitud = (peso * 1000000) / (Math.PI * (diametro ** 2 - diametroInterior ** 2) / 4 * densidad);
                break;
            case '4': // CUADRADO
                longitud = (peso * 1000000) / (altoA * altoA * densidad);
                break;
            case '5': // TUBO CUADRADO
                const areaExterior = altoA * anchoB;
                const areaInterior = (altoA - 2 * espesorT) * (anchoB - 2 * espesorT);
                longitud = (peso * 1000000) / ((areaExterior - areaInterior) * densidad);
                break;
            case '6': // PERFIL T
            case '9': // ANGULO
                longitud = (peso * 1000000) / (((altoA * espesorT) + ((anchoB - espesorT) * espesorT)) * densidad);
                break;
            case '7': // PERFIL DOBLE T
                longitud = (peso * 1000000) / (((anchoB * espesorS * 2) + ((altoA - 2 * espesorS) * espesorT)) * densidad);
                break;
            case '8': // PERFIL U
                longitud = (peso * 1000000) / (((anchoB * espesorS * 2) + ((altoA - 2 * espesorS) * espesorT)) * densidad);
                break;
            case '10': // PLETINA
                longitud = (peso * 1000000) / (altoA * anchoB * densidad);
                break;
            case '11': // CHAPA
                longitud = (peso * 1000) / (altoA * anchoB * espesorT * densidad);
                break;
        }

      // Convertir de mm a metros
      const longitud_m = longitud / 1000;
      const longitud_ft = longitud_m * 3.28084;
      const longitud_yd = longitud_m * 1.09361;
      
      const longitudTotal_m = longitud_m * cantidad;
      const longitudTotal_ft = longitud_ft * cantidad;
      const longitudTotal_yd = longitud_yd * cantidad;
  
      // Actualizar resultados
      document.getElementById('resultado_longitud').value = 
          `${longitud_m.toFixed(2)} m / ${longitud_ft.toFixed(2)} ft / ${longitud_yd.toFixed(2)} yd`;
      document.getElementById('resultado_longitud_total').value = 
          `${longitudTotal_m.toFixed(2)} m / ${longitudTotal_ft.toFixed(2)} ft / ${longitudTotal_yd.toFixed(2)} yd`;
  };

    const calcularResultados = () => {
        const valores = {
            altoA: getValorInput(elementos.inputs.alto, true),
            anchoB: getValorInput(elementos.inputs.ancho, true),
            diametro: getValorInput(elementos.inputs.diametro, true),
            espesorT: getValorInput(elementos.inputs.espesorT, true),
            espesorS: getValorInput(elementos.inputs.espesorS, true),
            longitud: getValorInput(elementos.inputs.longitud, true),
            peso: getValorInput(elementos.inputs.peso),
            cantidad: getValorInput(elementos.inputs.cantidad),
            precioKg: getValorInput(elementos.inputs.precio)
        };

        const densidad = parseFloat(elementos.densidadMaterial.value) || 0;

        if (estado.modoCalculo === 'longitud') {
            calcularPorLongitud(valores, densidad);
        } else {
            calcularPorPeso(valores, densidad);
        }
    };

    const limpiarFormulario = () => {
        // Limpiar inputs
        Object.values(elementos.inputs).forEach(input => {
            if (input) input.value = input.id === 'number_cantidad' ? '1' : '';
        });

        // Restablecer estado inicial
        estado = {
            modoCalculo: 'longitud',
            figuraActual: '1',
            materialActual: 'acero'
        };

        // Actualizar interfaz
        elementos.selecFigura.value = '1';
        elementos.imgFigura.src = CONFIG.imagenes['1'];
        elementos.selecMaterial.value = 'acero';
        elementos.densidadMaterial.value = CONFIG.densidades['acero'];
        elementos.botonesModo.longitud.classList.add('active');
        elementos.botonesModo.peso.classList.remove('active');

        // Limpiar resultados
        document.querySelectorAll('#resultados_longitud input, #resultados_peso input').forEach(input => {
            input.value = '';
        });

        actualizarInterfaz();

    };

    // =============================================
    // EVENT LISTENERS
    // =============================================
    elementos.selecFigura.addEventListener('change', function () {
        estado.figuraActual = this.value;
        elementos.imgFigura.src = CONFIG.imagenes[this.value] || '';
        actualizarInterfaz();
        calcularResultados();
    });

    elementos.selecMaterial.addEventListener('change', function () {
        estado.materialActual = this.value;
        elementos.densidadMaterial.value = CONFIG.densidades[this.value] || '0';
        calcularResultados();
    });

    elementos.botonesModo.longitud.addEventListener('click', () => {
        estado.modoCalculo = 'longitud';
        elementos.botonesModo.longitud.classList.add('active');
        elementos.botonesModo.peso.classList.remove('active');
        actualizarInterfaz();
        calcularResultados();
    });

    elementos.botonesModo.peso.addEventListener('click', () => {
        estado.modoCalculo = 'peso';
        elementos.botonesModo.peso.classList.add('active');
        elementos.botonesModo.longitud.classList.remove('active');
        actualizarInterfaz();
        calcularResultados();
    });

    // Eventos para inputs (cálculos en tiempo real)
    document.querySelectorAll('#campos_dimensiones input, #campos_dimensiones select').forEach(input => {
        input.addEventListener('input', calcularResultados);
    });


    elementos.btnLimpiar.addEventListener('click', limpiarFormulario);

    // =============================================
    // INICIALIZACIÓN
    // =============================================

    elementos.densidadMaterial.value = CONFIG.densidades['acero'];
    actualizarInterfaz();
    calcularResultados(); // Calcular resultados iniciales
});
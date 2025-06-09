document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const selecFigura = document.getElementById('selec_figura');
    const imgFigura = document.getElementById('img_figura');
    const dimensionesContainer = document.getElementById('dimensiones-container');
    const txtVolumenI = document.getElementById('txt_volumenI');
    const unidadVolumen = document.getElementById('unidad_volumen');
    const checkOtroVolumen = document.getElementById('check_otroVolumen');
    const btnAceptar = document.getElementById('btn_aceptar_volumenFinal');
    const btnLimpiar = document.getElementById('btn_limpiar_VolFInal');
    
    let figuraActual = '';
    let volumenesCalculados = [];
    let contadorVolumenes = 0;
    
    // Configuración de imágenes para cada figura
    const imagenes = {
        cubo: '../img/cubo.png',
        prisma_rectangular: '../img/prisma_rectangular.png',
        esfera: '../img/esfera.png',
        hemisferio: '../img/hemisferio.png',
        casquete_esferico: '../img/casquete_esferico.png',
        elipsoide: '../img/elipsoide.png',
        cilindro: '../img/cilindro.png',
        cilindro_hueco: '../img/cilindro_hueco.png',
        capsula: '../img/capsula.png',
        cono: '../img/cono.png',
        tronco_conico: '../img/tronco_conico.png',
        piramide: '../img/piramide.png',
        piramide_truncada: '../img/piramide_truncada.png',
        prisma_triangular: '../img/base_altura.png'
    };
    
    const imagenesTriangulo = {
        base_altura: '../img/base_altura.png',
        tres_lados: '../img/tres_lados.png',
        dos_lados_angulo: '../img/dos_lado_un_angulo.png',
        lado_dos_angulos: '../img/dos_angulos_un_lado.png'
    };
    
    // Configuración de unidades
    const unidades = {
        longitud: [
            { value: 0.001, text: 'milímetros (mm)', selected: true },
            { value: 0.01, text: 'centímetros (cm)' },
            { value: 1, text: 'metros (m)' },
            { value: 0.0254, text: 'pulgadas (in)' },
            { value: 0.3048, text: 'pies (ft)' }
        ],
        angulo: [
            { value: 'deg', text: 'grados (º)', selected: true },
            { value: 'rad', text: 'radianes (rad)' },
            { value: 'gradian', text: 'grados centesimales (gon)' },
            { value: 'turn', text: 'revoluciones (rev)' }
        ]
    };
    
    // Fórmulas para calcular volúmenes
    const formulasVolumen = {
        cubo: (v) => Math.pow(v.lado, 3),
        prisma_rectangular: (v) => v.longitud * v.anchura * v.altura,
        esfera: (v) => (4 / 3) * Math.PI * Math.pow(v.radio, 3),
        hemisferio: (v) => (2 / 3) * Math.PI * Math.pow(v.radio, 3),
        casquete_esferico: (v) => (Math.PI * Math.pow(v.altura, 2) * (3 * v.radioEsfera - v.altura)) / 3,
        elipsoide: (v) => (4 / 3) * Math.PI * v.semiejeA * v.semiejeB * v.semiejeC,
        cilindro: (v) => Math.PI * Math.pow(v.radio, 2) * v.altura,
        cilindro_hueco: (v) => Math.PI * v.altura * (Math.pow(v.radioExterior, 2) - Math.pow(v.radioInterior, 2)),
        capsula: (v) => {
            const volumenEsfera = (4 / 3) * Math.PI * Math.pow(v.radio, 3);
            const volumenCilindro = Math.PI * Math.pow(v.radio, 2) * v.alturaCilindro;
            return volumenCilindro + volumenEsfera;
        },
        cono: (v) => (1 / 3) * Math.PI * Math.pow(v.radio, 2) * v.altura,
        tronco_conico: (v) => {
            const termino = Math.pow(v.radioSuperior, 2) + Math.pow(v.radioInferior, 2) + (v.radioSuperior * v.radioInferior);
            return (1 / 3) * Math.PI * v.altura * termino;
        },
        piramide: (v) => (1 / 3) * Math.pow(v.ladoBase, 2) * v.altura,
        piramide_truncada: (v) => {
            const termino = Math.pow(v.ladoBase, 2) + Math.pow(v.ladoSuperior, 2) + (v.ladoBase * v.ladoSuperior);
            return (1 / 3) * v.altura * termino;
        },
        prisma_triangular: (v) => {
            const metodo = document.getElementById('metodo_base')?.value;
            if (!metodo || !v.altura_prisma) return 0;

            switch (metodo) {
                case 'base_altura':
                    if (!v.base || !v.altura_base) return 0;
                    return 0.5 * v.base * v.altura_base * v.altura_prisma;
                case 'tres_lados':
                    if (!v.lado1 || !v.lado2 || !v.lado3) return 0;
                    const s = (v.lado1 + v.lado2 + v.lado3) / 2;
                    const area = Math.sqrt(s * (s - v.lado1) * (s - v.lado2) * (s - v.lado3));
                    return area * v.altura_prisma;
                case 'dos_lados_angulo':
                    if (!v.lado_a || !v.lado_b || !v.angulo || !v.unidad_angulo) return 0;
                    const rad = convertirAngulo(v.angulo, v.unidad_angulo);
                    return 0.5 * v.lado_a * v.lado_b * Math.sin(rad) * v.altura_prisma;
                case 'lado_dos_angulos':
                    if (!v.lado || !v.angulo1 || !v.angulo2 || !v.unidad_angulo) return 0;
                    const ang1 = convertirAngulo(v.angulo1, v.unidad_angulo);
                    const ang2 = convertirAngulo(v.angulo2, v.unidad_angulo);
                    const ang3 = Math.PI - ang1 - ang2;
                    const area2 = (Math.pow(v.lado, 2) * Math.sin(ang1) * Math.sin(ang2)) / (2 * Math.sin(ang3));
                    return area2 * v.altura_prisma;
                default:
                    return 0;
            }
        }
    };
    
    // Configuración de campos para cada figura
    const figurasConfig = {
        cubo: [
            { id: 'lado', label: 'Lado (a)', unidad: 'longitud' }
        ],
        prisma_rectangular: [
            { id: 'longitud', label: 'Longitud (l)', unidad: 'longitud' },
            { id: 'anchura', label: 'Anchura (w)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        esfera: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' }
        ],
        hemisferio: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' }
        ],
        casquete_esferico: [
            { id: 'radioBase', label: 'Radio de la base (a)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' },
            { id: 'radioEsfera', label: 'Radio de la esfera (r)', unidad: 'longitud' }
        ],
        elipsoide: [
            { id: 'semiejeA', label: 'Semieje a', unidad: 'longitud' },
            { id: 'semiejeB', label: 'Semieje b', unidad: 'longitud' },
            { id: 'semiejeC', label: 'Semieje c', unidad: 'longitud' }
        ],
        cilindro: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        cilindro_hueco: [
            { id: 'radioExterior', label: 'Radio exterior (R)', unidad: 'longitud' },
            { id: 'radioInterior', label: 'Radio interior (r)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        capsula: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' },
            { id: 'alturaCilindro', label: 'Altura (h)', unidad: 'longitud' }
        ],
        cono: [
            { id: 'radio', label: 'Radio (r)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        tronco_conico: [
            { id: 'radioSuperior', label: 'Radio superior (r)', unidad: 'longitud' },
            { id: 'radioInferior', label: 'Radio inferior (R)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        piramide: [
            { id: 'ladoBase', label: 'Lado de la base (a)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        piramide_truncada: [
            { id: 'ladoBase', label: 'Lado de la base (a)', unidad: 'longitud' },
            { id: 'ladoSuperior', label: 'Lado superior (b)', unidad: 'longitud' },
            { id: 'altura', label: 'Altura (h)', unidad: 'longitud' }
        ],
        prisma_triangular: [
            { id: 'altura_prisma', label: 'Altura (h)', unidad: 'longitud' }
        ]
    };
    
    // Evento al cambiar la figura seleccionada
    selecFigura.addEventListener('change', function() {
        figuraActual = this.value;
        dimensionesContainer.innerHTML = '';
        txtVolumenI.value = '';
        
        updateFiguraImage(figuraActual);
        
        if (!figuraActual) return;
        
        if (figuraActual === 'prisma_triangular') {
            agregarSelectorMetodoTriangular();
        } else if (figurasConfig[figuraActual]) {
            figurasConfig[figuraActual].forEach(campo => {
                crearCampo(campo.id, campo.label, campo.unidad);
            });
        }
    });
    
    // Función para actualizar la imagen de la figura
    function updateFiguraImage(figura) {
        if (!figura) {
            imgFigura.src = '../img/vidfig.gif';
            imgFigura.alt = 'Imagen por defecto';
            return;
        }
        
        if (figura === 'prisma_triangular') {
            const metodo = document.getElementById('metodo_base')?.value;
            imgFigura.src = imagenesTriangulo[metodo] || imagenesTriangulo.base_altura;
            imgFigura.alt = `Imagen de prisma triangular (${metodo || 'base_altura'})`;
        } else {
            imgFigura.src = imagenes[figura] || '../img/vidfig.gif';
            imgFigura.alt = `Imagen de ${figura}`;
        }
    }
    
    // Función para agregar selector de método para prisma triangular
    function agregarSelectorMetodoTriangular() {
        const metodoDiv = document.createElement('div');
        metodoDiv.className = 'col-md-12 mt-2';
        metodoDiv.innerHTML = `
            <label class="form-label">Método para calcular el área de la base</label>
            <select class="form-select" id="metodo_base">
                <option value="base_altura" selected>Base y altura</option>
                <option value="tres_lados">Tres lados (Herón)</option>
                <option value="dos_lados_angulo">Dos lados y un ángulo</option>
                <option value="lado_dos_angulos">Un lado y dos ángulos</option>
            </select>
        `;
        dimensionesContainer.appendChild(metodoDiv);
        
        // Crear campo de altura primero (siempre visible)
        crearCampo('altura_prisma', 'Altura (h)', 'longitud');
        
        const metodoSelect = metodoDiv.querySelector('select');
        metodoSelect.addEventListener('change', mostrarCamposTriangulo);
        mostrarCamposTriangulo();
    }
    
    // Función para mostrar campos según método seleccionado para prisma triangular
    function mostrarCamposTriangulo() {
        // Eliminar todos los campos excepto el selector de método y la altura
        while (dimensionesContainer.children.length > 2) {
            dimensionesContainer.removeChild(dimensionesContainer.lastChild);
        }
        
        const metodo = document.getElementById('metodo_base').value;
        
        // Actualizar la imagen cuando cambia el método
        updateFiguraImage('prisma_triangular');
        
        switch (metodo) {
            case 'base_altura':
                crearCampo('base', 'Base (b)', 'longitud');
                crearCampo('altura_base', 'Altura base (hb)', 'longitud');
                break;
            case 'tres_lados':
                crearCampo('lado1', 'Lado a', 'longitud');
                crearCampo('lado2', 'Lado b', 'longitud');
                crearCampo('lado3', 'Lado c', 'longitud');
                break;
            case 'dos_lados_angulo':
                crearCampo('lado_a', 'Lado a', 'longitud');
                crearCampo('lado_b', 'Lado b', 'longitud');
                crearCampo('angulo', 'Ángulo entre a y b (γ)', 'angulo');
                break;
            case 'lado_dos_angulos':
                crearCampo('lado', 'Lado conocido', 'longitud');
                crearCampo('angulo1', 'Ángulo 1 (β)', 'angulo');
                crearCampo('angulo2', 'Ángulo 2 (α)', 'angulo');
                break;
        }
    }
    
    // Función para crear campos de entrada dinámicos
    function crearCampo(id, label, unidad) {
        const div = document.createElement('div');
        div.className = 'col-md-6 mt-2';
        
        div.innerHTML = `
            <label class="form-label">${label}</label>
            <div class="input-group">
                <input type="number" class="form-control dimension-input" id="${figuraActual}_${id}" 
                    placeholder="Ingrese valor" step="any" min="0">
                <select class="form-select unidad-${unidad}">
                    ${unidades[unidad].map(u => 
                        `<option value="${u.value}" ${u.selected ? 'selected' : ''}>${u.text}</option>`
                    ).join('')}
                </select>
            </div>
        `;
        
        dimensionesContainer.appendChild(div);
        
        const input = div.querySelector('input');
        const select = div.querySelector('select');
        
        input.addEventListener('input', actualizarResultadoVolumen);
        select.addEventListener('change', actualizarResultadoVolumen);
    }
    
    // Función para convertir ángulos a radianes
    function convertirAngulo(valor, unidad) {
        const conversiones = {
            deg: (x) => x * Math.PI / 180,
            rad: (x) => x,
            gradian: (x) => x * Math.PI / 200,
            turn: (x) => x * 2 * Math.PI
        };
        return conversiones[unidad]?.(valor) ?? valor;
    }
    
    // Función para actualizar el resultado del volumen en tiempo real
    function actualizarResultadoVolumen() {
        if (!figuraActual) return;
        
        const inputs = dimensionesContainer.querySelectorAll('.dimension-input');
        const valores = {};
        let camposCompletos = true;
        
        inputs.forEach(input => {
            // Obtener el ID limpio del input
            let id = input.id;
            if (figuraActual === 'prisma_triangular') {
                id = id.replace('prisma_triangular_', '');
            } else {
                id = id.split('_').pop();
            }
            
            const valor = parseFloat(input.value);
            const unidadSelect = input.parentElement.querySelector('select');
            const factor = parseFloat(unidadSelect.value);
            const esAngulo = unidadSelect.classList.contains('unidad-angulo');
            
            if (isNaN(valor)) {
                camposCompletos = false;
                return;
            }
            
            // Guardar el valor convertido o directo si es ángulo
            if (esAngulo) {
                valores[id] = valor;
                valores.unidad_angulo = unidadSelect.value;
            } else {
                valores[id] = valor * factor;
            }
        });
        
        // Si falta algún campo, limpiar y salir
        if (!camposCompletos) {
            txtVolumenI.value = '';
            return;
        }
        
        // Aplicar la fórmula correspondiente
        let volumenMetrosCubicos = 0;
        if (formulasVolumen[figuraActual]) {
            volumenMetrosCubicos = formulasVolumen[figuraActual](valores);
        }
        
        // Mostrar el resultado si es válido
        if (volumenMetrosCubicos > 0) {
            const factorConversion = parseFloat(unidadVolumen.value);
            const volumenConvertido = volumenMetrosCubicos / factorConversion;
            txtVolumenI.value = volumenConvertido.toFixed(3);
        } else {
            txtVolumenI.value = '';
        }
    }
    
    // Evento al cambiar la unidad de volumen
    unidadVolumen.addEventListener('change', actualizarResultadoVolumen);
    
    // Evento para el botón limpiar
    btnLimpiar.addEventListener('click', function() {
        selecFigura.selectedIndex = 0;
        imgFigura.src = '../img/cilindro.jpeg';
        dimensionesContainer.innerHTML = '';
        txtVolumenI.value = '';
        volumenesCalculados = [];
        contadorVolumenes = 0;
        checkOtroVolumen.checked = false;
        figuraActual = '';
    });
    
    // Evento para el checkbox "Añadir otro volumen"
    checkOtroVolumen.addEventListener('change', function() {
        // Solo cambia el estado visual, la lógica se maneja en continuarConElProceso
        if (this.checked && txtVolumenI.value === '') {
            Swal.fire({
                icon: 'info',
                title: 'Atención',
                text: 'Complete los campos para poder agregar otro volumen',
                confirmButtonColor: '#3085d6',
            });
        }
    });
    
    // Función para agregar un volumen a la lista
    function agregarVolumen() {
        const figuraSeleccionada = selecFigura.options[selecFigura.selectedIndex].text;
        const volumen = parseFloat(txtVolumenI.value);
        const unidad = unidadVolumen.options[unidadVolumen.selectedIndex].text;
        
        if (isNaN(volumen)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay un volumen válido para agregar',
                confirmButtonColor: '#3085d6',
            });
            checkOtroVolumen.checked = false;
            return;
        }
        
        contadorVolumenes++;
        volumenesCalculados.push({
            id: contadorVolumenes,
            figura: figuraSeleccionada,
            volumen: parseFloat(volumen.toFixed(3)), // Redondear aquí también
            unidad: unidad
        });
        
        // Limpiar para nuevo cálculo
        selecFigura.selectedIndex = 0;
        imgFigura.src = '../img/cilindro.jpeg';
        dimensionesContainer.innerHTML = '';
        txtVolumenI.value = '';
        checkOtroVolumen.checked = false;
        
        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: 'Volumen agregado',
            text: `Se ha añadido el volumen ${volumen.toExponential(4)} ${unidad}`,
            confirmButtonColor: '#3085d6',
        });
    }
    
    // Evento para el botón aceptar
    btnAceptar.addEventListener('click', function() {
            continuarConElProceso();
    });
    
    // Función para continuar con el proceso
    function continuarConElProceso() {
       // Validar que haya un volumen válido
    if (txtVolumenI.value === '' || isNaN(parseFloat(txtVolumenI.value))) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese un volumen válido',
            confirmButtonColor: '#3085d6',
        });
        return;
    }

    const volumenActual = parseFloat(txtVolumenI.value);
    const unidadActual = unidadVolumen.options[unidadVolumen.selectedIndex].text;
    const figuraActualText = selecFigura.options[selecFigura.selectedIndex].text;

    // Si el check ESTÁ ACTIVADO (queremos agregar otro volumen)
    if (checkOtroVolumen.checked) {
        // Agregar el volumen actual a la lista
        contadorVolumenes++;
        volumenesCalculados.push({
            id: contadorVolumenes,
            figura: figuraActualText,
            volumen: parseFloat(volumenActual.toFixed(3)),
            unidad: unidadActual
        });

        // Limpiar el formulario para el próximo volumen
        selecFigura.selectedIndex = 0;
        dimensionesContainer.innerHTML = '';
        txtVolumenI.value = '';
        checkOtroVolumen.checked = false;
        figuraActual = '';

        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: 'Volumen agregado',
            text: `Se ha añadido el volumen ${volumenActual.toFixed(3)} ${unidadActual}`,
            confirmButtonColor: '#3085d6',
        });
    }
    // Si el check NO ESTÁ ACTIVADO (es el último volumen)
    else {
        // Agregar el volumen actual a la lista (si no estaba ya agregado)
        if (volumenesCalculados.length === 0 || 
            volumenesCalculados[volumenesCalculados.length-1].id !== contadorVolumenes+1) {
            contadorVolumenes++;
            volumenesCalculados.push({
                id: contadorVolumenes,
                figura: figuraActualText,
                volumen: parseFloat(volumenActual.toFixed(3)),
                unidad: unidadActual
            });
        }

        // Calcular la suma total
        const sumaTotal = volumenesCalculados.reduce((total, item) => {
            return total + parseFloat(item.volumen);
        }, 0);

        // Guardar en localStorage
        localStorage.setItem('volumenesFinales', JSON.stringify({
            volúmenesIndividuales: volumenesCalculados,
            volumenTotal: parseFloat(sumaTotal.toFixed(3)),
            unidad: unidadActual
        }));

        // Redireccionar a la siguiente página
        window.location.href = 'MAQUINADOS_7_tiempoMaquinado.html';
    }

}
    function obtenerFactorConversion(unidadTexto) {
        // Mapeo de unidades a sus factores de conversión a m³
        const factores = {
            'milímetros cúbicos (mm³)': 1e-9,
            'centímetros cúbicos (cm³)': 1e-6,
            'decímetros cúbicos (dm³)': 0.001,
            'metros cúbicos (m³)': 1,
            'pulgadas cúbicas (in³)': 1.6387064e-5,
            'pies cúbicos (ft³)': 0.028316846592,
            'yardas cúbicas (yd³)': 0.764554857984,
            'mililitros (ml)': 1e-6,
            'litros (l)': 0.001
        };
        
        return factores[unidadTexto] || 1; // Si no se encuentra, asumir que ya está en m³
    }
    // Inicializar con la imagen por defecto
    updateFiguraImage(null);
});
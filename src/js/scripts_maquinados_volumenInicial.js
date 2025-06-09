document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const figuraSelect = document.getElementById('selec_figura');
    const imgFigura = document.getElementById('img_figura');
    const container = document.getElementById('dimensiones-container');
    const txtVolumenI = document.getElementById('txt_volumenI');
    const unidadVolumenSelect = document.getElementById('unidad_volumen');
    const btnAceptar = document.getElementById('btn_aceptar_VolInicial');
    const btnLimpiar = document.getElementById('btn_limpiar_VolInicial');
    
    let figuraActual = '';
    
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
        prisma_triangular: '../img/base_altura.png', // valor por defecto, luego se cambia según método
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
            { value: '0.001', text: 'milímetros (mm)', selected: true },
            { value: '0.01', text: 'centímetros (cm)' },
            { value: '1', text: 'metros (m)' },
            { value: '0.0254', text: 'pulgadas (in)' },
            { value: '0.3048', text: 'pies (ft)' },
            { value: '1000', text: 'kilómetros (km)' },
            { value: '1609.344', text: 'millas (mi)' },
            { value: '1852', text: 'millas náuticas (nmi)' },
            { value: '28316.8466', text: 'pies / pulgadas (ft / in)' },
            { value: '1000000', text: 'metros / centímetros (m / cm)' }
        ],
        angulo: [
            { value: 'deg', text: 'grados (º)', selected: true },
            { value: 'rad', text: 'radianes (rad)' },
            { value: 'gradian', text: 'grados centesimales (gon)' },
            { value: 'turn', text: 'revoluciones (rev)' },
            { value: 'minute_of_arc', text: 'minutos de arco (arcmin)' },
            { value: 'second_of_arc', text: 'segundos de arco (arcseg)' },
            { value: 'miliradian', text: 'milliradianes (mrad)' },
            { value: 'microradian', text: 'microradianes (μrad)' },
            { value: 'pirad', text: 'π radianes (× π rad)' }
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
    figuraSelect.addEventListener('change', function() {
        figuraActual = this.value;
        container.innerHTML = '';
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
        container.appendChild(metodoDiv);
        
        // Crear campo de altura primero (siempre visible)
        crearCampo('altura_prisma', 'Altura (h)', 'longitud');
        
        const metodoSelect = metodoDiv.querySelector('select');
        metodoSelect.addEventListener('change', mostrarCamposTriangulo);
        mostrarCamposTriangulo();
    }
    
    // Función para mostrar campos según método seleccionado para prisma triangular
    function mostrarCamposTriangulo() {
        // Eliminar todos los campos excepto el selector de método y la altura
        while (container.children.length > 2) {
            container.removeChild(container.lastChild);
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
        
        container.appendChild(div);
        
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
        
        const inputs = container.querySelectorAll('.dimension-input');
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
            const factorConversion = parseFloat(unidadVolumenSelect.value);
            const volumenConvertido = volumenMetrosCubicos / factorConversion;
            txtVolumenI.value = volumenConvertido.toFixed(4);
        } else {
            txtVolumenI.value = '';
        }
    }
    
    // Evento al cambiar la unidad de volumen
    unidadVolumenSelect.addEventListener('change', actualizarResultadoVolumen);
    
    // Evento para el botón limpiar
    btnLimpiar.addEventListener('click', function() {
        figuraSelect.selectedIndex = 0;
        imgFigura.src = '../img/cilindro.jpeg';
        container.innerHTML = '';
        txtVolumenI.value = '';
        figuraActual = '';
    });
    
    // Evento para el botón aceptar
    btnAceptar.addEventListener('click', function() {
        if (txtVolumenI.value === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor complete todos los campos o seleccione una figura',
                confirmButtonColor: '#3085d6',
            });
            return;
        }
        
        // Guardar el volumen en localStorage para usarlo en la siguiente página
        localStorage.setItem('volumenInicial', txtVolumenI.value);
        localStorage.setItem('unidadVolumen', unidadVolumenSelect.options[unidadVolumenSelect.selectedIndex].text);
        
        // Redireccionar a la siguiente página
        window.location.href = 'MAQUINADOS_6_volumenFinal.html';
    });
    
    // Inicializar con la imagen por defecto
    updateFiguraImage(null);
});
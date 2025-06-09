
// MÓDULO DE NAVEGACIÓN ENTRE PÁGINAS
const NavigationModule = (() => {
    // Configuración de navegación
    const NAV_BUTTONS = {
        "btn_aceptar_tipoMaterial": "MAQUINADOS_4_dimencionesAcero.html"
    };

    /**
     * Inicializa los eventos de navegación
     */
    const init = () => {
        Object.entries(NAV_BUTTONS).forEach(([id, page]) => {
            document.getElementById(id)?.addEventListener("click", () => {
                window.location.href = page;
            });
        });
    };

    return { init };
})();


// MÓDULO DE SELECCIÓN DE TIPO DE MAQUINADO
const MachiningTypeModule = (() => {
    // Elementos del DOM
    const elements = {
        acceptBtn: document.getElementById("btn_aceptar_tipoMaquinado"),
        clearBtn: document.getElementById("btn_limpiar_tipoMaquinado"),
        checkboxes: document.querySelectorAll('input[type="checkbox"]'),
    };

    /**
     * Muestra alerta con los tipos seleccionados
     * @param {string[]} selectedItems - Elementos seleccionados
     * @param {string[]} specialItems - Elementos especiales seleccionados
     */
    const showSelectionAlert = (selectedItems, specialItems) => {
        Swal.fire({
            title: 'Tipos de maquinado seleccionados',
            html: `Has seleccionado:<br>• ${selectedItems.join('<br>• ')}`,
            icon: 'info',
            showDenyButton: true,
            confirmButtonText: 'Siguiente',
            denyButtonText: 'Borrar selección',
            customClass: {
                confirmButton: 'btn btn-primary',
                denyButton: 'btn btn-danger'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem("acabadosEspeciales", JSON.stringify(specialItems));
                localStorage.setItem("tiposmaquinados", JSON.stringify(selectedItems));
                window.location.href = "MAQUINADOS_3_tipoMaterial.html";
            } else if (result.isDenied) {
                clearSelection();
            }
        });
    };

    /**
     * Limpia todos los checkboxes
     */
    const clearSelection = () => {
        elements.checkboxes.forEach(cb => cb.checked = false);
        Swal.fire({
            title: '¡Listo!',
            text: 'Todos los checkboxes han sido deseleccionados.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    };

    /**
     * Maneja el evento de aceptar selección
     */
    const handleAccept = () => {
        const checkedBoxes = Array.from(elements.checkboxes).filter(cb => cb.checked);

        if (checkedBoxes.length === 0) {
            Swal.fire({
                title: '¡Atención!',
                text: 'Por favor selecciona al menos un tipo de maquinado.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const selectedItems = checkedBoxes.map(cb => 
            cb.nextElementSibling?.textContent.trim() || "Opción sin nombre"
        );
        
        const specialItems = checkedBoxes
            .filter(cb => cb.value === "2")
            .map(cb => cb.nextElementSibling?.textContent.trim() || "Opción sin nombre");

        showSelectionAlert(selectedItems, specialItems);
    };

    /**
     * Inicializa el módulo
     */
    const init = () => {
        if (elements.acceptBtn) elements.acceptBtn.addEventListener("click", handleAccept);
        if (elements.clearBtn) elements.clearBtn.addEventListener("click", clearSelection);
    };

    return { init };
})();


// MÓDULO DE SELECCIÓN DE MATERIAL

const MaterialSelectionModule = (() => {
    // Elementos del DOM
    const elements = {
        materialType: document.getElementById("selector1"),
        provider: document.getElementById("selector2"),
        materialSubtype: document.getElementById("selector3")
    };

    // Base de datos de materiales
    const MATERIAL_DATA = {
        "Aceros para trabajo en frio": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["ARNE", "RIGOR", "SVERKER21", "CALMAX", "CALDIE", "VANADIS 4 EXTRA"],
                BOHLER: ["K 460", "K 305", "K 110", "K 353", "K 340 ISODUR", "K 360 ISODUR", "K 294", "K 390 MICROCLEAN", "K 490 MICROCLEAN", "K 890 MICROCLEAN"],
                AISI: ["O1", "A2", "D2", "A11"]
            }
        },
        "Aceros para moldes plasticos": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["HOLDAX / HOLDER", "IMPAX SUPREME", "NIMAX", "STAVAX", "RAMAX HH", "CORRAX", "MIRRAX", "MIRRAX 40", "UDDEHOLM ROYALLOY", "MOLDMAXHH", "P - 20", "ALUMEC89"],
                BOHLER: ["M 200", "M238", "M315"],
                AISI: ["4140M", "P20M", "420ESR", "420 M"]
            }
        },
        "Aceros para trabajo en caliente": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["ORVAR-2M", "ORVAR SUPREME", "DIEVAR", "W360 ISOBLOC", "QRO-90 SUPREME", "VEX"],
                BOHLER: ["W302", "W302 ISOBLOC", "W360 ISOBLOC", "W400"],
                AISI: ["H13", "H13 PREMIUM", "H11"]
            }
        },
        "Aceros a alta velocidad": {
            proveedores: ["UDDEHOLM", "BOHLER", "AISI"],
            subtipos: {
                UDDEHOLM: ["VANADIS 23"],
                BOHLER: ["S 600", "S 500", "S 705", "S 290 MICROCLEAN", "S 390 MICROCLEAN", "S 692 MICROCLEAN", "S 790 MICROCLEAN"],
                AISI: ["M2", "M-42", "M-35", "M3:2"]
            }
        },
        "Aceros para construccion mecanica": {
            proveedores: ["BOHLER", "AISI"],
            subtipos: {
                BOHLER: ["4140 TRATADO", "4140 RECOCIDO", "1045", "ALUMINIO 5083"],
                AISI: ["4140", "1045"]
            }
        },
        "Aceros inoxidables": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["410", "416", "440C", "304/310", "316/321"]
            }
        },
        "Cobre": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["ELECTROLITICO", "PURO", "SIN OXIGENO"]
            }
        },
        "Bronce": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["SAE 62", "SAE 64", "SAE 65", "SAE 660", "SAE 688"]
            }
        },
        "Laton": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["ALFA", "BETA", "ROJO", "AMARILLO", "MANGANESO"]
            }
        },
        "Aluminio": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["3003", "7075", "1050", "SERIES 1000", "SERIES 2000", "SERIES 3004", "SERIES 4000", "SERIES 5000", "SERIES 6000", "SERIES 7000"]
            }
        },
        "Plasticos de ingenieria": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["POLICARBONATOS", "ACETAL NYLAMID", "SANALITE", "PVC", "PTFE"]
            }
        },
        "Placa comercial": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["A36"]
            }
        },
        "Acero estructural": {
            proveedores: ["SIN_PROVEEDOR"],
            subtipos: {
                SIN_PROVEEDOR: ["PTR", "IPR", "HSS", "CPS", "POLIN O MONTEN", "LAMINA"]
            }
        }
    };

    /**
     * Actualiza el selector de proveedores según el material seleccionado
     */
    const updateProviders = () => {
        const material = elements.materialType.value;
        const providers = MATERIAL_DATA[material]?.proveedores || [];

        elements.provider.innerHTML = '<option selected>Elige una opción...</option>';
        providers.forEach(provider => {
            const option = document.createElement("option");
            option.value = provider;
            option.textContent = provider;
            elements.provider.appendChild(option);
        });

        elements.materialSubtype.innerHTML = '<option selected>Elige una opción...</option>';
    };

    /**
     * Actualiza el selector de subtipos según el proveedor seleccionado
     */
    const updateSubtypes = () => {
        const material = elements.materialType.value;
        const provider = elements.provider.value;
        const subtypes = MATERIAL_DATA[material]?.subtipos[provider] || [];

        elements.materialSubtype.innerHTML = '<option selected>Elige una opción...</option>';
        subtypes.forEach(subtype => {
            const option = document.createElement("option");
            option.value = subtype;
            option.textContent = subtype;
            elements.materialSubtype.appendChild(option);
        });
    };

    /**
     * Guarda la selección en localStorage
     */
    const saveSelection = () => {
        if (elements.materialType.value && elements.materialSubtype.value) {
            localStorage.setItem("selectorTipoMaterial", elements.materialType.value);
            localStorage.setItem("selectorSubtipoMaterial", elements.materialSubtype.value);
            localStorage.setItem("materialSeleccionado", 
                `${elements.materialType.value} : ${elements.materialSubtype.value}`);
        }
    };
// Función para limpiar los selectores de material
function limpiarSelectoresMaterial() {
    // Obtener los elementos select
    const selector1 = document.getElementById("selector1");
    const selector2 = document.getElementById("selector2");
    const selector3 = document.getElementById("selector3");
    
    // Restablecer los selectores a su estado inicial
    if (selector1) selector1.selectedIndex = 0;
    if (selector2) {
        selector2.innerHTML = '<option selected>Elige una opción...</option>';
    }
    if (selector3) {
        selector3.innerHTML = '<option selected>Elige una opción...</option>';
    }
}

// Asignar la función al botón limpiar
document.getElementById("btn_limpiar_tipoMaterial")?.addEventListener("click", limpiarSelectoresMaterial);
    /**
     * Inicializa el módulo
     */
    const init = () => {
        if (elements.materialType) {
            elements.materialType.addEventListener("change", updateProviders);
        }
        
        if (elements.provider) {
            elements.provider.addEventListener("change", updateSubtypes);
        }
        
        if (elements.materialSubtype) {
            elements.materialSubtype.addEventListener("change", saveSelection);
        }
    };

    return { init };
})();


// INICIALIZACIÓN DE MÓDULOS AL CARGAR EL DOCUMENTO

document.addEventListener("DOMContentLoaded", () => {
    NavigationModule.init();
    MachiningTypeModule.init();
    MaterialSelectionModule.init();
});
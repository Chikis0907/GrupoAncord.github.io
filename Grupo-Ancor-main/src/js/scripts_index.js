//direccionamiento a tipos de maquinados
document.addEventListener("DOMContentLoaded", function () { 
    // Seleccionar el botón por su ID correcto
    const btnMaquinados = document.getElementById("btn_maquinados"); 

    const btnTratamientos = document.getElementById("btn_tratamienros");

    const btnInicio = document.getElementById("btn_inicio");

    
    if (btnMaquinados) {
        btnMaquinados.addEventListener("click", function () {
            window.location.href = "MAQUINADOS_2_tipoMaquinados.html";
        });
    }
    if (btnTratamientos){
        btnTratamientos.addEventListener("click", function(){
            window.location.href = "tratamientos_termicos.html";
        });
    }
if (btnInicio) {
  btnInicio.addEventListener("click", function () {
    window.location.href = "InicioSesion.html";
  });
}

});


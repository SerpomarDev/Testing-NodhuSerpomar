let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

    pendienteLiquidar(id)
    cantidadContenedor(id)
    function actualizarEstadoBoton() {
        
        const cantidadFacturados = localStorage.getItem('cantidadFacturados');
        const cantidadContenedor = localStorage.getItem('cantidadContenedor');
        const btnLiquidar = document.getElementById('BtnSaveLiquidar');
        
        if (cantidadFacturados === cantidadContenedor) {
            btnLiquidar.disabled = false;
        } else {
            btnLiquidar.disabled = true;
        }
    }

    // Ejecutar la función cuando se cargue la página
    document.addEventListener('DOMContentLoaded', () => {
        // Llamar a la función inmediatamente para verificar el estado inicial
        actualizarEstadoBoton();
        
        // Verificar cambios en los valores de localStorage cada segundo
        setInterval(actualizarEstadoBoton, 1000);
    });

    new gridjs.Grid({
        search: false,
        language:{
            search:{
                placeholder: '🔍 Buscar...'
            }
        },
        pagination: {
            limit:10,
            enabled: true,
        },
        resizable: true,
        sort: false,
        columns: ["SP","Cliente",{
            name:"Valor Total",
            formatter:(_,row)=> `$ ${(row.cells[2].data)}`
        }],
        server: {
            url: `http://esenttiapp.test/api/liquidarspt/${id}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((preliq) => [
                        preliq.do_sp,
                        preliq.cliente,
                        preliq.valor_total,
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('liquidar'));


    document.getElementById('saveLiquidacion').addEventListener('submit',function(event){
        event.preventDefault();
    
        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));
    
        fetch('http://esenttiapp.test/api/liquidacion',{
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
             },
            body:jsonData
        })
        .then(response=>{
            if(!response.ok){
                Swal.fire({
                    title: "Advertencia",
                    text: "No se puede enviar una factura vacia",
                    icon: "warning"
                });
                throw new Error('Error al enviar los datos del formulario');
            }
        })
        .then(data => {
            Swal.fire({
              title: "¡Buen trabajo!",
              text: "Liquidación cerrada",
              icon: "success",
            });
            setTimeout(() => {
                window.location.href = `/view/solicitudes_servicios/seacrh_do_service.html`; 
              }, 1500);
        })
        .catch((error) => {
            Swal.fire({
                title: "¡Ha ocrrido un error!",
                text: "La ejecución se detuvo",
                icon: "error",
              });
            console.error('Error:', error);
          });
    })
// Definir columnas de la tabla
const columnDefs = [
    { headerName: "id", field: "id", hide: true },
    { headerName: "SP", field: "sp" },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Cliente", field: "cliente" },
    {
        headerName: "Accion",
        cellRenderer: params => {
            const id = params.data.id;
            return `<button class="py- mb-4 px-4 bg-blue-600" onclick="actualizarFactura('${id}')">Programar</button>`;
        }
    }
];

fetch("http://127.0.0.1:8000/api/uploadpreprogramar", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const processedData = data.map(Preprogramar => {
            return {
                id: Preprogramar.id,
                sp: Preprogramar.sp,
                contenedor: Preprogramar.contenedor,
                cliente: Preprogramar.cliente,
            };
        });

        const gridOptions = {
            columnDefs: columnDefs,
            defaultColDef: {
                resizable: true,
                sortable: false,
                filter: "agTextColumnFilter",
                floatingFilter: true,
                flex: 1,
                minWidth: 100,
            },
            rowSelection: 'multiple',
            enableRangeSelection: true,
            suppressMultiRangeSelection: true,
            pagination: true,
            paginationPageSize: 20,
            rowData: processedData,
        };

        const eGridDiv = document.getElementById('preprogramar');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });

function actualizarFactura(id) {
    const modal = document.getElementById("myModal");
    modal.classList.remove("hidden");
    modal.style.display = "flex";
    console.log("Modal mostrado para el id:", id);
}

function closeModal() {
    console.log("Botón Cerrar presionado");
    const modal = document.getElementById("myModal");
    modal.classList.add("hidden");
    modal.style.display = "none";

    const computedStyle = window.getComputedStyle(modal);
    console.log("Display del modal:", computedStyle.display);
}

function submitForm() {
    const fechaProgramacion = document.getElementById("fechaProgramacion").value;
    const tipoOperacion = document.getElementById("tipoOperacion").value;

    console.log("Fecha Programación:", fechaProgramacion);
    console.log("Tipo de Operación:", tipoOperacion);

    closeModal();
}

// modal oculto al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    modal.classList.add("hidden");

    console.log("El modal está oculto al cargar la página.");
});
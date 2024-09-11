const columnDefs = [
    // { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
    { headerName: "id", field: "id", hide: true },
    { headerName: "SP", field: "sp" },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Cliente", field: "cliente" },
    {
        headerName: "Accion",
        cellRenderer: params => {
            return `
                <button class="py-2 mb-4 px-4 border rounded bg-blue-600" onclick="actualizarFactura()">Programar</button>`;
        }
    }
];
fetch("http://esenttiapp.test/api/uploadpreprogramar",{
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

    gridOptions = {
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
        suppressMultiRangeSelection:true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
        
      };
      
      // Renderizar la tabla en el contenedor
        const eGridDiv = document.getElementById('preprogramar');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });


  
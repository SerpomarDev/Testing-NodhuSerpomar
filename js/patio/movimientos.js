// SDKs necesarios de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Configuración Firebase (copia la misma configuración de uploadFotos.js)
const firebaseConfig = {
    apiKey: "AIzaSyBQh7eqWl_iu02oDPds3nQMigzSrHDOFn0",
    authDomain: "serpomar-driver-mysql-f8df6.firebaseapp.com",
    projectId: "serpomar-driver-mysql-f8df6",
    storageBucket: "serpomar-driver-mysql-f8df6.appspot.com",
    messagingSenderId: "840427888757",
    appId: "1:840427888757:web:b8250feec992a76510583c"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// new gridjs.Grid({
//     search: true,
//     language: {
//         search: {
//             placeholder: '🔍 Buscar...'
//         }
//     },
//     pagination: {
//         limit: 50,
//         enabled: false,
//     },
//     sort: false,
//     columns: ["id", "Contenedor", "Cliente", "T. Contenedor", "Tipo transporte", "Cutoff", "Naviera", "Operación", "estado",
//         {
//             name: 'Fotos',
//             formatter: (cell, row) => {
//                 const id = row.cells[0].data;
//                 return gridjs.h('button', {
//                     className: '}border rounded bg-green-600',
//                     onClick: () => abrirModalFotos(id)
//                 }, 'Fotos');
//             }
//         },
//         {
//             name: 'Acción',
//             hidden: 'true',
//             formatter: (cell, row) => {
//                 return gridjs.h('button', {
//                     className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
//                     onClick: () => asignar(row.cells[0].data)
//                 }, 'Entrada');
//             },
//         }
//     ],
//     fixedHeader: true,
//     server: {
//         url: `http://esenttiapp.test/api/cargarhistorico`,
//         headers: {

//             Authorization: `Bearer ${localStorage.getItem("authToken")}`
//         },
//         then: (data) => {
//             if (Array.isArray(data) && data.length > 0) {
//                 return data.map((ordenCargue) => [
//                     ordenCargue.id,
//                     ordenCargue.contenedor,
//                     ordenCargue.cliente,
//                     ordenCargue.tipo_contenedor,
//                     ordenCargue.modalidad,
//                     ordenCargue.cutoff,
//                     ordenCargue.naviera,
//                     ordenCargue.operacion,
//                     ordenCargue.lleno_vacio
//                 ]);
//             } else {
//                 console.error("La respuesta del servidor no contiene datos válidos.");
//                 return [];
//             }
//         }
//     },
//     resizable: true,
//     style: {
//         table: { with: "80%" }
//     }
// }).render(document.getElementById('historico'));


const columnDefs = [
    { headerName: "id", field: "id", hide: false },
    { headerName: "Contenedor", field: "contenedor" },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "Tipo de contenedor", field: "tipo_contenedor" },
    { headerName: "Tipo transporte", field: "modalidad" },
    { headerName: "Cutoff", field: "cutoff" },
    { headerName: "Naviera", field: "naviera" },
    { headerName: "Operación", field: "operacion" },
    { headerName: "Estado", field: "lleno_vacio" },
    { headerName: "Fecha Entrada", field: "fecha_entrada" },
    { 
        headerName: "Fotos", 
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'border rounded bg-green-600';
            button.innerText = 'Fotos';
            button.onclick = () => abrirModalFotos(params.data.id);
            return button;
        }
    }
];

fetch("http://esenttiapp.test/api/cargarhistorico",{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const processedData = data.map(ordenCargue => {
      return {
        id: ordenCargue.id,
        contenedor: ordenCargue.contenedor,
        cliente: ordenCargue.cliente,
        tipo_contenedor: ordenCargue.tipo_contenedor,
        modalidad: ordenCargue.modalidad,
        cutoff: ordenCargue.cutoff,
        naviera: ordenCargue.naviera,
        operacion: ordenCargue.operacion,
        lleno_vacio: ordenCargue.lleno_vacio,
        fecha_entrada: ordenCargue.fecha_entrada,
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
        enableRangeSelection: true,
        suppressMultiRangeSelection:true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData // Asignar los datos procesados
        
      };
      
      // Renderizar la tabla en el contenedor
        const eGridDiv = document.getElementById('historico');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });

function time() {
    setTimeout(() => {
        window.location.href = `/view/patio/inventario.html`;
    }, 1500);
}


// Función para abrir el modal de fotos
async function abrirModalFotos(id) {
    const fileList = document.getElementById('uploadedFilesList');
    fileList.innerHTML = '';

    try {
        const listRef = ref(storage, `orden_cargue/${id}`);
        const res = await listAll(listRef);

        if (res.items.length === 0) {
            const noFilesMessage = document.createElement('li');
            noFilesMessage.textContent = 'No hay archivos adjuntos.';
            fileList.appendChild(noFilesMessage);
        } else {
            for (const itemRef of res.items) {
                const url = await getDownloadURL(itemRef);
                const listItem = document.createElement('li');

                const imgPreview = document.createElement('img');
                imgPreview.src = url;
                imgPreview.alt = itemRef.name;
                imgPreview.style.maxWidth = '100px';
                imgPreview.style.maxHeight = '100px';
                imgPreview.style.cursor = 'pointer';
                imgPreview.onclick = () => showImageInModal(url, itemRef.name);

                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = itemRef.name;

                listItem.appendChild(imgPreview);
                listItem.appendChild(link);
                fileList.appendChild(listItem);
            }
        }

        const modal = document.getElementById('fileUploadModal');
        modal.style.display = 'block';

        // Limpiar el formulario de subida de archivos (opcional)
        const dropzoneElement = document.getElementById('SaveFile');
        if (dropzoneElement && Dropzone.instances.length > 0) {
            const dropzoneInstance = Dropzone.forElement(dropzoneElement);
            dropzoneInstance.removeAllFiles(true);
        }

    } catch (error) {
        console.error('Error loading uploaded files:', error);
        alert('Ocurrió un error al cargar los archivos adjuntos. Por favor, inténtelo de nuevo más tarde.');
    }
}

// Función para mostrar la imagen en el modal de detalles (si la tienes)
function showImageInModal(imageUrl, imageName) {
    const modalContent = document.getElementById('modalDetailsContent');
    modalContent.innerHTML = '';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.alt = imageName;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = imageName;

    modalContent.appendChild(img);
    modalContent.appendChild(figcaption);
    detailsModal.style.display = 'block';
}
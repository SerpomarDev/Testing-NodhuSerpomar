$(document).ready(function() {
  function actualizarContadores(data) {
      const totalSP = data.length;
      const valorTotal = data.reduce((acc, liquidacion) => acc + liquidacion.valor_total, 0);

      $('#total-sp-por-facturar').text(totalSP);
      $('#valor-total-sp').text(valorTotal.toLocaleString());
  }

  new gridjs.Grid({
      search: false,
      language: {
          search: {
              placeholder: '🔍 Buscar...'
          }
      },
      pagination: {
          limit: 10,
          enabled: true,
      },
      resizable: true,
      sort: false,
      columns: [
          "id", "SP", {
              name: "Valor Total",
              formatter: (_, row) => `$ ${(row.cells[2].data).toLocaleString()}`
          }, "Fecha notificación", {
              name: "Numero factura",
              hidden: false,
              formatter: (cell, row) => {
                  return gridjs.html(`<textarea id="observacion-${row.cells[0].data}"></textarea>`);
              }
          }, {
              name: "Acción",
              hidden: false,
              formatter: (cell, row) => {
                  return gridjs.h('button', {
                      className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
                      onClick: () => {
                          const facturaTexto = document.getElementById(`observacion-${row.cells[0].data}`).value;
                          comentario(row.cells[0].data, facturaTexto);
                      }
                  }, 'Enviar');
              }
          }, {
              name: "Reporte",
              hidden: false,
              formatter: (cell, row) => {
                  return gridjs.h('button', {
                      className: 'py-2 mb-4 px-4 border rounded bg-green-600',
                      onClick: () => {
                          const comentarioTexto = document.getElementById(`observacion-${row.cells[0].data}`).value;
                          numeroFactura(row.cells[0].data, comentarioTexto);
                      }
                  }, 'Liquidación');
              }
          }
      ],
      server: {
          url: `http://esenttiapp.test/api/showliquidacion`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
          then: (data) => {
              if (Array.isArray(data) && data.length > 0) {
                  actualizarContadores(data);
                  return data.map((liquidacion) => [
                      liquidacion.id,
                      liquidacion.do_sp,
                      liquidacion.valor_total,
                      liquidacion.fecha_creacion,
                  ]);
              } else {
                  console.error("La respuesta del servidor no contiene datos válidos.");
                  return [];
              }
          }
      }
  }).render(document.getElementById('contabilidad'));

  localStorage.setItem("authToken", data.token);

  function numeroFactura(id, factura) {
      fetch(`http://esenttiapp.test/api/ActualizarNfactura/${factura}/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          },
          body: JSON.stringify({
              id: id,
              factura: factura
          }),
      })
      .then(response => response.json())
      .then(data => {
          console.log('Comentario guardado con éxito:', data);
          Swal.fire({
              title: "¡Buen trabajo!",
              text: "Comentario guardado!",
              icon: "success"
          });
          time()
      })
      .catch((error) => {
          console.error('Error al guardar el comentario:', error);
      });
  }
});
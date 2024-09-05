
document.addEventListener('DOMContentLoaded', function() {


    let selectNombre = document.getElementById('id_conductor');
    let inputIdentificacion = document.getElementById('identificacion');
    let inputTelefono = document.getElementById('telefono');
  
    new TomSelect(selectNombre, {
      valueField: 'id',
      labelField: 'nombre',
      searchField: 'nombre',
      maxItems:1,
      load: function(query, callback) {
          fetch(`http://esenttiapp.test/api/uploadconductor?search=${encodeURIComponent(query)}`,{
            method: 'GET',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem("authToken")}`
              }
          })
          .then(response => response.json())
          .then(data => {
                callback(data);
            })
            .catch(() => {
                  callback();
            });
      },
      render: {
          option: function(item, escape) {
              return `<div class="">
                          ${escape(item.nombre)}
                      </div>`;
          },
          item: function(item, escape) {
              return `<div class="">
                          ${escape(item.nombre)}
                      </div>`;
          }
      }
  });

  
  
      selectNombre.addEventListener('change', function() {

        let idConductorSeleccionado = this.value

          fetch(`http://esenttiapp.test/api/uploadoptid/${idConductorSeleccionado}`,{
            method: 'GET',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem("authToken")}`
              }
          })  
          .then(response => {
            if (!response.ok) {
              throw new Error('Error en la respuesta de la API: ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            const conductor =  data[0]
            if (conductor.identificacion && conductor.telefono) {
                inputIdentificacion.value = conductor.identificacion;
                inputTelefono.value = conductor.telefono;
            } else {
              console.error('Los datos esperados no están presentes en la respuesta de la API');
            } 
          })
          .catch(error => console.error('Error:', error));
      });
  });

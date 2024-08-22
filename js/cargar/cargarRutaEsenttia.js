document.addEventListener('DOMContentLoaded',function(){

    let selectRuta = document.getElementById('id_ruta')
    let inputTarifa = document.getElementById('tarifa')

    fetch('http://esenttiapp.test/api/uploadrutaesenttia',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(ruta => {
            let option = document.createElement('option')
            option.value = ruta.id
            option.text = ruta.item
            selectRuta.appendChild(option)
        });

    });


    selectRuta.addEventListener('change', function(){

        let idRutaSeleccionada = this.value
        console.log(idRutaSeleccionada)

        fetch(`http://esenttiapp.test/api/uploadrutaid/${idRutaSeleccionada}`,{
            method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                }
        })
        .then(response=>{
            if(!response.ok){
                throw new Error('Error en la respuesta de la API: ' + response.statusText);
            }
            return response.json()
        })
        .then(data=>{
            const ruta = data[0]
            if(ruta.tarifas){
                inputTarifa.value = ruta.tarifas
            }else{
                console.error('Los datos esperados no están presentes en la respuesta de la API');
            }
        })
        .catch(error => console.error('Error:', error))
    })
})
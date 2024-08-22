document.addEventListener('DOMContentLoaded',function(){
    let selectDestinos = document.getElementById('id_sitio_inspeccion')

    fetch('http://esenttiapp.test/api/destinos',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(Response=>Response.json())
    .then(data =>{
        data.forEach(destino => {
            let option = document.createElement('option')
            option.value = destino.id
            option.text = destino.nombre
            selectDestinos.appendChild(option)
        });
    })
})
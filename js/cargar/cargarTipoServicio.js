document.addEventListener('DOMContentLoaded',function(){
    let selectTipoServicio = document.getElementById('id_tipo_operacion');

    fetch('http://esenttiapp.test/api/tiposervicios',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(tipoServ => {
            let option = document.createElement('option')
            option.value = tipoServ.id
            option.text = tipoServ.tipo
            selectTipoServicio.appendChild(option)       
        });

    });

});
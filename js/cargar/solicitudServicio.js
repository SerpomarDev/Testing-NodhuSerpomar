document.addEventListener('DOMContentLoaded',function(){
    let selectSoliServi = document.getElementById('id_solicitud_servicio');

    fetch('http://esenttiapp.test/api/solicitudservicios',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
    .then(Response => Response.json())
    .then(data=>{
        data.forEach(soliServi => {
            let option = document.createElement('option')
            option.value = soliServi.id
            option.text = soliServi.do_pedido
            selectSoliServi.appendChild(option)       
        });

    });

});


function filtrarSp(){
    document.addEventListener('keyup', e => {
        if (e.target.matches('#id_solicitud_servicio')) {
            let query = e.target.value.toLowerCase();
            document.querySelectorAll('#id_solicitud_servicio option').forEach(option => {
                let optionText = option.text.toLowerCase();
                optionText.includes(query)
                ? option.classList.remove('filtro')
                : option.classList.add('filtro');
            });
        }
    });
}
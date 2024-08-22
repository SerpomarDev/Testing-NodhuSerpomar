document.addEventListener('DOMContentLoaded',function(){
    let selectNaviera = document.getElementById('id_naviera')

    fetch('http://esenttiapp.test/api/navieras',{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        })
    .then(Response => Response.json())
    .then (data=>{
        data.forEach(naviera => {
            let option = document.createElement('option')
            option.value  = naviera.id
            option.text = naviera.nombre
            selectNaviera.appendChild(option)
        });
    })
})
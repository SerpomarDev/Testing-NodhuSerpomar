fetch('http://esenttiapp.test/api/totalasignacionabiertas',{
    method: 'GET',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos de la API');
    }
    return response.json();
  })
  .then(data => {
    const totalRegistrosElement = document.getElementById('total-abiertas');
    totalRegistrosElement.textContent = `${data}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });
   function DeleteData(id) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo"
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`https://esenttiapp-production.up.railway.app/api/deleterby/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Error al eliminar el registro');
              }
              Swal.fire({
                title: "¡Eliminado!",
                text: "Tu archivo ha sido eliminado.",
                icon: "success"
              });
            })
            .then((response) => {
              time();
            })
            .catch(error => {
              console.error('Error:', error);
              Swal.fire({
                title: "¡Error!",
                text: "Hubo un problema al intentar eliminar el archivo.",
                icon: "error"
              });
            });
        }
      });
    }
    function time() {
      document.getElementById("createRuta").reset();
      setTimeout(() => {
        window.location.href = `/view/rutas/create.html`;
      }, 1500);
      }
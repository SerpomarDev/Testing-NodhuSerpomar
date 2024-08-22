function actualizarEstado(id) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, procesar"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://esenttiapp.test/api/actualizarestado/${id}`, {
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
              title: "¡Procesado!",
              text: "Registro procesado con exito.",
              icon: "success"
            });
            location.reload()
          })
          .catch(error => {
            console.error('Error:', error);
            Swal.fire({
              title: "¡Error!",
              text: "Hubo un problema al intentar Procesar la solicitud.",
              icon: "error"
            });
          });
      }
    });
  }

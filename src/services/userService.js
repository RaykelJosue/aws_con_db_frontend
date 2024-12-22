// Define la URL base para tu API
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("La respuesta no es JSON válido");
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  return data;
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (params = {}) => {
  try {
    let url = `${API_BASE_URL}/api/usuarios`;
    if (params.filtro && params.busqueda) {
      url += `?filtro=${encodeURIComponent(params.filtro)}&busqueda=${encodeURIComponent(params.busqueda)}`;
    }
    const respuesta = await fetch(url);
    return await handleResponse(respuesta);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Obtener un usuario específico por ID
export const obtenerUsuarioPorId = async (id) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/usuarios/${id}`);
    return await handleResponse(respuesta);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

// Crear un nuevo usuario
export const agregarUsuario = async (usuario) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    return await handleResponse(respuesta);
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    throw error;
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (id, datosActualizados) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosActualizados),
    });
    return await handleResponse(respuesta);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (id) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(respuesta);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// Obtener el total de usuarios
export const obtenerTotalUsuarios = async () => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/usuarios/total`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(respuesta);
  } catch (error) {
    console.error("Error al obtener el total de usuarios:", error);
    throw error;
  }
};
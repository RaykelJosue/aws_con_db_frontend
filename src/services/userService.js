// Define la URL base para tu API
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Obtener todos los usuarios
export const obtenerUsuarios = async (params = {}) => {
  try {
    let url = `${API_BASE_URL}/usuarios`;
    if (params.filtro && params.busqueda) {
      url += `?filtro=${params.filtro}&busqueda=${params.busqueda}`;
    }
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error('La respuesta de la red no fue satisfactoria');
    }
    const data = await respuesta.json();
    console.log('Datos recibidos del servidor:', data);

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no son un array');
    }

    return data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Obtener un usuario específico por ID
export const obtenerUsuarioPorId = async (id) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios/${id}`);
    if (!respuesta.ok) {
      throw new Error('La respuesta de la red no fue satisfactoria');
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

// Crear un nuevo usuario
export const agregarUsuario = async (usuario) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    if (!respuesta.ok) {
      throw new Error('La respuesta de la red no fue satisfactoria');
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    throw error;
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (id, datosActualizados) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosActualizados),
    });
    if (!respuesta.ok) {
      throw new Error('La respuesta de la red no fue satisfactoria');
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (id) => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
    });
    if (!respuesta.ok) {
      throw new Error('La respuesta de la red no fue satisfactoria');
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// Obtener el total de usuarios
export const obtenerTotalUsuarios = async () => {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios/total`);
    if (!respuesta.ok) {
      throw new Error('La respuesta de la red no fue satisfactoria');
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener el total de usuarios:", error);
    throw error;
  }
};

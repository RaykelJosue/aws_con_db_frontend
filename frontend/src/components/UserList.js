import React, { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';
import AddUser from './AddUser';
import { obtenerUsuarios, eliminarUsuario, obtenerTotalUsuarios } from '../services/userService';
import Notification from './Notification';

const UserList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [error, setError] = useState(null);
    const [usuarioEditado, setUsuarioEditado] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [notification, setNotification] = useState(null);
    const [expandedNames, setExpandedNames] = useState({});
    const [filtro, setFiltro] = useState("nombre");
    const [busqueda, setBusqueda] = useState("");
    const [totalUsuarios, setTotalUsuarios] = useState(0);

    const aplicarFiltro = useCallback(() => {
        if (!busqueda) {
            setUsuariosFiltrados(usuarios);
            return;
        }

        const usuariosFiltrados = usuarios.filter(usuario => {
            const valor = String(usuario[filtro]).toLowerCase();
            return valor.includes(busqueda.toLowerCase());
        });

        setUsuariosFiltrados(usuariosFiltrados);
    }, [busqueda, filtro, usuarios]);

    useEffect(() => {
        fetchUsuarios();
        fetchTotalUsuarios();
    }, []);

    useEffect(() => {
        aplicarFiltro();
    }, [aplicarFiltro]);

    const fetchUsuarios = async () => {
        try {
            const data = await obtenerUsuarios();
            if (Array.isArray(data)) {
                setUsuarios(data);
                setUsuariosFiltrados(data);
            } else {
                throw new Error('Los datos obtenidos no son un array');
            }
        } catch (err) {
            setError(err);
        }
    };

    const fetchTotalUsuarios = async () => {
        try {
            const data = await obtenerTotalUsuarios();
            setTotalUsuarios(data.total_usuarios);
        } catch (err) {
            setError(err);
        }
    };

    const handleDelete = async () => {
        if (usuarioAEliminar) {
            try {
                await eliminarUsuario(usuarioAEliminar.id);
                await fetchUsuarios();
                await fetchTotalUsuarios();
                setUsuarioAEliminar(null);
                setConfirmDeleteModalOpen(false);
                showNotification('Usuario eliminado de manera exitosa', 'error');
            } catch (err) {
                setError(err);
            }
        }
    };

    const handleConfirmDelete = (usuario) => {
        setUsuarioAEliminar(usuario);
        setConfirmDeleteModalOpen(true);
    };

    const handleEdit = (usuario) => {
        setUsuarioEditado(usuario);
        setIsAddingUser(false);
        setModalOpen(true);
    };

    const handleCloseConfirmDelete = () => {
        setConfirmDeleteModalOpen(false);
        setUsuarioAEliminar(null);
    };

    const handleAddUser = () => {
        setUsuarioEditado(null);
        setIsAddingUser(true);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setUsuarioEditado(null);
        setIsAddingUser(false);
        setModalOpen(false);
    };

    const handleUserAdded = async () => {
        await fetchUsuarios();
        await fetchTotalUsuarios();
        handleCloseModal();
        showNotification('Usuario agregado de manera exitosa', 'success');
    };

    const handleUserEdited = async () => {
        await fetchUsuarios();
        await fetchTotalUsuarios();
        handleCloseModal();
        showNotification('Usuario modificado de manera exitosa', 'info');
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleNameExpansion = (id) => {
        setExpandedNames(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const truncateName = (name, id) => {
        if (expandedNames[id]) {
            return (
                <>
                    {name}
                    <button className="view-more-button" onClick={() => toggleNameExpansion(id)}>
                        Ver menos
                    </button>
                </>
            );
        }
        if (name.length > 10) {
            return (
                <>
                    {name.substring(0, 10)}...
                    <button className="view-more-button" onClick={() => toggleNameExpansion(id)}>
                        Ver más
                    </button>
                </>
            );
        }
        return name;
    };

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1 className="title">Super CRUD</h1>

            {notification && (
                <Notification
                    key={Date.now()}
                    message={notification.message}
                    type={notification.type}
                />
            )}

            <Modal isOpen={modalOpen} onClose={handleCloseModal}>
                <AddUser
                    onUserAdded={handleUserAdded}
                    onUserEdited={handleUserEdited}
                    usuarioEditado={usuarioEditado}
                    isAddingUser={isAddingUser}
                    resetForm={handleCloseModal}
                    onClose={handleCloseModal}
                />
            </Modal>

            <Modal isOpen={confirmDeleteModalOpen} onClose={handleCloseConfirmDelete}>
                <div className="confirm-delete-modal">
                    <h2>Confirmación</h2>
                    <p>¿Estás seguro que deseas eliminar el nombre de {usuarioAEliminar?.nombre}?</p>
                    <div className="confirm-delete-buttons">
                        <button className="confirm-button" onClick={handleDelete}>Sí</button>
                        <button className="cancel-button" onClick={handleCloseConfirmDelete}>No</button>
                    </div>
                </div>
            </Modal>

            <div className="user-list-container">
                <div className="user-list-header">
                    <h2>Lista de Usuarios</h2>
                    <button onClick={handleAddUser} className="add-user-button">
                        Agregar Usuario
                    </button>
                </div>

                <div className="search-filter-container">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={handleBusquedaChange}
                        placeholder={`Buscar por ${filtro}`}
                        className="search-input"
                    />
                    <select 
                        value={filtro} 
                        onChange={handleFiltroChange}
                        className="filter-select"
                    >
                        <option value="nombre">Nombre</option>
                        <option value="correo">Correo</option>
                        <option value="edad">Edad</option>
                    </select>
                </div>

                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Edad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{truncateName(usuario.nombre, usuario.id)}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.edad}</td>
                                    <td className="action-buttons">
                                        <button onClick={() => handleEdit(usuario)}>Editar</button>
                                        <button
                                            className="delete"
                                            onClick={() => handleConfirmDelete(usuario)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="total-users">Total de usuarios: {totalUsuarios}</p>
            </div>
        </div>
    );
};

export default UserList;
import React, { useEffect, useState } from 'react';
import { agregarUsuario, actualizarUsuario } from '../services/userService';

const AddUser = ({ onUserAdded, onUserEdited, usuarioEditado, isAddingUser, resetForm, onClose }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [edad, setEdad] = useState('');

    useEffect(() => {
        if (usuarioEditado) {
            setNombre(usuarioEditado.nombre);
            setCorreo(usuarioEditado.correo);
            setEdad(usuarioEditado.edad);
        } else if (isAddingUser) {
            setNombre('');
            setCorreo('');
            setEdad('');
        }
    }, [usuarioEditado, isAddingUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (usuarioEditado) {
                await actualizarUsuario(usuarioEditado.id, { nombre, correo, edad });
                onUserEdited();
            } else {
                await agregarUsuario({ nombre, correo, edad });
                onUserAdded();
            }
        } catch (error) {
            console.error("Error al guardar usuario:", error);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>{usuarioEditado ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                <button className="modal-close" onClick={onClose}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Edad"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    required
                />
                <button type="submit">Guardar</button>
                <button type="button" onClick={resetForm}>Cancelar</button>
            </form>
        </div>
    );
};

export default AddUser;
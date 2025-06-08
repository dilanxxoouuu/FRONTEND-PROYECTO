import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import './GestionUsuarios.css'; 
 
const GestionUsuarios = () => { 
    const [usuarios, setUsuarios] = useState([]); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const navigate = useNavigate(); 
    const token = localStorage.getItem("token"); 

    const axiosInstance = axios.create({ 
        baseURL: "https://backenddespliegue-production.up.railway.app", 
        headers: { 
            Authorization: `Bearer ${token}`, 
        }, 
    }); 
    const refreshUsers = () => { 

        axiosInstance 
            .get("/usuarios") 
            .then((response) => setUsuarios(response.data)) 
            .catch((error) => { 
                console.error("Error al obtener los usuarios:", error); 
                setErrorMessage("Error al cargar los usuarios."); 
            }); 
    }; 

    useEffect(() => { 
        refreshUsers(); 
    }, []); 

    return ( 
        <div className="gestion-usuarios"> 
            <h1>Gestión de Usuarios</h1> 
            <div className="action-buttons"> 
                <button className="back-btn" onClick={() => navigate("/dashboard")}> 
                    Regresar al Dashboard 
                </button> 
                <button className="refresh-btn" onClick={refreshUsers}> 
                    Refrescar Usuarios 
                </button> 
            </div> 
            {errorMessage && ( 
                <div className="alert alert-error"> 
                    <span className="alert-icon">!</span> {errorMessage} 
                </div> 
            )} 
            <div className="users-list"> 
                <h2>Listado de Usuarios</h2> 
                {usuarios.length === 0 ? ( 
                    <p className="no-users">No hay usuarios registrados</p> 
                ) : ( 
                    <div className="users-grid"> 
                        {usuarios.map(user => ( 
                            <div key={user.id_usuario} className="user-card"> 
                                <div className="user-header"> 
                                    <span className="user-id">ID: {user.id_usuario}</span> 
                                    {user.rol_id === 1 && <span className="superadmin-badge">Superadmin</span>} 
                                </div> 
                                <div className="user-body"> 
                                    <p><strong>Nombre:</strong> {user.nombre}</p> 
                                    <p><strong>Correo:</strong> {user.correo}</p> 
                                    <p><strong>Documento:</strong> {user.numerodoc}</p> 
                                </div> 
                            </div> 
                        ))} 
                    </div> 
                )} 
            </div> 
        </div> 
    ); 
};
export default GestionUsuarios; 
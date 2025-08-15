import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../assets/css/registro.css';

function Registro() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors } 
    } = useForm();

    const password = watch("password");

    const validatePassword = (value) => {
        if (!value) return "La contraseña es requerida";
        
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>-_¡¿]/.test(value);

        if (value.length < minLength) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!hasUpperCase) {
            return 'La contraseña debe contener al menos una mayúscula';
        }
        if (!hasLowerCase) {
            return 'La contraseña debe contener al menos una minúscula';
        }
        if (!hasNumber) {
            return 'La contraseña debe contener al menos un número';
        }
        if (!hasSpecialChar) {
            return 'La contraseña debe contener al menos un carácter especial';
        }
        return true;
    };

    const onSubmit = (data) => {
        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Datos del formulario:', data);
        // Después del registro exitoso, redirigir al login
        navigate('/login');
    };

    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col">
                    <h1>Registro de Usuario</h1>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                    id="nombre"
                                    {...register("nombre", {
                                        required: "El nombre es requerido",
                                        minLength: {
                                            value: 2,
                                            message: "Debe tener al menos 2 caracteres"
                                        },
                                        pattern: {
                                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                            message: "Solo se permiten letras"
                                        }
                                    })}
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="apellido" className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                                    id="apellido"
                                    {...register("apellido", {
                                        required: "El apellido es requerido",
                                        minLength: {
                                            value: 2,
                                            message: "Debe tener al menos 2 caracteres"
                                        },
                                        pattern: {
                                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                            message: "Solo se permiten letras"
                                        }
                                    })}
                                />
                                {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                                    id="direccion"
                                    {...register("direccion", {
                                        required: "La dirección es requerida",
                                        minLength: {
                                            value: 5,
                                            message: "La dirección debe tener al menos 5 caracteres"
                                        }
                                    })}
                                />
                                {errors.direccion && <div className="invalid-feedback">{errors.direccion.message}</div>}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="barrio" className="form-label">Barrio</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.barrio ? 'is-invalid' : ''}`}
                                    id="barrio"
                                    {...register("barrio", {
                                        required: "El barrio es requerido",
                                        minLength: {
                                            value: 3,
                                            message: "El barrio debe tener al menos 3 caracteres"
                                        }
                                    })}
                                />
                                {errors.barrio && <div className="invalid-feedback">{errors.barrio.message}</div>}
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    {...register("email", {
                                        required: "El email es requerido",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Email inválido"
                                        }
                                    })}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        {...register("password", {
                                            validate: validatePassword
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-light"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                </div>
                                <small className="form-text text-muted">
                                    La contraseña debe contener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                                </small>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                <div className="input-group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        {...register("confirmPassword", {
                                            required: "Por favor confirme su contraseña",
                                            validate: value => 
                                                value === password || "Las contraseñas no coinciden"
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-light"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-primary w-100">
                                    Registrarse
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Registro; 
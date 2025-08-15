import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import '../assets/css/login.css';

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();

    const onSubmit = (data) => {
        // Aquí irá la lógica de autenticación
        console.log('Iniciando sesión con:', data);
    };

    return (
        <main className="container my-4">
            <div className="row mb-4">
                <div className="col">
                    <h1>Iniciar Sesión</h1>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    {...register("email", {
                                        required: "El email es requerido",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email inválido"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-12">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        {...register("password", {
                                            required: "La contraseña es requerida"
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-light"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-primary w-100">
                                    Iniciar Sesión
                                </button>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <Link to="/recuperar-contraseña" className="d-block mb-2">¿Olvidaste tu contraseña?</Link>
                                <Link to="/registro">¿No tienes cuenta? Regístrate aquí</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Login; 
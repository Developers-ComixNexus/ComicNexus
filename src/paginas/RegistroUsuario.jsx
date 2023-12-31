import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ZEROBOUNCE_API_KEY = '1090cb61970442a6b5a5f3370c37eb68';

async function validateEmail(email) {
  const zeroBounceUrl = `https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`;

  try {
    const response = await axios.get(zeroBounceUrl);
    return response.data;
  } catch (error) {
    console.error('Error al validar el correo electrónico:', error);
    return null;
  }
}

function RegistroUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '', 
    password: '',
  });

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: '' });
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      setServerErrorMessage(null);
    }
    if (name === "username") {
      setServerErrorMessageUserName(null);
    }
  };

  const [serverErrorMessage, setServerErrorMessage] = useState(false);
  const [serverErrorMessageUserName, setServerErrorMessageUserName] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { ...errors };
    
    if (!formData.name) {
      newErrors.name = 'El nombre es obligatorio.';
    }
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio.';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres.';
    }
  
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else {
      const emailValidationResult = await validateEmail(formData.email);
      if (emailValidationResult && emailValidationResult.status !== 'valid') {
        newErrors.email = 'El correo electrónico no es válido.';
      }
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra mayúscula.';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un número.';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra minúscula.';
    }
    try {
      if (Object.values(newErrors).every((error) => !error)) {
        const response = await axios.post('https://comic-next-laravel.vercel.app/api/api/registro-usuario', formData);
          // La solicitud es exitosa
          console.log('Registro exitoso con:', formData);
          console.log('Respuesta del servidor:', response.data);
          navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        if (error.response.data.message === 'Correo ya está registrado en esta página') {
          setServerErrorMessage('Este correo ya fue registrado.');
        } else if (error.response.data.message === 'Nombre de usuario ya está registrado en esta página') {
          setServerErrorMessageUserName('Este nombre de usuario ya fue registrado.');
        } else if (error.response.data.message === 'Correo y nombre de usuario ya están registrados en esta página') {
          setServerErrorMessage('Este correo ya fue registrado.');
          setServerErrorMessageUserName('Este nombre de usuario ya fue registrado.');
        }
      } else {
        console.error('Error al registrar:', error);
      }
    }
    setErrors(newErrors);
  };

  return (
    <div className="form-container" style={{ width: '600px', margin: 'auto' }}>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title badabbm">Registro de Usuario</h2>
        <div className="image-container">
          <img src="./LogoComicsNexus.png" alt="Imagen de usuario" style={{ maxWidth: '50%', height: 'auto' }} />
        </div>
        <div className="form-group">
          <label>Nombre completo<span className="text-danger">*</span></label>
          <input
            type="text"
            name="name"
            placeholder="Ingrese su nombre"
            value={formData.name}
            onChange={handleChange}
          />
          <p className={`error-message ${errors.name ? '' : 'hidden'}`}>
            {errors.name}
          </p>
        </div>
        <div className="form-group">
          <label>Nombre de usuario<span className="text-danger">*</span></label>
          <input
            type="text"
            name="username"
            placeholder="Ingrese un nombre de usuario"
            value={formData.username}
            onChange={handleChange}
          />
          <p className={`error-message ${errors.username ? '' : 'hidden'}`}>
            {errors.username}
          </p>
          {serverErrorMessageUserName && (
          <p className='error-message-repetido'>
           {serverErrorMessageUserName}
          </p>
           )}
        </div>
        <div className="form-group">
          <label>Correo electrónico<span className="text-danger">*</span></label>
          <input
            type="email"
            name="email"
            placeholder="Ingrese un correo electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          <p className={`error-message ${errors.email ? '' : 'hidden'}`}>
            {errors.email}
          </p>
          {serverErrorMessage && (
          <p className='error-message-repetido'>
           {serverErrorMessage}
          </p>
           )}
        </div>
        <div className="form-group">
          <label>Contraseña<span className="text-danger">*</span></label>
          <div className="password-input">
            <input
              type={formData.showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Ingrese una contraseña"
              value={formData.password}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={formData.showPassword ? faEye : faEyeSlash}
              onClick={togglePasswordVisibility}
              className="password-toggle"
            />
          </div>
          <p className={`error-message ${errors.password ? '' : 'hidden'}`}>
            {errors.password}
          </p>
        </div>
        <div className="form-group" style={{ textAlign: 'center' }}>
          <button type="submit">Registrarse</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión aquí.</Link>
        </div>
      </form>
    </div>
  );
}

export default RegistroUsuario;

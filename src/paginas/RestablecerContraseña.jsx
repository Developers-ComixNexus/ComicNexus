import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestablecerContraseña() {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    cod: localStorage.getItem('nuevo')
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  const [passwordMatchError, setPasswordMatchError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    
    if (passwordMatchError) {
      setPasswordMatchError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmación de contraseña es obligatoria.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      setPasswordMatchError('Las contraseñas no coinciden.');
    }

    if (Object.keys(newErrors).length === 0) {
      if (formData.newPassword === formData.confirmPassword) {
        // Las contraseñas coinciden, puedes enviar la solicitud para restablecerla
        // Aquí debes agregar el código para enviar la solicitud de restablecimiento
        try {
          const response = await axios.post('https://comic-next-laravel.vercel.app/api/api/reset-password', {
            password: formData.newPassword,
            cod: localStorage.getItem('nuevo'),
          });
          // La solicitud es exitosa
          console.log('Registro exitoso con:', formData);
          console.log('Respuesta del servidor:', response.data);
          navigate('/');
        } catch (error) {
          console.error('Error al registrar:', error);
        }
        // Limpia los campos solo si las contraseñas coinciden
        setFormData({ newPassword: '', confirmPassword: '' });
      }
      
    }

    setErrors(newErrors);
  };

  return (
    <div className="form-container" style={{ width: '600px', margin: 'auto' }}>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title badabbm">Restablecer Contraseña</h2>
        <div className="image-container">
          <img src="./LogoComicsNexus.png" alt="Imagen de usuario" style={{ maxWidth: '50%', height: 'auto' }} />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faLock} /> Nueva Contraseña<span className="text-danger">*</span>
          </label>
          <div className="password-input">
            <input
              type={passwordVisibility.newPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Ingrese una nueva contraseña."
              maxLength="50"
            />
            <FontAwesomeIcon
              icon={passwordVisibility.newPassword ? faEye : faEyeSlash}
              onClick={() => togglePasswordVisibility('newPassword')}
              className="password-toggle"
            />
          </div>
          <p className={`error-message ${errors.newPassword ? 'text-danger' : 'hidden'}`}>
            {errors.newPassword}
          </p>
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faLock} /> Confirmar Contraseña<span className="text-danger">*</span>
          </label>
          <div className="password-input">
            <input
              type={passwordVisibility.confirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repita la misma contraseña para confirmarla."
              maxLength="50"
            />
            <FontAwesomeIcon
              icon={passwordVisibility.confirmPassword ? faEye : faEyeSlash}
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="password-toggle"
            />
          </div>
          <p className={`error-message ${errors.confirmPassword ? 'text-danger' : 'hidden'}`}>
            {errors.confirmPassword}
          </p>
        </div>
        <div className="form-group" style={{ textAlign: 'center' }}>
          <button type="submit">Restablecer Contraseña</button>
          <p className="error-message">{passwordMatchError}</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/">Volver al Inicio de Sesión</Link>
        </div>
      </form>
    </div>
  );
}

export default RestablecerContraseña;

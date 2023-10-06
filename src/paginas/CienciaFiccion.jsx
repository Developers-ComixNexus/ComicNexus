import React from 'react';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CardCat from '../componentes/CardCat';

const CienciaFiccion = () => {
  const [comicsData, setComicsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://comic-next-laravel.vercel.app/api/api/categoria/Ciencia_ficcion')
      .then((response) => {
        setComicsData(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <Container className="text-center my-5">
        <h1 className="display-4">Sección de ciencia ficción</h1>
        <p className="lead">Explora y descubre contenido increíble</p>
        <hr className="my-4" style={{ borderColor: 'var(--celestito)', borderWidth: '2px' }} />
      </Container>
      <div className="container">
        {isLoading ? (
          <p>Cargando cómics...</p>
        ) : comicsData.length === 0 ? (
          <p>No se encontraron cómics en esta categoría.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-4 g-4 mt-4">
            {comicsData.map((comic) => (
              <div className="col-md-4" key={comic.comic.cod_comic}>
                <CardCat comic={comic} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CienciaFiccion;

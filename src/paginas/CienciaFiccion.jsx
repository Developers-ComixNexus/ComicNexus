import React from 'react';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CardCat from '../componentes/CardCat';
import { Spinner } from 'react-bootstrap';

const CienciaFiccion = () => {
  const [comicsData, setComicsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);

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
  const getCurrentComics = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return comicsData.slice(startIndex, endIndex);
  };

  return (
    <div>
      <Container className="text-center my-5">
        <h1 className="display-4 badabb">Seccion de ciencia ficcion</h1>
        <hr className="my-4 custom-divider"  />
      </Container>
      <div className="container">
        {isLoading ? (
         <Container className="text-center my-5" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '50%', width: '200px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
         <Spinner animation="border" variant="primary" role="status">
           <span className="sr-only"></span>
         </Spinner>
         <p className="mt-2">Cargando cómics...</p>
       </Container>
        ) : comicsData.length === 0 ? (
          <p>No se encontraron cómics en esta categoría.</p>
        ) : (
          <div>
            <div className="row row-cols-1 row-cols-md-4 g-4 mt-4">
              {getCurrentComics().map((comic) => (
                <div className="col-md-4" key={comic.comic.cod_comic}>
                  <CardCat comic={comic} />
                </div>
              ))}
            </div>
            {comicsData.length > itemsPerPage && (
              <div className="mt-4 text-center">
                <button
                  className="btn custom-btn-color mx-2"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{border: '3px solid white', 
                  borderRadius: '8px'}}
                  disabled={currentPage === 1}
                >
                  Página Anterior
                </button>
                <button
                  className="btn custom-btn-color mx-2"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{border: '3px solid white', 
                  borderRadius: '8px'}}
                  disabled={currentPage * itemsPerPage >= comicsData.length}
                >
                  Siguiente Página
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CienciaFiccion;

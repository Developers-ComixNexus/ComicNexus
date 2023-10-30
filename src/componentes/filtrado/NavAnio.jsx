import React from 'react'
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios
import CardCat from '../CardCat'// Importa tu componente Card
import { Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const NavAnio = () => {
  const [comicsData, setComicsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Inicialmente, isLoading se establece en true
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    // Si el usuario no ingresa nada durante 300 ms, realizar la solicitud
    const delay = setTimeout(() => {
      setIsLoading(true);
      axios.get('https://comic-next-laravel.vercel.app/api/api/anio/' + search)
        .then((response) => {
          console.log(response.data);
          setComicsData(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
          setComicsData([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300); // 300 ms de retraso

    // Limpiar el temporizador si el usuario sigue escribiendo
    return () => clearTimeout(delay);
  }, [search]);
  
  const getCurrentComics = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return comicsData.slice(startIndex, endIndex);
  };

  return (
      
    <div className="container">
        {isLoading ? (
         <div className="text-center my-3">
         <Spinner animation="border" variant="primary" role="status">
           <span className="sr-only">.</span>
         </Spinner>
         <p className="mt-2">Cargando cómics...</p>
       </div>
        ) : comicsData.length === 0 ? (
          <p style={ { textAlign: "center", fontFamily: "Comic Sans MS", fontSize: "20px" }}>
          {search !== "¡" ? `No se han encontraron resultados para "${search}"` 
          : 'No se han encontraron resultados para ""'}
        </p>
        ) : (
          <div>
            <div className="row row-cols-1 row-cols-md-4 g-4 mt-4">
              {getCurrentComics().map((comic) => (
                <div className="col-md-4" key={comic.comic.cod_comic}>
                  <CardCat comic={comic} />
                </div>
              ))}
            </div>
            
          </div>
        )}
      </div>
  )
}

export default  NavAnio 
import "./styles.css";
import React, {   useState, useEffect,  useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile} from "@fortawesome/free-regular-svg-icons";
import { IoArrowBackCircle } from 'react-icons/io5';
import {AiOutlineFullscreen} from 'react-icons/ai'
import { FaArrowUp } from "react-icons/fa";
import { Container, Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function LeerCascada() {
  const [currentPage, setCurrentPage] = useState(1);
  const { cod } = useParams();
  const [isLoading, setIsLoading] = useState(true); 
  const [imageUrls, setImageUrls] = useState([]);
  let navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  // Variables de estado para controlar la visibilidad de los botones

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Desplazamiento suave
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullScreen) {
        if (event.keyCode === 38 && currentPage > 1) {
          // Flecha arriba
          setCurrentPage((prevPage) => prevPage - 1);
        } else if (event.keyCode === 40 && currentPage < imageUrls.length) {
          // Flecha abajo
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, imageUrls.length, isFullScreen]);
  


  const changemode = (e) =>{
    navigate(`/leer-paginacion/${cod}`)
  }

  const backpage = (e)=>{
    navigate(`/vista-comic/${cod}`)
  }

  useEffect(() => {
    // Llamar a la API de Laravel para obtener las imágenes
    axios.get(`https://comic-next-laravel.vercel.app/api/api/getpaginas/${cod}`)
      .then((response) => {
        // axios ya transforma la respuesta JSON automáticamente
        // Verificar la cantidad de páginas en la respuesta
        const images = response.data; // Suponiendo que response.data es un arreglo de imágenes
        setImageUrls(images);
      })
      .catch((error) => {
        console.error("Error al obtener las imágenes del comic:", error);
      })
      .finally(() => {
        // Establece isLoading en false una vez que la solicitud se ha completado (ya sea con éxito o con error)
        setIsLoading(false);
        setCurrentPage(1);
      });
  }, [cod]);
  
  const toggleFullScreen = () => {
    const element = document.getElementById('cascada');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen();
    } };
  
   useEffect(() => {
    const handleKeyDown = (event) => {
      const element = document.getElementById('cascada');
      if (event.key === 'ArrowUp') {
        element.scrollTop -= 130; // Desplazamiento hacia arriba
      } else if (event.key === 'ArrowDown') {
        element.scrollTop += 130; // Desplazamiento hacia abajo
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="Leer">
      <Container className="text-center my-5">
        <div className="button-container">
          <Button variant="link" className="control-button" onClick={backpage}>
            <IoArrowBackCircle  />
            <span>Atrás</span>
          </Button>
          <Button variant="link" className="control-button" onClick={changemode}>
          <FontAwesomeIcon icon={faFile} /> 
            <span>Paginación</span>
          </Button>
          <Button variant="link" className="control-button" onClick={toggleFullScreen}>
            <AiOutlineFullscreen /> 
            <span>Pantalla Completa</span>
          </Button>
        </div>
      </Container>
      <Container className="text-center my-5">
      <hr className="my-4 custom-divider"  />
      </Container>
        {isLoading ? (
        <Container className="text-center my-5" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '50%', width: '200px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner animation="border" variant="primary" role="status">
            <span className="sr-only"></span>
          </Spinner>
          <p className="mt-2">Cargando paginas...</p>
        </Container>
      ) :  imageUrls.length === 1 ? (
        <Container className="text-center my-5" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '50%', width: '450px', height: '75px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ fontSize: "20px"}}>
          El cómic seleccionado no tiene contenido subido.
        </p>
        </Container>
      ) : (
        <Container>
  <div id="cascada" className="overflow-auto h-100">
    {imageUrls.map((imageUrl, index) => (
      <div key={index} className="d-flex justify-content-center">
        
          <LazyLoadImage
            key={index}
            src={imageUrl.pagina}
            alt={`Page ${index}`}
            effect="blur"
            width={700}
            height={650}
            className="full-image"
            placeholderSrc={imageUrl.pagina}
            onLoad={() => setCurrentPage(index+1)} // Actualizar currentPage al cargar una nueva imagen
          />
       
      </div>
    ))}
  </div> 
  <div className="position-fixed bottom-0 end-0 p-3 contenedor-badge">
    <div className="numero-pages">
        <h2>
            <span className="badge rounded-pill text-dark bg-light">
            {currentPage} / {imageUrls.length} páginas
            </span>
        </h2>
        </div> 
      <button className="btn btn-inverted" onClick={scrollToTop}><FaArrowUp /></button>
    </div>
    
</Container>

      )}
      
    </div>
  );
}

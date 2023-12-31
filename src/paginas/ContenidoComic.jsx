import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, ProgressBar } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Link } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import './styles.css';

function ContenidoComic() {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comicsData, setComicsData] = useState([]);
  const [selectedComic, setSelectedComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const handleShowConfirmationModal = () => setShowConfirmationModal(true);
  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  const confirmUpload = () => {
    handleCloseConfirmationModal();
    uploadImages();
  };
  

  useEffect(() => {
    axios.get('https://comic-next-laravel.vercel.app/api/api/comicsSinContenido')
      .then((response) => {
        console.log(response.data);
        setComicsData(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const calculateProgress = (index) => Math.round(((index + 1) / images.length) * 100);

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
    const validFiles = acceptedFiles.filter(file =>
      acceptedImageTypes.includes(file.type)
    );
  
    // Manejar los archivos válidos aquí (ejemplo: enviarlos a un servidor, procesarlos, etc.)
    console.log('Archivos válidos:', validFiles);
  
    // Manejar los archivos rechazados si es necesario
    if (rejectedFiles.length > 0 || validFiles.length !== acceptedFiles.length) {
      console.log('Archivos rechazados:', rejectedFiles);
      Swal.fire({
        icon: 'error',
        title: 'Solo se permiten archivos JPG y PNG',
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    if (images.length + acceptedFiles.length > 35) {
      Swal.fire({
        icon: 'warning',
        title: 'Maximo 35 imagenes!',
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    const newImages = await Promise.all(
      acceptedFiles.map(async (file) => {
        const base64String = await readFileAsBase64(file);
        return { file, preview: URL.createObjectURL(file), base64String };
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: onDrop,
  });
  const uploadImages = async () => {
    if (!selectedComic) {
      Swal.fire({
        icon: 'warning',
        title: 'Seleccione un cómic primero',
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    if(images == 0){
      Swal.fire({
        icon: 'warning',
        title: 'Debe subir al menos una imagen',
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    try {
      const totalImages = images.length;

      const promises = images.map(async (image, index) => {
        const imageData = {
          imagenes: [image.base64String],
          cod_comic: selectedComic.comic.cod_comic,
          pag: index + 1,
        };

        console.log('Datos que se enviarán al servidor:', imageData);

        const response = await axios.post(
          'https://comic-next-laravel.vercel.app/api/api/registroContenidoComic',
          imageData,
          {
            onUploadProgress: (progressEvent) => {
              // Cambiado: Calcula el progreso en función del número de imágenes
              const progress = calculateProgress(index);
              setUploadProgress(progress);
            },
          }
        );

        return response.data;
      });

      await Promise.all(promises);

      setUploadProgress(0);
      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: 'Contenido subido con éxito',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
      console.log('Imágenes subidas correctamente.');
    } catch (error) {
      setUploadProgress(0);
      console.error('Error al subir imágenes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al subir imágenes',
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  };
  
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSelectComic = (comic) => {
    setSelectedComic(comic);
    handleCloseModal();
  };

  const clearImages = () => {
    setImages([]);
  };
  const handleIconClick = () => {
    Swal.fire({
      icon: 'info',
      title: 'Cómo subir contenido a un cómic',
      html:
        '<p>1. Primero, selecciona un cómic de la lista de cómics sin contenido.</p>' +
        '<p>2. Arrastra y suelta las imágenes en la zona indicada o haz clic para seleccionarlas.</p>' +
        '<p>3. Haz clic en "Subir imágenes" para completar el proceso.</p>',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-info', 
      },
    });
  };
  

  return (
    <Container className="text-center my-5 ">
      <h1 className="display-4 badabb">
        <strong>Registro contenido comic</strong>
        <Button
          variant="link"
          onClick={handleIconClick}
        >
          <i class="bi bi-info-circle-fill" style={{ marginLeft: '50px', fontSize: '3.5em' }}></i>
        </Button>
      </h1>
      <hr className="my-4 custom-divider" />
      <Row>
        <Col xs={12} md={4}>
          {selectedComic ? (
            <>
              <img
                src={selectedComic.portadaUrl}
                alt={selectedComic.comic.titulo}
                style={{
                  width: "300px",
                  height: "470px",
                  borderRadius: '8px',
                  border: '3px solid white',
                  marginRight: '100px'
                }}
              />
              <div
                style={{
                  marginTop: '20px',
                  marginLeft: '10px',
                  width: '300px',
                  height: '100px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                <h4>Título: {selectedComic.comic.titulo}</h4>
                <p>Autor(es): {selectedComic.comic.autor}</p>
              </div>
            </>
          ) : (
            <div
              className="empty-image-container"
              style={{
                width: "300px",
                height: "470px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                border: '3px solid white',
                borderRadius: '8px'
              }}
            >
              Escoja un cómic
            </div>
          )}
          <div className='text-center'>
            <button
              className="btn custom-btn-color"
              style={{
                marginTop: '20px',
                width: '180px',
                height: '60px',
                justifyContent: 'center',
                lineHeight: '35px',
                border: '3px solid white',
                borderRadius: '8px',
                marginRight: '110px'
              }}
              onClick={handleShowModal}
            >
              Seleccionar Cómic
            </button>
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div>
            <div {...getRootProps()} style={dropzoneStyles}>
              <input {...getInputProps()} />
              <p>Arrastra y suelta las imágenes aquí, o haz clic para seleccionarlas</p>
            </div>
            <div style={previewStyles}>
              {images.map((file, index) => (
                <div key={file.name} style={imageContainerStyles}>
                  <img
                    src={file.preview}
                    alt={file.name}
                    style={imageStyles}
                  />
                  <div style={deleteIconStyles} onClick={() => removeImage(index)}>
                    &times;
                  </div>
                </div>
              ))}
            </div>
            <Row>
              <Col>
                <button
                  onClick={handleShowConfirmationModal}
                  className="btn custom-btn-color"
                  style={{
                    marginTop: '20px',
                    width: '180px',
                    height: '60px',
                    justifyContent: 'center',
                    lineHeight: '35px',
                    border: '3px solid white',
                    borderRadius: '8px',
                    marginRight: '10px', // Ajusta el margen según sea necesario
                  }}
                >
                  Subir imágenes
                </button>
              </Col>
              <Col>
                <button
                  className="btn custom-btn-color"
                  style={{
                    marginTop: '20px',
                    width: '180px',
                    height: '60px',
                    justifyContent: 'center',
                    lineHeight: '35px',
                    border: '3px solid white',
                    borderRadius: '8px',
                    marginRight: '10px', // Ajusta el margen según sea necesario
                  }}
                  onClick={clearImages}
                >
                  Limpiar
                </button>
              </Col>
              <Col>
                <Link
                  className="btn Warning-btn-color"
                  to="/pagina-admi"
                  style={{
                    marginTop: '20px',
                    width: '180px',
                    height: '60px',
                    justifyContent: 'center',
                    lineHeight: '40px',
                    border: '3px solid white',
                    borderRadius: '8px',
                  }}
                >
                  Cancelar
                </Link>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>A qué cómic quieres añadir contenido?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(80vh - 130px)', overflowY: 'auto' }}>
          <ul className='playlist-list'>
            {comicsData.map((comic) => (
              <li key={comic.comic.id}>
                <div className='playlist-item'>
                  <img
                    src={comic.portadaUrl}
                    alt={comic.comic.titulo}
                    className='contenido-image'
                  />
                  <span className='playlist-title'>{comic.comic.titulo}</span>
                  <Button
                    className='btn custom-btn-color'
                    onClick={() => handleSelectComic(comic)}
                  >
                    Seleccionar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn Warning-btn-color" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={uploadProgress > 0} backdrop="static" keyboard={false} centered>
        <Modal.Body>
          <h5>Subiendo contenido al comic...</h5>
          <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} variant='var(--celestito)'/>
        </Modal.Body>
      </Modal>
            <Modal
        show={showConfirmationModal}
        onHide={handleCloseConfirmationModal}
        style={{
          //position: 'absolute',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px', // Ajusta este valor según tus necesidades
          // height: 'auto', // Puedes comentar esta línea para que el tamaño se ajuste automáticamente al contenido
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
      <Modal.Header closeButton style={{ textAlign: 'center' }}>
          <Modal.Title style={{ margin: 'auto' }}>Confirmar subida de imágenes</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          ¿Está seguro de registrar las {images.length} imágenes?
        </Modal.Body>
        <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
          <Button className="btn Warning-btn-color" onClick={handleCloseConfirmationModal} style={{marginRight: '10px'}}>
            No
          </Button>
          <Button className='btn custom-btn-color' onClick={confirmUpload}>
            Sí
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: '20px',
  minHeight: '150px',
  marginTop: '20px',
  backgroundColor: "white"
};

const previewStyles = {
  display: 'flex',
  marginTop: '20px',
  overflowX: 'auto',
  maxHeight: '300px',
  backgroundColor: 'white', 
  '&::-webkit-scrollbar': {
    width: '12px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'red',  
    borderRadius: '10px',
  },
};


const imageContainerStyles = {
  position: 'relative',
  marginRight: '10px',
};

const imageStyles = {
  width: '150px',
  height: '200px',
  objectFit: 'cover',
};

const deleteIconStyles = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  background: 'red',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export default ContenidoComic;

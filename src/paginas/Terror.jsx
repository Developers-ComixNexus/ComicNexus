import React from 'react'
import { Container } from 'react-bootstrap';


const Terror = () => {
  return (
    <div>
      <Container className="text-center my-5">
      <h1 className="display-4">Seccion de terror</h1>
      <p className="lead">Explora y descubre contenido increíble</p>
      <hr className="my-4" style={{ borderColor: 'var(--verdesito)', borderWidth: '2px' }} />
    </Container>
  </div>
  )
}

export default Terror
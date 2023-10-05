import React from 'react'
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PaginaAdmi() {
  return (
    <div>
        <Container className="text-center my-5">
            <h1 className="display-4">Panel administrador</h1>
            <hr className="my-4" style={{ borderColor: 'var(--verdesito)', borderWidth: '2px' }}/>
        </Container>
        <div class="row">
        <div class="col-sm-6 mb-3 mb-sm-0">
            <div class="card text-center">
            <div class="card-body">
                <h5 class="card-title">Añadir nuevo comic a la plataforma</h5>
                <p class="card-text">Para registrar un nuevo comic y agregar sus datos presione el boton de abajo.</p>
                <Link class="btn custom-btn-color" to="/registro-comic">Añadir comic</Link>
            </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="card text-center">
            <div class="card-body">
                <h5 class="card-title">Elimar comic existente de la plataforma</h5>
                <p class="card-text">Para eliminar el registro y datos de un comic ya existente presione el boton.</p>
                <a href="#" class="btn desact-btn-color">Eliminar comic</a>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default PaginaAdmi
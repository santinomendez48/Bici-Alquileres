function Contacto() {
    return (
        <main className="container my-4">
            <h1 className="mb-4">Centro de Contacto y Ayuda</h1>

            <div className="row">
                <div className="col-md-6">
                    <div className="mb-4 d-flex align-items-start">
                        <i className="bi bi-tools fs-2 text-primary me-3"></i>
                        <div>
                        <h5>Problemas técnicos</h5>
                        <p>Si tienes algún problema técnico con tu bicicleta, comunícate con nosotros para resolverlo lo antes posible.</p>
                        </div>
                    </div>
                    <div className="mb-4 d-flex align-items-start">
                        <i className="bi bi-clock-history fs-2 text-danger me-3"></i>
                        <div>
                        <h5>Devolución tardía</h5>
                        <p>Si no pudiste devolver tu bici a tiempo te explicamos como proceder en estos casos.</p>
                        </div>
                    </div>
                    <div className="mb-4 d-flex align-items-start">
                        <i className="bi bi-geo-alt fs-2 text-warning me-3"></i>
                        <div>
                        <h5>disponibilidad de estaciones</h5>
                        <p>Consulta si las estaciones cercanas están llenas o vacías.</p>
                        </div>
                    </div>
                </div>
            
                <div className="col-md-6">
                    <div className="form-floating mb-4">
                        <input type="text" className="form-control" id="floatingInputGroup1" placeholder="Nombre"></input>
                        <label htmlFor="floatingInputGroup1">Nombre</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input type="email" className="form-control" id="floatingInput" placeholder="Correo Electrónico"></input>
                        <label htmlFor="floatingInput">Correo Electrónico</label>
                    </div>
                
                    <div className="form-floating mb-4">
                        <textarea className="form-control" placeholder="Mensaje" id="floatingTextarea2" style={{height: "100px"}}></textarea>
                        <label htmlFor="floatingTextarea2">Mensaje</label>
                    </div>

                    <div className= "ms-0">
                        <button className="btn btn-primary w-100" type="button">
                            <i className="bi bi-send me-2"></i>
                            <span>Enviar Mensaje</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Contacto;

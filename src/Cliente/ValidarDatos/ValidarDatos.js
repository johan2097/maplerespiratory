import React, { Component } from 'react';
import './ValidarDatos.css';
import IconoMaple from '../../Imagenes/Logos/logo_maple.svg';
import IconCorrect from '../../Imagenes/Iconos/Correct.svg';
import IconError from '../../Imagenes/Iconos/wrong.svg';
import Axios from 'axios';


class ValidarDatos extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.state = {
            terminos: false,
            tipoDocumento: '',
            fechaNacimiento: '',
            documento: '',
            genero: '',
            email: '',
            forgotPassword: false,
        }
    }


    componentDidMount() {
        // const validateData = JSON.parse(localStorage.getItem('validateData'))
        const validateData = this.props.location.state
        if (validateData) {
            this.setState({
                validateData,
                forgotPassword: validateData.forgotPassword,
            })
        }
    }
    handleChange(event) {
        const name = event.target.name;
        const data = event.target.value;
        this.setState({ [name]: data });
    }

    handleToggle(event) {
        const name = event.target.name;
        this.setState(prevState => ({
            [name]: !prevState[name]
        }))

    }
    OnSubmit = async () => {
        // console.log(this.state)

        try {
            if (!this.state.terminos) {
                this.OnOpenModalError()
                return
            }

            const formData = {
                documento: this.state.documento,
                fechaNacimiento: this.state.fechaNacimiento,
                tipoDocumento: this.state.tipoDocumento,
                genero: this.state.genero,
            }
            let res = null
            if (this.state.forgotPassword)
                res = await Axios.post('/user/validate', formData)
            else {
                res = await Axios.post('/patient-data/validate', formData)
                this.setState({ email: res.data.email })
            }

            // console.log(res)
            if (res.status === 200) {
                // sessionStorage.setItem('validateData', JSON.stringify(formData))
                // this.OnOpenModalCorrect()
                this.OnCloseModalCorrect()
            }
        } catch (err) {
            console.log(`[Validate err]: ${JSON.stringify(err.message)}`)
            if (err.response.data.reason === "exist")
                this.OnOpenModalExist()
            else
                this.OnOpenModalError()
        }
    }

    //_____________________MODAL'S_______________________________
    OnOpenModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "block";
    }

    OnCloseModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "none";
        this.props.history.push({
            pathname: "/registro",
            state: this.state,
        });
    }

    OnOpenModalError = () => {
        document.getElementById("ModalError").style.display = "block";
    }

    OnCloseModalError = () => {
        document.getElementById("ModalError").style.display = "none";
    }


    OnOpenModalExist = () => {
        document.getElementById("ModalExist").style.display = "block";
    }

    OnCloseModalExist = () => {
        document.getElementById("ModalExist").style.display = "none";
        this.props.history.push({
            pathname: "/",
        });
    }
    onLogin = () => {
        this.props.history.push({ pathname: "/" });
    }
    //_____________________END MODAL'S_______________________________

    render() {

        return (
            <div className="fondo">


                <div id="ModalCorrect" className="modal">

                    <div className="modal-content">

                        <figure className="Icon" align="Center" >
                            <img id="logoIni" className="IconImg" src={IconCorrect} alt="Icon" />
                        </figure>

                        <br></br>
                        <br></br>
                        <div className="labelPopUp" align="Center">
                            <label>¡Los datos han sido</label>
                            <br></br>
                            <label>validados con <b>éxito!</b></label>
                        </div>

                        <div className="BtnGuardar" align="Center">
                            <button className="ButtonLog" type="button" onClick={this.OnCloseModalCorrect}>Aceptar</button>
                        </div>
                        <div className="Bottom" align="Center">
                            <label className="LabelGrisPopUp">Maple Respiratory Colombia</label>
                        </div>

                    </div>
                </div>


                <div id="ModalError" className="modal">

                    <div className="modal-content">

                        <figure className="Icon" align="Center" >
                            <img src={IconError} className="IconImg" alt="Icon" />
                        </figure>

                        <br></br>
                        <br></br>
                        <div className="labelPopUp" align="Center">
                            <label><b>Por favor verificar</b></label>
                            <br></br>
                            <label>la información del formulario</label>
                        </div>

                        <div className="BtnGuardar" align="Center">
                            <button className="ButtonLog" type="button" onClick={this.OnCloseModalError}>Aceptar</button>
                        </div>
                        <div className="Bottom" align="Center">
                            <label className="LabelGrisPopUp">Maple Respiratory Colombia</label>
                        </div>

                    </div>
                </div>

                <div id="ModalExist" className="modal">

                    <div className="modal-content">

                        <figure className="Icon" align="Center" >
                            <img src={IconError} className="IconImg" alt="Icon" />
                        </figure>

                        <br></br>
                        <br></br>
                        <div className="labelPopUp" align="Center">
                            <label><b>Este usuario ya existe</b></label>
                            <br></br>
                            <label>por favor ingresar normalmente o recupere la contraseña si no la recuerda</label>
                        </div>

                        <div className="BtnGuardar" align="Center">
                            <button className="ButtonLog" type="button" onClick={this.OnCloseModalExist}>Aceptar</button>
                        </div>
                        <div className="Bottom" align="Center">
                            <label className="LabelGrisPopUp">Maple Respiratory Colombia</label>
                        </div>

                    </div>
                </div>

                <figure className="logo" align="Center">
                    <img src={IconoMaple} alt="logo" />
                </figure>

                <div className="PanelBlancoValidacion" align="Center">
                    <div className="ZoneLabel">

                        <label className="titleLogin" align="Center">Validación de datos</label>
                        <br></br>
                        <label className="subtitleLogin">{this.state.forgotPassword ? "para recuperar la contraseña" : "para continuar con el proceso de registro"}</label>

                    </div>

                    <div className="InputRegistro">

                        <div className="Zone_Button_Center">
                            <div className="columna">
                                <select className="Registro-input" type="text" placeholder="Tipo de documento" name="tipoDocumento" value={this.state.tipoDocumento} onChange={this.handleChange} >
                                    <option value="">Tipo de documento</option>
                                    <option value="CC">Cédula de ciudadania</option>
                                    <option value="CE">Cédula de extranjería</option>
                                    <option value="PA">Pasaporte</option>
                                    <option value="RC">Regristro Civil</option>
                                    <option value="TI">Tarjeta de identidad</option>
                                    <option value="MS">Menor sin identificar</option>
                                    <option value="PE">Permiso Especial de Eermanencia</option>
                                    <option value="CD">Carné diplomático</option>
                                    <option value="SC">Salvo conducto</option>
                                    <option value="CN">Certificado de nacido vivo</option>
                                </select>
                            </div>
                            <div className="columna">
                                <label htmlFor="number"></label>
                                <input className="Registro-input" type="text" placeholder="Número de documento" name="documento" value={this.state.documento} onChange={this.handleChange} />
                            </div>
                        </div>


                        <div className="rowLogin">
                            <div className="RightLogin">

                            </div>
                            <div className="campo-registro">
                                <div className="fecha fehaNacimientoLabel">
                                    <label className="subtitleRegistro"><b>Fecha de Nacimiento</b></label>
                                </div>
                                <div className="fecha">
                                    <input className="Validar-input" type="date" placeholder="Fecha de nacimiento" name="fechaNacimiento" value={this.state.fechaNacimiento} onChange={this.handleChange} ></input>
                                </div>
                            </div>
                            <div className="campo-registro">
                                <div className="genero">
                                    <label className="subtitleRegistro"><b>Género</b></label>
                                </div>
                                <div className="genero">
                                    <input type="radio" value="M" name="genero" onChange={this.handleChange} />
                                    <label className="subtitleLogin"><b>Hombre</b></label>
                                </div>
                                <div className="genero">
                                    <input type="radio" value="F" name="genero" onChange={this.handleChange} />
                                    <label className="subtitleLogin"><b>Mujer</b></label>
                                </div>
                            </div>
                            <div className="leftLogin">

                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="rowLogin">
                        <div className="RightLogin">

                        </div>
                        <div className="leftInterLogin">
                            <input type="checkbox" name="terminos" value={this.state.terminos} onChange={this.handleToggle} />
                            <label className="LabelCopy">Acepto términos y condiciones</label>
                        </div>
                        <div className="rightInterLogin"></div>
                        <button className="ButtonLog" type="button" align="Right" onClick={this.OnSubmit}>Validar</button>
                        <br/>
                        <div className="botonlogin">
                        <button className="ButtonLog" type="button" align="Right" onClick={this.onLogin}>Volver al login</button>
                        </div>
                    </div>
                </div>



                <div className="Bottom" align="Center">

                    <label className="LabelCopy">Copyright Maple Respiratory Colombia © 2022</label>
                </div>


            </div >
        )
    }
}

export default ValidarDatos;

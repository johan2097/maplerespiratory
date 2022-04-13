import React, { Component } from 'react';
import './Registro.css';
import IconCorrect from '../../Imagenes/Iconos/Correct.svg';
import IconError from '../../Imagenes/Iconos/wrong.svg';
import IconoMaple from '../../Imagenes/Logos/logo_maple.svg';
import Axios from 'axios';

class Registro extends Component {

    constructor(props) {
        super(props)

        this.state = {
            documento: "",
            password: "",
            repeat_password: "",
            fechaNacimiento: "",
            genero: "",
            t_documento: "",
            email: "",
            forgotPassword: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const data = event.target.value
        this.setState({ [name]: data });
    }

    onValidacion = async () => {
        const { password, repeat_password } = this.state
        if (password === repeat_password) {
            let res
            if (this.state.forgotPassword) {
                res = await Axios.post(`/user/forgot-password/${this.state.documento}`, {
                    tipoDocumento: this.state.t_documento,
                    documento: this.state.documento,
                    genero: this.state.genero,
                    fechaNacimiento: this.state.fechaNacimiento,
                    password: password,
                    new_password: password,
                })
            } else {
                res = await Axios.post('/user/create', {
                    tipoDocumento: this.state.t_documento,
                    documento: this.state.documento,
                    email: this.state.email,
                    password: password,
                    ...this.state.validateData,
                })
            }
            if (res.status === 200) {
                this.OnOpenModalCorrect()
            } else {
                this.OnOpenModalError()
            }
        } else {
            this.OnOpenModalError()
        }
    }

    componentDidMount() {
        // const validateData = JSON.parse(localStorage.getItem('validateData'))
        const validateData = this.props.location.state
        if (validateData) {
            this.setState({
                validateData,
                documento: validateData.documento,
                t_documento: validateData.tipoDocumento,
                forgotPassword: validateData.forgotPassword,
                genero: validateData.genero,
                fechaNacimiento: validateData.fechaNacimiento,
                email: validateData.email
            })
        }
    }
    //_____________________MODAL'S_______________________________
    OnOpenModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "block";
    }

    OnCloseModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "none";
        this.props.history.push({ pathname: "/" });
    }

    OnOpenModalError = () => {
        document.getElementById("ModalError").style.display = "block";
    }

    OnCloseModalError = () => {
        document.getElementById("ModalError").style.display = "none";
    }
    //_____________________END MODAL'S_______________________________


    render() {

        // console.log(this.state)
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
                            <label>guardados con <b>éxito!</b></label>
                            <br></br>
                            <label>Ahora es necesario ingresar</label>
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

                <figure className="logo" align="Center">
                    <img id="logoIni" src={IconoMaple} alt="logo" />
                </figure>

                <div className="PanelBlancoRegistro" align="Center">
                    <div className="ZoneLabel">

                        <label className="titleLogin" align="Center">Registro de datos</label>

                    </div>

                    <div className="InputRegistro">

                        <div className="Zone_Button_Center">
                            <div className="columna">
                                <select
                                    className="Registro-input"
                                    type="text"
                                    placeholder="Tipo de documento"
                                    name="t_documento"
                                    value={this.state.t_documento}
                                    onChange={this.handleChange}
                                    disabled>
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
                                <input className="Registro-input" type="text" placeholder="Número de documento" name="documento" value={this.state.documento} onChange={this.handleChange} disabled />
                            </div>
                        </div>

                        <div className="Correo">
                            <label htmlFor="email"></label>
                            {this.state.forgotPassword ? null :
                                <input className="Registro-input-Correo" type="text" placeholder="Correo electrónico" name="email" value={this.state.email} onChange={this.handleChange} />
                            }

                        </div>

                        <div className="Zone_Button_Center">
                            <div className="columna">
                                <label htmlFor="psw"></label>
                                <input className="Registro-input-contraseña" type="password" placeholder="Contraseña" name="password" value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <div className="columna">
                                <label htmlFor="psw"></label>
                                <input className="Registro-input-contraseña" type="password" placeholder="Confirmar contraseña" name="repeat_password" value={this.state.repeat_password} onChange={this.handleChange} />
                            </div>
                        </div>
                    </div>


                    <div className="BtnGuardar" align="Center">
                        <button className="ButtonLog" type="button" onClick={this.onValidacion}>Guardar</button>
                    </div>
                </div>

                <div className="Bottom" align="Center">
                    <label className="LabelCopy">Copyright Maple Respiratory Colombia © 2022</label>
                </div>


            </div>
        )
    }
}

export default Registro;
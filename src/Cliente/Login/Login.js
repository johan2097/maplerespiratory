import React, { Component } from 'react';
import './Login.css';
import IconoMaple from '../../Imagenes/Logos/logo_maple.svg';
import IconError from '../../Imagenes/Iconos/wrong.svg';


class Login extends Component {


    


    onRegistro = () => {
        this.props.history.push({ pathname: "/registro" });
    }

    onForgot = () => {
        this.props.history.push({ pathname: "/validacion", state: { forgotPassword: true } });
    }
    onExitoso = () => {
        this.props.history.push({ pathname: "/exitoso"});
    }

    OnOpenModalError = () => {
        document.getElementById("ModalError").style.display = "block";
    }

    OnCloseModalError = () => {
        document.getElementById("ModalError").style.display = "none";
    }

    render() {

        return (         
                            <div className='fondo'>
                            
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

                            <div className="PanelBlanco" align="Center">
                                <div className="ZoneLabel">
                                    <label className="titleLogin" align="Center">Inicia la sesión</label><br></br>
                                    <label className="subtitleLogin">para consultar sus resultados</label>
                                </div>

                                <div className="ZoneInput">
                                    <div className="Input">
                                        <label htmlFor="numeric"></label>
                                        <input className="Login-input" type="text" placeholder="Documento de Identidad" name="username"  />
                                    </div>

                                    <div className="Input">
                                        <label htmlFor="psw"></label>
                                        <input className="Login-input" type="password" placeholder="Contraseña" name="password"  />
                                    </div>
                                </div>

                                <div className="rowLogin">
                                    <div className="leftLogin">

                                    </div>

                                    <div className="leftInterLogin">
                                        <input type="checkbox" name="Remember" />
                                        <label className="LabelCopy">Recuérdame</label>
                                    </div>

                                    <div className="rightInterLogin">
                                        <button className="ButtonLog" type="button" align="Right" onClick={this.onExitoso}>Ingresar</button>
                                    </div>

                                    <div className="leftLogin">

                                    </div>
                                </div>


                                <div className="OlvContraseña">
                                    <button className="LabelInternoContraseña" onClick={this.onForgot}><u><b>¿Olvidó su contraseña?</b></u></button>
                                </div>

                            </div>


                            <div className="Bottom" align="Center">
                                <button className="ButtonLarge" type="button" align="Right" onClick={this.onRegistro}>Soy nuevo y deseo <b>registrarme</b></button>
                            </div>
                            <div className="Copy" align="Center">
                                <label className="LabelCopy">Copyright Maple Respiratory Colombia © 2022</label>
                            </div>
                        </div>
                    
        )
    }
}

export default Login;
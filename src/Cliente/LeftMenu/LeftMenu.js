import React, { Component } from 'react';
import IconoMaple from '../../Imagenes/Logos/logo_maple_blanco.svg';
import IconoConsultar from '../../Imagenes/Iconos/Consultar.svg';
import IconoActualizar from '../../Imagenes/Iconos/Actualizar Datos.svg';
import IconoContraseña from '../../Imagenes/Iconos/CambiarContraseña.svg';
import IconoCerrar from '../../Imagenes/Iconos/CerrarSesion.svg';
import { AuthConsumer } from '../../AuthContext';
import _ from 'lodash';

import './LeftMenu.css'

const toProperCase = function (str) {
    if (str == null || str === '') return str
    // console.log(str)
    return _.startCase(_.toLower(str));
};


export default class LeftMenu extends Component {


    constructor(props) {
        super(props)

        this.state = {
            userInfo: JSON.parse(localStorage.getItem("userInfo")) || { p_nombre: '', s_nombre: '', p_apellido: '', s_apellido: '' }
        }
    }

    onConsultar = () => {
        this.props.history.push({ pathname: "/consultar" });
    }

    onEventos = () => {
        this.props.history.push({ pathname: "/eventos" });
    }

    onActualizar = () => {
        this.props.history.push({ pathname: "/actualizar" });
    }

    onContraseña = () => {
        this.props.history.push({ pathname: "/contraseña" });
    }
    onLogin = () => {
        this.props.history.push({ pathname: "/" });
    }

    render() {
        // console.log(this.state.userInfo)
        return (
            <div className="left">
                <div className="MenuLateral">
                    <div className="LogoMaple">
                        <figure className="logoInterno" align="Left">
                            <img id="LogoBlanco" src={IconoMaple} alt="logo" />
                        </figure>
                        <h2 className="userTitle">{`${toProperCase(this.state.userInfo.p_nombre)} ${this.state.userInfo.s_nombre.slice(0, 1).toUpperCase()}. ${toProperCase(this.state.userInfo.p_apellido)} ${this.state.userInfo.s_apellido.slice(0, 1).toUpperCase()}.`}</h2>
                    </div>


                    <div className="BotonesLaterales">

                        <button className="BtnInterno" type="button" name="BtnConsultar" onClick={this.onConsultar}>
                            <img className="IconMenu" src={IconoConsultar} alt="consultar" />
                            <label className="LabelInterno">Resultados</label>
                        </button>
                        <br></br>
                        <button className="BtnInterno" type="button" name="BtnActualizar" onClick={this.onActualizar}>
                            <img className="IconMenu" src={IconoActualizar} alt="actualizar" />
                            <label className="LabelInterno">Actualizar datos</label>
                        </button>
                        <br></br>
                        <button className="BtnInterno" type="button" name="BtnContraseña" onClick={this.onContraseña}>
                            <img className="IconMenu" src={IconoContraseña} alt="contraseña" />
                            <label className="LabelInterno">Cambiar contraseña</label>
                        </button>
                        <br></br>
                        {this.state.userInfo.rol === "admin" ?
                            <>
                                <button className="BtnInterno" type="button" name="BtnCerrar" onClick={this.onEventos}>
                                    <img className="IconMenu" src={IconoContraseña} alt="cerrar" />
                                    <label className="LabelInterno">Eventos</label>
                                </button>
                                <br></br></> : null
                        }
                        <AuthConsumer>
                            {({ logout }) => (
                                <button className="BtnInterno" type="button" name="BtnCerrar" onClick={this.onLogin}>
                                    <img className="IconMenu" src={IconoCerrar} alt="cerrar" />
                                    <label className="LabelInterno">Cerrar Sesión</label>
                                </button>
                            )}
                        </AuthConsumer>
                        <br></br>

                        <div className="AyudaZone">
                            <button className="BtnAyuda" type="button" name="Ayuda">
                                <label className="LabelInterno">¿Necesita ayuda?</label>
                            </button>
                        </div>


                    </div>
                </div>

            </div>
        )
    }
}
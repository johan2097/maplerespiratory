import React, { Component } from 'react';
import './ActualizarDatos.css';
import LeftMenu from "../LeftMenu/LeftMenu";
import Axios from 'axios';
import { municipiosTypes } from './municipios';

class ActualizarDatos extends Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            p_nombre: '',
            s_nombre: '',
            p_apellido: '',
            s_apellido: '',
            t_documento: 0,
            documento: '',
            email: '',
            direccion: '',
            c_departamento: -1,
            c_municipio: -1,
            telefono: '',
            celular: '',
            municipios: [],
        }
    }


    handleChange(event) {
        const name = event.target.name;
        const data = event.target.value
        this.setState({ [name]: data });
    }


    async componentDidMount() {

        const user = JSON.parse(localStorage.getItem('user')) || ''
        const res = await Axios.get(`/user/${user.documento}`)

        // console.log(res)
        this.setState(res.data)

        this.onDepartamento()   

    }

    onCerrarSesion = () => {
        this.props.history.push({ pathname: "/" });
    }

    onConsultar = () => {
        this.props.history.push({ pathname: "/consultar" });
    }

    onActualizar = () => {
        this.props.history.push({ pathname: "/actualizar" });
    }

    onContraseña = () => {
        this.props.history.push({ pathname: "/contraseña" });
    }

    onDepartamento = (event) => {
        if (event)
            this.handleChange(event)
        // this.setState({
        //     c_municipio: -1,
        // })
        // var departamento = this.state.c_departamento;
        var departamento = event ? event.target.value : this.state.c_departamento;
        // console.log(departamento)
        // var select = document.getElementById("Municipio");
        var municipios = municipiosTypes[departamento + ""] || {};
        // console.log(municipios)
        this.setState({ municipios })
        // console.log(departamento)


        // select.options.length = 1;
        // // console.log(municipios)
        // for (var index in municipios) {
        //     select.options[select.options.length] = new Option(municipios[index], index);
        // }
    }

    //MODAL
    OnOpenModalCorrect = async () => {
        // console.log(this.state)

        let res = await Axios.put(`/user/${this.state.documento}`, this.state)

        if (res.status === 200) {
            console.log(res)
            var x = document.getElementById("fondoInterno");
            x.classList.replace("fondoInterno", "fondoInternoDos")
            document.getElementById("MenuCentral").style.display = "none";
            setTimeout(() => {
                x.classList.replace("fondoInternoDos", "fondoInterno")
                document.getElementById("MenuCentral").style.display = "block";
            }, 3000)
        }
    }


    render() {
        // console.log(this.state)
        return (

            <div id="fondoInterno" className="fondoInterno">

                <div className="row">
                    <LeftMenu {...this.props} />
                    <div className="right">

                        <div id="MenuCentral" className="MenuCentral">

                            <div className="MensajeSuperior">
                                <label className="LabelGrande">
                                    <b>Actualice los datos de contacto</b>
                                </label>
                                <br></br>
                                <label className="LabelMedianoGris">
                                    Esta información nos permite comunicarnos más eficientemente con usted.
                                </label>
                            </div>

                            <div className="Nombre_Documento">

                                <select className="input-Actualizar" type="text" placeholder="Tipo de documento" name="t_documento" value={this.state.t_documento} onChange={this.handleChange} disabled>
                                    <option value="0">Tipo de documento</option>
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

                                <input className="input-Actualizar" type="text" placeholder="Número de documento" name="documento" value={this.state.documento} onChange={this.handleChange} disabled />
                            </div>

                            <div className="Apellido_Correo">
                                <input className="input-Actualizar" type="text" placeholder="Primer Nombre" name="p_nombre" value={this.state.p_nombre} onChange={this.handleChange} disabled />
                                <input className="input-Actualizar" type="text" placeholder="Primer Apellido" name="p_apellido" value={this.state.p_apellido} onChange={this.handleChange} disabled />
                                <input className="input-Actualizar" type="text" placeholder="Segundo Nombre" name="s_nombre" value={this.state.s_nombre} onChange={this.handleChange} disabled />
                                <input className="input-Actualizar" type="text" placeholder="Segundo Apellido" name="s_apellido" value={this.state.s_apellido} onChange={this.handleChange} disabled />
                            </div>
                            <input className="input-Actualizar input-Correo" type="text" placeholder="Correo Electrónico" name="email" value={this.state.email} onChange={this.handleChange} />

                            <div className="Direccion_Ciudad">
                                <input className="input-Actualizar" type="text" placeholder="Dirección de Residencia" name="direccion" value={this.state.direccion} onChange={this.handleChange} />

                                <select id="Departamento" className="input-Actualizar" type="text" placeholder="Departamento" name="c_departamento" value={this.state.c_departamento} onChange={this.onDepartamento}>
                                    <option value="-1">Departamento</option>
                                    <option value="05">ANTIOQUIA</option>
                                    <option value="81">ARAUCA</option>
                                    <option value="08">ATLANTICO</option>
                                    <option value="80">ATLANTICO</option>
                                    <option value="98">AUCKLAND</option>
                                    <option value="09">BARRANQUILLA D.E</option>
                                    <option value="11">BOGOTA D.C.</option>
                                    <option value="13">BOLIVAR</option>
                                    <option value="15">BOYACA</option>
                                    <option value="17">CALDAS</option>
                                    <option value="00">CALGARY</option>
                                    <option value="18">CAQUETA</option>
                                    <option value="14">CARTAGENA D.E.</option>
                                    <option value="85">CASANARE</option>
                                    <option value="19">CAUCA</option>
                                    <option value="20">CESAR</option>
                                    <option value="27">CHOCO</option>
                                    <option value="23">CORDOBA</option>
                                    <option value="25">CUNDINAMARCA</option>
                                    <option value="94">GUAINIA</option>
                                    <option value="95">GUAVIARE</option>
                                    <option value="41">HUILA</option>
                                    <option value="44">LA GUAJIRA</option>
                                    <option value="21">LIMBURGO</option>
                                    <option value="01">MADRID</option>
                                    <option value="47">MAGDALENA</option>
                                    <option value="50">META</option>
                                    <option value="52">NARIÑO</option>
                                    <option value="10">New York</option>
                                    <option value="42">NEW YORK</option>
                                    <option value="54">NORTE DE SANTANDER</option>
                                    <option value="86">PUTUMAYO</option>
                                    <option value="63">QUINDIO</option>
                                    <option value="66">RISARALDA</option>
                                    <option value="88">SAN ANDRES</option>
                                    <option value="48">SANTAMARTA D.E</option>
                                    <option value="68">SANTANDER</option>
                                    <option value="70">SUCRE</option>
                                    <option value="73">TOLIMA</option>
                                    <option value="76">VALLE</option>
                                    <option value="97">VAUPES</option>
                                    <option value="99">VICHADA</option>
                                </select>

                                <select id="Municipio" className="input-Actualizar" type="text" placeholder="Municipio" name="c_municipio" value={this.state.c_municipio} onChange={this.handleChange}>
                                    <option selected value="-1">Municipio</option>
                                    {Object.keys(this.state.municipios).map((item, index) =>
                                        <option selected value={item}>{this.state.municipios[item]}</option>
                                    )}
                                </select>

                            </div>
                            <br></br>
                            <div className="Telefenos">
                                <label className="LabelMedianoGris">
                                    Números telefónicos de contacto
                                </label>
                                <input className="input-Actualizar" type="text" placeholder="Teléfono Fijo" name="telefono" value={this.state.telefono} onChange={this.handleChange} />
                                <input className="input-Actualizar" type="text" placeholder="Teléfono Celular" name="celular" value={this.state.celular} onChange={this.handleChange} />
                            </div>
                            <div className="BotonActualizar" align="Center">
                                <button className="ButtonLog" type="button" onClick={this.OnOpenModalCorrect}>Guardar</button>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

export default ActualizarDatos;
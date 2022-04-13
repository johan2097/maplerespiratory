import React, { Component } from 'react';
import './CambioContraseña.css';
import LeftMenu from "../LeftMenu/LeftMenu";
import Axios from 'axios';

class CambioContraseña extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)

        this.state = {
            user: null,
            warning: "",
            documento: '',
            password: '',
            new_password: '',
            old_password: '',
            repeat_password: ''
        }
    }

    async componentDidMount() {

        const user = JSON.parse(localStorage.getItem('user')) || ''
        const res = await Axios.get(`/user/${user.documento}`)

        // console.log(res)
        this.setState(res.data)
    }

    handleChange(event) {
        const name = event.target.name;
        const data = event.target.value
        this.setState({ [name]: data });
    }

    // async componentDidMount() {
    //     this.user = localStorage.getItem('user')
    // }

    //MODAL
    OnOpenModalCorrect = async () => {
        const { new_password, old_password, repeat_password } = this.state

        this.setState({ warning: '' })

        // console.log(this.state)
        if (new_password !== repeat_password) {
            return
        }
        try {
            const res = await Axios.post(`/user/change-password/${this.state.documento}`, {
                password: old_password,
                new_password: new_password
            })

            if (res.status === 200) {
                // console.log(res)
                var x = document.getElementById("fondoInterno");
                x.classList.replace("fondoInterno", "fondoInternoTres")
                document.getElementById("MenuCentral").style.display = "none";
                setTimeout(() => {
                    x.classList.replace("fondoInternoTres", "fondoInterno")
                    document.getElementById("MenuCentral").style.display = "block";
                    this.setState({
                        password: '',
                        new_password: '',
                        old_password: '',
                        repeat_password: ''
                    })
                }, 3000)
            } else {
                this.setState({ warning: 'Error en los datos de contraseña, por favor verificar' })
            }
        } catch (err) {
            this.setState({ warning: 'Error de validación desconocido' })
            console.log(`[Change password error]: ${JSON.stringify(err)}`)
        }
    }

    render() {

        return (
            <div id="fondoInterno" className="fondoInterno">
                <div className="row">
                    <LeftMenu {...this.props} />
                    <div className="right">
                        <div id="MenuCentral" className="MenuCentral">

                            <div className="MensajeSuperior">
                                <label className="LabelGrande">
                                    <b>Cambiar Contraseña</b>
                                </label>
                                <br></br>
                                <label className="LabelMedianoGris">
                                    El cambio de contraseña es importante realizarlo cada 3 meses.
                                </label>
                                <h3 className="label-password" id="Aviso">{this.state.warning}</h3>
                            </div>

                            <div className="Contraseña_Nueva">
                                <input className="input-Actualizar" type="password" placeholder="Contraseña Actual" name="old_password" value={this.old_password} onChange={this.handleChange} />
                                <input className="input-Actualizar" type="password" placeholder="Nueva Contraseña" name="new_password" value={this.new_password} onChange={this.handleChange} />
                                <input className="input-Actualizar" type="password" placeholder="Confirmar Nueva Contraseña" name="repeat_password" value={this.repeat_password} onChange={this.handleChange} />
                            </div>


                            <br></br>

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

export default CambioContraseña;
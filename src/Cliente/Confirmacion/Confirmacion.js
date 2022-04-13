import React, { Component, useState } from 'react';
import './Confirmacion.css';
import LeftMenu from "../LeftMenu/LeftMenu";
import IconCorrect from '../../Imagenes/Iconos/Correct.svg';
import { showFile } from '../../utils';
import axios from 'axios';
import _ from 'lodash';
import {Modal,ModalHeader,ModalBody} from 'reactstrap';

class Confirmacion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fechaProcedimiento: "",
            tipoProcedimiento: "",
            user: {},
            userInfo: {},
            offset: 0,
            limit: 100,
            popUpMessage: '',
            tiposResultados: [],
            labelsResultados: {},
            documento: '',
            tipoDocumento: '',
        }

        this.handleChange = this.handleChange.bind(this)

    }


    filterResultados = [8]
    popupResultados = [6, 7]

    

    async componentDidMount() {
        setTimeout(this.onSearch.bind(this), 1500)
        const user = JSON.parse(localStorage.getItem('user'))
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        // console.log(user)
        this.setState({
            user,
            userInfo,
        })

        try {

            const res2 = await axios.get('/patient-result/report-types', {})

            // console.log(res2.data)
            const tiposResultados = res2.data
            const labelsResultados = _.groupBy(tiposResultados, 'label')
            this.setState({
                tiposResultados,
                labelsResultados,
            })

            const res = await axios.get('/config/descargaPopUpText', {})
            // console.log(res)
            if (res.status === 200) {
                const text = res.data.valor.text
                // console.log(text)
                this.setState({ popUpMessage: res.data.valor.text })
            }
        } catch (err) {
            console.log(`[Get config error]: ${err}`)
        }
    }

    handleChange(event) {
        const name = event.target.name;
        const data = event.target.value
        this.setState({ [name]: data });
    }

    
    

    async openUrl(url, row) {

        const doc = this.state.userInfo.rol === "admin" ? this.state.documento : this.state.user.documento
        const name = row.actionName.replace(/ /g, "_") + '_' +
            row.file[0].dateRegister.split('T')[0] + '_' + doc + '_' + row.file[0].idExternalFile + '.pdf'

        const r = await axios({
            url: `/pdf/${row.identifier}/${row.file[0].idExternalFile}`,
            method: 'GET',
            responseType: "blob",
        })
            .then(r => r.data)
            .then(blob => showFile(blob, name))

       
    }

    onSearch = async (event) => {
        event && event.preventDefault()
        try {


            let documento, tipoDocumento
            if (this.state.userInfo.rol === "admin") {
                documento = this.state.documento
                tipoDocumento = this.state.tipoDocumento

                if (documento == '' || tipoDocumento == '') {
                    this.setState({
                        data: []
                    })
                    return
                }
            } else {
                documento = this.state.user.documento
                tipoDocumento = this.state.userInfo.t_documento
            }

            const res = await axios.get(`/patient-result`,
                {
                    params: {
                        documento,
                        tipoDocumento,
                        limit: this.state.limit,
                        offset: this.state.offset,
                        ...this.state.fechaProcedimiento && { date: this.state.fechaProcedimiento },
                        ...this.state.tipoProcedimiento &&
                        this.state.tipoProcedimiento &&
                        { tipo_resultado: this.state.labelsResultados[this.state.tipoProcedimiento].map(x => x.name) }
                    }
                })
            // console.log(res.data)

            this.setState({
                data: res.data
            })
        } catch (err) {
            console.log(`[get patient results error]: ${err}`)
        }
    }

    state={
        abierto:false,
    }
    abrirModal=()=>{
        this.setState({abierto:!this.state.abierto});
    }
    

    OnOpenModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "block";
    }

    OnCloseModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "none";
    }

    onPagos = () => {
        this.props.history.push({ pathname: "/pagos" });
    }
    

    render() {

        return (
            <div className="fondoInterno" >

                <div id="ModalCorrect" className="modal">

                    <div className="modal-content">

                        <figure className="Icon" align="Center" >
                            <img id="logoIni" className="IconImg" src={IconCorrect} alt="Icon" />
                        </figure>

                        <br></br>
                        <br></br>
                        <div className="labelPopUp" align="Center">
                            {this.state.popUpMessage.split('\n').map((item, i) => {
                                return <span key={i}><label>{item}</label><br></br></span>
                            })}
                        </div>

                        <div className="BtnGuardar" align="Center">
                            <button className="ButtonLog" type="button" onClick={this.OnCloseModalCorrect}>Aceptar</button>
                        </div>
                        <div className="Bottom" align="Center">
                            <label className="LabelGrisPopUp">Maple Respiratory Colombia</label>
                        </div>

                    </div>
                </div>

                <div className="row">
                    <LeftMenu {...this.props} />
                    <div className="right">
                        <div className="MenuCentral">
                            <div className="MensajeSuperior">

                                <label className="Grande">
                                    <b>Confirme los datos</b>
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                  <b>Antes de inciar el proceso de pagos debe verificar sus datos.</b>
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                  <span className="inicial"> Nombre y Apellido:</span> Juan Perez
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                 <span className="inicial"> EPS:</span>  Sanitas
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                <span className="inicial"> Regimen( Contributivo-Subsidiado):</span> Contributivo
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                <span className="inicial"> Tipo de Usuario( Cotizante-Beneficiario):</span> Cotizante
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                <span className="inicial"> Rango( Categoria: A, B, B):</span> B
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                <span className="inicial"> Sede:</span> Cali
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                <span className="inicial"> Estado(Activo-Inactivo Suspendido):</span> Suspendido
                                </label>
                                <br></br><br></br>
                                <label className="MedianoGris">
                                  <b>¿Todos los datos son correcto?.  <div class="radio">
				                       
				                       <input type="radio" name="sexo"  onClick={this.onPagos}/>
				                       <label for="hombre">Si</label>
                                       <input type="radio" name="sexo"  onClick={this.abrirModal}/>
				                       <label for="mujer">No</label>

                                 </div></b>
                                 
		
                                </label>
                                
                            </div>
                            <br></br>
                            <div className="BotonActualizar" align="left">
                                <button className="ButtonLog1" type="button" onClick={this.onPagos}>Continuar</button>
                            </div>
                        </div>
 
                    </div>

                </div>
                <br></br>
                 <Modal isOpen={this.state.abierto}>
                     <ModalHeader>

                     </ModalHeader>
                     <ModalBody>
                     <form class="form">
                      <h1 class="mencione">Mencione los datos que se deben corregir</h1>
                      <textarea name="mensaje" placeholder="Datos para corregir...">
                    </textarea>
                    <h1 class="mencione">Correo Electronico para confirmar el cambio</h1>
                     <input className="input" type="text" name="correo" placeholder="Correo Electronico"></input>
                    <input className="boton" type="button" value="Enviar" id="boton" onClick={this.onPagos}></input>
                    </form>
                    </ModalBody>
                 </Modal>
            </div>
        )
    }

}

export default Confirmacion;
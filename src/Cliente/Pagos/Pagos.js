import React, { Component } from 'react';
import './Pagos.css';
import LeftMenu from "../LeftMenu/LeftMenu";
import { showFile } from '../../utils';
import axios from 'axios';
import _ from 'lodash';
import Logo from '../../Imagenes/Logos/logospse.jpg';
import Card from 'react-bootstrap/Card';
import Success from '../../components/Success';


class Consultar extends Component {
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

    onExitoso = () => {
        this.props.history.push({ pathname: "/exitoso" });
    }
    


    render() {

        return (
            <div className="fondoInterno" >

                

                <div className="row">
                    <LeftMenu {...this.props} />
                    <div className="right">
                        <div className="MenuCentral">
                            <div className="MensajeSuperior1">

                                <label className="Grande">
                                    <b>Detalles los servicios por pagar</b>
                                </label>
                                <br></br>
                                <label className="MedianoGris">
                                  <span className="inicial"> Nombre y Apellido:</span> Juan Perez
                                </label>
                                <br></br>
                                <label className="MedianoGris">
                                 <span className="inicial"> Tipo de Documento:</span>  Cedula de ciudadania
                                </label>
                                <br></br>
                                <label className="MedianoGris">
                                <span className="inicial">  Numero de Documento:</span> 80.000.000
                                </label>
                            </div>

                        </div>
                     
                      
                        <div id="main-container">

		                <table>
			                <thead>
				                 <tr>
					              
                                 <th>ID</th><th>Concepto</th><th>Valor</th><th>Deseo Pagar</th>
				               </tr>
			                </thead>

			                <tr>
				            <td>M-3918</td><td>Tratamiento/Nombre procedimiento <br/>Cuota Moderadora($00.000)</td><td>$ 10.000.000</td><td> <input type="checkbox" id="cbox2" value="second_checkbox"></input> </td>
			               </tr>
			               <tr>
                           <td>M-3918</td><td>Tratamiento/Nombre procedimiento <br/>Cuota Moderadora($00.000)</td><td>$ 20.000.000</td><td><input type="checkbox" id="cbox2" value="second_checkbox"></input></td>
			              </tr>
			              <tr>
                          <td>M-3918</td><td>Tratamiento/Nombre procedimiento <br/>Cuota Moderadora($00.000)</td><td>$ 20.000.000</td><td><input type="checkbox" id="cbox2" value="second_checkbox"></input></td>
			             </tr>
		               </table>
	                   <br/><br/><br/><br/><br/>
	                   <br/><br/><br/>
                       <Card className="card78" align="left">
                <div class="subapartado1">
                 <div class="titulo">
                    <p class="titulo">Agregar otros Conceptos</p>
                 </div>
              <div class="info">
               <p class="info"> 
                  Tratamiento/Nombre procedimiento <br/>Cuota Moderadora($00.000)
                    </p>
                     
                    <hr className="divider"/>
                    <p class="info">
                    Tratamiento/Nombre procedimiento <br/>Cuota Moderadora($00.000)
                    </p>
              </div>
             </div>
                </Card>
               <br/><br/>
                <Card className="card79" align="right">
                <br/><br/><br/>
                
                 <div class="titulo3">
                    <p class="titulo3">Total a Pagar:$20.000.000</p>
                 </div>
              
                </Card>
                
                <br/><br/><br/><br/><br/>
                <br/><br/>
                <Card className="card80" align="right">
                <br/><br/><br/>
                
                 <div class="titulo1">
                    <p class="titulo2">**Recuerde que cada procedimiento requiere 
                    el pago de la Cuota moderadora.
                    </p>
                    <p class="titulo1">***El costo de cada procedimiento ya tiene 
                    incluido el valor de la cuota moderadora 
                    </p>
                 </div>
              
                </Card>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <label className="Grande1">
                         <b>Seleccione la forma de pago:</b>
                 </label>
                 <br/><br/><br/>
                  <div>
                      <img src={Logo} alt=""></img>
                      <div className="radio">
				                       
                      <input type="radio" name="sexo" id="hombre" className="inputs1" />
				        
                      <input type="radio" name="sexo" id="mujer" className="inputs2" />   
			 
                      </div>
                  </div>
                 <br/><br/><br/>

                <div className="Boton Actualizar" align="left">
                  <Success />
                </div>
                <br/>
                </div>

                </div>
                
                </div>

            </div>
        )
    }

}

export default Consultar;
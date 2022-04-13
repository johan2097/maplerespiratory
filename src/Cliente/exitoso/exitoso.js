

import React, { Component } from 'react';
import LeftMenu from "../LeftMenu/LeftMenu";
import { showFile } from '../../utils';
import axios from 'axios';
import _ from 'lodash';
import Exito from '../../Imagenes/Logos/correcto.JPG';
import './exitoso.css';


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

 
    

    render() {

        return (
            <div className="fondoInterno" >

                

                <div className="row">
                    <LeftMenu {...this.props} />
                    
                    <img src={Exito} alt="" className="imagenexito"/>
                
                </div>

            </div>
        )
    }

}

export default Consultar;










import React, { Component } from 'react';
import './Consultar.css';
import ReactTable from 'react-table'
import { ReactTableDefaults } from 'react-table'
import './table-style.css';
import LeftMenu from "../LeftMenu/LeftMenu";
import { static_url } from "../../api"
import IconCorrect from '../../Imagenes/Iconos/Correct.svg';
import { showFile } from '../../utils'
import axios from 'axios'
import _ from 'lodash'

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

    columns = [
        {
            Header: 'ID',
            accessor: 'Id',
            minWidth: 50,
            maxWidth: 150,
            show: false,
        },
        // {
        //     Header: '# Tipo',
        //     // accessor: 'TipoResultado', // String-based value accessors!
        //     accessor: 'actionName',
        //     className: 'bold',
        //     show: false,
        // },
        {
            Header: 'identifier',
            accessor: 'identifier',
            className: 'bold',
            show: false,
        },
        {
            Header: 'Tipo',
            // accessor: 'TipoResultadoName', // String-based value accessors!
            accessor: 'actionName',
            className: 'bold',
        },
        {
            Header: 'Fecha Resultado',
            accessor: 'file[0].dateRegister',
            minWidth: 100,
            maxWidth: 200,
            Cell: row => {
                return row.value ? row.value.split("T")[0] : '-'
            }
        },
        {
            Header: 'Archivo',
            accessor: 'file',

            Cell: props => {
                // console.log(props.row)
                // const url = `${static_url}/${props.value}`
                const url = props.row.file[0] ? props.row.file[0].urlFile : ''
                const tooltip = props.row.file[0] ? props.row.file[0].descriptionFile : ''

                // console.log(url)
                return tooltip ?
                    <button
                        className="ButtonTable"
                        type="button"
                        title={tooltip}
                        onClick={() => this.openUrl(url, props.row)}
                    >VER</button> : <span>No disponible</span>
            },
            minWidth: 150,
            maxWidth: 200,
            show: !matchMedia('only screen and (max-width: 768px)').matches
        }]

    handleResize() {
        this.forceUpdate()
    }

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
        window.addEventListener("resize", this.handleResize.bind(this));
    }

    handleChange(event) {
        const name = event.target.name;
        const data = event.target.value
        this.setState({ [name]: data });
    }

    // openUrl(url, row) {
    //     // eslint-disable-next-line no-restricted-globals
    //     window.open(
    //         url,
    //         '_blank' // <- This is what makes it open in a new window.
    //     );

    // }
    // openUrl(url, row) {
    //     // console.log(row)
    //     // const name = `${row.TipoResultadoName.slice(0, 3).toLowerCase()}${row.FechaCargue.replace(/-/g, "")}-${this.state.userInfo.t_documento.toLowerCase()}${this.state.user.documento}.pdf`
    //     const name = row.actionName.replace(/ /g, "_") + '_' + row.file[0].dateRegister.split('T')[0] + this.state.user.documento + '.pdf'
    //     // console.log(url)
    //     // console.log(name)

    //     var link = document.createElement("a");
    //     link.download = 'File.pdf';
    //     link.href = 'https://gomedisysimages.blob.core.windows.net/temporalimages/d1134c01/y2020m02d14/file_patient62890_encounter7489_637172851666034878.pdf';
    //     link.click();
    //     // fetch(url, {
    //     //     mode: 'cors'
    //     // })
    //     //     .then(r => r.blob())
    //     //     .then(blob => showFile(blob, name))

    //     // if (this.popupResultados.indexOf(row.TipoResultado) === -1) {
    //     //     this.OnOpenModalCorrect()
    //     //     // console.log("opened")
    //     // }
    // }

    async openUrl(url, row) {

        const doc = this.state.userInfo.rol === "admin" ? this.state.documento : this.state.user.documento
        const name = row.actionName.replace(/ /g, "_") + '_' +
            row.file[0].dateRegister.split('T')[0] + '_' + doc + '_' + row.file[0].idExternalFile + '.pdf'

        const r = await axios({
            url: `/pdf/${row.identifier}/${row.file[0].idExternalFile}`, //your url
            method: 'GET',
            responseType: "blob",
        })
            .then(r => r.data)
            .then(blob => showFile(blob, name))

        // if (this.popupResultados.indexOf(row.TipoResultado) === -1) {
        //     this.OnOpenModalCorrect()
        // }
    }

    onSearch = async (event) => {
        event && event.preventDefault()
        try {

            // console.log(this.state.labelsResultados, this.state.tipoProcedimiento)
            // console.log(this.state.user)

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

    OnOpenModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "block";
    }

    OnCloseModalCorrect = () => {
        document.getElementById("ModalCorrect").style.display = "none";
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
                                {/* <button className="ButtonTable" type="button" onClick={() => window.open('https://www.orimi.com/pdf-test.pdf')}>VER</button> */}

                                <label className="LabelGrande">
                                    <b>Resultado de exámenes</b>
                                </label>
                                <br></br>
                                <label className="LabelMedianoGris">
                                    Seleccione la opción de búsqueda:
                                </label>
                            </div>


                            <form className="ZonaBusqueda" onSubmit={this.onSearch}>
                                {this.state.userInfo.rol === "admin" &&
                                    <div className="BusquedaProdRow">

                                        <select className="BusquedaProcedimiento" type="text" name="tipoDocumento" value={this.state.tipoDocumento} onChange={this.handleChange} required>
                                            <option value="">Tipo de documento</option>
                                            <option value="CC">Cédula</option>
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

                                        <input className="BusquedaProcedimiento" type="text" placeholder="Número de documento" name="documento" value={this.state.documento} onChange={this.handleChange} required />
                                    </div>
                                }
                                <div className="BusquedaProdRow">
                                    <select className="BusquedaProcedimiento" type="text" name="tipoProcedimiento" value={this.tipoProcedimiento} onChange={this.handleChange}>
                                        <option value="Buscar por tipo de procedimiento" name="">Buscar por tipo de procedimiento</option>
                                        {_.uniqBy(this.state.tiposResultados, 'label')
                                            .map(({ value, name, label, hidde }, index) => {
                                                return hidde ? null : <option key={index} value={label}>{label || name}</option>
                                            })}
                                    </select>
                                </div>
                                <div className="BusquedaProdRow">
                                    <input className="BusquedaProcedimiento" type="date" placeholder="Fecha de procedimiento" name="fechaProcedimiento" value={this.fechaProcedimiento} onChange={this.handleChange}></input>
                                    <button className="ButtonConsulta" type="submit">Buscar</button>
                                </div>
                            </form>
                        </div>

                        <ReactTable
                            className="TablaDatos -highlight"
                            data={this.state.data}
                            columns={this.columns}
                            showPageJump={false}
                            showPageSizeOptions={false}
                            defaultPageSize={7}
                            // Text
                            previousText='Anterior'
                            nextText='Siguiente'
                            loadingText='Cargando...'
                            noDataText=''
                            pageText='Página'
                            ofText='de'
                            rowsText-='filas'

                            column={{
                                ...ReactTableDefaults.column,
                                headerStyle: {
                                    textAlign: "center"
                                },
                                style: {
                                    textAlign: "center"
                                }
                            }}

                            // Accessibility Labels
                            pageJumpText='saltar a la página'
                            rowsSelectorText='filas por página'
                            resolveData={data => {
                                // data = data.filter(row => this.filterResultados.indexOf(row.TipoResultado) === -1)
                                // return data.map(row => {
                                //     row.TipoResultadoName =
                                //         this.tiposResultados.filter(e => String(e.value) === String(row.TipoResultado))[0].name
                                //     return row
                                // })
                                // return data

                                data = _.flatMap(data, row => {
                                    row.actionName =
                                        (this.state.tiposResultados.filter(item => item.name === row.actionName)[0] || { label: row.actionName }).label

                                    return row.file.map((f, i) => {
                                        const r = _.cloneDeep(row)
                                        r.file = [row.file[i]]
                                        return r
                                    })
                                })

                                return data.filter(item => item.file.length > 0)
                            }}

                            SubComponent={
                                matchMedia('only screen and (max-width: 768px)').matches ? ({ row }) => {
                                    // console.log(row)
                                    const url = `${static_url}/${row.NombreArchivo}`
                                    return <button className="ButtonTable" type="button" onClick={() => this.openUrl(url, row)}>VER EXAMEN</button>
                                } : null
                            }
                        />
                    </div>

                </div>

            </div>
        )
    }

}

export default Consultar;
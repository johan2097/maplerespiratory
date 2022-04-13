import React, { Component } from 'react';
import './Reportes.css';
import ReactTable from 'react-table'
import Axios from 'axios';
import LeftMenu from "../LeftMenu/LeftMenu";
import { static_url } from "../../api"
import { showFile } from "../../utils"

const pageSize = 7

class Reportes extends Component {
    constructor(props) {
        super(props)

        this.state = {
            documento: '',
            fechaInicio: '',
            fechaFinal: ''.fechaFinal,
            tipo: '',
            data: [],
            pages: -1,
            loading: false,
            csvDisabled: false,
        }

        this.handleChange = this.handleChange.bind(this)

    }

    tipos = [
        { value: '', name: "Tipos de eventos" },
        { value: 'query', name: "Busquedas" },
        { value: 'login', name: 'Login' },
        { value: 'create', name: 'Creación' },
        { value: 'delete', name: 'Eliminación' },
        { value: 'update', name: 'Actualización' },
    ]
    columns = [
        {
            Header: 'Tipo',
            accessor: 'tipo', // String-based value accessors!
            className: 'bold',
            minWidth: 50,
            maxWidth: 150,
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        },
        {
            Header: 'Fecha',
            accessor: 'createdAt',
            minWidth: 100,
            maxWidth: 150,
        },
        {
            Header: 'Documento',
            accessor: 'documento',
            minWidth: 100,
            maxWidth: 150,
        },
    ]


    handleResize() {
        this.forceUpdate()
    }

    async componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'))
        // console.log(user)
        this.setState({
            user: user,
            data: [],
            fechaProcedimiento: "",
            tipoProcedimiento: "",
        })

        window.addEventListener("resize", this.handleResize.bind(this));
        setTimeout(this.onSearch.bind(this), 1000)
    }

    handleChange(event) {
        const name = event.target.name;
        const data = event.target.value
        this.setState({ [name]: data });
    }

    onSearch = async (state, instance) => {
        // show the loading overlay
        this.setState({ loading: true })
        // fetch your data
        const res = await Axios.get(`/report/`,
            {
                params: {
                    limit: state && state.pageSize ? state.pageSize : pageSize,
                    offset: state && state.page ? state.page * state.pageSize : 0,
                    ...this.state.tipo && { tipo: this.state.tipo },
                    ...this.state.documento && { documento: this.state.documento },
                    ...this.state.fechaInicio && { fechaInicio: this.state.fechaInicio },
                    ...this.state.fechaFinal && { fechaFinal: this.state.fechaFinal },
                }
            })

        this.setState({
            data: res.data.data,
            loading: false,
            pages: Math.floor(res.data.count / pageSize),
        })
    }

    async onDownloadCSV() {
        this.setState({ csvDisabled: true })

        try {
            const res = await Axios.get(`/report/`,
                {
                    params: {
                        limit: 1E10,
                        // offset: 0,
                        output: 'csv',
                        ...this.state.tipo && { tipo: this.state.tipo },
                        ...this.state.documento && { documento: this.state.documento },
                        ...this.state.fechaInicio && { fechaInicio: this.state.fechaInicio },
                        ...this.state.fechaFinal && { fechaFinal: this.state.fechaFinal },
                    }
                })
            showFile(res.data, 'data.csv')
        } finally {
            this.setState({ csvDisabled: false })
        }
    }

    render() {

        return (
            <div className="fondoInterno" >
                <div className="row">
                    <LeftMenu {...this.props} />
                    <div className="right">
                        <div className="MenuCentral">

                            <div className="MensajeSuperior">
                                {/* <button className="ButtonTable" type="button" onClick={() => window.open('https://www.orimi.com/pdf-test.pdf')}>VER</button> */}

                                <label className="LabelGrande">
                                    <b>Consutar de eventos</b>
                                </label>
                                <br></br>
                                <label className="LabelMedianoGris">
                                    Consultar eventos por:
                                </label>
                            </div>


                            <div className="ZonaBusqueda">
                                <div className="BusquedaProdRow">
                                    <select className="BusquedaProcedimiento" type="text" name="tipo" value={this.state.tipo} onChange={this.handleChange}>
                                        {this.tipos.map(({ value, name }, index) => {
                                            return <option key={index} value={value}>{name}</option>
                                        })}
                                    </select>
                                    <input className="BusquedaProcedimiento" type="text" placeholder="documento" name="documento" value={this.state.documento} onChange={this.handleChange}></input>
                                </div>
                                <div className="BusquedaProdRow">
                                    <div>
                                        <label htmlFor="">Fecha desde:</label>
                                        <input className="BusquedaProcedimiento" type="date" placeholder="Fecha desde" name="fechaInicio" value={this.state.fechaInicio} onChange={this.handleChange}></input>
                                    </div>
                                    <div>
                                        <label htmlFor="">Fecha hasta:</label>
                                        <input className="BusquedaProcedimiento" type="date" placeholder="Fecha hasta " name="fechaFinal" value={this.state.fechaFinal} onChange={this.handleChange}></input>
                                    </div>
                                    <button className="ButtonSearch" type="button" onClick={this.onSearch}>Buscar</button>
                                </div>
                            </div>
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
                            onFetchData={this.onSearch}

                            // Accessibility Labels
                            pageJumpText='saltar a la página'
                            rowsSelectorText='filas por página'
                            manual
                            pages={this.state.pages}
                            loading={this.state.loading}
                        />
                        <button
                            className="ButtonCSV"
                            type="button"
                            onClick={this.onDownloadCSV.bind(this)}
                            disabled={this.state.csvDisabled}
                        >
                            Descargar CSV
                        </button>

                    </div>

                </div>

            </div>
        )
    }

}

export default Reportes;
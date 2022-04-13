import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Login from './Cliente/Login/Login.js';
import Registro from './Cliente/Registro/Registro.js';
import ValidarDatos from './Cliente/ValidarDatos/ValidarDatos.js';
import Consultar from './Cliente/Consultar/Consultar.js'
import Actualizar from './Cliente/ActualizarDatos/ActualizarDatos.js';
import Reportes from './Cliente/Reportes/Reportes.js';
import Contraseña from './Cliente/CambiarContraseña/CambioContraseña.js';
import Pagos from './Cliente/Pagos/Pagos.js';
import Exitoso from './Cliente/exitoso/exitoso.js';
import Confirmacion from './Cliente/Confirmacion/Confirmacion.js';
import InitApi from './api'
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectRoute'
import './index.css';
import {AuthProvider} from './AuthContext';

InitApi()

class App extends Component {

    render() {
        return (
            <AuthProvider>
                <Router>
               
                    <Route exact path="/" component={Login} />
                    <Route path="/registro" component={Registro} />
                    <Route path="/validacion" component={ValidarDatos} />
                    <Route path="/consultar" component={ValidarDatos} />
                    
                    <Route path="/confirmacion" component={Confirmacion} />
                    <Route path="/actualizar" component={Actualizar} />
                    <Route path="/pagos" component={Pagos} />
                    <Route path="/exitoso" component={Exitoso} />
                    <Route path="/contraseña" component={Contraseña} />
                    <Route path="/eventos" component={Reportes} />
                 
                </Router>
            </AuthProvider>

        )
    }
}


ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();

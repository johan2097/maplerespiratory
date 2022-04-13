import React from 'react';
import './formulario.css';


export default function PersonalInfoHelp({
	
}) {
	

	return (
		
		<div id="generalModalContainer">
		<form action="">
        <h1 class="mencione">Mencione los datos que se deben corregir</h1>
        <textarea name="mensaje" placeholder="Datos para corregir...">
        </textarea>
        <h1 class="mencione">Correo Electronico para confirmar el cambio</h1>
        <input type="text" name="correo" placeholder="Correo Electronico"></input>
        <input type="button" value="Enviar" id="boton"></input>
        </form>
		</div>
		
	);
}

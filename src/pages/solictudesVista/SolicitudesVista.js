import React,{useState,useEffect} from 'react'
import './SolicitudesVista.css'
import { useForm } from "react-hook-form";
import { getQuotitationAdministrativeUnit} from '../../services/Http/QuotitationService';
import { useHistory, useParams } from 'react-router-dom'
import { Eye, FileEarmarkText, Envelope, ChevronLeft, Printer, Coin } from 'react-bootstrap-icons'
import EnviarCotizacion from '../EnviarFormulario/EnviarCotizacion'
import CrearInforme from '../informe/CrearInforme';
import { getReport } from '../../services/Http/ReportService';
import InformeCotizacion from '../cotizaciones/InformeCotizacion';
import { getReportQuotitation } from '../../services/Http/ReportQuotitationService';

function SolicitudesVista(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const {idUA} = useParams();
    const [quotitations, setQuotitations] = useState([]);
    const [abiertoEmail, setAbiertoEmail] = useState(false);
    const [quotitationId, setQuotitationID ] = useState("")
    let history = useHistory();
    const [request, setRequest ] = useState({});
    const [abiertoInforme, setAbiertoInforme] = useState(false);
    const [report, setReport ] = useState(null)
    const [abiertoInformeCotizacion, setAbiertoInformeCotizacion] = useState(false);
    const [reportQuotitation, setReportQuotitation ] = useState(null)
    const [search, setSearch] = useState("");
    const [filteredQuontitation, setFilteredQuotitation] = useState([])
    useEffect(() => {
        const user = JSON.parse(window.localStorage.getItem("userDetails"));
        async function getAllQuotitations() {
            try {
                const result = await getQuotitationAdministrativeUnit(idUA);
                const resultQuotitations=result.request_quotitations;
                console.log(resultQuotitations)
                setQuotitations(resultQuotitations);
            } catch (error) {
                console.log(error)
            }
        }
        getAllQuotitations();
        //eslint-disable-next-line
    }, []);
    useEffect(() => {
        setFilteredQuotitation(
            quotitations.filter((quantitation) =>
                quantitation.nameUnidadGasto.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search,quotitations]);
    const EnablebuttonAddReport = (quotitation) =>{
        if(quotitation.status!="Pendiente"){
            return(
                <button className="dropdown-item" onClick={() => abrirModalInforme(quotitation.id)}>
                    <FileEarmarkText/> Informe Solicitud
                </button>                                    
            );
        }else{
            return(
                <button className="dropdown-item" disabled>
                    <FileEarmarkText/> Informe Solicitud
                </button>
            );
        }
    }

    const EnableSendMailButton = (quotitation) =>{
        if(quotitation.status=="Aceptado" && quotitation.statusResponse !== "Finalizado"){
            return(
                <button className="dropdown-item" onClick={ () => abrirModalEmail(quotitation.id) }>
                    <Envelope/> Enviar correo
                </button>                                    
            );
        }else{
            return(
                <button className="dropdown-item" disabled>
                    <Envelope/> Enviar correo
                </button>
            );
        }
    }

    const EnablebuttonImprimir=(quotitation)=>{
        if(quotitation.status=="Aceptado"){
            const urlQuotitation = "https://tis-sistema-cotizacion-backend.herokuapp.com/api/requestquotitationpdf/"+quotitation.id;
            return(
                <button className="dropdown-item">
                    <a target="true" href={urlQuotitation} style={{textDecoration:'none',padding:'0px', color:"#000"}}><Printer/> Imprimir cotización</a>
                </button>                                    
            );
        }else{
            return(
                <button className="dropdown-item" disabled>
                    <Printer/> Imprimir cotización
                </button>
            );
        }
    }

    const EnablebuttonQuotitation = (quotitation) =>{
        if(quotitation.statusResponse==="En proceso" || quotitation.statusResponse==="Finalizado"){
            return(
                <button className="dropdown-item" onClick={() => {history.push({pathname:`/cotizaciones/${quotitation.id}`,data:quotitation});}}>
                    <Coin/> Cotizaciones
                </button>                                    
            );
        }else{
            return(
                <button className="dropdown-item" disabled>
                    <Coin/> Cotizaciones
                </button>
            );
        }
    }

    const EnablebuttonReportQuotitation = (quotitation) =>{
        if(quotitation.statusResponse==="Finalizado"){
            return(
                <button className="dropdown-item" onClick={() => history.push(`/informeCotizacionResp/${quotitation.id}`)}>
                    <FileEarmarkText/>Informe cotizacion
                </button>                                    
            );
        }else{
            return(
                <button className="dropdown-item" disabled>
                    <FileEarmarkText/>Informe cotizacion
                </button>
            );
        }
    }

    const abrirModalEmail =(id)=>{
        setQuotitationID(id);
        setAbiertoEmail(true);
    }
    const cerrarModalEmail=()=>{
        setAbiertoEmail(false);
    }

    const abrirModalInforme =(id)=>{
        getInforme(id)
        setQuotitationID(id);
        setAbiertoInforme(true);
    }
    const cerrarModalInforme=()=>{
        setReport(null)
        setAbiertoInforme(false);
    }

    const abrirModalInformeCotizacion =(id)=>{
        getInformeQuotitation(id)
        setQuotitationID(id);
        setAbiertoInformeCotizacion(true);
    }

    const cerrarModalInformeCotizacion=()=>{
        setReportQuotitation(null)
        setAbiertoInformeCotizacion(false);
    }

    const RequestSelect = (index) =>{
        setRequest(quotitations[index])
        console.log("solicitud",quotitations[index])
    }

    async function getInforme(id) {
        console.log("id",id)
        try {
            const result = await getReport(id);
            console.log(result)
            if(result){
                setReport(result);
            }else{
                setReport(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getInformeQuotitation(id) {
        console.log("id",id)
        try {
            const result = await getReportQuotitation(id);
            console.log(result)
            if(result){
                setReportQuotitation(result);
            }else{
                setReportQuotitation(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <div className="container" align="left" style={{marginBottom:"160px"}}>
                        <br></br>
                        <h1>Solicitudes</h1>
                        <br></br>
                    <div className="row">
                        <div className="col-6">
                            <input {...register("quotitation", { required: true })}
                                className="form-control"
                                placeholder="Ingrese unidad de gasto" 
                                aria-label="Search"
                                type="search"
                                id = "search"
                                onChange = {(e) => setSearch(e.target.value)}                                    
                           />
                        </div>
                    </div>
                    <br></br>
                    <div className="form-register">             
                        <div className="form-row">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Unidad de Gasto</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Estado de Solicitud</th>
                                        <th scope="col">Estado de Cotización</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {filteredQuontitation.map((quotitation,index) => {
                                    return(
                                        <tr key={quotitation.id}>
                                            <th scope="row">{index+1}</th>
                                            <td >{quotitation.nameUnidadGasto}</td>
                                            <td>{quotitation.requestDate}</td>
                                            <td>{quotitation.status}</td>
                                            <td>{quotitation.statusResponse}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn"><ChevronLeft/> Acciones</button>
                                                    <div className="dropdown-content dropdown-menu-right">
                                                        <button className="dropdown-item"  onClick={() => history.push(`/DetalleSolicitud/${quotitation.id}`)}>
                                                            <Eye/> Ver solicitud
                                                        </button>
                                                        {
                                                            EnablebuttonAddReport(quotitation)
                                                        }
                                                        {
                                                            EnableSendMailButton(quotitation)
                                                        }
                                                        {
                                                            EnablebuttonImprimir(quotitation)
                                                        }
                                                        {
                                                            EnablebuttonQuotitation(quotitation)
                                                        }
                                                        {
                                                            EnablebuttonReportQuotitation(quotitation)
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <EnviarCotizacion
                        id={quotitationId}
                        abiertoEmail={abiertoEmail} 
                        cerrarModal={cerrarModalEmail}
                    />
                    <CrearInforme
                        id={quotitationId}
                        abierto={abiertoInforme} 
                        cerrarModal={cerrarModalInforme}
                        report={report}
                    />
                    <InformeCotizacion
                        id={quotitationId}
                        abierto={abiertoInformeCotizacion} 
                        cerrarModal={cerrarModalInformeCotizacion}
                        report={reportQuotitation}
                    />
            </div>
        </>
    );
}

export default SolicitudesVista;
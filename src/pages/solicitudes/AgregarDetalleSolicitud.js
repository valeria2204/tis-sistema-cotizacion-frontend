import { FileEarmarkArrowUpFill, PlusCircle } from 'react-bootstrap-icons'
import React, { useState, useEffect } from  'react'
import { useForm } from 'react-hook-form'
import { useHistory, useParams} from 'react-router-dom'
import './AgregarDetalleSolicitud.css'
import ModalAgregarAdquisicion from './ModalAgregarAdquisicion'
import { createQuotitation, getInform } from '../../services/Http/QuotitationService';
import axios from 'axios';

function AgregarDetalleSolictud(){
    const {idUS} = useParams();
    const {nameUS} = useParams();
    const {register, formState: { errors }, handleSubmit, reset} = useForm();
    const [ adquisicion, setAdquisicion] = useState({nameUnidadGasto:"",aplicantName:"", requestDate:"", amount:null,spending_units_id:""})
    const [ newDetails, setNewDetails] = useState([])
    const [fecha , setFecha ] = useState(new Date())
    const [namefile, setNamefile] = useState([])
    const [fileValidate, setFileValidate] = useState(false);

    const [abierto, setAbierto] = useState(false);

    useEffect(() => {
        const user = JSON.parse(window.localStorage.getItem("userDetails"));
        const fetchData = async () => {
        try {
            const response = await getInform(user.user.id);
            console.log("esto es el response",response)
            setAdquisicion({
                ...adquisicion,
                nameUnidadGasto : nameUS,
                aplicantName : user.user.name+" "+user.user.lastName,
                requestDate : fecha.getFullYear()+"-"+(fecha.getMonth()+1+"-"+fecha.getDate()),
                spending_units_id: idUS
            });
        } catch (error) {
            console.log(error);
        }
    };

    fetchData();
    }, []);    

    const abrirModal =()=>{
        setAbierto(true);
    }
    const cerrarModal=()=>{
        setAbierto(false);
    }

    const handleInputChange = (event) => {
        console.log("cambio",event.target.value[0])
        if(event.target.value[0]==" "){
            console.log("primer",event.target.value[0])
            setAdquisicion({
                ...adquisicion,
                [event.target.name] : event.target.value.substring(1)
            });
        }else{
            setAdquisicion({
                ...adquisicion,
                [event.target.name] : event.target.value
            });
        }
    };

    const handleInputAmount = (event) => {
        console.log("number",event.target.value)
        setAdquisicion({
            ...adquisicion,
            [event.target.name] : event.target.value
        });
    }

    const invalidateSpace = (e) => {
        if(e[0]==" "){
            return "Dato invalido";
        }
        return true;
    };

    const updateDetails = (data) => {
        setNewDetails([...newDetails,data])
    }

    const [fls, setFls] = useState(null);

    const fileSelectHandler =(e)=>{
        let namefileAux =[];
        let extenciones = [];
        for (let index = 0; index <e.target.files.length; index++) {
            const name = e.target.files[index].name;
            let extension = name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2);
            namefileAux.push(name);
            extenciones.push(extension);
        }
        let noEsValido = true;
        let flag = false;
        extenciones.forEach(exten => {
            if(!flag){
                if(exten === 'pdf' || exten === 'docx' || exten=== 'jpg'){
                    noEsValido =false;
                }else{
                    noEsValido=true;
                    flag = true;
                    
                }
            }
        });
        setFileValidate(noEsValido);
        setNamefile(namefileAux);
        setFls(e.target.files);   
    }
    const onSubmit =async (id) =>{
        const formData = new FormData();
        if(fls != null){
            for(var i=0 ; i<fls.length ; i++){
            let name = 'file'+i;
            formData.append(name,fls[i],fls[i].name);
            }
            const token=window.localStorage.getItem("tokenContizacion");
            const headers = { headers: {'Authorization': `Bearer ${token}`}};
            console.log("archivo que se manda",formData)
            const res = await axios.post('https://tis-sistema-cotizacion-backend.herokuapp.com/api/upload/'+id,formData,headers);
            console.log("respuesta ",res);
        }
    }

    const sendData = async ( ) => {
        if(newDetails.length>0 && !fileValidate){
            try {
                const auxFecha = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()
                const obj = {nameUnidadGasto: adquisicion.nameUnidadGasto,aplicantName:adquisicion.aplicantName, requestDate:auxFecha, details:newDetails ,amount:adquisicion.amount, spending_units_id:adquisicion.spending_units_id};
                const result = await createQuotitation(obj);
                console.log(obj);
                console.log("resultado ",result);
                await onSubmit(result.success);
                reset();
                closePage();
            } catch (error) {
                console.log(error);
            }
        }
    };

    let history = useHistory();

    function closePage(){
        // history.replace("/SolicitudesDeAdquisicion");
        window.history.back();
    }

    const Details = newDetails.map((detail,index)=>{
        return(
            <tr key={index}>
                <th scope="row">
                    {index+1}         
                </th>
                <td>
                    {detail.amount}         
                </td>
                <td>
                    {detail.unitMeasure}         
                </td>
                <td >
                    {detail.description}         
                </td>
            </tr>
        );
    })

    return(
        <>
            <div className="container" align="left">
                <br></br>
                <h1>Nueva solicitud</h1>
                <br></br>
                <div className="col" id="registro">
                    <div className="form-register" id="formRegistro">
                        <form onSubmit={handleSubmit(sendData)}>
                        <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label>Unidad de gasto:</label>
                                    <div className="form-row" id="inputs">
                                         <label className="col-form-label">{adquisicion.nameUnidadGasto}</label>
                                    </div>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Nombre del solicitante:</label>
                                    <div className="form-row" id="inputs">
                                        <label className="col-form-label">{adquisicion.aplicantName}</label>
                                    </div>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Fecha de solicitud:</label>
                                    <div className="form-row" id="inputs">
                                        <label className="col-form-label">{adquisicion.requestDate}</label>
                                    </div>
                                </div>
                            </div>                     
                            <div className="form-row">
                                <div className="form-col">
                                    <label>Detalle de solicitud</label>
                                </div>
                                <div className="form-group col" align="end">
                                <button className="btn btn-success" type="button" onClick={ abrirModal }>
                                    < PlusCircle className="mb-1"/> Agregar
                                </button>                                                                    
                                </div>
                            </div>
                            <div className="form-row" id="list">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Unidad</th>
                                        <th scope="col">Descripcion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Details}
                                    </tbody>
                                </table>
                            </div>
                            <div className="form-row">
                                    <label>Monto estimado:</label>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <div className="form-row" id="inputs">
                                        <input
                                        name="amount"
                                        {...register("amount",{
                                            required:"El campo es requerido",
                                            min:{
                                                value:1,
                                                message:"Dato invalido"
                                            }
                                        })}
                                        value={adquisicion.amount}
                                        type="number" 
                                        className="form-control"
                                        onChange={ handleInputAmount }
                                        ></input>
                                        {errors.amount && <span className="text-danger text-small d-block mb-2">{errors.amount.message}</span>}
                                    </div>
                                </div>
                                    <ol>
                                        {namefile.map((name)=>{
                                            return(
                                                <li>{name}</li>
                                            )
                                        })}
                                    </ol>
                                        
                                        {fileValidate && <label style={{color:'red'}}>Solo se permite archivos pdf, docx y jpg</label>}
                                <div className="form-group col-md-6" align="end">
                                    <input 
                                    name="files"
                                    type="file" 
                                    id="files" 
                                    multiple 
                                    onChange = {fileSelectHandler}
                                    ></input>
                                    <label for="files"><FileEarmarkArrowUpFill className="mb-1"/> Adjuntar archivo</label>
                                </div>
                            </div>
                            <div className="form-row" >
                                <div className="form-group col" id="toolbar">
                                    <button type="button" className="btn btn-secondary" id="btnV" onClick={closePage}> Cancelar </button>
                                    <button type="submit" className="btn btn-info" id="btnV" > Enviar </button>
                                </div>
                            </div>
                        </form>
                                
                    </div>
                    <ModalAgregarAdquisicion
                        abierto={abierto}
                        cerrarModal={cerrarModal}
                        updateDetails={updateDetails}
                    />
                </div>
            </div>
        </>
    );
}

export default AgregarDetalleSolictud;
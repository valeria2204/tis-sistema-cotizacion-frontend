import React, { useEffect, useState } from 'react'
import FileViewer from 'react-file-viewer'
import { useParams } from 'react-router-dom'

function VerArchivoCotizacion(){
    
    const {aux} = useParams();
    const {fl} = useParams();

    const file = 'https://tis-sistema-cotizacion-backend.herokuapp.com/api/quotation/showFiles/detail/'+fl;
    const [type, setType] = useState("")

    useEffect(() => {
        const ext = getFileExtension(fl)
        setType(ext)
    }, []);

    const getFileExtension = (filename) => {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }
    
    const onError = (e) => {
        console.log(e, 'error in file-viewer');
    }

    const getRuta = () => {
        console.log(aux)
        if(aux==1){
            return('https://tis-sistema-cotizacion-backend.herokuapp.com/api/quotation/showFiles/detail/'+fl)
        }else{
            return('https://tis-sistema-cotizacion-backend.herokuapp.com/api/ua/quotation/showFiles/detail/'+fl)
        }
    }

    return(
        <div style={{width:"100%", height:"500px", textAlign:"center", backgroundColor:"grey"}}>
            <div style={{width:"100%", height:"100%"}}>
                <FileViewer
                fileType={type}
                filePath={getRuta()}
                onError={onError}
                style={{margin:"10px"}}/>
            </div>
        </div>
    );
}

export default VerArchivoCotizacion;
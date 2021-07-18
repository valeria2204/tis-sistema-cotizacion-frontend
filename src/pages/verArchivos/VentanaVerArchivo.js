import React, { useEffect, useState } from 'react'
import FileViewer from 'react-file-viewer'
import { useParams } from 'react-router-dom'

function VentanaVerArchivo(){
    const {id} = useParams();
    const {fl} = useParams();

    const file = 'https://tis-sistema-cotizacion-backend.herokuapp.com/api/showFile/'+id+'/'+fl;
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

    return(
        <div style={{width:"100%", height:"500px", textAlign:"center", backgroundColor:"grey"}}>
            <div style={{width:"100%", height:"100%"}}>
                <FileViewer
                fileType={type}
                filePath={file}
                onError={onError}
                style={{margin:"10px"}}/>
            </div>
        </div>
    );
}

export default VentanaVerArchivo;

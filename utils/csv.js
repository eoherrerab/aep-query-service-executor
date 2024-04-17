/*Se importa el módulo que permite cargar las variables de ambiente*/
const dotenv = require('dotenv')
/*Se importa el módulo que permite interactuar con archivos del sistema*/
const fs = require('fs');
/*Se importa el módulo que permite manipular rutas de carpetas y archivos*/
const path = require('path');
/*Se importa el módulo que permite crear archivos CSV*/
const csv = require('fast-csv');

/*Se establece la configuración del archivo que contiene las variables de ambiente*/
dotenv.config({path: ['config/csv.env']})

/*Se define una función de escritura de archivo CSV*/
function write_csv_file(file_name, rows){
    
    /*Se define una variable boleana que permite conocer si finalizó la escritura, inicializada en false*/
    let is_writing_done = false
    
    /*Se evalua si las líneas a escribir están almacenadas en un array*/
    if (Array.isArray(rows)){

        /*Se despliega un fragmento de código con un try...catch*/
        try{

            /*Se define una variable que contiene la ruta de almacenamiento del archivo CSV*/
            const csv_file = path.resolve(__dirname, path.join(".." ,process.env.FOLDER_PATH, file_name))
            
            /*Se define una variable que contiene el flujo de escritura*/
            const csv_stream = csv.format({ headers: true })
        
            /*Se hace una iteración sobre todas las líneas a escribir en el archivo CSV*/
            for(const row of rows){

                /*Se escribe la línea en el archivo CSV*/
                csv_stream.write(row)

            }

            /*Se utiliza una tubería para definir la codificación del archivo*/
            csv_stream.pipe(fs.createWriteStream(csv_file,{ encoding: 'utf8'}))
        
            /*Se finaliza el flujo de escritura*/
            csv_stream.end()

            /*Se establece la variable definida anteriormente como valor true */
            is_writing_done = true
        
        /*Se realiza una obtención del error ocurrido*/
        }catch(error){
            
            /*Se muestra en consola el error obtenido*/
            //console.error(error)
            
            /*Se despliega una excepción asociada al error obtenido*/
            throw error

        /*Se ejecuta código independiente de si la ejecución anterior fue exitosa o no*/
        }finally{

            /*Se retorna la respuesta a la función original*/
            return is_writing_done

        }
        
    }else{

        /*Se retorna la respuesta a la función original*/
        return is_writing_done

    }
}

/*Se definen las funciones a exportar*/
module.exports = {
    write_csv_file: write_csv_file
}
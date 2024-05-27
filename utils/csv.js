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

            /*Se define una variable que contiene la ruta de la carpeta donde se guardan los archivos CSV*/
            const csv_folder_path = path.resolve(__dirname, "..", process.env.FOLDER_PATH)

            /*Se define una variable que contiene la ruta del archivo CSV a generar*/
            const csv_file_path = path.resolve(csv_folder_path, file_name)            

            /*Se evalua si la ruta de almacenamiento del archivo no existe*/
            if (!fs.existsSync(csv_folder_path)) {
    
                /*Si la ruta de almacenamiento no existe, se genera la ruta*/
                fs.mkdirSync(csv_folder_path)
            
            }

            /*Se define una variable que contiene el flujo de escritura basado en archivos*/
            const writing_stream = fs.createWriteStream(csv_file_path, {flags: 'a', encoding: 'utf8'})

            /*Se define una variable que contiene el flujo de escritura del archivo CSV*/
            let csv_writing_stream

            /*Se evalua si la ruta del archivo CSV a generar existe*/
            if (fs.existsSync(csv_file_path)){

                /*Si la ruta del archivo existe, se establece la variable definida anteriormente
                como el flujo de escritura del archivo CSV sin cabeceras activas*/
                csv_writing_stream = csv.format({ headers: false, includeEndRowDelimiter: true})

            }else{

                /*Si la ruta del archivo no, se establece la variable definida anteriormente
                como el flujo de escritura del archivo CSV con cabeceras activas*/
                csv_writing_stream = csv.format({ headers: true, includeEndRowDelimiter: true})

            }

            /*Se hace una iteración sobre todas las líneas a escribir en el archivo CSV*/
            for(const row of rows){

                /*Se escribe la línea en el archivo CSV*/
                csv_writing_stream.write(row)

            }

            /*Se utiliza una tubería para definir la codificación y modo del archivo*/
            csv_writing_stream.pipe(writing_stream)
        
            /*Se finaliza el flujo de escritura*/
            csv_writing_stream.end()

            /*Se establece la variable definida anteriormente como valor true */
            is_writing_done = true
        
        /*Se realiza una obtención del error ocurrido*/
        }catch(error){
            
            /*Se muestra en consola el error obtenido*/
            console.error(error)
            
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

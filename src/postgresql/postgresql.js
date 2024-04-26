/*Se importa el módulo que permite cargar las variables de ambiente*/
const dotenv = require('dotenv')
/*Se importa el módulo que permite conectar con bases de datos postgresql*/
const pg = require('pg')

/*Se establece la configuración del archivo que contiene las variables de ambiente*/
dotenv.config({path: ['config/pg.env']})

/*Se define una función de comprobación de final de registros*/
function is_query_result_over_yet(sql_query_result_row_count){
    
    /*Se evalua si la cantidad de registros obtenidos a partir de la
    respuesta de la sentencia es menor a la cantidad límite por lote*/
    if (sql_query_result_row_count < process.env.BATCH_LIMIT){
        
        /*Si se cumple esta condición, se retorna el valor true*/
        return true
    
    }else{
        
        /*Si no se cumple esta condición, se retorna el valor false*/
        return false
    
    }

}

function replace_sql_query_parameters(sql_query, sql_query_parameters){
    
    let sql_query_with_replaced_parameters = sql_query
    
    for(const sql_query_parameter of Object.keys(sql_query_parameters)){
        
        sql_query_with_replaced_parameters = sql_query_with_replaced_parameters.replace("$" + sql_query_parameter, sql_query_parameters[sql_query_parameter])
    }
    
    return sql_query_with_replaced_parameters
}

/*Se define una función de ejecución de sentencias*/
async function execute_query(connection_parameters, query_template){
    
    /*Se define una variable que contiene los parámetros requeridos para conectar con la base de datos postgresql*/
    const client = new pg.Client({
        'user': connection_parameters['username'],
        'host': connection_parameters['host'],
        'database': connection_parameters['dbName'],
        'password': connection_parameters['token'],
        'port': connection_parameters['port'],
        'ssl': true
    })

    /*Se define una variable que contiene la cantidad total de registros de las respuestas de la sentencia*/
    let total_query_results_rows = []

    /*Se define una variable que contiene la respuesta de la sentencia*/
    let query_results

    /*Se despliega un fragmento de código con un try...catch*/
    try{
        
        /*Se realiza la conexión a la base de datos, con los parámetros requeridos
        para conectarcon la base de datos postgresql definidos anteriormente*/
        await client.connect()

        /*Se define una variable que contiene la información relacionada al
        tamaño limite por lote de registros permitido por la base de datos*/
        let limit = parseInt(process.env.BATCH_LIMIT)

        /*Se define una variable que contiene la información relacionada
        a desde qué línea se debe tomar la información de registros*/
        let offset = 0

        let sql_query

        if(query_template['queryParameters']){

            sql_query = replace_sql_query_parameters(query_template['sql'], query_template['queryParameters'])

        }else{

            sql_query = query_template['sql']

        }

        /*Este fragmento de código se ejecuta, al menos, una
        vez dado que la consulta se realiza al menos una vez*/
        do{
            
            /*Se establece la respuesta de la sentencia al realizar
            la consulta sobre la conexión a la base de datos*/
            query_results = await client.query(sql_query + ` LIMIT ${limit} OFFSET ${offset}`)

            /*Se establece que la variable que contiene la cantidad total de registros es la
            variable misma, en concatenación con los registros obtenidos en la respuesta anterior*/
            total_query_results_rows = total_query_results_rows.concat(query_results.rows)

            /*Se establece la variable como la variable misma,
            más la suma del límite para cada iteración*/
            offset = offset + limit

        /*Este fragmento de código se ejecuta, al menos una vez, y mientras no se llegue
        al final de los registros que se obtienen de respuesta de la sentencia*/
        }while(!is_query_result_over_yet(query_results.rowCount))

    /*Se realiza una obtención del error ocurrido*/
    }catch(error){
        
        /*Se muestra en consola el error obtenido*/
        console.error(error)

        /*Se despliega una excepción asociada al error obtenido*/
        throw error

    /*Se ejecuta código independiente de si la ejecución anterior fue exitosa o no*/
    }finally{

        /*Se evalua si la conexión a la base de datos permanece abierta*/
        if(client._connected){

            /*Se finaliza la conexión a la base de datos*/
            await client.end()

        }

        /*Se retorna la respuesta de la sentencia a la función original*/
        return total_query_results_rows

    }

}

/*Se definen las funciones a exportar*/
module.exports = {
    execute_query: execute_query
}
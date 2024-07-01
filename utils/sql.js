/*Se importa el módulo que permite obtener el tipo de sentencia SQL a ejecutar*/
const sql_parser = require('sql-parser-cst')

/*Se define una función de comprobación de sentencias*/
function is_sql_select_query(sql_query){

    /*Se define una variable boleana que permite conocer si la consulta es un SELECT o no, inicializada en false*/
    let is_sql_select_query = false

    /*Se evalua si la sentencia SQL está en formato string*/
    if(typeof sql_query === "string"){
        
        /*Se despliega un fragmento de código con un try...catch*/
        try{

            /*Se define una variable que obtiene la metadata de la sentencia SQL*/
            let parser = sql_parser.parse(sql_query, {
                dialect: "postgresql",
                includeSpaces: true,
                includeNewlines: true,
                includeComments: true,
                includeRange: true
              }
            )
            
            /*Se evalua si el tipo de sentencia SQL es un SELECT*/
            if(parser.statements[0].type === "select_stmt"){
                
                /*Si el tipo de sentencia SQL es un select, se establece como valor true*/
                is_sql_select_query = true

            }
            
        /*Se realiza una obtención del error ocurrido*/
        }catch(error){
            
            /*Se muestra en consola el error obtenido*/
            console.error(error)
            
            /*Se despliega una excepción asociada al error obtenido*/
            throw error

        /*Se ejecuta código independiente de si la ejecución anterior fue exitosa o no*/
        }finally{
            
            /*Se retorna la respuesta a la función original*/
            return is_sql_select_query

        }
        
    }else{

        /*Se retorna la respuesta a la función original*/
        return is_sql_select_query

    }

}

/*Se define una función de comprobación de sentencias*/
function contains_offset_query(sql_query){

    /*Se define una variable boleana que permite conocer si la consulta es un SELECT o no, inicializada en false*/
    let contains_offset = true

    /*Se evalua si la sentencia SQL está en formato string*/
    if(typeof sql_query === "string"){

        /*Se despliega un fragmento de código con un try...catch*/
        try{

            /*Se define una variable que obtiene la metadata de la sentencia SQL*/
            let parser = sql_parser.parse(sql_query, {
                dialect: "postgresql",
                includeSpaces: true,
                includeNewlines: true,
                includeComments: true,
                includeRange: true
              }
            )

            /*Se define la variable definida anteriormente como la obtención de
            propiedades relacionadas a las palabras claves OFFSET o LIMIT en la
            sentencia*/
            contains_offset = parser.statements[0].clauses.some(person => person.hasOwnProperty('offsetKw') || person.hasOwnProperty('limitKw'))

        /*Se realiza una obtención del error ocurrido*/
        }catch(error){
            
            /*Se muestra en consola el error obtenido*/
            console.error(error)
            
            /*Se despliega una excepción asociada al error obtenido*/
            throw error

        /*Se ejecuta código independiente de si la ejecución anterior fue exitosa o no*/
        }finally{
            
            /*Se retorna la respuesta a la función original*/
            return contains_offset

        }

    }else{

        /*Se retorna la respuesta a la función original*/
        return contains_offset

    }

}

/*Se definen las funciones a exportar*/
module.exports = {
    is_sql_select_query: is_sql_select_query,
    contains_offset_query: contains_offset_query
}
/*Se importa el módulo que permite obtener el tipo de sentencia SQL a ejecutar*/
const sql_parser = require('node-sql-parser')

/*Se define una función de comprobación de sentencias*/
function is_sql_select_query(sql_query){
    
    /*Se define una variable que inicializa el objeto Parser*/
    const parser = new sql_parser.Parser()

    /*Se define una variable boleana que permite conocer si la consulta es un SELECT o no, inicializada en false*/
    let is_sql_select_query = false

    /*Se despliega un fragmento de código con un try...catch*/
    try{

        /*Se define una variable que obtiene la metadata de la sentencia SQL*/
        let ast = parser.astify(sql_query)

        /*Se evalua si el tipo de sentencia SQL es un SELECT*/
        if(ast.type === 'select'){
            
            /*Si el tipo de sentencia SQL es un select, se establece como valor true*/
            is_sql_select_query = true

        }

    /*Se realiza una obtención del error ocurrido*/
    }catch(error){
        
        /*Se muestra en consola el error obtenido*/
        //console.error(error)
        
        /*Se despliega una excepción asociada al error obtenido*/
        throw error

    /*Se ejecuta código independiente de si la ejecución anterior fue exitosa o no*/
    }finally{

        /*Se retorna la respuesta a la función original*/
        return is_sql_select_query

    }

}

/*Se define una función de comprobación de sentencias*/
function contains_offset_query(sql_query){
    
    /*Se define una variable que inicializa el objeto Parser*/
    const parser = new sql_parser.Parser()

    /*Se define una variable boleana que permite conocer si la consulta es un SELECT o no, inicializada en false*/
    let contains_offset = true

    /*Se despliega un fragmento de código con un try...catch*/
    try{

        /*Se define una variable que obtiene la metadata de la sentencia SQL*/
        let ast = parser.astify(sql_query)

        /*Se evalua si la sentencia SQL contiene un OFFSET, LIMIT
        o cualquier otra palabra clave que no la permita ejecutar*/
        if(ast.limit == null){
            
            /*Si la sentencia no contiene palabras clave que no
            la permitan ejecutar, se establece como valor false*/
            contains_offset = false

        }


    /*Se realiza una obtención del error ocurrido*/
    }catch(error){
        
        /*Se muestra en consola el error obtenido*/
        //console.error(error)
        
        /*Se despliega una excepción asociada al error obtenido*/
        throw error

    /*Se ejecuta código independiente de si la ejecución anterior fue exitosa o no*/
    }finally{

        /*Se retorna la respuesta a la función original*/
        return contains_offset

    }

}

/*Se definen las funciones a exportar*/
module.exports = {
    is_sql_select_query: is_sql_select_query,
    contains_offset_query: contains_offset_query
}
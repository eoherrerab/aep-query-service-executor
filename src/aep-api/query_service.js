/*Se importa el módulo que permite realizar peticiones HTTP*/
const axios = require('axios')
/*Se importa el módulo que permite cargar las variables de ambiente*/
const dotenv = require('dotenv')

/*Se establece la configuración del archivo que contiene las variables de ambiente*/
dotenv.config({path: ['config/aep.env']})

/*Se define una función de obtención de parámetros de conexión a postgresql con un entorno asincrónico*/
async function get_postgresql_connection_parameters(access_token){

    /*Se define una variable que contiene la respuesta la respuesta de la petición HTTP*/
    let response

    /*Se despliega un fragmento de código con un try...catch*/
    try{

        /*Se define una variable que contiene las cabeceras requeridas
        para la obtención de parámetros de conexión a postgresql*/
        const headers = {
            "Authorization": "Bearer " + access_token,
            "x-gw-ims-org-id": process.env.IMS_ORG,
            "x-api-key": process.env.API_KEY,
            "x-sandbox-name": process.env.SANDBOX_NAME
        }

        /*Se define una variable que contiene la respuesta de la petición que se obtiene a partir
        del envío de la petición GET usando axios, con las cabeceras definidas anteriormente*/
        response = await axios.get("https://platform.adobe.io/data/foundation/query/connection_parameters", {
            headers: headers
        })

    /*Se realiza una obtención del error ocurrido*/
    }catch(error){

        response = error.response

        /*Se muestra en consola el error obtenido*/
        console.error(error)

        /*Se despliega una excepción asociada al error obtenido*/
        throw error

    }finally{

        /*Se retorna la respuesta de la petición a la función original*/
        return response

    }
}

/*Se define una función de obtención de información asociada a una plantilla de sentencia con un entorno asincrónico*/
async function get_query_template(access_token, query_template_id){

    /*Se define una variable que contiene la respuesta la respuesta de la petición HTTP*/
    let response

    /*Se despliega un fragmento de código con un try...catch*/
    try{

        /*Se define una variable que contiene las cabeceras requeridas para
        la obtención de información asociada a una plantilla de sentencia*/
        const headers = {
            "Authorization": "Bearer " + access_token,
            "x-gw-ims-org-id": process.env.IMS_ORG,
            "x-api-key": process.env.API_KEY,
            "x-sandbox-name": process.env.SANDBOX_NAME
        }

        /*Se define una variable que contiene la respuesta de la petición que se obtiene a partir
        del envío de la petición GET usando axios, con las cabeceras definidas anteriormente*/
        response = await axios.get("https://platform.adobe.io/data/foundation/query/query-templates/" + query_template_id, {
            headers: headers
        })

    /*Se realiza una obtención del error ocurrido*/
    }catch(error){

        response = error.response

        /*Se muestra en consola el error obtenido*/
        //console.error(error)

        /*Se despliega una excepción asociada al error obtenido*/
        throw error

    }finally{

        /*Se retorna la respuesta de la petición a la función original*/
        return response

    }
}

/*Se definen las funciones a exportar*/
module.exports = {
    get_postgresql_connection_parameters: get_postgresql_connection_parameters,
    get_query_template: get_query_template
}
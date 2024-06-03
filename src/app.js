/*Se importa el módulo que permite cargar las variables de ambiente*/
const dotenv = require('dotenv')
/*Se importa el módulo que permite manipular arreglos*/
const underscore = require('underscore')
/*Se importa el módulo que permite generar tokens de acceso para Experience Platform API*/
const access_token_generator = require('./aep-api-auth/adobelogin.js')
/*Se importa el módulo que permite interactuar con la Query Service API de Experience Platform*/
const query_service = require('./aep-api/query_service.js')
/*Se importa el módulo que permite validar sentencias SQL*/
const sql_tools = require('../utils/sql.js')
/*Se importa el módulo que permite conectar a base de datos postgresql y ejecutar sentencias SQL */
const postgresql = require('../src/postgresql/postgresql.js')

/*Se establece la configuración del archivo que contiene las variables de ambiente*/
dotenv.config({path: ['config/aep.env']})

/*Se define una función principal con un entorno asincrónico*/
async function main(){

    try{

        /*Se define una variable que contiene la información de la respuesta de
        la petición especificamente el valor correspondiente al token de acceso*/
        let token_request_response

        /*Se evalua si el método de autenticación a utilizar*/
        if(process.env.AUTH_METHOD.toLowerCase() == 'jwt'){
            
            /*Se define la variable que contiene el JSON Web Token generado y necesario
            para realizar la autenticación ante Adobe Experience Platform API usando JWT*/
            let json_web_token = access_token_generator.generate_json_web_token()

            /*Se establece una variable que contiene la respuesta de la petición que se obtiene a partir de la
            función de generación de token de acceso usando JWT, usando el json_web_token como parámetro*/
            token_request_response = await access_token_generator.generate_access_token_using_jwt(json_web_token)


        }else if(process.env.AUTH_METHOD.toLowerCase() == 'oauth'){
            
            /*Se establece una variable que contiene la respuesta de la petición que se 
            obtiene a partir de la función de generación de token de acceso usando Oauth*/
            token_request_response = await access_token_generator.generate_access_token_using_oauth()

        }

        /*Se evalua si la respuesta de la petición fue exitosa*/
        if(token_request_response.status == 200){

            /*Se define una variable que contiene la información de la respuesta de
            la petición especificamente el valor correspondiente al token de acceso*/
            let access_token = token_request_response.data.access_token

            /*Se define una variable que contiene las ID de las plantillas de las sentencias*/
            let query_templates_ids = process.env.QUERY_TEMPLATES_IDS.split(",")

            /*Se establece la variable definida anteriormente como la misma,
            removiendo los espacios al inicio y al final de cada elemento de la lista*/
            query_templates_ids = query_templates_ids.map(query_template_id => query_template_id.trim())

            /*Se establece la variable definida anteriormente como la misma, removiendo los elementos que sean vacíos*/
            query_templates_ids = query_templates_ids.filter(query_template_id => query_template_id != "")

            /*Se establece la variable definida anteriormente como la misma, removiendo los elementos repetidos*/
            query_templates_ids = underscore.uniq(query_templates_ids)

            /*Se define una variable que contiene la información de las plantillas de las sentencias a partir de la función
            asincrónica de obtención de información de las plantillas de sentencias, con un token de acceso y la ID de la
            plantilla como parámetro*/
            let query_templates = await Promise.all(query_templates_ids.map(query_template_id => query_service.get_query_template(access_token, query_template_id)))

            /*Se establece la variable definida anteriormente como la misma, removiendo las peticiones no exitosas*/
            query_templates = query_templates.filter(query_template => query_template.status == 200)

            /*Se establece la variable definida anteriormente como la misma, removiendo las sentencias que no sea de tipo SELECT*/
            query_templates =  query_templates.filter(query_template => sql_tools.is_sql_select_query(query_template.data.sql))

            /*Se establece la variable definida anteriormente como la misma, removiendo las sentencias que contengan palabras como OFFSET, LIMIT, etc.*/
            query_templates =  query_templates.filter(query_template => !sql_tools.contains_offset_query(query_template.data.sql))

            /*Se define una variable que contiene la respuesta de la petición que se obtiene a partir de la
            función de obtención de credenciales de acceso a postgreslq, con un token de acceso como parámetro*/
            let parameters_requests_response = await query_service.get_postgresql_connection_parameters(access_token)

            /*Se evalua si la respuesta de la petición fue exitosa*/
            if(parameters_requests_response.status == 200){

                /*Se ejecuta la función asincrónica de consulta en la base de datos,
                con los datos de conexión y la plantilla de sentencia como parámetro*/
                await Promise.all(query_templates.map(query_template => postgresql.execute_query(parameters_requests_response.data, query_template.data)))
                
            }

        }

    /*Se realiza una obtención del error ocurrido*/
    }catch(error){

        /*Se muestra en consola el error obtenido*/
        console.log(error)

    }
    
}

/*Se ejecuta la función principal*/
main()
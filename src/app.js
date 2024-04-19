/*Se importa el módulo que permite cargar las variables de ambiente*/
const dotenv = require('dotenv')
/*Se importa el módulo que permite generar tokens de acceso para Experience Platform API*/
const access_token_generator = require('./aep-api-auth/adobelogin.js')
/*Se importa el módulo que permite interactuar con la Query Service API de Experience Platform*/
const query_service = require('./aep-api/query_service.js')
/*Se importa el módulo que permite validar sentencias SQL*/
const sql_tools = require('../utils/sql.js')
/*Se importa el módulo que permite conectar a base de datos postgresql y ejecutar sentencias SQL */
const postgresql = require('../src/postgresql/postgresql.js')
/*Se importa el módulo que permite obtener la fecha y ahora actual como marca de tiempo*/
const date = require('../utils/date.js')
/*Se importa el módulo que permite crear archivos CSV*/
const csv = require('../utils/csv.js')

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
            let access_token = token_request_response.data['access_token']

            /*Se define una variable que contiene las ID de las plantillas de las sentencias*/
            let query_templates_ids = process.env.QUERY_TEMPLATES_IDS.split(",")

            /*Se establece la variable definida anteriormente como la misma,
            removiendo los espacios al inicio y al final de cada elemento de la lista*/
            query_templates_ids = query_templates_ids.map(query_template_id => query_template_id.trim())

            /*Se establece la variable definida anteriormente como la misma, removiendo los elementos que sean vacíos*/
            query_templates_ids = query_templates_ids.filter(query_template_id => query_template_id != "")

            /*Se define una variable que contiene la información de las plantillas de las sentencias*/
            let query_templates = []

            /*Se hace una iteración sobre todos los elementos de la
            variable que contiene las ID de las plantillas de sentencias*/
            for(const query_template_id of query_templates_ids){

                /*Se define una variable que contiene la respuesta de la petición que se obtiene a
                partir de la función de obtención de información de las plantillas de sentencias,
                con un token de acceso y la ID de la plantilla de sentencia como parámetro*/
                let template_request_response = await query_service.get_query_template(access_token, query_template_id)
            
                /*Se evalua si la respuesta de la petición fue exitosa*/
                if(template_request_response.status == 200){

                    /*Se evalua si la sentencia SQL es de tipo SELECT y no contiene palabras claves OFFSET o LIMIT*/
                    if (sql_tools.is_sql_select_query(template_request_response.data.sql) && !sql_tools.contains_offset_query(template_request_response.data.sql)){

                        /*Se agrega la información de la plantilla de sentencia a la variable definida anteriormente*/
                        query_templates.push(template_request_response.data)

                    }

                }

            }

            /*Se realiza una iteración sobre todos los elementos de la variable
            que contiene la información de las plantillas de sentencia*/
            for (const query_template of query_templates){
            
                /*Se define una variable que contiene la respuesta de la petición que se obtiene a partir de la
                función de obtención de credenciales de acceso a postgreslq, con un token de acceso como parámetro*/
                let parameters_requests_response = await query_service.get_postgresql_connection_parameters(access_token)

                /*Se evalua si la respuesta de la petición fue exitosa*/
                if(parameters_requests_response.status == 200){

                    /*Se define una variable que contiene la información de los resultados de la sentencia*/
                    let query_results = await postgresql.execute_query(parameters_requests_response.data, query_template)

                    /*Se crea el archivo CSV con las líneas obtenidas de los resultados de la setencia*/
                    csv.write_csv_file(query_template.id + "_At_" + date.get_datetime() + ".csv", query_results)

                }

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
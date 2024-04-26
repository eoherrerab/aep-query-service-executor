# AEP Query Service Executor

AEP Query Service Executor es un script que permite la ejecución de sentencias SQL guardadas en Adobe Experience Platform Query Service

## Caracteristicas

-  **Conexión directa con PostgreSQL:** como lo específica la documentación, los conjuntos de datos, sean creados por los usuarios de Experience Platform a partir de esquemas o los conjuntos de datos del sistema, están almacenados en una base de datos que se ejecuta mediante PostgreSQL. Este script utiliza los servicios proporcionados por Query Service API, obteniendo las credenciales para crear una conexión directa a la base de datos, permitiendo una ejecución más rápida de las sentencias que, de igual manera, se obtienen mediante los servicios de Query Service API.

-  **Sin limites de líneas por consulta:** la documentación menciona que, al ejecutar una sentencia, la cantidad máxima de líneas que puede retornar mediante la interfaz gráfica proporcionada son 50.000, que a su vez se traducen en registros. Este script utiliza las palabras claves LIMIT y FETCH para obtener lotes de 50.000 registros hasta obtener la cantidad total de registros que debe de traer la consulta.

- **Exportación de consultas a archivo CSV:** la documentación menciona que, si se desea exportar los resultados de una sentencia, se puede utilizar la opción de CREATE TABLE AS SELECT (CTAS), para convertir los resultados de la sentencia en un conjunto de datos Ad Hoc para, posteriormente, exportarlo a un servidor SFTP o servicio en la nube mediante la opción de destinos, lo que se traduce en trabajo adicional para visualizar todos los resultados obtenidos. Este script utiliza el módulo *fast-csv* para exportar los resultados de la sentencia en un archivo separado por caracteres (CSV) que se almacenará en la carpeta definida.

## Requerimientos

- **NodeJS:** Este permite ejecutar el script. Particularmente estoy utilizando la versión v20.11.0, sin embargo esto no implica directamente que no pueda funcionar en otras versiones.

- **PostgreSQL:** El módulo *pg* de NodeJS utiliza el motor de base de datos PostgreSQL para realizar la conexión y consultas a la base de datos. Particularmente estoy utilizando la versión 16.1, sin embargo, y como mencioné anteriormente, esto no implica directamente que no pueda funcionar en otras versiones.

## Configuración

Una vez posea los archivos del repositorio en su entorno local, se accede a la carpeta *config* del mismo y, dependiendo del método de autenticación a utilizar, se debe cambiar el nombre del archivo correspondiente a *aep.env*. Actualmente se manejan los métodos de autenticación dispuestos por Adobe, JWT y Oauth, relacionados a los archivos *aep_jwt.env* y *aep_oauth.env* respectivamente, ubicados en la carpeta *config*.

A partir del archivo que se haya renombrado como *aep.env*, se debe de ingresar las credenciales en dicho archivo. A continuación se describe la información de cada campo en ambos archivos:

### Campos para archivo .env de autenticación por estandar Oauth

|Nombre de variable de ambiente|Descripción|Donde obtener este valor|
|--|--|--|
|AUTH_METHOD|Es un valor que identifica el método de autenticación a utilizar. Este valor, para método de autenticación por Oauth, es *OAUTH*|Predefinido por el archivo de ambiente|
|CLIENT_SECRET|Es un valor formado, normalmente, por letras, en mayúsculas y minúsculas, y números, en conjuntos de caracteres separados por guiones. Este valor, en conjunto con API KEY, permite la creación de tokens de acceso|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|API_KEY|Es un valor formado, normalmente, por letras, en minúscula, y números. Este valor, en conjunto con CLIENT SECRET, permite la creación de tokens de acceso|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|IMS_ORG|Es un valor formado, normalmente, por letras, en mayúscula, números y con sufijo *@AdobeOrg*. Este valor identifica la propiedad/organización en Adobe|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|GRANT_TYPE|Es un valor que indica que tipo de acceso relacionado al token a generar. Este valor, por defecto, es *client_credentials*|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|SCOPES|Es un valor que indica el alcance relacionado al token a generar. Este valor, por defecto, es *openid, session, cjm.suppression_service.client.delete, AdobeID, read_organizations, cjm.suppression_service.client.all, additional_info.projectedProductContext*|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|SANDBOX_NAME|Nombre distintivo del ambiente sobre cual se realizan las consultas. Por defecto, al contratar Adobe Experience Platform, se crea un ambiente productivo con nombre distintivo *prod*|Se obtiene mediante la opción de Sandboxes, dentro de la categoría Administration del menú de Adobe Experience Platform|
|QUERY_TEMPLATES_IDS|Un Query Template ID es un valor formado, normalmente, por letras, en minúsculas, y números, en conjuntos de caracteres separados por guiones. Cada uno de estos Query Template ID debe ir separado del resto usando el caracter de coma|Se obtiene mediante cada una de las plantillas de consulta a ejecutar creadas en Queries, dentro de la categoría Data Management del menú de en Adobe Experience Platform|

### Campos para archivo .env de autenticación por estandar JWT
|Nombre de variable de ambiente|Descripción|Donde obtener este valor|
|--|--|--|
|AUTH_METHOD|Es un valor que identifica el método de autenticación a utilizar. Este valor, para método de autenticación por JWT, es *JWT*|Predefinido por el archivo de ambiente|
|CLIENT_SECRET|Es un valor formado, normalmente, por letras, en mayúsculas y minúsculas, y números, en conjuntos de caracteres separados por guiones. Este valor, en conjunto con API KEY, permite la creación de tokens de acceso|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|API_KEY|Es un valor formado, normalmente, por letras, en minúscula, y números. Este valor, en conjunto con CLIENT SECRET, permite la creación de tokens de acceso|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|IMS_ORG|Es un valor formado, normalmente, por letras, en mayúscula, números y con sufijo *@AdobeOrg*. Este valor identifica la propiedad/organización en Adobe|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|METASCOPES|Es un valor que indica el alcance relacionado con el token a generar. Este valor, por defecto, es *ent_dataservices_sdk*|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|TECHNICAL_ACCOUNT_ID|Es un valor formado, normalmente, por letras, en mayúscula, números y con sufijo *@techacct.adobe.com*. Este valor identifica la propiedad/organización en Adobe desde Developer Console|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|PRIVATE_KEY|Es un valor formado, normalmente, por letras, en mayúsculas y minúsculas, números, caracteres especiales, tiene como prefijo *-----BEGIN PRIVATE KEY-----* y como sufijo *-----END PRIVATE KEY-----*|Se obtiene al crear un proyecto en Adobe Developer Console y agregando la Experience Platform API|
|SANDBOX_NAME|Nombre distintivo del ambiente sobre cual se realizan las consultas. Por defecto, al contratar Adobe Experience Platform, se crea un ambiente productivo con nombre distintivo *prod*|Se obtiene mediante la opción de Sandboxes, dentro de la categoría Administration del menú de Adobe Experience Platform|
|QUERY_TEMPLATES_IDS|Un Query Template ID es un valor formado, normalmente, por letras, en minúsculas, y números, en conjuntos de caracteres separados por guiones. Cada uno de estos Query Template ID debe ir separado del resto usando el caracter de coma|Se obtiene mediante cada una de las plantillas de consulta a ejecutar creadas en Queries, dentro de la categoría Data Management del menú de en Adobe Experience Platform|

Posteriormente, se accede al archivo *csv.env* y se debe de ingresar las configuraciones requeridas en dicho archivo. A continuación se describe la información de cada campo en el archivo:

### Campos para archivo .env de exportación a CSV

|Nombre de variable de ambiente|Descripción|Donde obtener este valor|
|--|--|--|
|FOLDER_PATH|Ruta de la carpeta donde desea que se almacenen los archivos CSV generados. Este valor, por defecto, es *csv*. Al ejecutar el script, si esta ruta no existe, se creará dentro de la ruta del repositorio|Predefinido por el archivo de ambiente, con posibilidad de cambiar dicho valor dependiendo de la necesidad del usuario|

Finalmente, se accede al archivo *pg.env* y se debe de ingresar las configuraciones requeridas en dicho archivo. A continuación se describe la información de cada campo en el archivo:

### Campos para archivo .env de configuración de limites por consulta

|Nombre de variable de ambiente|Descripción|Donde obtener este valor|
|--|--|--|
|BATCH_LIMIT|Limite de líneas por consulta. Como se comentó anteriormente, la cantidad máxima de registros que puede retornar un resultado de consulta son 50.000. Este valor está definido en la documentación y no es manipulable por el usuario, sin embargo, esto está sujeto a cambios realizados por el equipo de Experience Platform|Predefinido por el archivo de ambiente, sujeto a cambios realizados por Adobe|

## Limitantes
 
- Solamente puede ejecutar de tipo SELECT. Esto para evitar crear sentencias, como UPDATE O DELETE, que puedan alterar la estructura y estabilidad de la base de datos y, en consecuencia, la instancia de Adobe Experience Platform.

- Las sentencias no pueden contener FETCH, LIMIT, OFFSET u otras palabras claves que cumplan estas funciones. Esto es debido a que, como se mencionó anteriormente, este script utiliza palabras claves LIMIT y OFFSET para obtener los valores completos de la sentencia, superando ese limite de 50000 registros por consulta.

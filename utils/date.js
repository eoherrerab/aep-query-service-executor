/*Se define una función de generación de fecha en formato DD-MM-AAAAThh:mm:ss*/
function get_datetime(){

    /*Se define una variable que contiene los milisegundos
    correspondientes a la fecha y hora actuales*/
    const now = new Date()

    /*Se define una variable que contiene el día actual de la fecha*/
    const day = String(now.getDate()).padStart(2, '0')

    /*Se define una variable que contiene el mes actual de la fecha*/
    const month = String(now.getMonth() + 1).padStart(2, '0')

    /*Se define una variable que contiene el año actual de la fecha*/
    const year = String(now.getFullYear())

    /*Se define una variable que contiene la hora actual de la fecha*/
    const hours = String(now.getHours()).padStart(2, '0')

    /*Se define una variable que contiene los minutos actuales de la fecha*/
    const minutes = String(now.getMinutes()).padStart(2, '0')

    /*Se define una variable que contiene los segundos actuales de la fecha*/
    const seconds = String(now.getSeconds()).padStart(2, '0')

    /*Se retorna la cadena de caracteres con los datos de
    la fecha aplicando el formato a la función original*/
    return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`

}

/*Se definen las funciones a exportar*/
module.exports = {
    get_datetime: get_datetime
}

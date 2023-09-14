import { addDoc, collection, getDocs, orderBy, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js"

const conversion = { style: 'currency', currency: 'USD' };
var nf = new Intl.NumberFormat('en-US', conversion);  

window.nuevo = function nuevo(){

    $('#nuevoregistro').show()
    $('#gestosavaluos').hide()

}




window.listar = async function listar(){

    $('#gestosavaluos').show()
    $('#nuevoregistro').hide()

    const querySnapshot = await getDocs(collection(db, "verificacion"),orderBy("fechainspeccion", "desc"));
    var registros = []
    var resultado = document.getElementById('resultados')
    resultado.innerHTML = "";

    var i = 1;
    querySnapshot.forEach((doc) => {
        const timestamp = doc.data().fechainspeccion;
        const fecha = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

        resultado.innerHTML += `
            <tr id="${doc.id}">
                <th scope="row">${i}</th>
                <td>${doc.data().cliente}</td>
                <td>${fechaFormateada}</td>
                <td>
                    <b>Referencia: </b>${doc.data().referencia} <br>
                    <b>Folio: </b>${doc.data().folio} <br>
                    <b>Propietario: </b>${doc.data().propietario} <br>
                    <b>Valor de Mercado: </b>${nf.format(doc.data().valormercado)} <br>
                    <b>Valor de Venta Forzosa: </b>${nf.format(doc.data().valorventa)} <br>
                </td>
                <td><a href="javascript:eliminar('${doc.id}')"<i class="fa-solid fa-trash"></i></a></td>
            </tr>
        `;
        registros.push(doc.data());
        i++;
    }); 

    console.log(registros)
    
}

window.guardar = async function guardar(){

        $('.btn-cargando').show()
        $('.btn-guardar').hide()

        var referencia = $('#referencia').val()
        var propietario = $('#propietario').val()
        var folio = $('#folio').val()
        var fechainspeccion = new Date($('#fecha').val())
        var cliente = $('#cliente').val()
        var valormercado = $('#valormercado').val()
        var valorventa = $('#valorventa').val()

        if(!referencia){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes llenar todos los campos',
            })
            $('#referencia').focus()
            $('.btn-cargando').hide()
            $('.btn-guardar').show()
            return false;
        }
        if(!propietario){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes llenar todos los campos',
            })
            $('#propietario').focus()
            $('.btn-cargando').hide()
            $('.btn-guardar').show()
            return false;
        }
        if(!folio){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes llenar todos los campos',
            })
            $('#folio').focus()
            $('.btn-cargando').hide()
            $('.btn-guardar').show()
            return false;
        }
        if(!fechainspeccion){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes llenar todos los campos',
            })
            $('#referencia').focus()
            return false;
        }
        if(!cliente){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes llenar todos los campos',
            })
            $('#cliente').focus()
            $('.btn-cargando').hide()
            $('.btn-guardar').show()
            return false;
        }
        if(!valormercado){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes llenar todos los campos',
            })
            $('#valormercado').focus()
            $('.btn-cargando').hide()
            $('.btn-guardar').show()
            return false;
        }
        if(!valorventa){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes llenar todos los campos',
            })
            $('#valorventa').focus()
            $('.btn-cargando').hide()
            $('.btn-guardar').show()
            return false;
        }


        // Agregando datos a nuestra tabla en este ejemplo a la tabla users
        try {
            const docRef = await addDoc(collection(db, "verificacion"), {
                referencia,
                propietario,
                folio,
                fechainspeccion,
                cliente,
                valormercado,
                valorventa,
                creado: new Date()
            });

            console.log("Document written with ID: ", docRef.id);


            Swal.fire({
                icon: 'success',
                title: 'Bien!',
                text: 'Registro cargado con Exito!',
            })

            $('#referencia').val('')
            $('#propietario').val('')
            $('#folio').val('')
            $('#fecha').val('')
            $('#cliente').val('')
            $('#valormercado').val('')
            $('#valorventa').val('')
            $('.btn-cargando').hide()
            $('.btn-guardar').show()


        } catch (e) {
            console.error("Error adding document: ", e);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hemos tenido un error',
            })

            $('.btn-cargando').hide()
            $('.btn-guardar').show()
        }



}


window.eliminar = async function eliminar(val){

   Swal.fire({
    title: '¿Estas seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
    if (result.isConfirmed) {

        deleteDoc(doc(db, "verificacion", val));
        $('#'+val).hide()
        
        Swal.fire(
        'Eliminado!',
        'El registro ha sido eliminado',
        'success'
        )
    }
    })

}
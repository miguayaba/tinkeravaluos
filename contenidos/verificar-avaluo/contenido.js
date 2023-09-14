import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js"

const conversion = { style: 'currency', currency: 'USD' };
var nf = new Intl.NumberFormat('en-US', conversion);  


var result = document.getElementById('resultado')


window.consultar = async function consultar(){

    $('.btn-verifica').hide()
    $('.btn-loading').show()
    
    result.innerHTML = "";
    var val = $('#referencia').val()
    
    if(val == ""){

        Swal.fire({
             position: 'center',
             icon: 'error',
             title: 'El campo esta vacio',
             showConfirmButton: false,
             timer: 1500
           })

            $('.btn-verifica').show()
            $('.btn-loading').hide()

    }else{
        const q = query(collection(db, "verificacion"), where("referencia", "==", val));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.docs.length > 0){
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                $('#resultado').show()
                const timestamp = doc.data().fechainspeccion;
                const fecha = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;


                var result = document.getElementById('resultado')
                result.innerHTML = `
                
                <h2>Avalúo Verificado <i class="fa-regular fa-thumbs-up"></i></h2>
                <p><b>Referencia: </b> ${doc.data().referencia}</p>
                <p><b>Propietario: </b> ${doc.data().propietario}</p>
                <p><b>Folio: </b> ${doc.data().folio}</p>
                
                <p><b>Fecha de Inspeccion: </b> ${fechaFormateada}</p>
                <p><b>Cliente: </b> ${doc.data().cliente}</p>

                
                <p><b>Valor de Mercado: </b> ${nf.format(doc.data().valormercado)}</p>
                <p><b>Valor de Venta Forzosa: </b> ${nf.format(doc.data().valorventa)}</p>
                
                
                `;

            });
        }else{
  
            Swal.fire({
             position: 'center',
             icon: 'error',
             title: 'No existe este Avaluo',
             showConfirmButton: false,
             timer: 1500
           })
        }

        $('.btn-verifica').show()
        $('.btn-loading').hide()
        
    }
   
}
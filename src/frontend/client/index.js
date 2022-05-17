function prendreTicket() {
    
    var requete = {
        method : 'GET',}

    fetch("http://localhost:3000/new_ticket", requete)
        .then(req => req.json())
        .then(json => {
            if (json.code !== undefined) return;
            document.getElementById("ticket").textContent = "Ticket n°" + json.ticketId
            
            setTimeout(() => {
                document.getElementById("ticket").textContent = "";
            }, 10000)
        })
}
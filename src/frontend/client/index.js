function prendreTicket() {
    
    var requete = {
        method : 'GET',}

    fetch("https://project.ichiidev.xyz/api/new_ticket", requete)
        .then(req => req.json())
        .then(json => {
            if (json.code !== undefined) return;
            document.getElementById("ticket").textContent = "Ticket n°" + json.ticketId
            
            setTimeout(() => {
                document.getElementById("ticket").textContent = "";
            }, 10000)
        })
}
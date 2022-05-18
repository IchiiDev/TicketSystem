// Cette fonction permet de créer un ticket dans la base de données SQL
function prendreTicket() {
    
    // Définition des paramètres de la requête
    const requete = {
        method : 'GET',
    }
    // execution de la requête
    fetch("https://project.ichiidev.xyz/api/new_ticket", requete)
        .then(req => req.json())
        .then(json => {
            if (json.code !== undefined) return; // annule si la requête n'a pas abouti
            document.getElementById("ticket").textContent = "Ticket n°" + json.ticketId // Definis le ticket dans le DOM
            
            // Efface l'affichage 10s après
            setTimeout(() => {
                document.getElementById("ticket").textContent = "";
            }, 10000)
        })
}
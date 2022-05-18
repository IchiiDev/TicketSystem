const token = localStorage.getItem("token") // Cette ligne récupère le jeton d'authentification dans le localStorage de la page

// Initie une connection WebSocket
const ws = new WebSocket("wss://ws.ichiidev.xyz/");

ws.onopen = () => {
    // Authentifie l'utilisateur via le WebSocket
    ws.send(JSON.stringify({ endpoint: "auth", token }))
}

ws.onmessage = (data) => {

    // Parse le message reçu en JSON pour exploiter les données
    data = JSON.parse(data.data);

    if (data.code != 200) return console.log(data.message); // debug
    if (data.endpoint == "auth") return; // Clause de garde afin d'empêcher des erreurs
    document.getElementById("ticket").textContent = data.message.display_name // Change le texte en fonction du nouveau ticket
}

function nextTicket() {

    // Envoie une requête pour récupérer le prochain ticket
    ws.send(JSON.stringify({ endpoint: "next_ticket"}))
    
}
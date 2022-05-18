const token = "update_screen";

// Initie une connection WebSocket
const ws = new WebSocket("wss://ws.ichiidev.xyz");

ws.onopen = () => {
    // Authentifie l'utilisateur via le WebSocket
    ws.send(JSON.stringify({ endpoint:"auth",token}));

};

ws.onmessage = (data) => {
    
    data = JSON.parse(data.data); // Parse le message reçu en JSON pour exploiter les données
    
    if (data.code != 200) return console.log(data.message); // debug
    if (data.endpoint == "auth") return; // Clause de garde afin d'empêcher des erreurs
    document.getElementById("ticket").textContent = data.message.display_name // Change le texte en fonction du nouveau ticket
    document.getElementById("guichet").textContent = "Guichet n°" + data.message.desk_number // Change le texte en fonction du guichet où se trouve l'opérateur
}


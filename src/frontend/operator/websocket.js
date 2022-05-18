const token = localStorage.getItem("token")

const ws = new WebSocket("wss://project.ichiidev.xyz/ws");

ws.onopen = () => {

    ws.send(JSON.stringify({ endpoint: "auth", token }))
}

ws.onmessage = (data) => {

    data = JSON.parse(data.data);

    if (data.code != 200) return console.log(data.message);
    if (data.endpoint == "auth") return;
    document.getElementById("ticket").textContent = data.message.display_name
}

function nextTicket() {

    ws.send(JSON.stringify({ endpoint: "next_ticket"}))
    
}
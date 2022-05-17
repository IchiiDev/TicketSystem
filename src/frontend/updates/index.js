const token = "update_screen";

const ws = new WebSocket("ws://localhost:3004");

ws.onopen = () => {

    ws.send(JSON.stringify({ endpoint:"auth",token}));

};

ws.onmessage = (data) => {
    
    data = JSON.parse(data.data);
    console.log(data)
    if (data.code != 200) return console.log(data.message);
    if (data.endpoint == "auth") return;
    document.getElementById("ticket").textContent = data.message.display_name
    document.getElementById("guichet").textContent = "Guichet n°" + data.message.desk_number
}


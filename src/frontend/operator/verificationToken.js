function verifierToken() {
    
    var requete = {
        method : 'GET',
        headers: { 'Content-Type': "application/json", 'Authorization': localStorage.getItem('token') },
    }
    fetch("http://localhost:3000/renew", requete)
        .then(req => req.json())
        .then(json => {
            if (json.code === undefined) {
                document.getElementById("desk").textContent = localStorage.getItem('desk_number');
            }
            else {
                location.href = "./login.html"
            }
        });
}
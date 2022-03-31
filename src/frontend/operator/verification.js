function verifier() {
    if(document.getElementById("mdp").value != "" && document.getElementById("username").value != "") {
        let username = document.getElementById("username").value
        let mdp = document.getElementById("mdp").value
        mdp = CryptoJS.MD5(mdp).toString()
        console.log(`${username} ${mdp}`)
        
        var requete = {
                method : 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ "username" : username, "password": mdp})
        }
        fetch("http://localhost:3000/login", requete)
            .then(req => req.json())
            .then(json => {
                console.log(json)
            })
    }
    else{
        alert("Saissisez votre nom d'utilisateur");
    }
}

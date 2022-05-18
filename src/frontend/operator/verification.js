function verifier() {
    if(document.getElementById("mdp").value != "" && document.getElementById("username").value != "") {
        let username = document.getElementById("username").value
        let mdp = document.getElementById("mdp").value
        mdp = CryptoJS.MD5(mdp).toString()
        
        var requete = {
                method : 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ "username" : username, "password": mdp})
        }
        fetch("https://project.ichiidev.xyz/api/login", requete)
            .then(req => req.json())
            .then(json => {
                if (json.code !== 200) return;
                localStorage.setItem('token', json.data.token)
                localStorage.setItem('username', json.data.username)
                localStorage.setItem('firstname', json.data.firstname)
                localStorage.setItem('lastname', json.data.lastname)
                localStorage.setItem('desk_number', json.data.desk_number)
                location.href = "./"
            })

    }
    else{
        alert("Saissisez votre nom d'utilisateur");
    }
}

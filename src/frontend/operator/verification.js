// Cette fonction vérifie les paramètres entrés dans le formulaire de connection
// Si c'est le cas, on envoie une requête de connection au serveur
function verifier() {
    if(document.getElementById("mdp").value != "" && document.getElementById("username").value != "") {
        let username = document.getElementById("username").value
        let mdp = document.getElementById("mdp").value
        mdp = CryptoJS.MD5(mdp).toString() // Chiffrage du mot de passe en MD5
        
        // Definition des paramètres de la requête
        const requete = {
                method : 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ "username" : username, "password": mdp})
        }
        // execution de la requête
        fetch("https://project.ichiidev.xyz/api/login", requete)
            .then(req => req.json())
            .then(json => {
                if (json.code !== 200) return; // annule si la requête n'a pas abouti
                // Ces lignes enregistrent les données dans le localStorage
                localStorage.setItem('token', json.data.token)
                localStorage.setItem('username', json.data.username)
                localStorage.setItem('firstname', json.data.firstname)
                localStorage.setItem('lastname', json.data.lastname)
                localStorage.setItem('desk_number', json.data.desk_number)
                location.href = "./" // Redirection vers la page opérateur
            })

    }
    else{
        alert("Saissisez votre nom d'utilisateur et votre mot de passe");
    }
}

// Cette fonction vérifie si la session est toujours active, si ce n'est pas le cas, elle redirige l'utilisateur vers la page de login.
function verifierToken() {
    
    // Definition des paramètres de la requête
    const requete = {
        method : 'GET',
        headers: { 'Content-Type': "application/json", 'Authorization': localStorage.getItem('token') },
    }
    // execution de la requête
    fetch("https://project.ichiidev.xyz/api/renew", requete)
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
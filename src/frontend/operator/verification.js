function verifier() {
    if(document.formSaisie.username.value != "") {
        document.formSaisie.submit();
    }
    else{
        alert("Saissisez votre nom d'utilisateur");
    }
}
console.log(CryptoJS.MD5("test"))
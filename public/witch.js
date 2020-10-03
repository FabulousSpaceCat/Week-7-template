function hide() {
    document.getElementById("cookie").setAttribute("class", "fade-out");
    setTimeout(() => {
        document.getElementById("cookie").classList.toggle("hide");
        document.getElementById("form").classList.toggle("hide");
        }, 400);
    
    document.getElementById("1").classList.toggle("hide");
    document.getElementById("1").classList.toggle("fade-in");
}

function next(id) {
    let i = id.parentNode.parentNode.id;
    document.getElementById(i).addEventListener("click", function(event){
        event.preventDefault();
    });
    document.getElementById(i).classList.toggle("fade-out");
    setTimeout(() => {
        document.getElementById(i).classList.toggle("hide");
        }, 400);
    document.getElementById(i).nextElementSibling.classList.toggle("hide");
    document.getElementById(i).nextElementSibling.classList.toggle("fade-in");
}

const userName = document.getElementById("userName");
userName.addEventListener("input", () => {
    document.getElementById("userNameBtn").disabled = !userName.checkValidity();
});
const userEmail = document.getElementById("userEmail");
userEmail.addEventListener("input", () => {
    document.getElementById("userEmailBtn").disabled = !userEmail.checkValidity();
});
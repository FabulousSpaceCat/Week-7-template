function hide() {
    document.querySelector("#cookie").setAttribute("class", "fade-out");
    document.querySelector("#1").setAttribute("class","fade-in");
}

function next(id) {
    let i = id.parentNode.id;
    document.querySelector(`#${i}`).setAttribute("class", "fade-out");
    document.querySelector(`#${i}`).setAttribute("class", "fade-in");
    evt.preventDefault();
}
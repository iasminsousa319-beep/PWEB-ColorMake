const exploreButton = document.getElementById("exploreButton");

exploreButton.addEventListener("click", function () {

    document.getElementById("cores").scrollIntoView({
        behavior: "smooth"
    });

});

const makeupButton = document.getElementById("makeupButton");

makeupButton.addEventListener("click", function () {

    document.getElementById("maquiagem").scrollIntoView({
        behavior: "smooth"
    });

});

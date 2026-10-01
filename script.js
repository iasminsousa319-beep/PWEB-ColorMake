const exploreButton = document.getElementById("exploreButton");

exploreButton.addEventListener("click", function () {

    document.getElementById("cores").scrollIntoView({
        behavior: "smooth"
    });

});


const theoryInfo = document.getElementById("theoryInfo");

const theoryTexts = {

    primarias: {
        titulo: "Cores primárias",
        texto: "São cores utilizadas como base para criar outras cores. No modelo tradicional de pigmentos, são representadas por vermelho, amarelo e azul."
    },

    secundarias: {
        titulo: "Cores secundárias",
        texto: "São obtidas pela combinação de duas cores primárias. Por exemplo: vermelho + amarelo = laranja."
    },

    terciarias: {
        titulo: "Cores terciárias",
        texto: "São formadas pela combinação de uma cor primária com uma cor secundária próxima na roda de cores."
    },

    quentes: {
        titulo: "Cores quentes",
        texto: "Vermelhos, laranjas e amarelos são exemplos de cores quentes. Elas costumam transmitir sensações de energia, calor e destaque."
    },

    frias: {
        titulo: "Cores frias",
        texto: "Azuis, verdes e alguns tons de roxo são exemplos de cores frias. Elas costumam transmitir sensações de tranquilidade e suavidade."
    },

    complementares: {
        titulo: "Cores complementares",
        texto: "São cores que ficam em posições opostas na roda de cores. Essa combinação cria bastante contraste e pode ser usada para destacar elementos."
    },

    analogas: {
        titulo: "Cores análogas",
        texto: "São cores próximas umas das outras na roda de cores. Por serem parecidas, costumam criar combinações mais suaves e harmoniosas."
    }

};


const theoryButtons = document.querySelectorAll("[data-theory]");

theoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        const tipo = button.dataset.theory;
        const teoria = theoryTexts[tipo];

        theoryInfo.innerHTML = `
            <h3>${teoria.titulo}</h3>
            <p>${teoria.texto}</p>
        `;

    });

});


const makeupButton = document.getElementById("makeupButton");
const palettesButton = document.getElementById("palettesButton");
const combinationButton = document.getElementById("combinationButton");

const makeupContent = document.getElementById("makeupContent");



makeupButton.addEventListener("click", function () {

    makeupContent.innerHTML = `
        
        <h3>Explore a maquiagem</h3>

        <div class="makeup-options">

            <div class="makeup-option">
                <span>👁️</span>
                <h4>Sombras</h4>
                <p>
                    Use cores complementares ou análogas
                    para criar diferentes combinações de sombras.
                </p>
            </div>

            <div class="makeup-option">
                <span>🌸</span>
                <h4>Blush</h4>
                <p>
                    Escolha tons que combinem com a
                    paleta geral da maquiagem.
                </p>
            </div>

            <div class="makeup-option">
                <span>💄</span>
                <h4>Batom</h4>
                <p>
                    O batom pode criar contraste ou
                    complementar os outros tons.
                </p>
            </div>

        </div>
    `;

});



palettesButton.addEventListener("click", function () {

    makeupContent.innerHTML = `

        <h3>Paletas de cores</h3>

        <p>
            Confira algumas combinações para
            inspirar sua maquiagem.
        </p>

        <div class="palette-examples">

            <div class="example-palette">

                <h4>Romântica</h4>

                <div class="palette-colors">

                    <span style="background:#e9a393"></span>

                    <span style="background:#f3c5c8"></span>

                    <span style="background:#c9828d"></span>

                    <span style="background:#8e5964"></span>

                </div>

            </div>


            <div class="example-palette">

                <h4>Quente</h4>

                <div class="palette-colors">

                    <span style="background:#d95f43"></span>

                    <span style="background:#e69b45"></span>

                    <span style="background:#f1c453"></span>

                    <span style="background:#8f4938"></span>

                </div>

            </div>


            <div class="example-palette">

                <h4>Fria</h4>

                <div class="palette-colors">

                    <span style="background:#6c8ebf"></span>

                    <span style="background:#819ac6"></span>

                    <span style="background:#8e6bb3"></span>

                    <span style="background:#4d536d"></span>

                </div>

            </div>

        </div>
    `;

});

combinationButton.addEventListener("click", function () {

    makeupContent.innerHTML = `

        <h3>Crie sua combinação</h3>

        <p>
            Escolha duas cores e veja a cor resultante.
        </p>

        <div class="color-mixer">

            <div class="mixer-controls">

                <div>
                    <label for="color1">
                        Primeira cor
                    </label>

                    <input
                        type="color"
                        id="color1"
                        value="#e9a393"
                    >
                </div>

                <span>+</span>

                <div>
                    <label for="color2">
                        Segunda cor
                    </label>

                    <input
                        type="color"
                        id="color2"
                        value="#8e44ad"
                    >
                </div>

            </div>


            <div class="mix-result">

                <div id="resultColor"></div>

                <div>
                    <h4>Resultado</h4>

                    <p id="resultText">
                        #9B74A0
                    </p>
                </div>

            </div>

        </div>
    `;


    const color1 = document.getElementById("color1");
    const color2 = document.getElementById("color2");

    const resultColor =
        document.getElementById("resultColor");

    const resultText =
        document.getElementById("resultText");


    function hexToRgb(hex) {

        hex = hex.replace("#", "");

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return {
            r: r,
            g: g,
            b: b
        };
    }


    function rgbToHex(r, g, b) {

        return "#" + [r, g, b]
            .map(valor =>
                valor.toString(16).padStart(2, "0")
            )
            .join("")
            .toUpperCase();

    }


    function misturarCores() {

        const primeira = hexToRgb(color1.value);
        const segunda = hexToRgb(color2.value);


        const r = Math.round(
            (primeira.r + segunda.r) / 2
        );

        const g = Math.round(
            (primeira.g + segunda.g) / 2
        );

        const b = Math.round(
            (primeira.b + segunda.b) / 2
        );


        const resultado = rgbToHex(r, g, b);


        resultColor.style.backgroundColor = resultado;

        resultText.textContent = resultado;

    }


    color1.addEventListener(
        "input",
        misturarCores
    );

    color2.addEventListener(
        "input",
        misturarCores
    );


    misturarCores();

});
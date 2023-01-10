function findFlags(country) {
    let countryName, countryDdi, countryLabel, formatNumberPlaceholder;

    switch (country) { // Para cada país no array principal, deverá ser preenchido o nome do país, o nome em inglês para busca da imagem, o ddi e o formato do número.
        case 'brazil':
            countryName = 'brazil';
            countryLabel = 'Brasil';
            countryDdi = '+55';
            formatNumberPlaceholder = "(00) 0 0000-0000";
            break;
        case 'usa':
            countryName = 'united-states';
            countryLabel = 'Estados Unidos';
            countryDdi = '+1';
            formatNumberPlaceholder = "000 000-0000";
            break;
        case 'portugal':
            countryName = 'portugal';
            countryLabel = 'Portugal';
            countryDdi = '+351'; 
            formatNumberPlaceholder = "000 000-000";
            break;
    }

    let returnString = `
        <div class="flag-item" country_flag="${countryName}" ddi="${countryDdi}" number_placeholder="${formatNumberPlaceholder}">
            <img src="img/${countryName}-flag.jpg">
            <span>${countryLabel}</span>
            <span class="display-ddi">${countryDdi}</span>
        </div>
    `

    return returnString;
}

function mountTelInputElement() {
    let countries = ['brazil', 'usa', "portugal"]; // Array deverá conter os países que serão contemplados no componente.

    for (let i in countries) {
        if (countries[i] == 'brazil') {
            $(".current-flag-container").append(findFlags(countries[i]));
        } else {
            $(".flag-list").append(findFlags(countries[i]));
        }
    } 
}

mountTelInputElement();

if ($(document).ready()) {
    let open = false, input = $("#tel-input"), flag = $(".flag-input"), flagList = $(".flag-list"), currentFlagContainer = $(".current-flag-container");
    
    changePlaceholder(input, $(".current-flag-container .flag-item"));

    $(document).on("click", e => { // Ao clicar fora da div das flags o container fecha.
        if (!flag.is(e.target) && flag.has(e.target).length === 0) {
            closeFlagSelect();
        }
    })

    flag.on("click", e => {
        if (!open) {
            openFlagSelect();
        } else {
            closeFlagSelect();
        }
    });

    $(".flag-item").on("click", e => { // Quando clica em uma flag, ela é retirada da lista, colocada no container principal, a flag que era principal volta pra lista, ela é re-ordenada,o placeholder do input muda conforme o país da flag e o inputé validado.
        let targetValue = e.currentTarget.attributes.country_flag.value;
        let currentFlagElement = $(".current-flag-container .flag-item");

        if (open && targetValue != currentFlagElement.attr("country_flag")) {
            let targetElement = $(".flag-list div[country_flag=" + targetValue + "]");
            currentFlagContainer.append(targetElement); 
            flagList.append(currentFlagElement);
            sortElements(flagList);
            changePlaceholder(input, $(".current-flag-container .flag-item"));
            validateInput();
        }
    });

    input.on("focusout", () => { // Quando o foco sai do input o conteudo é validado.
        validateInput();
    });

    input.on("keydown", e => { // Validação para não permitir entrada de letras no input, apenas números.
        let keyCode = e.keyCode;
        if (keyCode < 48 || keyCode > 57 && keyCode < 96 || keyCode > 105) {
            if (keyCode != 8) {
                e.preventDefault();
            }
        }
    });

    function formatNumber(input, currentFlagElement) { // Função para formatar o número conforme o país.
        let numberTemplate = currentFlagElement.attr("number_placeholder");
        let number = input.val().replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", '');
        let formattedNumber = [], numberPosition = 0;
        for (let i in numberTemplate) {
            if (numberTemplate[i] == "0") {
                formattedNumber[i] = number[numberPosition];
                numberPosition++;
            } else {
                formattedNumber[i] = numberTemplate[i];
            }
        }

        input.val(formattedNumber.join(''));
    }

    function restoreNumber() { // Função restaura o número retirando caracteres especiais.
        input.val(input.val().replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", ''));
    }

    function isValidNumber() { // Função valida se o valor do input é valido.
        let number = $("#tel-input").val().replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", '');
        let currentFlagElement = $(".current-flag-container .flag-item");
        let targetNumbers;

        switch (currentFlagElement.attr("country_flag")) {
            case 'brazil':
                targetNumbers = 11;
                break;
            case 'united-states':
                targetNumbers = 10;
                break;
            case 'portugal':
                targetNumbers = 9;
                break;
        }
        if (number.length != targetNumbers) {
            restoreNumber();
            return false;
        } 
        return true;
    }

    function validateInput() { // Função valida o conteúdo do input e adiciona classe de erro caso não for válido.
        let input = $("#tel-input");
        let currentFlagElement = $(".current-flag-container .flag-item");

        if (isValidNumber()) {
            input.removeClass("invalid-number");
            formatNumber(input, currentFlagElement);
        } else {
            input.addClass("invalid-number");
        }
    }

    function getTelInputValue() { // Pega o valor do input removendo caracteres especiais e espaço para submit do formulário.
        let ddi = $(".current-flag-container .flag-item").attr("ddi");
        let number = $("#tel-input").val().replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", '');
        if (number == "") {
            return;
        }

        return `${ddi}${number}`;
    }

    function changePlaceholder(input, currentFlagElement) { // Função muda o placeholder do input conforme o país selecionado.
        input.attr("placeholder", currentFlagElement.attr("number_placeholder"));
    }

    function sortElements(flagList) { // Função re-ordena os elementos da lista de países.
        let flagListItems = $(".flag-list .flag-item");
        flagListItems.sort((a, b) => {
            return ($(a).find("span").html() > $(b).find("span").html()) ? 1 : (($(b).find("span").html() > $(a).find("span").html()) ? -1 : 0);
        });
        flagList.append(flagListItems);
    }

    function openFlagSelect() { // Função abre o container de países.
        $(".flag-list").css("display", "flex");
        open = true;
    }

    function closeFlagSelect() { // Função fecha o container de países.
        $(".flag-list").hide();
        open = false;
    }
}




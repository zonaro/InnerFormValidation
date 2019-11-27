
const _phoneMask = (input) => {
    let text = input.value
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{1,2})/g, "($1");
    text = text.replace(/^(\(\d{2})(\d+)/g, "$1) $2");
    text = text.replace(/^(\(\d{2}\) \d{4})(\d{1,4})$/g, "$1-$2");
    text = text.replace(/^(\(\d{2}\) \d{5})(\d{4})$/g, "$1-$2");
    if (/\([\d]{2}\) [\d]{5}-[\d]{4}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};

const _dateMask = (input) => {
    let text = input.value;
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{2})(\d+)/g, "$1/$2");
    text = text.replace(/^(\d{2}\/\d{2})(\d{1,4})$/g, "$1/$2");
    if (/^[\d]{2}\/[\d]{2}\/[\d]{4}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};

const _cpfMask = (input) => {
    let text = input.value;
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{3})(\d+)/g, "$1.$2");
    text = text.replace(/^(\d{3}\.\d{3})(\d+)/g, "$1.$2");
    text = text.replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/g, "$1-$2");
    if (/^[\d]{3}\.[\d]{3}\.[\d]{3}-[\d]{2}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};

const _cepMask = (input) => {
    let text = input.value
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{5})(\d{1,3})$/g, "$1-$2");
    if (/^[\d]{5}-[\d]{3}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};

const _cnpjMask = (input) => {
    let text = input.value;
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{2})(\d+)/, "$1.$2");
    text = text.replace(/^(\d{2}\.\d{3})(\d+)/g, "$1.$2");
    text = text.replace(/^(\d{2}\.\d{3}\.\d{3})(\d+)/g, "$1/$2");
    text = text.replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d{1,2})$/g, "$1-$2");
    if (/^[\d]{2}\.[\d]{3}\.[\d]{3}\/[\d]{4}-[\d]{2}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};

const _cardNumberMaks = (input) => {
    let text = input.value;
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{4})(\d+)$/g, "$1 $2");
    text = text.replace(/^(\d{4} \d{4})(\d+)$/g, "$1 $2");
    text = text.replace(/^(\d{4} \d{4} \d{4})(\d{1,4})$/g, "$1 $2");
    if (/^[\d]{4} [\d]{4} [\d]{4} [\d]{4}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};

const _onlyNumbers = (input) => {
    let text = input.value;
    text = text.replace(/\D/g, "");
    input.value = text;
};

const _monthYear = (input) => {
    let text = input.value;
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{2})(\d{1,4})/g, "$1/$2");
    if (/^[\d]{2}\/[\d]{4}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};


const _checkLuhn = (cardNo) => {
    var s = 0;
    var doubleDigit = false;
    cardNo = cardNo.split(" ").join("");
    for (var i = cardNo.length - 1; i >= 0; i--) {
        var digit = +cardNo[i];
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        s += digit;
        doubleDigit = !doubleDigit;
    }
    return s % 10 == 0;
};

const _validatecardbrand = (cardnumber) => {
    cardnumber = cardnumber.replace(/[^0-9]+/g, '');
    var cards = {
        visa: /^4[0-9]{12}(?:[0-9]{3})/,
        mastercard: /^5[1-5][0-9]{14}/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
        amex: /^3[47][0-9]{13}/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
        hiper: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
        elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}/,
        aura: /^(5078\d{2})(\d{2})(\d{11})$/
    };

    for (var flag in cards) {
        if (cards[flag].test(cardnumber)) {
            return flag;
        }
    }

    return false;
};


jQuery.fn.isValid = function () {
    var results = [];

    if (jQuery(this).length > 1 || jQuery(this).prop('tagName') == 'FORM') {
        var elements = [];
        var config = Array.prototype.slice.call(arguments)[0];
        jQuery(this).find(":input" + (config || "")).each(function () {
            results.push(jQuery(this).isValid());
            elements.push(jQuery(this));
        });

        for (var i = 0; i < results.length; i++) {
            if (results[i] === false) {
                return false;
            }
        }
        return true;
    } else {
        var valids = Array.prototype.slice.call(arguments);
        var value = this.val();
        var type = this.attr("type");
        if (arguments.length < 1) {
            var classes = (this.attr('class') || 'v_noclass').split(" ");
            for (var i = 0; i < classes.length; i++) {
                valids.push("" + classes[i]);
            }
        }
        for (var i = 0; i < valids.length; i++) {
            if (jQuery(this).prop("disabled") == false) {
                switch (valids[i].toLowerCase()) {
                    case "number":
                    case "num":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(!isNaN(value.replace(',', '.')));
                        break;
                    case "mail":
                    case "email":
                    case "e-mail":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var re = /^[\w-]+(\.[\w-]+)*@[\w]+(\.[a-z]{2,6})*(\.[a-z]{2,6})$/gi;
                        results.push(re.test(value));
                        break;
                    case "required":
                    case "req":
                    case "obg":
                        if (type == 'checkbox' || type == 'radio') {
                            results.push(jQuery(this).is(':checked'));
                        } else {
                            results.push(!(!value || jQuery.trim(value) === ""));
                        }
                        break;
                    case "url":
                    case "link":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
                        results.push(re.test(value));
                        break;
                    case "data":
                    case "date":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        if (type == 'text') {
                            var comp = value.split(' ')[0].split('/');
                            if (comp.length == 3) {
                                var d = parseInt(comp[0], 10);
                                var m = parseInt(comp[1], 10) - 1;
                                var y = parseInt(comp[2], 10);
                                var date = new Date(y, m, d);
                                results.push(date.getFullYear() == y && date.getMonth() == m && date.getDate() == d);
                            } else {
                                results.push(false);
                            }
                        } else {
                            results.push(true);
                        }
                        break;
                    case "month":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push($(this).isValid("num"));
                        var numero = parseInt(value);
                        results.push(num > 0 && num <= 12);
                        break;
                    case "monthyear":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var mesano = value.split("/");
                        
                        if (mesano.length == 2) {
                            results.push(mesano[0] > 0 && mesano[0] <= 12);
                            results.push(!isNaN(mesano[1]));
                            break;
                        }
                        if (mesano.length == 3) {
                            results.push(mesano[1] > 0 && mesano[1] <= 12);
                            results.push(!isNaN(mesano[2]));
                            break;
                        }
                        results.push(false);
                        break;
                    
                    case "cnpj":

                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        value = value.replace(/[^\d]+/g, '');

                        if (value.length !== 14) { results.push(false); break; }

                        // Elimina CNPJs invalidos conhecidos
                        if (value == "00000000000000" ||
                            value == "11111111111111" ||
                            value == "22222222222222" ||
                            value == "33333333333333" ||
                            value == "44444444444444" ||
                            value == "55555555555555" ||
                            value == "66666666666666" ||
                            value == "77777777777777" ||
                            value == "88888888888888" ||
                            value == "99999999999999") { results.push(false); break; }

                        // Valida DVs
                        tamanho = value.length - 2;
                        numeros = value.substring(0, tamanho);
                        digitos = value.substring(tamanho);
                        soma = 0;
                        pos = tamanho - 7;
                        for (i = tamanho; i >= 1; i--) {
                            soma += numeros.charAt(tamanho - i) * pos--;
                            if (pos < 2)
                                pos = 9;
                        }
                        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado != digitos.charAt(0)) { results.push(false); break; }

                        tamanho = tamanho + 1;
                        numeros = value.substring(0, tamanho);
                        soma = 0;
                        pos = tamanho - 7;
                        for (i = tamanho; i >= 1; i--) {
                            soma += numeros.charAt(tamanho - i) * pos--;
                            if (pos < 2)
                                pos = 9;
                        }
                        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado !== digitos.charAt(1)) { results.push(false); break; }

                        results.push(true);
                        break;
                    case "cpf":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        value = value.replace(/[^\d]+/g, '');

                        // Elimina CPFS invalidos conhecidos
                        if (value == "00000000000000" ||
                            value == "11111111111111" ||
                            value == "22222222222222" ||
                            value == "33333333333333" ||
                            value == "44444444444444" ||
                            value == "55555555555555" ||
                            value == "66666666666666" ||
                            value == "77777777777777" ||
                            value == "88888888888888" ||
                            value == "99999999999999") { results.push(false); break; }

                        var Soma;
                        var Resto;
                        Soma = 0; 

                        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (11 - i);
                        Resto = (Soma * 10) % 11;

                        if ((Resto == 10) || (Resto == 11)) Resto = 0;
                        if (Resto != parseInt(value.substring(9, 10))) { results.push(false); break; }

                        Soma = 0;
                        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (12 - i);
                        Resto = (Soma * 10) % 11;

                        if ((Resto == 10) || (Resto == 11)) Resto = 0;
                        if (Resto != parseInt(value.substring(10, 11))) { results.push(false); break; }
                        results.push(true);
                        break;
                    case "debitcard":
                    case "creditcard":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(_checkLuhn(value));
                        var flagcard = _validatecardbrand(value);
                        jQuery(this).attr("data-cardbrand", flagcard.toString());
                        if (jQuery(this).is(".visa, .mastercard, .diners, .amex, .discover, .hiper, .elo, .jcb, .aura")) {
                            if (flagcard) {
                                results.push(jQuery(this).hasClass(flagcard.toString()));
                            } else {
                                results.push(false);
                            }
                        } else {
                            result.push(flagcard !== false);
                        }
                        break;
                    default:
                        var c = valids[i];
                        if (c.startsWith("eq:") || c.startsWith("equal:")) {
                            var selector = c.split(':')[1] || jQuery(this).data("eq");
                            var valor1 = jQuery(this).val();
                            var valor2 = jQuery(selector).val() || jQuery(selector).text();
                            results.push(valor1 == valor2);
                        } else {
                            results.push(true);
                        }
                        if (~c.indexOf(" or ")) {
                            var any = false;
                            var allchecks = c.split(" or ");
                            for (var i = 0; i < allchecks.length; i++) {
                                allchecks[i] = allchecks[i].split(" ").join("");
                                any = jQuery(this).isValid(allchecks[i]);
                                if (any == true) { break; }
                            }
                            results.push(any);
                        } else {
                            results.push(true);
                        }
                        if (~c.indexOf(" to ")) {
                            var allnums = c.split(" to ");
                            if (allnums[0] > allnums[1]) {
                                results.push(jQuery(this).isValid("after " + allnums[1]) && jQuery(this).isValid("before " + allnums[0]));
                            } else {
                                results.push(jQuery(this).isValid("after " + allnums[0]) && jQuery(this).isValid("before " + allnums[1]));
                            }
                        } else {
                            results.push(true);
                        }

                        if (c.startsWith("after")) {
                            var mynumber = jQuery(this).val();
                            if (jQuery.trim(mynumber) === "") {
                                results.push(true);
                                break;
                            }
                            var num = c.split("after").join("");
                            if ((num.indexOf("today") || num.indexOf("/")) && jQuery(this).isValid("date")) {
                                var comp = mynumber.split('/');
                                var d = parseInt(comp[0], 10);
                                var m = parseInt(comp[1], 10) - 1;
                                var y = parseInt(comp[2], 10);
                                mynumber = +new Date(y, m, d);
                                if (num == 'today') {
                                    num = today;
                                } else {
                                    comp = num.split('/');
                                    d = parseInt(comp[0], 10);
                                    m = parseInt(comp[1], 10) - 1;
                                    y = parseInt(comp[2], 10);
                                    num = +new Date(y, m, d);
                                }
                            }

                            results.push(parseFloat(mynumber) >= parseFloat(num));
                        } else {
                            results.push(true);
                        }

                        if (c.startsWith("before")) {
                            var mynumber = jQuery(this).val();
                            if (jQuery.trim(mynumber) === "") {
                                results.push(true);
                                break;
                            }
                            var num = c.split("before").join("");
                            if ((num.indexOf("today") || num.indexOf("/")) && jQuery(this).isValid("date")) {
                                var comp = mynumber.split('/');
                                var d = parseInt(comp[0], 10);
                                var m = parseInt(comp[1], 10) - 1;
                                var y = parseInt(comp[2], 10);
                                mynumber = +new Date(y, m, d);
                                if (num == 'today') {
                                    num = today;
                                } else {
                                    comp = num.split('/');
                                    d = parseInt(comp[0], 10);
                                    m = parseInt(comp[1], 10) - 1;
                                    y = parseInt(comp[2], 10);
                                    num = +new Date(y, m, d);
                                }
                            }

                            results.push(parseFloat(mynumber) <= parseFloat(num));
                        } else {
                            results.push(true);
                        }
                        break;
                }
            } else {
                results.push(true);
            }
        }

        for (var i = 0; i < results.length; i++) {
            if (results[i] === false) {
                jQuery(this).addClass('error');
                jQuery(this).closest('.form-group').addClass('has-error');
                eval(jQuery(this).attr('data-invalidcallback') || "void(0)");
                return false;
            }
        }
        jQuery(this).removeClass('error');
        jQuery(this).closest('.form-group').removeClass('has-error');
        return true;
    }
};



jQuery(document).ready(function () {
    jQuery('form.validate, form[data-validate="true"], form[data-validation="true"]').on('submit', function () {
        return jQuery(this).isValid();
    });

    jQuery(".mask.phone, .mask.tel, [type='tel'].mask").on('input', function () {
        _phoneMask(this);
    });

    jQuery(".mask.cpf").on('input', function () {
        _cpfMask(this);
    });

    jQuery(".mask.cep").on('input', function () {
        _cepMask(this);
    });

    jQuery(".mask.cnpj").on('input', function () {
        _cnpjMask(this);
    });

    jQuery(".mask.creditcard, .mask.debitcard").on('input', function () {
        _cardNumberMaks(this);
    });

    jQuery(".mask.date, .mask.data").on('input', function () {
        _dateMask(this);
    });

    jQuery(".mask.monthyear").on('input', function () {
        _monthYear(this);
    });

    jQuery(".mask.num, .mask.number, .mask.month").on('input', function () {
        _onlyNumbers(this);
    });

});
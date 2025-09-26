/**
 * InnerFormValidation.js
 * 
 * A comprehensive set of input validation and masking utilities for forms, primarily for Brazilian formats (CPF, CNPJ, CEP, etc.).
 * Extends jQuery with validation and masking methods, and provides utility functions for logging, date parsing, and more.
 * 
 * @namespace window.innerForm
 * @property {boolean} verbose - Enables verbose logging.
 * @property {number} onTypeTimeout - Timeout for on-type validation.
 * 
 * @function log
 * @description Logs messages to the console if verbose is enabled.
 * 
 * @function error
 * @description Logs error messages to the console if verbose is enabled.
 * 
 * @function warn
 * @description Logs warning messages to the console if verbose is enabled.
 * 
 * @function addLeadingZeros
 * @param {string|number} num - The number to pad.
 * @param {number} totalLength - Desired total length.
 * @returns {string} The padded number as a string.
 * 
 * @function barcodeCheckSum
 * @param {string} code - Barcode string.
 * @returns {number} The calculated checksum.
 * 
 * @function validateTime
 * @param {string} value - Time string (HH:MM or HH:MM:SS).
 * @param {boolean} [minutesSeconds=false] - If true, validates as MM:SS.
 * @returns {boolean} True if valid, false otherwise.
 * 
 * @function validateEAN
 * @param {string} value - EAN code.
 * @returns {boolean} True if valid, false otherwise.
 * 
 * @function getAge
 * @param {string|Date} birthDate - Birth date.
 * @param {Date} [fromDate=new Date()] - Reference date.
 * @returns {number} Age in years.
 * 
 * @function validateNotChar
 * @param {string} value - Input value.
 * @param {string} chars - Characters to check for absence.
 * @returns {boolean} True if none of the chars are present.
 * 
 * @function validateAnyChar
 * @param {string} value - Input value.
 * @param {string} chars - Characters to check for presence.
 * @returns {boolean} True if any char is present.
 * 
 * @function validateAllChar
 * @param {string} value - Input value.
 * @param {string} chars - Characters to check for presence.
 * @returns {boolean} True if all chars are present.
 * 
 * @function validDate
 * @param {string} value - Date string.
 * @returns {boolean} True if valid date.
 * 
 * @function parseDate
 * @param {string} value - Date string (DD/MM/YYYY or MM/YYYY).
 * @returns {number|null} Timestamp if valid, null otherwise.
 * 
 * @function applyNoSpaceMask
 * @param {HTMLInputElement} input - Input element.
 * @description Removes all spaces from input value.
 * 
 * @function applyAlphaMask
 * @param {HTMLInputElement} input - Input element.
 * @description Allows only alphabetic characters and spaces.
 * 
 * @function applyAlphaNumericMask
 * @param {HTMLInputElement} input - Input element.
 * @description Allows only alphanumeric characters and spaces.
 * 
 * @function applyPhoneMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies Brazilian phone number mask.
 * 
 * @function applyUpperMask
 * @param {HTMLInputElement} input - Input element.
 * @description Converts input value to uppercase.
 * 
 * @function applyLowerMask
 * @param {HTMLInputElement} input - Input element.
 * @description Converts input value to lowercase.
 * 
 * @function applyDateMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies date mask (DD/MM/YYYY).
 * 
 * @function applyDateTimeMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies date and time mask (DD/MM/YYYY HH:MM:SS).
 * 
 * @function applyDateShortMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies short date and time mask (DD/MM/YYYY HH:MM).
 * 
 * @function applyTimeMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies time mask (HH:MM:SS).
 * 
 * @function applyShortTimeMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies short time mask (HH:MM).
 * 
 * @function applyCPForCNPJMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies CPF or CNPJ mask based on input length.
 * 
 * @function applyCPFMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies CPF mask (000.000.000-00).
 * 
 * @function applyCEPMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies CEP mask (00000-000).
 * 
 * @function applyCNPJMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies CNPJ mask (00.000.000/0000-00).
 * 
 * @function applyCreditCardMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies credit card mask (0000 0000 0000 0000).
 * 
 * @function applyNumberMask
 * @param {HTMLInputElement} input - Input element.
 * @description Allows only numeric characters.
 * 
 * @function applyMonthYearMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies month/year mask (MM/YYYY).
 * 
 * @function applyMonthYearRangeMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies month/year range mask (MM/YYYY ~ MM/YYYY).
 * 
 * @function applyShortMonthYearRangeMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies short month/year range mask (MM/YY ~ MM/YY).
 * 
 * @function applyDateRangeMask
 * @param {HTMLInputElement} input - Input element.
 * @description Applies date range mask (DD/MM/YYYY ~ DD/MM/YYYY).
 * 
 * @function checkLuhn
 * @param {string} cardNumber - Card number.
 * @returns {boolean} True if valid per Luhn algorithm.
 * 
 * @function validateCardBrand
 * @param {string} cardNumber - Card number.
 * @returns {string|boolean} Card brand or false if not recognized.
 * 
 * @function validateCNPJ
 * @param {string} CNPJNumber - CNPJ number.
 * @returns {boolean} True if valid.
 * 
 * @function validatePassword
 * @param {HTMLInputElement} input - Password input.
 * @returns {number} Password strength (number of matched criteria).
 * 
 * @function searchViaCEP
 * @param {string} CEPNumber - CEP (postal code).
 * @param {string} homeNumber - Home number.
 * @param {number} delay - Delay before callback.
 * @param {function} callbackFunction - Callback to execute with address data.
 * @description Fetches address data from ViaCEP and fills form fields.
 * 
 * @function setOrReplaceVal
 * @memberof jQuery.fn
 * @param {any} value - Value to set.
 * @returns {jQuery} The jQuery object for chaining.
 * @description Sets value if empty or not .noreplace.
 * 
 * @function isValid
 * @memberof jQuery
 * @param {...any} args - Value and validation classes.
 * @returns {boolean} True if valid.
 * @description Checks if a value is valid for given validation classes.
 * 
 * @function isValid
 * @memberof jQuery.fn
 * @param {...string} [validationClasses] - Validation classes.
 * @returns {boolean} True if valid.
 * @description Checks if an input, form, or collection is valid.
 * 
 * @function startMasks
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Initializes all masks on the selected elements.
 * 
 * @function startValidation
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Initializes validation on blur, change, and submit.
 * 
 * @function validateOnType
 * @memberof jQuery.fn
 * @param {number} [time=900] - Delay in ms.
 * @returns {jQuery} The jQuery object for chaining.
 * @description Validates input on keyup after a delay.
 * 
 * @function validateOnBlur
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Validates input on blur.
 * 
 * @function validateOnChange
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Validates input on change.
 * 
 * @function phoneMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies phone mask on input.
 * 
 * @function upperMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies uppercase mask on input.
 * 
 * @function lowerMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies lowercase mask on input.
 * 
 * @function cpfMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies CPF mask on input.
 * 
 * @function cepMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies CEP mask on input.
 * 
 * @function cnpjMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies CNPJ mask on input.
 * 
 * @function cpfCnpjMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies CPF or CNPJ mask on input.
 * 
 * @function creditCardMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies credit card mask on input.
 * 
 * @function dateMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies date mask on input.
 * 
 * @function monthYearMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies month/year mask on input.
 * 
 * @function numberMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Allows only numbers in input.
 * 
 * @function dateRangeMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies date range mask on input.
 * 
 * @function shortMonthYearRangeMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies short month/year range mask on input.
 * 
 * @function monthYearRangeMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies month/year range mask on input.
 * 
 * @function lenMask
 * @memberof jQuery.fn
 * @param {number} [tam] - Length to enforce.
 * @returns {jQuery} The jQuery object for chaining.
 * @description Enforces maximum length on input.
 * 
 * @function cepAutoComplete
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Autocompletes address fields based on CEP.
 * 
 * @function timeMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies time mask on input.
 * 
 * @function shortTimeMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies short time mask on input.
 * 
 * @function dateShortTimeMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies short date/time mask on input.
 * 
 * @function dateTimeMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Applies date/time mask on input.
 * 
 * @function alphaMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Allows only alphabetic characters in input.
 * 
 * @function alphaNumericMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Allows only alphanumeric characters in input.
 * 
 * @function noSpaceMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Removes spaces from input.
 * 
 * @function maxLenMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Enforces maximum length on input.
 * 
 * @function leadingZeroMask
 * @memberof jQuery.fn
 * @returns {jQuery} The jQuery object for chaining.
 * @description Pads input with leading zeros on blur.
 * 
 * @event document.ready
 * @description Initializes validation and masks on forms and inputs.
 */

window.innerForm = window.innerForm || {};
window.innerForm.verbose = window.innerForm.verbose || false;
window.innerForm.onTypeTimeout = 900;

window.innerForm.log = function () {
    if (window.innerForm.verbose) console.log("InnerFormValidation:", arguments);
}
window.innerForm.error = function () {
    if (window.innerForm.verbose) console.error("InnerFormValidation:", arguments);
}

window.innerForm.warn = function () {
    if (window.innerForm.verbose) console.warn("InnerFormValidation:", arguments);
}

window.innerForm.addLeadingZeros = function (num, totalLength) {
    num = num || ""
    num = jQuery.trim(num);
    if (!isNaN(num) && num < 0) {
        const withoutMinus = String(num).slice(1);
        return '-' + withoutMinus.padStart(totalLength, '0');
    }

    return String(num).padStart(totalLength, '0');
}

window.innerForm.barcodeCheckSum = function (code) {
    code = code || ""
    let i = 0;
    let p = 0;
    let t = code.length;
    for (var j = 1; j <= t; j++) {
        if ((j & ~-2) == 0) {
            p += parseInt(code.slice(j - 1, j));
        }
        else {
            i += parseInt(code.slice(j - 1, j));
        }
    }
    if ((t == 7 || t == 11)) {
        i = i * 3 + p;
        p = parseInt((i + 9) / 10) * 10;
        t = p - i;
    } else {
        p = p * 3 + i;
        i = parseInt((p + 9) / 10) * 10;
        t = i - p;
    }
    return t;
}

window.innerForm.validateTime = function (value, minutesSeconds) {
    minutesSeconds = minutesSeconds || false;
    var comp = value.split(":");
    if (comp.length == 3) {
        minutesSeconds == false;
        var h = parseInt(comp[0], 10);
        var m = parseInt(comp[1], 10);
        var s = parseInt(comp[2], 10);
        let ff = h <= 23 && h >= 0 && m <= 59 && m >= 0 && s >= 0 && s <= 59;
        return ff;
    }
    if (comp.length == 2) {
        if (minutesSeconds) {
            var m = parseInt(comp[0], 10);
            var s = parseInt(comp[1], 10);
            let ff = m <= 59 && m >= 0 && s >= 0 && s <= 59;
            return ff;
        } else {
            var h = parseInt(comp[0], 10);
            var m = parseInt(comp[1], 10);
            let ff = h <= 23 && h >= 0 && m <= 59 && m >= 0;
            return ff;
        }

    }
    return false;
}

window.innerForm.validateEAN = function (value) {
    value = value || ""
    if (!isNaN(value) && value.length > 1 && value.length <= 16) {
        let bar = value.slice(0, -1);
        let ver = value.slice(-1);
        return window.innerForm.barcodeCheckSum(bar) == ver;
    }
    return false;
}

window.innerForm.getAge = function (birthDate, fromDate) {
    fromDate = fromDate || new Date();
    return Math.floor((fromDate - window.innerForm.parseDate(birthDate)) / 3.15576e+10);
};

window.innerForm.validateNotChar = function (value, chars) {
    chars = chars.split("");
    for (var i = 0; i < chars.length; i++) {
        if (value.indexOf(chars[i]) >= 0) {
            return false;
        }
    }
    return true;
};
window.innerForm.validateAnyChar = function (value, chars) {
    chars = chars.split("");
    var v = [];
    for (var i = 0; i < chars.length; i++) {
        if (value.indexOf(chars[i]) >= 0) {
            v.push(true);
        }
    }
    return v.indexOf(true) >= 0;
};

window.innerForm.validateAllChar = function (value, chars) {
    chars = chars.split("");
    var v = [];
    for (var i = 0; i < chars.length; i++) {
        if (value.indexOf(chars[i]) >= 0) {
            v.push(true);
        } else { v.push(false); }
    }
    return v.indexOf(false) < 0;
};

window.innerForm.validDate = function (value) {
    var datenumber = window.innerForm.parseDate(value);
    return datenumber != null && !isNaN(datenumber);
}

window.innerForm.parseDate = function (value) {
    var dt = 0;
    var d = 0;
    var m = 0;
    var y = 0;
    var comp = value.split(" ")[0].split("/");
    if (comp.length == 3) {
        comp[2] = comp[2].length == 2 ? new Date().getFullYear().toString().substring(0, 2) + comp[2] : comp[2];
        d = parseInt(comp[0], 10);
        m = parseInt(comp[1], 10) - 1;
        y = parseInt(comp[2], 10);
    }
    if (comp.length == 2) {
        comp[1] = comp[1].length == 2 ? new Date().getFullYear().toString().substring(0, 2) + comp[1] : comp[1];
        d = 1
        m = parseInt(comp[0], 10) - 1;
        y = parseInt(comp[1], 10);
    }
    dt = new Date(y, m, d);
    var lastday = new Date(y, m + 1, 0);
    if (m > 11 || m < 0) { return null }
    if (d > lastday.getDate() || d < 1) { return null }
    if (dt > 0) { return dt * 1 };
    return null;
}

/**
 * Validates a date range string in format "DD/MM/YYYY ~ DD/MM/YYYY"
 * @param {string} value - Date range string
 * @returns {boolean} True if both dates are valid and first date <= second date
 */
window.innerForm.validDateRange = function (value) {
    if (!value || typeof value !== 'string') return false;

    var parts = value.split(' ~ ');
    if (parts.length !== 2) return false;

    var date1 = parts[0].trim();
    var date2 = parts[1].trim();

    // Validate both dates individually
    if (!window.innerForm.validDate(date1) || !window.innerForm.validDate(date2)) {
        return false;
    }

    // Parse both dates to compare
    var parsedDate1 = window.innerForm.parseDate(date1);
    var parsedDate2 = window.innerForm.parseDate(date2);

    // First date should be <= second date
    return parsedDate1 <= parsedDate2;
}

/**
 * Validates a month/year range string in format "MM/YYYY ~ MM/YYYY"
 * @param {string} value - Month/year range string
 * @returns {boolean} True if both month/years are valid and first <= second
 */
window.innerForm.validMonthYearRange = function (value) {
    if (!value || typeof value !== 'string') return false;

    var parts = value.split(' ~ ');
    if (parts.length !== 2) return false;

    var monthYear1 = parts[0].trim();
    var monthYear2 = parts[1].trim();

    // Validate both month/years individually (add day 01 for validation)
    var testDate1 = "01/" + monthYear1;
    var testDate2 = "01/" + monthYear2;
    return window.innerForm.validDateRange(testDate1 + " ~ " + testDate2);


}


window.innerForm.expandYear = function (year, pivot) {
    pivot = pivot || 0;

    if (!year || isNaN(year) || year < 0) {
        return new Date().getFullYear();
    }

    if (year > 999) {
        return year;
    }

    if (year > 99) {
        return 1000 + year;
    }

    if (pivot >= 0) {
        if (year >= pivot) {
            return 1900 + year;
        } else {
            return 2000 + year;
        }
    } else {
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        let candidate = century + twoDigits;

        // Ajusta se estiver muito distante do ano atual
        if (Math.abs(candidate - currentYear) > 50) {
            if (candidate < currentYear) {
                candidate += 100;
            } else {
                candidate -= 100;
            }
        }
        return candidate;
    }
}





/**
 * Validates a short month/year range string in format "MM/YY ~ MM/YY"
 * @param {string} value - Short month/year range string
 * @returns {boolean} True if both month/years are valid and first <= second
 */
window.innerForm.validShortMonthYearRange = function (value) {
    if (!value || typeof value !== 'string') return false;

    var parts = value.split(' ~ ');
    if (parts.length !== 2) return false;

    var monthYear1 = parts[0].trim();
    var monthYear2 = parts[1].trim();

    //expannd years
    var comp1 = monthYear1.split("/");
    if (comp1.length != 2) return false;
    comp1[1] = comp1[1].length == 2 ? window.innerForm.expandYear(parseInt(comp1[1], 10)) : comp1[1];
    monthYear1 = comp1[0] + "/" + comp1[1];

    var comp2 = monthYear2.split("/");
    if (comp2.length != 2) return false;
    comp2[1] = comp2[1].length == 2 ? window.innerForm.expandYear(parseInt(comp2[1], 10)) : comp2[1];
    monthYear2 = comp2[0] + "/" + comp2[1];

    return window.innerForm.validMonthYearRange(monthYear1 + " ~ " + monthYear2);

}

window.innerForm.applyNoSpaceMask = function (input = new HTMLInputElement()) {
    input.value = input.value
        .replace(/[ ]+/g, '');
};

window.innerForm.applyAlphaMask = function (input = new HTMLInputElement()) {
    input.value = input.value
        .replace(/[!@#$%¨&*()_+\d\-=¹²³£¢¬§´[`{\/?°ª~\]^}º\\,.;|<>:₢«»"'¶¿®þ]/g, '')
        .replace(/[ ]+/g, ' ');
};

window.innerForm.applyAlphaNumericMask = function (input = new HTMLInputElement()) {
    input.value = input.value
        .replace(/[!@#$%¨&*()_+\-=¹²³£¢¬§´[`{\/?°ª~\]^}º\\,.;|<>:₢«»"'¶¿®þ]/g, '')
        .replace(/[ ]+/g, ' ');
};

window.innerForm.applyPhoneMask = function (input = new HTMLInputElement()) {
    var value = input.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{4})(\d{1,4})$/g, "$1-$2");
    value = value.replace(/^(\d{5})(\d{1,4})$/g, "$1-$2");
    value = value.replace(/^(\d{2})(\d{4})(\d{1,4})$/g, "($1) $2-$3");
    value = value.replace(/^(\d{2})(\d{5})(\d{1,4})$/g, "($1) $2-$3");
    input.maxLength = 15;
    input.value = value;
};

window.innerForm.applyUpperMask = function (input = new HTMLInputElement()) {
    input.value = input.value.toUpperCase();
};

window.innerForm.applyLowerMask = function (input = new HTMLInputElement()) {
    input.value = input.value.toLowerCase();
};

window.innerForm.applyDateMask = function (input = new HTMLInputElement()) {
    var text = input.value || "";
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{2})(\d+)/g, "$1/$2");
    text = text.replace(/^(\d{2}\/\d{2})(\d{1,4})$/g, "$1/$2");
    if (/^[\d]{2}\/[\d]{2}\/[\d]{4}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};


jQuery.fn.dateMask = function () {
    window.innerForm.applyDateMask(this)
};

window.innerForm.applyDateTimeMask = function (input = new HTMLInputElement()) {
    var value = input.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d+)$/g, "$1/$2");
    value = value.replace(/^(\d{2}\/\d{2})(\d+)$/g, "$1/$2");
    value = value.replace(/^(\d{2}\/\d{2}\/\d{4})(\d+)$/g, "$1 $2");
    value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2})(\d+)$/g, "$1:$2");
    value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})(\d+)$/g, "$1:$2");
    input.value = value;
    input.maxLength = 19;
};

window.innerForm.applyDateShortMask = function (input = new HTMLInputElement()) {
    var value = input.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d+)$/g, "$1/$2");
    value = value.replace(/^(\d{2}\/\d{2})(\d+)$/g, "$1/$2");
    value = value.replace(/^(\d{2}\/\d{2}\/\d{4})(\d+)$/g, "$1 $2");
    value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2})(\d+)$/g, "$1:$2");
    input.value = value;
    input.maxLength = 16;
};

window.innerForm.applyTimeMask = function (input = new HTMLInputElement()) {
    var value = input.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d+)$/g, "$1:$2");
    input.value = value.replace(/^(\d{2}:\d{2})(\d{1,2})$/g, "$1:$2");
    input.maxLength = 8;
};

window.innerForm.applyShortTimeMask = function (input = new HTMLInputElement()) {
    var value = input.value.replace(/\D/g, "");
    input.value = value.replace(/^(\d{2})(\d{1,2})$/g, "$1:$2");
    input.maxLength = 5;
};


window.innerForm.applyCPForCNPJMask = function (input = new HTMLInputElement()) {
    var value = input.value;
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
        window.innerForm.log(value.length);
        value = value.replace(/^(\d{3})(\d+)$/g, "$1.$2");
        value = value.replace(/^(\d{3}\.\d{3})(\d+)$/g, "$1.$2");
        value = value.replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/g, "$1-$2");
    } else {
        value = value.replace(/^(\d{2})(\d+)$/g, "$1.$2");
        value = value.replace(/^(\d{2}\.\d{3})(\d+)$/g, "$1.$2");
        value = value.replace(/^(\d{2}\.\d{3}\.\d{3})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d{1,2})$/g, "$1-$2");
    }
    input.value = value;
    input.maxLength = 18;
};


window.innerForm.applyCPFMask = function (input = new HTMLInputElement()) {
    var text = input.value || "";
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{3})(\d+)/g, "$1.$2");
    text = text.replace(/^(\d{3}\.\d{3})(\d+)/g, "$1.$2");
    text = text.replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/g, "$1-$2");
    if (/^[\d]{3}\.[\d]{3}\.[\d]{3}-[\d]{2}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};


window.innerForm.applyCEPMask = function (input = new HTMLInputElement()) {
    var text = input.value || "";
    text = text.replace(/\D/g, "");

    // Limita a 8 dígitos
    if (text.length > 8) {
        text = text.substring(0, 8);
    }

    // Só aplica a formatação se tiver 6 ou mais dígitos
    if (text.length >= 6) {
        text = text.replace(/^(\d{5})(\d{1,3})$/g, "$1-$2");
    }

    // Define maxLength baseado no formato final esperado
    input.maxLength = 9; // "00000-000"
    input.value = text;
};




window.innerForm.applyCNPJMask = function (input = new HTMLInputElement()) {
    var text = input.value || "";
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


window.innerForm.applyCreditCardMask = function (input = new HTMLInputElement()) {
    var text = input.value || "";
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{4})(\d+)$/g, "$1 $2");
    text = text.replace(/^(\d{4} \d{4})(\d+)$/g, "$1 $2");
    text = text.replace(/^(\d{4} \d{4} \d{4})(\d{1,4})$/g, "$1 $2");
    if (/^[\d]{4} [\d]{4} [\d]{4} [\d]{4}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};


window.innerForm.applyNumberMask = function (input = new HTMLInputElement()) {
    var text = input.value || "";
    text = text.replace(/\D/g, "");
    input.value = text;
};

window.innerForm.applyMonthYearMask = function (input = new HTMLInputElement()) {
    var text = input.value || "";
    text = text.replace(/\D/g, "");
    text = text.replace(/^(\d{2})(\d{1,4})/g, "$1/$2");
    if (/^[\d]{2}\/[\d]{4}$/g.test(text)) {
        input.maxLength = text.length;
    }
    input.value = text;
};


window.innerForm.applyDateRangeMask = function (input = new HTMLInputElement()) {
    // formato DD/MM/AAAA ~ DD/MM/AAAA
    var text = input.value || "";
    text = text.replace(/[^\d~\s]/g, ""); // Manter apenas dígitos, ~ e espaços
    text = text.replace(/\s+/g, " "); // Normalizar espaços

    // Remover múltiplos tildes
    text = text.replace(/~+/g, "~");

    // Se não tem tilde ainda, adicionar quando necessário
    if (!text.includes("~")) {
        // Quando tiver 8 dígitos (DDMMAAAA), adicionar o separador
        if (text.length >= 8) {
            var digits = text.replace(/\D/g, "");
            if (digits.length >= 8) {
                text = digits.substring(0, 2) + "/" + digits.substring(2, 4) + "/" + digits.substring(4, 8) + " ~ " +
                    (digits.length > 8 ? digits.substring(8, 10) : "") +
                    (digits.length > 10 ? "/" + digits.substring(10, 12) : "") +
                    (digits.length > 12 ? "/" + digits.substring(12, 16) : "");
            } else {
                text = text.replace(/^(\d{2})(\d{1,2})(\d{1,4})/g, "$1/$2/$3");
            }
        } else {
            text = text.replace(/^(\d{2})(\d{1,2})(\d{1,4})/g, "$1/$2/$3");
        }
    } else {
        // Já tem tilde, formatar as duas partes
        var parts = text.split("~");
        var part1 = parts[0] ? parts[0].trim().replace(/\D/g, "") : "";
        var part2 = parts[1] ? parts[1].trim().replace(/\D/g, "") : "";

        var formatted1 = "";
        if (part1.length >= 2) {
            formatted1 = part1.substring(0, 2);
            if (part1.length >= 4) {
                formatted1 += "/" + part1.substring(2, 4);
                if (part1.length >= 8) {
                    formatted1 += "/" + part1.substring(4, 8);
                }
            }
        } else {
            formatted1 = part1;
        }

        var formatted2 = "";
        if (part2.length >= 2) {
            formatted2 = part2.substring(0, 2);
            if (part2.length >= 4) {
                formatted2 += "/" + part2.substring(2, 4);
                if (part2.length >= 8) {
                    formatted2 += "/" + part2.substring(4, 8);
                }
            }
        } else {
            formatted2 = part2;
        }

        text = formatted1 + " ~ " + formatted2;
    }

    // Limitar tamanho máximo
    if (text.length > 23) text = text.substring(0, 23); // DD/MM/AAAA ~ DD/MM/AAAA
    input.value = text;
}

window.innerForm.applyMonthYearRangeMask = function (input = new HTMLInputElement()) {
    // formato MM/AAAA ~ MM/AAAA
    var text = input.value || "";
    text = text.replace(/[^\d~\s]/g, ""); // Manter apenas dígitos, ~ e espaços
    text = text.replace(/\s+/g, " "); // Normalizar espaços

    // Remover múltiplos tildes
    text = text.replace(/~+/g, "~");

    // Se não tem tilde ainda, adicionar quando necessário
    if (!text.includes("~")) {
        // Quando tiver 6 dígitos (MMAAAA), adicionar o separador
        if (text.length >= 6) {
            var digits = text.replace(/\D/g, "");
            if (digits.length >= 6) {
                text = digits.substring(0, 2) + "/" + digits.substring(2, 4) + "/" + digits.substring(4, 6) + " ~ " +
                    (digits.length > 6 ? digits.substring(6, 8) : "") +
                    (digits.length > 8 ? "/" + digits.substring(8, 10) : "") +
                    (digits.length > 10 ? "/" + digits.substring(10, 12) : "");
            } else {
                text = text.replace(/^(\d{2})(\d{1,2})(\d{1,4})/g, "$1/$2/$3");
            }
        } else {
            text = text.replace(/^(\d{2})(\d{1,2})(\d{1,4})/g, "$1/$2/$3");
        }
    } else {
        // Já tem tilde, formatar as duas partes
        var parts = text.split("~");
        var part1 = parts[0] ? parts[0].trim().replace(/\D/g, "") : "";
        var part2 = parts[1] ? parts[1].trim().replace(/\D/g, "") : "";

        var formatted1 = "";
        if (part1.length >= 2) {
            formatted1 = part1.substring(0, 2);
            if (part1.length >= 4) {
                formatted1 += "/" + part1.substring(2, 4);
                if (part1.length >= 6) {
                    formatted1 += "/" + part1.substring(4, 6);
                }
            }
        } else {
            formatted1 = part1;
        }

        var formatted2 = "";
        if (part2.length >= 2) {
            formatted2 = part2.substring(0, 2);
            if (part2.length >= 4) {
                formatted2 += "/" + part2.substring(2, 4);
                if (part2.length >= 6) {
                    formatted2 += "/" + part2.substring(4, 6);
                }
            }
        } else {
            formatted2 = part2;
        }

        text = formatted1 + " ~ " + formatted2;
    }

    // Limitar tamanho máximo
    if (text.length > 17) text = text.substring(0, 17); // MM/AAAA ~ MM/AAAA
    input.value = text;
}

window.innerForm.applyShortMonthYearRangeMask = function (input = new HTMLInputElement()) {
    // formato MM/AA ~ MM/AA
    var text = input.value || "";
    text = text.replace(/[^\d~\s]/g, ""); // Manter apenas dígitos, ~ e espaços
    text = text.replace(/\s+/g, " "); // Normalizar espaços

    // Remover múltiplos tildes
    text = text.replace(/~+/g, "~");

    // Se não tem tilde ainda, adicionar quando necessário
    if (!text.includes("~")) {
        // Quando tiver 4 dígitos (MMAAAA), adicionar o separador
        if (text.length >= 4) {
            var digits = text.replace(/\D/g, "");
            if (digits.length >= 4) {
                text = digits.substring(0, 2) + "/" + digits.substring(2, 4) + " ~ " +
                    (digits.length > 4 ? digits.substring(4, 6) : "");
            } else {
                text = text.replace(/^(\d{2})(\d{1,2})/g, "$1/$2");
            }
        } else {
            text = text.replace(/^(\d{2})(\d{1,2})/g, "$1/$2");
        }
    } else {
        // Já tem tilde, formatar as duas partes
        var parts = text.split("~");
        var part1 = parts[0] ? parts[0].trim().replace(/\D/g, "") : "";
        var part2 = parts[1] ? parts[1].trim().replace(/\D/g, "") : "";

        var formatted1 = "";
        if (part1.length >= 2) {
            formatted1 = part1.substring(0, 2);
            if (part1.length >= 4) {
                formatted1 += "/" + part1.substring(2, 4);
                if (part1.length >= 6) {
                    formatted1 += "/" + part1.substring(4, 6);
                }
            }
        } else {
            formatted1 = part1;
        }

        var formatted2 = "";
        if (part2.length >= 2) {
            formatted2 = part2.substring(0, 2);
            if (part2.length >= 4) {
                formatted2 += "/" + part2.substring(2, 4);
                if (part2.length >= 6) {
                    formatted2 += "/" + part2.substring(4, 6);
                }
            }
        } else {
            formatted2 = part2;
        }
        text = formatted1 + " ~ " + formatted2;
    }

    // Limitar tamanho máximo
    if (text.length > 13) text = text.substring(0, 13); // MM/AA ~ MM/AA
    input.value = text;

}

window.innerForm.checkLuhn = function (cardNumber) {
    var s = 0;
    var doubleDigit = false;
    cardNumber = cardNumber.replace(/[^\d]+/g, "");
    for (var i = cardNumber.length - 1; i >= 0; i--) {
        var digit = +cardNumber[i];
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

window.innerForm.validateCardBrand = function (cardNumber) {
    cardNumber = cardNumber.replace(/[^0-9]+/g, "");
    var cards = {
        visa: /^4[0-9]{12}(?:[0-9]{3})/,
        mastercard: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
        amex: /^3[47][0-9]{13}/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
        hiper: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
        elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}/,
        aura: /^(5078\d{2})(\d{2})(\d{11})$/,
        maestro: /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/,
        laser: /^(6304|6706|6709|6771)[0-9]{12,15}$/,
        blanche: /^389[0-9]{11}$/,
        switch: /^(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}$/,
        korean: /^9[0-9]{15}$/,
        union: /^(62[0-9]{14,17})$/,
        solo: /^(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}$/,
        insta: /^63[7-9][0-9]{13}$/,
        bcglobal: /^(6541|6556)[0-9]{12}$/,
        rupay: /^6[0-9]{15}$/
    };

    for (var flag in cards) {
        if (cards[flag].test(cardNumber)) {
            return flag;
        }
    }

    return false;
};

window.innerForm.validateCNPJ = function (CNPJNumber) {
    CNPJNumber = CNPJNumber.replace(/\D/g, "");

    if (CNPJNumber == '')
        return false;

    if (CNPJNumber.length != 14)
        return false;

    // Elimina CNPJs inválidos conhecidos
    if (CNPJNumber == "00000000000000" ||
        CNPJNumber == "11111111111111" ||
        CNPJNumber == "22222222222222" ||
        CNPJNumber == "33333333333333" ||
        CNPJNumber == "44444444444444" ||
        CNPJNumber == "55555555555555" ||
        CNPJNumber == "66666666666666" ||
        CNPJNumber == "77777777777777" ||
        CNPJNumber == "88888888888888" ||
        CNPJNumber == "99999999999999")
        return false;

    // Valida DVs
    tamanho = CNPJNumber.length - 2;
    numeros = CNPJNumber.substring(0, tamanho);
    digitos = CNPJNumber.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = CNPJNumber.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
};

window.innerForm.validatePassword = function (input) {
    // Create an array and push all possible values that you want in password
    var matchedCase = new Array();
    matchedCase.push(/[!@#$%^&*()_\-+=}{\]\[`~<>?/\\|±!.,]/g);
    matchedCase.push(/[A-Z]/g);
    matchedCase.push(/[0-9]/g);
    matchedCase.push(/[a-z]/g);

    // Check the conditions
    var ctr = 0;
    for (var i = 0; i < matchedCase.length; i++) {
        if (matchedCase[i].test(jQuery(input).val())) {
            ctr++;
        }
    }

    jQuery(input).attr("data-pwstrength", ctr);
    return ctr;
};

if (String.prototype.replaceAll == undefined) {
    String.prototype.replaceAll = function (from, to) {
        var array = this.split(from);
        array = array.filter(function (el) {
            return el !== null;
        });
        return array.join(to);
    };
    window.innerForm.log("replaceAll added to String.prototype");
}


window.innerForm.searchViaCEP = function (CEPNumber, homeNumber, delay, callbackFunction) {
    CEPNumber = CEPNumber || "";
    homeNumber = homeNumber || "";
    delay = delay || 0;
    callbackFunction = callbackFunction || function (o) { window.innerForm.log('No callback defined', o); }
    window.innerForm.log('Searching CEP', CEPNumber, homeNumber, delay);
    let address = jQuery(".autocomplete.address").prop("disabled");
    let complement = jQuery(".autocomplete.complement").prop("disabled");
    let neighborhood = jQuery(".autocomplete.neighborhood").prop("disabled");
    let city = jQuery(".autocomplete.city").prop("disabled");
    let state = jQuery(".autocomplete.state").prop("disabled");
    let fulladdress = jQuery(".autocomplete.fulladdress").prop("disabled");
    let gia = jQuery(".autocomplete.gia").prop("disabled");
    let ddd = jQuery(".autocomplete.ddd").prop("disabled");
    let ibge = jQuery(".autocomplete.ibge").prop("disabled");
    let siafi = jQuery(".autocomplete.siafi").prop("disabled");

    if (
        (CEPNumber.length == 9 && CEPNumber.includes("-")) ||
        (CEPNumber.length == 8 && CEPNumber.includes("-") == false)
    ) {
        jQuery.ajax({
            type: "GET",
            url: "https://viacep.com.br/ws/" + CEPNumber + "/json/",
            async: true,
            crossorigin: true,
            beforeSend: function () {
                window.innerForm.log("Getting info from ViaCEP...")
                jQuery(".autocomplete.address").prop("disabled", true);
                jQuery(".autocomplete.complement").prop("disabled", true);
                jQuery(".autocomplete.neighborhood").prop("disabled", true);
                jQuery(".autocomplete.city").prop("disabled", true);
                jQuery(".autocomplete.state").prop("disabled", true);
                jQuery(".autocomplete.fulladdress").prop("disabled", true);
                jQuery(".autocomplete.ibge").prop("disabled", true);
                jQuery(".autocomplete.gia").prop("disabled", true);
                jQuery(".autocomplete.ddd").prop("disabled", true);
                jQuery(".autocomplete.siafi").prop("disabled", true);
            },
            success: function (obj) {
                obj["numero"] = homeNumber;
                if (homeNumber != "") {
                    homeNumber = ", " + homeNumber;
                }

                window.innerForm.log("ViaCEP Response", obj);

                jQuery(".autocomplete.address:input")
                    .setOrReplaceVal(obj.logradouro)
                    .change().focus();
                jQuery(".autocomplete.complement:input")
                    .setOrReplaceVal(obj.complemento)
                    .change().focus();
                jQuery(".autocomplete.neighborhood:input")
                    .setOrReplaceVal(obj.bairro)
                    .change().focus();
                jQuery(".autocomplete.city:input")
                    .setOrReplaceVal(obj.localidade)
                    .change().focus();
                jQuery(".autocomplete.state:input")
                    .setOrReplaceVal(obj.uf)
                    .change().focus();
                jQuery(".autocomplete.ibge:input")
                    .setOrReplaceVal(obj.ibge)
                    .change().focus();
                jQuery(".autocomplete.gia:input")
                    .setOrReplaceVal(obj.gia)
                    .change().focus();
                jQuery(".autocomplete.ddd:input")
                    .setOrReplaceVal(obj.ddd)
                    .change().focus();
                jQuery(".autocomplete.siafi:input")
                    .setOrReplaceVal(obj.siafi)
                    .change().focus();

                jQuery(".autocomplete.fulladdress:input")
                    .setOrReplaceVal(
                        obj.logradouro +
                        homeNumber +
                        " " +
                        obj.complemento +
                        " - " +
                        obj.bairro +
                        " - " +
                        obj.localidade +
                        " - " +
                        obj.uf
                    )
                    .change().focus();

                jQuery(".autocomplete.address")
                    .not(":input")
                    .text(obj.logradouro);
                jQuery(".autocomplete.complement")
                    .not(":input")
                    .text(obj.complemento);
                jQuery(".autocomplete.neighborhood")
                    .not(":input")
                    .text(obj.bairro);
                jQuery(".autocomplete.city")
                    .not(":input")
                    .text(obj.localidade);
                jQuery(".autocomplete.state")
                    .not(":input")
                    .text(obj.uf);
                jQuery(".autocomplete.ibge")
                    .not(":input")
                    .text(obj.ibge);
                jQuery(".autocomplete.gia")
                    .not(":input")
                    .text(obj.gia);
                jQuery(".autocomplete.siafi")
                    .not(":input")
                    .text(obj.siafi);
                jQuery(".autocomplete.ddd")
                    .not(":input")
                    .text(obj.ddd);
                jQuery(".autocomplete.fulladdress")
                    .not(":input")
                    .text(
                        obj.logradouro +
                        homeNumber +
                        " - " +
                        obj.bairro +
                        " - " +
                        obj.localidade +
                        " - " +
                        obj.uf
                    );

                if (obj.logradouro) {
                    setTimeout(function () {
                        jQuery(".autocomplete.num:input, .autocomplete.number:input").focus();
                        jQuery(".autocomplete.homenum:input, .autocomplete.homenumber:input").focus();
                    }, delay);
                } else {
                    window.innerForm.error('Address not found');
                    let nft = jQuery(this).attr("data-addressnotfoundtext") || jQuery(this).attr("data-notfoundtext") || "";
                    jQuery(".autocomplete.fulladdress")
                        .not(":input").text(nft);
                    jQuery(".autocomplete.fulladdress:input")
                        .val(nft).change();
                    eval(jQuery(this).attr("data-addressnotfound") || jQuery(this).attr("data-notfound") || "void(0)");
                    setTimeout(function () {
                        jQuery(".autocomplete.address:input").focus();
                    }, delay);
                }
                if (obj) callbackFunction(obj);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //Error event
                window.innerForm.log("VIACEP error", xhr, ajaxOptions, thrownError);
                setTimeout(function () {
                    jQuery(".autocomplete.address:input").focus();
                }, delay);
            },
            complete: function () {
                jQuery(".autocomplete.address").prop("disabled", address);
                jQuery(".autocomplete.complement").prop("disabled", complement);
                jQuery(".autocomplete.neighborhood").prop("disabled", neighborhood);
                jQuery(".autocomplete.city").prop("disabled", city);
                jQuery(".autocomplete.state").prop("disabled", state);
                jQuery(".autocomplete.fulladdress").prop("disabled", fulladdress);
                jQuery(".autocomplete.gia").prop("disabled", gia);
                jQuery(".autocomplete.ddd").prop("disabled", ddd);
                jQuery(".autocomplete.siafi").prop("disabled", siafi);
                jQuery(".autocomplete.ibge").prop("disabled", ibge);
            }
        });
    } else {
        window.innerForm.log("Awaiting a valid CEP", CEPNumber);
    }
}

/**
 * Sets a value to an input if that input is empty. If this input is not empty, set the value only if it does not contain the .noreplace class
 * @param {Object} value any input value 
 */
jQuery.fn.setOrReplaceVal = function (value) {

    let valor = jQuery.trim(jQuery(this).val() || "");
    if (valor == "") {
        jQuery(this).val(value)
    } else if (jQuery(this).is(".noreplace") == false) {
        jQuery(this).val(value)
    }
    return jQuery(this);

}

/**
 * Check if given value is valid
 * @arguments The first argument is the value, the subsequent arguments are the validation classes
 * @return {Boolean} true if is valid, otherwise false
 */
jQuery.isValid = function () {
    let items = Array.prototype.slice.call(arguments);
    if (items.length > 0) {
        let v = items.shift();
        return jQuery("<input value='" + v + "' class='" + items.join(" ") + "' />").isValid();
    }
    return false;
}


/**
 * Checks if an input, form or collection of inputs is valid
 * @arguments When empty, uses the validation classes contained in the class attribute. if specified, use each argument as a validation class
 * @return {Boolean} true if is valid, otherwise false
 */
jQuery.fn.isValid = function () {
    let results = [];

    if (jQuery(this).length > 1 || jQuery(this).prop("tagName") == "FORM") {
        eval(jQuery(this).attr("data-beforevalidatecallback") || "void(0)");
        var elements = [];
        var config = Array.prototype.slice.call(arguments)[0];
        jQuery(this)
            .find(":input.prevFocus" + (config || ""))
            .each(function () {
                results.push(jQuery(this).isValid());
                elements.push(jQuery(this));
            });

        for (var mm = 0; mm < results.length; mm++) {
            if (results[mm] === false) {
                eval(jQuery(this).attr("data-invalidcallback") || "void(0)");
                eval(jQuery(this).attr("data-aftervalidatecallback") || "void(0)");
                return false;
            }
        }
        eval(jQuery(this).attr("data-validcallback") || "void(0)");
        eval(jQuery(this).attr("data-aftervalidatecallback") || "void(0)");
        return true;
    } else {
        this.removeClass("error");
        this.removeClass("success");
        this.closest(".form-group").removeClass("has-error");
        if (this.get(0).setCustomValidity) {
            this.get(0).setCustomValidity("");
        }
        var valids = [];
        var allargs = Array.prototype.slice.call(arguments);
        for (var vv = 0; vv < allargs.length; vv++) {
            allargs[vv].split(" ").forEach(function (el) {
                valids.push(el);
            });
        }
        var value = this.val();
        var type = this.attr("type");
        if (arguments.length < 1) {
            var classes = (this.attr("class") || "").split(" ");
            for (var vc = 0; vc < classes.length; vc++) {
                valids.push("" + classes[vc]);
            }
        }
        for (var i = 0; i < valids.length; i++) {
            if (this.prop("disabled") == false) {
                let currentValid = valids[i].toLowerCase();
                switch (currentValid) {
                    case "nospace":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(value.indexOf(" ") < 0);
                        break;
                    case "number":
                    case "num":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(!isNaN(value.replaceAll(",", ".")));
                        break;
                    case "ean":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(validateEAN(value));
                        break;
                    case "upper":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(!/[a-z]/.test(value));
                        break;
                    case "lower":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(!/[A-Z]/.test(value));

                        break;
                    case "alphanumeric":
                    case "alphanum":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(/^[A-Za-z0-9 ]+$/.test(value));
                        break;
                    case "alpha":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(/^[A-Za-z ]+$/.test(value));
                        break;
                    case "tel":
                    case "cel":
                    case "telephone":
                    case "mobilephone":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        value = value
                            .replaceAll("(", "")
                            .replaceAll(")", "")
                            .replaceAll(" ", "")
                            .replaceAll("-", "");
                        results.push(!isNaN(value) && value.length >= 8);
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
                        if (type == "checkbox" || type == "radio") {
                            results.push(jQuery(this).is(":checked"));
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
                        results.push(value.split("/").length == 3)
                        results.push(window.innerForm.validDate(value));
                        break;
                    case "daterange":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(window.innerForm.validDateRange(value));
                        break;
                    case "monthyearrange":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(window.innerForm.validMonthYearRange(value));
                        break;
                    case "shortmonthyearrange":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(window.innerForm.validShortMonthYearRange(value));
                        break;
                    case "datetime":
                    case "dateshorttime":
                    case "datetimeshort":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var comp = value.split(" ");
                        if (comp.length == 2) {
                            results.push(window.innerForm.validDate(comp[0]) && window.innerForm.validateTime(comp[1]));
                            break;
                        }
                        results.push(false);
                        break;
                    case "time":
                    case "shorttime":
                    case "timeshort":
                    case "minutesecond":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(window.innerForm.validateTime(value, currentValid == "minutesecond"));
                        break;
                    case "month":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(jQuery(this).isValid("num"));
                        var num = parseInt(value);
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
                    case "cep":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(value.replace("-", "").length == 8);
                        break;
                    case "cpfcnpj":
                    case "cnpjcpf":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(jQuery(this).isValid("cpf") || jQuery(this).isValid("cnpj"));
                        break;
                    case "cnpj":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        results.push(window.innerForm.validateCNPJ(value));
                        break;
                    case "cpf":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        value = value.replace(/\D/g, "");

                        // Elimina CPFS invalidos conhecidos
                        if (
                            value == "00000000000" ||
                            value == "11111111111" ||
                            value == "22222222222" ||
                            value == "33333333333" ||
                            value == "44444444444" ||
                            value == "55555555555" ||
                            value == "66666666666" ||
                            value == "77777777777" ||
                            value == "88888888888" ||
                            value == "99999999999" ||
                            value.length !== 11
                        ) {
                            results.push(false);
                            break;
                        }

                        var Soma = 0;
                        var Resto = 0;

                        for (x = 1; x <= 9; x++)
                            Soma = Soma + parseInt(value.substring(x - 1, x)) * (11 - x);
                        Resto = (Soma * 10) % 11;

                        if (Resto == 10 || Resto == 11) Resto = 0;
                        if (Resto != parseInt(value.substring(9, 10))) {
                            results.push(false);
                            break;
                        }

                        Soma = 0;
                        for (x = 1; x <= 10; x++)
                            Soma = Soma + parseInt(value.substring(x - 1, x)) * (12 - x);
                        Resto = (Soma * 10) % 11;

                        if (Resto == 10 || Resto == 11) Resto = 0;
                        if (Resto != parseInt(value.substring(10, 11))) {
                            results.push(false);
                            break;
                        }
                        results.push(true);
                        break;
                    case "debitcard":
                    case "creditcard":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var vlu = window.innerForm.checkLuhn(value);

                        if (vlu) {
                            var flagcard = window.innerForm.validateCardBrand(value);
                            jQuery(this).attr("data-flagcard", flagcard.toString());
                            if (
                                jQuery(this).is(
                                    ".visa, .mastercard, .diners, .amex, .discover, .hiper, .elo, .jcb, .aura, .maestro, .laser, .blanche, .switch, .korean, .union, .solo, .insta, .bcglobal, .rupay"
                                )
                            ) {
                                if (flagcard) {
                                    results.push(jQuery(this).hasClass(flagcard.toString()));
                                } else {
                                    results.push(false);
                                }
                            } else {
                                results.push(flagcard !== false);
                            }
                        } else {
                            jQuery(this).attr("data-flagcard", false);
                            results.push(false);
                        }
                        break;
                    case "password":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }

                        var strenght = valids[i + 1] || "3";

                        switch (strenght) {
                            case "strong":
                                strenght = 4;
                                break;
                            case "medium":
                                strenght = 3;
                                break;
                            default:
                                if (isNaN(strenght)) {
                                    strenght = 3;
                                }
                                break;
                        }

                        results.push(window.innerForm.validatePassword(this) >= strenght);
                        break;

                    case "after":
                    case "before":

                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        if (typeof valids[i + 1] === "undefined") {
                            results.push(false);
                            break;
                        }

                        var num = valids[i + 1] || "0";
                        if ((num.indexOf("today") || num.indexOf("/")) && window.innerForm.validDate(value)) {
                            value = window.innerForm.parseDate(value);
                            if (num == "today") {
                                num = Date.now();
                            } else {
                                num = window.innerForm.parseDate(num);
                            }
                        }
                        if (valids[i] == "after") {
                            results.push(parseFloat(value) >= parseFloat(num));
                        } else {
                            results.push(parseFloat(value) <= parseFloat(num));
                        }
                        break;
                    case "eq":
                    case "equal":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        if (typeof valids[i + 1] === "undefined") {
                            results.push(false);
                            break;
                        }
                        var selector =
                            jQuery(this).attr("data-eq") ||
                            jQuery(this).data("data-equal") ||
                            valids[i + 1] ||
                            null;
                        var valor1 = jQuery(this).val();
                        var valor2 = jQuery(selector).val() || jQuery(selector).text();
                        results.push(valor1 == valor2);
                        break;
                    case "notchars":
                    case "notchar":
                    case "containsnotchar":
                    case "containsnotchars":
                    case "notcontainschars":
                    case "notcontainschar":
                    case "eqv":
                    case "equalvalue":
                    case "equal-value":
                    case "eq-v":
                    case "contains":
                    case "cnts":
                    case "containsstring":
                    case "containsanychar":
                    case "containschar":
                    case "containsanychars":
                    case "containsallchar":
                    case "containsallchars":

                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var valor2 =
                            jQuery(this).attr("data-cnts") ||
                            jQuery(this).attr("data-contains") ||
                            jQuery(this).attr("data-string") ||
                            jQuery(this).attr("data-value") ||
                            valids[i + 1] ||
                            "";

                        if (valor2 === "") {
                            results.push(false);
                            break;
                        }

                        var valor1 = jQuery(this).val();
                        if (valor2.toLowerCase() == "_space") {
                            valor2 = " ";
                        }

                        switch (currentValid) {
                            case "containsanychar":
                            case "containsanychars":
                                results.push(window.innerForm.validateAnyChar(valor1, valor2));
                                break;
                            case "containschar":
                            case "containsallchar":
                            case "containsallchars":
                                results.push(window.innerForm.validateAllChar(valor1, valor2));
                                break;
                            case "eqv":
                            case "equalvalue":
                            case "equal-value":
                            case "eq-v":
                                results.push(valor1 == valor2);
                                break;
                            case "notchars":
                            case "notchar":
                            case "containsnotchar":
                            case "containsnotchars":
                            case "notcontainschars":
                            case "notcontainschar":
                                results.push(window.innerForm.validateNotChar(valor1, valor2));
                                break;
                            default:
                                results.push(valor1.includes(valor2));
                                break;
                        }
                        break;

                    case "len":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        if (typeof valids[i + 1] === "undefined") {
                            results.push(false);
                            break;
                        }
                        results.push(value.length == parseInt(valids[i + 1]));
                        break;
                    case "minlen":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        if (typeof valids[i + 1] === "undefined") {
                            results.push(false);
                            break;
                        }
                        results.push(value.length >= parseInt(valids[i + 1]));
                        break;
                    case "maxlen":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        if (typeof valids[i + 1] === "undefined") {
                            results.push(false);
                            break;
                        }
                        results.push(value.length <= parseInt(valids[i + 1]));
                        break;
                    case "to":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        if (typeof valids[i + 1] === "undefined") {
                            results.push(false);
                            break;
                        }
                        if (typeof valids[i - 1] === "undefined") {
                            results.push(false);
                            break;
                        }
                        var v1 = jQuery(this).isValid("after " + valids[i - 1]);
                        var v2 = jQuery(this).isValid("before " + valids[i + 1]);
                        results.push(v1 && v2);
                        break;
                    case "minage":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var idade = window.innerForm.getAge(value);
                        results.push(idade >= parseInt(valids[i + 1]));
                        break;
                    case "maxage":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var idade = getAge(value);
                        results.push(idade <= parseInt(valids[i + 1]));
                        break;
                    case "age":
                        if (jQuery.trim(value) === "") {
                            results.push(true);
                            break;
                        }
                        var idade = window.innerForm.getAge(value);
                        results.push(idade == parseInt(valids[i + 1]));
                        break;
                    default:
                        results.push(true);
                        break;
                }
            } else {
                results.push(true);
            }
        }

        for (var i = 0; i < results.length; i++) {
            if (results[i] === false) {
                jQuery(this).addClass("error");
                jQuery(this)
                    .closest(".form-group")
                    .addClass("has-error");
                jQuery(this)
                    .get(0)
                    .setCustomValidity(jQuery(this).attr("data-invalidmessage") || "");
                eval(jQuery(this).attr("data-invalidcallback") || "void(0)");
                eval(jQuery(this).attr("data-aftervalidatecallback") || "void(0)");
                return false;
            }
        }

        if (jQuery.trim(value) !== "") {
            jQuery(this).addClass("success");
        }
        jQuery(this).removeClass("error");
        eval(jQuery(this).attr("data-validcallback") || "void(0)");
        eval(jQuery(this).attr("data-aftervalidatecallback") || "void(0)");
        return true;
    }
};

jQuery(document).ready(function () {
    jQuery('form.validate, form[data-validate="true"], form[data-validation="true"], .forcevalidate').startValidation().startMasks();
    jQuery(":input").each(function () {
        jQuery(this).focus(function () {
            jQuery(this).addClass("prevFocus");
        });
    });
});


jQuery.fn.startMasks = function () {

    jQuery(this).find(".mask.phone, .mask.tel, .mask.cel").phoneMask();
    jQuery(this).find(".mask.upper").upperMask();
    jQuery(this).find(".mask.lower, .mask.email, .mask.mail").lowerMask();
    jQuery(this).find(".mask.cpf").cpfMask();
    jQuery(this).find(".mask.cep").cepMask();
    jQuery(this).find(".mask.cnpj").cnpjMask();
    jQuery(this).find(".mask.cpfcnpj, .mask.cnpjcpf").cpfCnpjMask();
    jQuery(this).find(".mask.creditcard, .mask.debitcard").creditCardMask();
    jQuery(this).find(".mask.date, .mask.data").dateMask();
    jQuery(this).find(".mask.monthyear").monthYearMask();
    jQuery(this).find(".mask.num, .mask.number, .mask.month").numberMask();
    jQuery(this).find(".mask.len").lenMask();
    jQuery(this).find(".autocomplete.cep").cepAutoComplete();
    jQuery(this).find(".mask.time").timeMask();
    jQuery(this).find(".mask.shorttime, .mask.timeshort, .mask.minutesecond").shortTimeMask();
    jQuery(this).find(".mask.dateshorttime, .mask.datetimeshort").dateShortTimeMask();
    jQuery(this).find(".mask.datetime").dateTimeMask();
    jQuery(this).find(".mask.alpha").alphaMask();
    jQuery(this).find(".mask.alphanum, .mask.alphanumeric").alphaNumericMask();
    jQuery(this).find(".mask.nospace").noSpaceMask();
    jQuery(this).find(".mask.maxlen").maxLenMask();
    jQuery(this).find(".mask.leadingzero").leadingZeroMask();
    jQuery(this).find(".mask.daterange").dateRangeMask();
    jQuery(this).find(".mask.monthyearrange").monthYearRangeMask();
    jQuery(this).find(".mask.shortmonthyearrange").shortMonthYearRangeMask();

}

jQuery.fn.startValidation = function () {
    jQuery(this).not(".notonblur").validateOnBlur();
    jQuery(this).not(".notonchange").validateOnChange();
    jQuery(this).find(".onkeyup").validateOnType();
    return jQuery(this).on("submit", function () {
        jQuery(this).find(":input").addClass('prevFocus');
        return jQuery(this).isValid();
    });

}

jQuery.fn.validateOnType = function (time) {
    time = time || window.innerForm.onTypeTimeout;
    let x = jQuery(this)
        .on("keyup", function () {
            var p = jQuery(this);
            p.removeClass("error");
            p.closest(".form-group").removeClass("has-error");
            if (window.innerForm.onTypeTimeoutFunction) {
                clearTimeout(window.innerForm.onTypeTimeoutFunction);
            }
            window.innerForm.onTypeTimeoutFunction = setTimeout(function () {
                p.isValid();
            }, time);
        });
    window.innerForm.log("InnerFormValidation:", "Validation on Type started", x, "delay", time);
    return x;
}

jQuery.fn.validateOnBlur = function () {
    let x = jQuery(this)
        .on("blur", function () {
            jQuery(this).isValid();
        });
    window.innerForm.log("InnerFormValidation:", "Validation on Blur started", x);
    return x;
}

jQuery.fn.validateOnChange = function () {
    let x = jQuery(this)
        .on("change", function () {
            jQuery(this).isValid();
        });
    window.innerForm.log("InnerFormValidation:", "Validation on Change started", x);
    return x;
}

jQuery.fn.phoneMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyPhoneMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "PhoneMask started", x);
    return x;
}


jQuery.fn.upperMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyUpperMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "UpperMask started", x);
    return x;
}


jQuery.fn.lowerMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyLowerMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "LowerMask started", x);
    return x;
}

jQuery.fn.cpfMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyCPFMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "CpfMask started", x);
    return x;
}


jQuery.fn.cepMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyCEPMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "CepMask started", x);
    return x;
}


jQuery.fn.cnpjMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyCNPJMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "CnpjMask started", x);
    return x;
}

jQuery.fn.cpfCnpjMask = function () {
    let x = jQuery(this).on('input', function () {
        window.innerForm.applyCPForCNPJMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "CpfCnpjMask started", x);
    return x;
}


jQuery.fn.creditCardMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyCreditCardMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "CreditCardMask started", x);
    return x;
}

jQuery.fn.dateMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyDateMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "DateMask started", x);
    return x;
}

jQuery.fn.monthYearMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyMonthYearMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "MonthYearMask started", x);
    return x;
}

jQuery.fn.numberMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyNumberMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "NumberMask started", x);
    return x;
}

jQuery.fn.dateRangeMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyDateRangeMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "DateRangeMask started", x);
    return x;
}

jQuery.fn.shortMonthYearRangeMask = function () {

    let x = jQuery(this).on("input", function () {
        window.innerForm.applyShortMonthYearRangeMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "ShortMonthYearRangeMask started", x);
    return x;

}
jQuery.fn.monthYearRangeMask = function () {

    let x = jQuery(this).on("input", function () {
        window.innerForm.applyMonthYearRangeMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "MonthYearRangeMask started", x);
    return x;
}

jQuery.fn.lenMask = function (tam) {
    let x = jQuery(this).on("input", function () {
        var array = jQuery(this)
            .attr("class")
            .split(" ")
            .filter(function (el) {
                return el != null && el != "";
            });
        tam = tam || parseInt(array[array.indexOf("len") + 1]);
        if (!isNaN(tam)) {
            jQuery(this).attr("maxlength", tam);
            jQuery(this).val(
                jQuery(this)
                    .val()
                    .substring(0, tam)
            );
        }
    });
    window.innerForm.log("InnerFormValidation:", "LenMax started", x);
    return x;
}

jQuery.fn.cepAutoComplete = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.searchViaCEP(
            jQuery(this).val(),
            jQuery(".autocomplete.homenum").val() || jQuery(".autocomplete.homenumber").val() || jQuery(".autocomplete.number").val() || jQuery(".autocomplete.num").val(),
            jQuery(this).data('timeout') || 0
        );
    });
    window.innerForm.log("InnerFormValidation:", "Autocomplete for CEP started", x);
}

jQuery.fn.timeMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyTimeMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "TimeMask started", x);
    return x;
}

jQuery.fn.shortTimeMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyShortTimeMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "ShortTimeMask started", x);
    return x;

}

jQuery.fn.dateShortTimeMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyDateShortMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "DateShortTimeMask started", x);
    return x;
}

jQuery.fn.dateTimeMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyDateTimeMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "DateTimeMask started", x);
    return x;
}

jQuery.fn.alphaMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyAlphaMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "AlphaMask started", x);
    return x;
}

jQuery.fn.alphaNumericMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyAlphaNumericMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "AlphaNumericMask started", x);
    return x;
}


jQuery.fn.noSpaceMask = function () {
    let x = jQuery(this).on("input", function () {
        window.innerForm.applyNoSpaceMask(this);
    });
    window.innerForm.log("InnerFormValidation:", "NoSpaceMask started", x);
    return x;
}

jQuery.fn.maxLenMask = function () {
    let x = jQuery(this).on("input", function () {
        var array = jQuery(this)
            .attr("class")
            .split(" ")
            .filter(function (el) {
                return el != null && el != "";
            });
        var tam = parseInt(array[array.indexOf("len") + 1] || array[array.indexOf("maxlen") + 1]);
        if (!isNaN(tam)) {
            jQuery(this).attr("maxlength", tam);
            jQuery(this).val(
                jQuery(this)
                    .val()
                    .substring(0, tam + 1)
            );
        }
    });
    window.innerForm.log("InnerFormValidation:", "MaxLenMask started", x);
    return x;
}



jQuery.fn.leadingZeroMask = function () {
    let x = jQuery(this).on("blur", function () {
        var array = jQuery(this)
            .attr("class")
            .split(" ")
            .filter(function (el) {
                return el != null && el != "";
            });
        var tam = parseInt(array[array.indexOf("len") + 1] || array[array.indexOf("minlen") + 1]);
        if (!isNaN(tam)) {
            jQuery(this).val(
                window.innerForm.addLeadingZeros(jQuery(this).val(), tam)
            ).isValid();
        }
    });
    window.innerForm.log("InnerFormValidation:", "LeadingZeroMask started", x);
    return x;
}



window.innerForm.log('Loaded');
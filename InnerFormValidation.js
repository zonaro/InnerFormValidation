(function ($) {

    /**
     * InnerFormValidation Configuration and Functions
     */
    $.innerForm = $.innerForm || {};

    /**
     * Enables or disables verbose logging for debugging purposes.
     */
    $.innerForm.verbose = $.innerForm.verbose || false;

    /**
     * Timeout duration (in milliseconds) for input type events before triggering validation.
     */
    $.innerForm.onTypeTimeout = 900;

    $.innerForm.isDeleting = false;

    /**
     * Logs messages to the console when verbose mode is enabled.
     * @function log
     * @memberof $.innerForm
     * @param {...*} arguments - Arguments to log to console
     */
    $.innerForm.log = function () {
        if ($.innerForm.verbose) console.log("InnerFormValidation:", arguments);
    }

    /**
     * Logs error messages to the console when verbose mode is enabled.
     * @function error
     * @memberof $.innerForm
     * @param {...*} arguments - Arguments to log as error
     */
    $.innerForm.error = function () {
        if ($.innerForm.verbose) console.error("InnerFormValidation:", arguments);
    }

    /**
     * Logs warning messages to the console when verbose mode is enabled.
     * @function warn
     * @memberof $.innerForm
     * @param {...*} arguments - Arguments to log as warning
     */
    $.innerForm.warn = function () {
        if ($.innerForm.verbose) console.warn("InnerFormValidation:", arguments);
    }

    /**
     * Adds leading zeros to a number to reach the specified total length.
     * @function addLeadingZeros
     * @memberof $.innerForm
     * @param {string|number} num - The number to pad with zeros
     * @param {number} totalLength - The desired total length of the string
     * @returns {string} The padded string
     */
    $.innerForm.addLeadingZeros = function (num, totalLength) {
        num = num || ""
        num = jQuery.trim(`${num}`);
        if (!isNaN(num) && num < 0) {
            const withoutMinus = String(num).slice(1);
            return '-' + withoutMinus.padStart(totalLength, '0');
        }

        return String(num).padStart(totalLength, '0');
    }

    /**
     * Calculates the checksum for a barcode using standard algorithms.
     * @function barcodeCheckSum
     * @memberof $.innerForm
     * @param {string} code - The barcode string to calculate checksum for
     * @returns {number} The calculated checksum digit
     */
    $.innerForm.barcodeCheckSum = function (code) {
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

    /**
     * Validates time format (HH:MM or HH:MM:SS or MM:SS).
     * @function validateTime
     * @memberof $.innerForm
     * @param {string} value - The time string to validate
     * @param {boolean} [minutesSeconds=false] - If true, validates as MM:SS format
     * @returns {boolean} True if the time format is valid, false otherwise
     */
    $.innerForm.validateTime = function (value, minutesSeconds) {
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

    /**
     * Validates EAN (European Article Number) barcode format and checksum.
     * @function validateEAN
     * @memberof $.innerForm
     * @param {string} value - The EAN code to validate
     * @returns {boolean} True if the EAN is valid, false otherwise
     */
    $.innerForm.validateEAN = function (value) {
        value = value || ""
        if (!isNaN(value) && value.length > 1 && value.length <= 16) {
            let bar = value.slice(0, -1);
            let ver = value.slice(-1);
            return $.innerForm.barcodeCheckSum(bar) == ver;
        }
        return false;
    }

    /**
     * Calculates age based on birth date and reference date.
     * @function getAge
     * @memberof $.innerForm
     * @param {string|Date} birthDate - The birth date
     * @param {Date} [fromDate=new Date()] - Reference date to calculate age from
     * @returns {number} The calculated age in years
     */
    $.innerForm.getAge = function (birthDate, fromDate) {
        fromDate = fromDate || new Date();
        return Math.floor((fromDate - $.innerForm.parseDateInt(birthDate)) / 3.15576e+10);
    };

    /**
     * Validates that a value does not contain any of the specified characters.
     * @function validateNotChar
     * @memberof $.innerForm
     * @param {string} value - The input value to check
     * @param {string} chars - String of characters that should not be present
     * @returns {boolean} True if none of the characters are found, false otherwise
     */
    $.innerForm.validateNotChar = function (value, chars) {
        chars = chars.split("");
        for (var i = 0; i < chars.length; i++) {
            if (value.indexOf(chars[i]) >= 0) {
                return false;
            }
        }
        return true;
    };

    /**
     * Validates if a value is a valid UUID (Universally Unique Identifier).
     * Accepts both RFC 4122 compliant UUIDs and more flexible GUID formats.
     * @function validateUUID
     * @memberof $.innerForm
     * @param {string} value - The UUID string to validate
     * @returns {boolean} True if the value is a valid UUID, false otherwise
     */
    $.innerForm.validateUUID = function (value) {
        value = value || "";
        // More flexible UUID pattern that accepts any hexadecimal characters
        // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        var uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return value != "00000000-0000-0000-0000-000000000000" && uuidPattern.test(value);
    };

    /**
     * Validates latitude coordinate values.
     * @function validateLatitude
     * @memberof $.innerForm
     * @param {string} value - The latitude value to validate
     * @returns {boolean} True if the value is a valid latitude (-90 to +90), false otherwise
     */
    $.innerForm.validateLatitude = function (value) {
        value = value || "";

        // Remove espaços e substitui vírgula por ponto
        value = value.trim().replace(',', '.');

        // Verifica se é um número válido
        var numValue = parseFloat(value);

        // Valida se é um número e está dentro dos limites da latitude
        return !isNaN(numValue) && numValue >= -90 && numValue <= 90;
    };

    /**
     * Validates longitude coordinate values.
     * @function validateLongitude
     * @memberof $.innerForm
     * @param {string} value - The longitude value to validate
     * @returns {boolean} True if the value is a valid longitude (-180 to +180), false otherwise
     */
    $.innerForm.validateLongitude = function (value) {
        value = value || "";

        // Remove espaços e substitui vírgula por ponto
        value = value.trim().replace(',', '.');

        // Verifica se é um número válido
        var numValue = parseFloat(value);

        // Valida se é um número e está dentro dos limites da longitude
        return !isNaN(numValue) && numValue >= -180 && numValue <= 180;
    };

    /**
     * Validates coordinate pairs in various formats.
     * @function validateCoordinate
     * @memberof $.innerForm
     * @param {string} value - The coordinate value to validate (e.g., "lat,lng" or "lat lng")
     * @returns {boolean} True if the value contains valid coordinates, false otherwise
     */
    $.innerForm.validateCoordinate = function (value) {
        value = value || "";

        // Remove espaços extras e substitui vírgulas por pontos nos decimais
        value = value.trim();

        // Tenta diferentes formatos de separação
        var coords = [];
        if (value.includes(',')) {
            coords = value.split(',');
        } else if (value.includes(' ')) {
            coords = value.split(/\s+/);
        } else if (value.includes(';')) {
            coords = value.split(';');
        } else {
            return false; // Formato não reconhecido
        }

        // Deve ter exatamente 2 coordenadas
        if (coords.length !== 2) {
            return false;
        }

        var lat = coords[0].trim().replace(',', '.');
        var lng = coords[1].trim().replace(',', '.');

        // Valida ambas as coordenadas
        return $.innerForm.validateLatitude(lat) && $.innerForm.validateLongitude(lng);
    };

    /**
     * Validates that a value contains at least one of the specified characters.
     * @function validateAnyChar
     * @memberof $.innerForm
     * @param {string} value - The input value to check
     * @param {string} chars - String of characters where at least one should be present
     * @returns {boolean} True if any of the characters are found, false otherwise
     */
    $.innerForm.validateAnyChar = function (value, chars) {
        chars = chars.split("");
        var v = [];
        for (var i = 0; i < chars.length; i++) {
            if (value.indexOf(chars[i]) >= 0) {
                v.push(true);
            }
        }
        return v.indexOf(true) >= 0;
    };

    /**
     * Validates that a value contains all of the specified characters.
     * @function validateAllChar
     * @memberof $.innerForm
     * @param {string} value - The input value to check
     * @param {string} chars - String of characters that must all be present
     * @returns {boolean} True if all characters are found, false otherwise
     */
    $.innerForm.validateAllChar = function (value, chars) {
        chars = chars.split("");
        var v = [];
        for (var i = 0; i < chars.length; i++) {
            if (value.indexOf(chars[i]) >= 0) {
                v.push(true);
            } else { v.push(false); }
        }
        return v.indexOf(false) < 0;
    };

    /**
     * Validates if a date string represents a valid date.
     * @function validDate
     * @memberof $.innerForm
     * @param {string} value - The date string to validate (DD/MM/YYYY format)
     * @returns {boolean} True if the date is valid, false otherwise
     */
    $.innerForm.validDate = function (value) {
        var datenumber = $.innerForm.parseDateInt(value);
        return datenumber != null && !isNaN(datenumber);
    }

    /**
     * Parses a date string and returns a int object.
     * @function parseDate
     * @memberof $.innerForm
     * @param {string} value - The date string to parse (DD/MM/YYYY or MM/YYYY format)
     * @returns {Date|null} The parsed Date object or null if invalid
     */
    $.innerForm.parseDateInt = function (value) {
        var dt = 0;
        var d = 0;
        var m = 0;
        var y = 0;
        var comp = value.split(" ")[0].split("/") ?? value.split("/");
        if (comp.length == 3) {
            comp[2] = comp[2].length == 2 ? $.innerForm.expandYear(comp[2]) : comp[2];
            d = parseInt(comp[0], 10);
            m = parseInt(comp[1], 10) - 1;
            y = parseInt(comp[2], 10);
        }
        if (comp.length == 2) {
            comp[1] = comp[1].length == 2 ? $.innerForm.expandYear(comp[1]) : comp[1];
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
     * Parses a date string and returns a Date object.
     * @function parseDate
     * @memberof $.innerForm
     * @param {string} value - The date string to parse (DD/MM/YYYY or MM/YYYY format)
     * @returns {Date|null} The parsed Date object or null if invalid
     */
    $.innerForm.parseDate = function (value) {
        value = value || "";
        var datenumber = $.innerForm.parseDateInt(value);
        if (datenumber != null) {
            return new Date(datenumber);
        }
        return null;
    }
    /**
     * Validates a date range string in format "DD/MM/YYYY ~ DD/MM/YYYY"
     * @param {string} value - Date range string
     * @returns {boolean} True if both dates are valid and first date <= second date
     */
    $.innerForm.validDateRange = function (value) {
        if (!value || typeof value !== 'string') return false;

        var parts = value.split(' ~ ');
        if (parts.length !== 2) return false;

        var date1 = parts[0].trim();
        var date2 = parts[1].trim();

        // Validate both dates individually
        if (!$.innerForm.validDate(date1) || !$.innerForm.validDate(date2)) {
            return false;
        }

        // Parse both dates to compare
        var parsedDate1 = $.innerForm.parseDateInt(date1);
        var parsedDate2 = $.innerForm.parseDateInt(date2);

        // First date should be <= second date
        return parsedDate1 <= parsedDate2;
    }

    /**
     * Validates a month/year range string in format "MM/YYYY ~ MM/YYYY"
     * @param {string} value - Month/year range string
     * @returns {boolean} True if both month/years are valid and first <= second
     */
    $.innerForm.validMonthYearRange = function (value) {
        if (!value || typeof value !== 'string') return false;

        var parts = value.split(' ~ ');
        if (parts.length !== 2) return false;

        var monthYear1 = parts[0].trim();
        var monthYear2 = parts[1].trim();

        // Validate both month/years individually (add day 01 for validation)
        var testDate1 = "01/" + monthYear1;
        var testDate2 = "01/" + monthYear2;
        return $.innerForm.validDateRange(testDate1 + " ~ " + testDate2);
    }

    /**
     * Validates a short month/year range string in format "MM/YY ~ MM/YY"
     * @function validShortMonthYearRange
     * @memberof $.innerForm
     * @param {string} value - Short month/year range string  
     * @returns {boolean} True if both month/years are valid and first <= second
     */
    $.innerForm.validShortMonthYearRange = function (value) {
        if (!value || typeof value !== 'string') return false;

        var parts = value.split(' ~ ');
        if (parts.length !== 2) return false;

        var shortMonthYear1 = parts[0].trim();
        var shortMonthYear2 = parts[1].trim();

        // Convert short year format to full year and validate
        var comp1 = shortMonthYear1.split('/');
        var comp2 = shortMonthYear2.split('/');

        if (comp1.length !== 2 || comp2.length !== 2) return false;

        // Expand short years to full years
        var fullYear1 = $.innerForm.expandYear(parseInt(comp1[1], 10), 20, 5);
        var fullYear2 = $.innerForm.expandYear(parseInt(comp2[1], 10), 20, 5);

        var fullMonthYear1 = comp1[0] + "/" + fullYear1;
        var fullMonthYear2 = comp2[0] + "/" + fullYear2;

        return $.innerForm.validMonthYearRange(fullMonthYear1 + " ~ " + fullMonthYear2);
    }

    /**
     * Expands a short year (YY) to a full year (YYYY) based on the current century.
     * If the expanded year is outside the range of (currentYear - pastDistance) to (currentYear + futureDistance),
     * it is adjusted to the previous century.
     * @function expandYear
     * @memberof $.innerForm
     * @param {number} year - The short year to expand.
     * @param {number} pastDistance - The number of years to consider for the past.
     * @param {number} futureDistance - The number of years to consider for the future.
     * @returns {number} The expanded full year
     */
    $.innerForm.expandYear = function (year, pastDistance, futureDistance) {
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        pastDistance = pastDistance || (currentYear - century);
        futureDistance = futureDistance || 5;



        if ($.innerForm.isNumber(pastDistance)) {
            pastDistance = parseInt(pastDistance, 10);
        } else {
            pastDistance = currentYear - century;
        }

        if ($.innerForm.isNumber(futureDistance)) {
            futureDistance = parseInt(futureDistance, 10);
        } else {
            futureDistance = 5;
        }

        if ($.innerForm.isNumber(year)) {
            year = parseInt(year, 10);
        } else {
            $.innerForm.warn("Invalid year:", year);
            year = new Date().getFullYear();
        }

        if (year < 0) year = -year;

        if (year >= 1000) {
            return year;
        }


        if (year > 99 && year <= 999) {
            year = century + year;
            year -= 1000;
            return year;
        } else {
            year = century + year;
        }

        let limitBefore = (currentYear - pastDistance);
        let limitAfter = (currentYear + futureDistance);
        /// se o ano digitado estiver fora do range, então é do século anterior
        if (year < limitBefore || year > limitAfter) {
            year -= 100;
        }

        return year;

    }

    /**
     * Applies a UUID mask to an input field, formatting it as a standard UUID.
     * @function applyUUIDMask
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyUUIDMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";
        text = text.replace(/[^a-zA-Z0-9]/g, '');
        /// add dashes during type
        text = text.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
        if (text.length > 36) {
            text = text.substring(0, 36);
            input.maxLength = 36;
        }
        input.value = text;
    }

    /**
     * Applies a latitude mask to format and validate latitude coordinates.
     * @function applyLatitudeMask
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyLatitudeMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";

        // Remove caracteres inválidos, mantendo apenas números, ponto, vírgula e sinal de menos
        text = text.replace(/[^0-9.,-]/g, '');

        // Substitui vírgula por ponto
        text = text.replace(',', '.');

        // Garante apenas um sinal de menos no início
        if (text.indexOf('-') > 0) {
            text = text.replace(/-/g, '');
        }
        if (text.split('-').length > 2) {
            text = text.substring(0, text.lastIndexOf('-'));
        }

        // Garante apenas um ponto decimal
        var dotIndex = text.indexOf('.');
        if (dotIndex !== -1) {
            text = text.substring(0, dotIndex + 1) + text.substring(dotIndex + 1).replace(/\./g, '');
        }

        // Limita casas decimais baseado na classe 'precision'
        var classes = (input.className || '').split(' ');
        var precisionIndex = classes.indexOf('precision');
        var precision = 6; // padrão
        if (precisionIndex !== -1 && classes[precisionIndex + 1]) {
            precision = parseInt(classes[precisionIndex + 1]) || 6;
        }

        if (dotIndex !== -1 && text.length > dotIndex + precision + 1) {
            text = text.substring(0, dotIndex + precision + 1);
        }

        // Valida limites de latitude (-90 a +90)
        var numValue = parseFloat(text);
        if (!isNaN(numValue)) {
            if (numValue > 90) {
                text = "90";
            } else if (numValue < -90) {
                text = "-90";
            }
        }

        input.value = text;
    };

    /**
     * Applies a longitude mask to format and validate longitude coordinates.
     * @function applyLongitudeMask
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyLongitudeMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";

        // Remove caracteres inválidos, mantendo apenas números, ponto, vírgula e sinal de menos
        text = text.replace(/[^0-9.,-]/g, '');

        // Substitui vírgula por ponto
        text = text.replace(',', '.');

        // Garante apenas um sinal de menos no início
        if (text.indexOf('-') > 0) {
            text = text.replace(/-/g, '');
        }
        if (text.split('-').length > 2) {
            text = text.substring(0, text.lastIndexOf('-'));
        }

        // Garante apenas um ponto decimal
        var dotIndex = text.indexOf('.');
        if (dotIndex !== -1) {
            text = text.substring(0, dotIndex + 1) + text.substring(dotIndex + 1).replace(/\./g, '');
        }

        // Limita casas decimais baseado na classe 'precision'
        var classes = (input.className || '').split(' ');
        var precisionIndex = classes.indexOf('precision');
        var precision = 6; // padrão
        if (precisionIndex !== -1 && classes[precisionIndex + 1]) {
            precision = parseInt(classes[precisionIndex + 1]) || 6;
        }

        if (dotIndex !== -1 && text.length > dotIndex + precision + 1) {
            text = text.substring(0, dotIndex + precision + 1);
        }

        // Valida limites de longitude (-180 a +180)
        var numValue = parseFloat(text);
        if (!isNaN(numValue)) {
            if (numValue > 180) {
                text = "180";
            } else if (numValue < -180) {
                text = "-180";
            }
        }

        input.value = text;
    };

    /**
     * Applies a mask that removes all spaces from the input.
     * @function applyNoSpaceMask
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyNoSpaceMask = function (input = new HTMLInputElement()) {
        input.value = input.value
            .replace(/[ ]+/g, '');
    };

    /**
     * Applies an alphabetic mask that allows only letters and spaces.
     * @function applyAlphaMask
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyAlphaMask = function (input = new HTMLInputElement()) {
        input.value = input.value
            .replace(/[!@#$%¨&*()_+\d\-=¹²³£¢¬§´[`{\/?°ª~\]^}º\\,.;|<>:₢«»"'¶¿®þ]/g, '')
            .replace(/[ ]+/g, ' ');

    };

    /**
     * Applies an alphanumeric mask that allows letters, numbers, and spaces.
     * @function applyAlphaNumericMask  
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyAlphaNumericMask = function (input = new HTMLInputElement()) {
        input.value = input.value
            .replace(/[!@#$%¨&*()_+\-=¹²³£¢¬§´[`{\/?°ª~\]^}º\\,.;|<>:₢«»"'¶¿®þ]/g, '')
            .replace(/[ ]+/g, ' ');

    };

    /**
     * Applies a phone number mask (Brazilian format).
     * @function applyPhoneMask
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyPhoneMask = function (input = new HTMLInputElement()) {
        var value = input.value;
        value = value.replace(/\D/g, "");
        value = value.replace(/^(\d{4})(\d{1,4})$/g, "$1-$2");
        value = value.replace(/^(\d{5})(\d{1,4})$/g, "$1-$2");
        value = value.replace(/^(\d{2})(\d{4})(\d{1,4})$/g, "($1) $2-$3");
        value = value.replace(/^(\d{2})(\d{5})(\d{1,4})$/g, "($1) $2-$3");
        input.maxLength = 15;
        input.value = value;

    };

    $.innerForm.applyUpperMask = function (input = new HTMLInputElement()) {
        input.value = input.value.toUpperCase();
    };

    $.innerForm.applyLowerMask = function (input = new HTMLInputElement()) {
        input.value = input.value.toLowerCase();
    };

    $.innerForm.applyDateMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";
        if ($.innerForm.isDeleting == false) {
            text = $.innerForm.formatDate(text);
        }
        if (/^[\d]{2}\/[\d]{2}\/[\d]{4}$/g.test(text)) {
            input.maxLength = text.length;
        }
        input.value = text;
    };



    /**
     * Formats a date string by adding separators (DD/MM/YYYY format).
     * @function formatDate
     * @memberof $.innerForm
     * @param {string} text - The date string to format
     * @returns {string} The formatted date string
     */
    $.innerForm.formatDate = function (text) {
        text = text || "";
        text = $.innerForm.parseDatePartial(text);
        // remove tudo que nao for numero ou barra
        text = text.replace(/[^\d\/]/g, "");
        if (text.length > 10) text = text.substring(0, 10);
        return text;
    }



    /**
     * Applies a date-time mask (DD/MM/YYYY HH:MM:SS format).
     * @function applyDateTimeMask
     * @memberof $.innerForm
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    $.innerForm.applyDateTimeMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4})(\d+)$/g, "$1 $2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2})(\d+)$/g, "$1:$2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})(\d+)$/g, "$1:$2");
        input.value = value;
        input.maxLength = 19;

    };

    $.innerForm.applyDateShortMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4})(\d+)$/g, "$1 $2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2})(\d+)$/g, "$1:$2");
        input.value = value;
        input.maxLength = 16;

    };

    $.innerForm.applyTimeMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d+)$/g, "$1:$2");
        input.value = value.replace(/^(\d{2}:\d{2})(\d{1,2})$/g, "$1:$2");
        input.maxLength = 8;

    };

    $.innerForm.applyShortTimeMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        input.value = value.replace(/^(\d{2})(\d{1,2})$/g, "$1:$2");
        input.maxLength = 5;

    };


    $.innerForm.applyCPForCNPJMask = function (input = new HTMLInputElement()) {
        var value = input.value;
        value = value.replace(/\D/g, "");
        if (value.length <= 11) {
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


    $.innerForm.applyCPFMask = function (input = new HTMLInputElement()) {
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


    $.innerForm.applyCEPMask = function (input = new HTMLInputElement()) {
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


    /**
    * Applies a CNPJ mask to format the input as a CNPJ number.
    * @function applyCNPJMask
    * @memberof $.innerForm
    * @param {*} input 
    */
    $.innerForm.applyCNPJMask = function (input = new HTMLInputElement()) {
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


    $.innerForm.applyCreditCardMask = function (input = new HTMLInputElement()) {
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

    $.innerForm.isNumber = function (n) {
        if (n === null || n === undefined) return false;
        if (typeof n === "string") n = n.trim();
        try {
            n = parseFloat(n);
            return !isNaN(n) && isFinite(n);
        } catch (error) {
            return false;
        }
    }


    /**
     * Aplica máscara numérica considerando separador de milhares, decimal e casas decimais.
     * @param {HTMLInputElement} input 
     */
    $.innerForm.applyNumberMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";
        var sep = input.getAttribute("data-separator");
        var dec = input.getAttribute("data-decimal");
        var thousand = input.getAttribute("data-thousand");
        var hasSep = typeof sep === "string" && sep.length > 0;
        var hasDec = typeof dec === "string" && dec.length > 0 && !isNaN(dec);
        var hasThousand = typeof thousand === "string" && thousand.length > 0;
        if (!hasSep && !hasDec) {
            // Inteiro
            text = text.replace(/\D/g, "");
            if (hasThousand && thousand !== sep) {
                // Adiciona separador de milhar
                text = text.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
            }
            input.value = text;
            return;
        }
        // Definir separador e casas decimais
        if (!hasSep && hasDec) sep = ",";
        if (hasSep && !hasDec) dec = "2";
        if (hasSep && hasDec) { /* ok */ }
        var sepRegex = sep.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        var thousandRegex = hasThousand ? thousand.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') : null;
        // Remove tudo exceto dígitos, separador decimal e de milhar
        var re = hasThousand ? new RegExp("[^\\d" + sepRegex + thousandRegex + "]", "g") : new RegExp("[^\\d" + sepRegex + "]", "g");
        text = text.replace(re, "");
        // Permitir só um separador decimal
        var first = text.indexOf(sep);
        if (first !== -1) {
            var before = text.substring(0, first + 1);
            var after = text.substring(first + 1).replaceAll(sep, "");
            text = before + after;
        }
        // Limitar casas decimais
        if (first !== -1 && dec > 0) {
            var decs = text.substring(first + 1);
            if (decs.length > dec) {
                decs = decs.substring(0, dec);
                text = text.substring(0, first + 1) + decs;
            }
        }
        // Adicionar separador de milhar
        if (hasThousand && thousand !== sep) {
            var intPart = first !== -1 ? text.substring(0, first) : text;
            var decPart = first !== -1 ? text.substring(first) : "";
            intPart = intPart.replace(new RegExp(thousandRegex, 'g'), '');
            intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
            text = intPart + decPart;
        }
        input.value = text;
    };

    $.innerForm.applyMonthYearMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";
        if ($.innerForm.isDeleting == false) {
            text = $.innerForm.parseMonthYearPartial(text);
        }
        if (/^[\d]{2}\/[\d]{2}\/[\d]{4}$/g.test(text)) {
            input.maxLength = text.length;
        }
        input.value = text;

    };

    /**
     * Apply a date range mask to an input field.
     * The expected format is "DD/MM/YYYY ~ DD/MM/YYYY".
     * @param {HTMLInputElement} input 
     */
    $.innerForm.applyDateRangeMask = function (input = new HTMLInputElement()) {
        if ($.innerForm.isDeleting == true) {
            return;
        }
        // formato DD/MM/AAAA ~ DD/MM/AAAA
        var text = input.value || "";
        // Manter apenas dígitos, barras, ~ e espaços
        text = text.replace(/[^\d\/~\s]/g, "");
        text = text.replace(/\s+/g, " "); // Normalizar espaços

        // Remover múltiplos tildes
        text = text.replace(/~+/g, "~");

        text = $.innerForm.parseDatePartial(text);

        if (text.length > 23) text = text.substring(0, 23);

        // se tiver o tilde, processa a segunda data
        if (text.includes("~")) {
            var parts = text.split("~");
            var part1 = parts[0] ? parts[0].trim() : "";
            var part2 = parts[1] ? parts[1].trim() : "";


            var date1 = $.innerForm.parseDate(part1);
            var date2 = $.innerForm.parseDate(part2);

            if (date1 && date2) {
                if (date1 > date2) {
                    part1 = `${date2.getDate().toString().padStart(2, '0')}/${(date2.getMonth() + 1).toString().padStart(2, '0')}/${date2.getFullYear()}`;
                    part2 = `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()}`;
                }
            }

            text = part1 + " ~ " + part2;
        }


        input.value = text;

    }

    /**
     * Parses and formats a partial short month/year string "MM/YY" during input.
     * @param {string} part - The partial short month/year string to parse
     * @returns {string} The formatted short month/year string
     */
    $.innerForm.parseShortMonthYearPartial = function (part) {
        part = part || "";

        // remove tudo que nao for numero, barra ou espaco ou tilde
        part = part.replace(/[^\d\/ ~]/g, "");

        // normaliza os espacos
        part = part.replace(/\s+/g, " ");

        if (part.length > 13) part = part.substring(0, 13); // "MM/YY ~ MM/YY"

        // Se a string está vazia ou tem apenas separadores, retorna vazio
        if (part === "" || /^[\/ ~]*$/.test(part)) {
            return "";
        }

        // primeiro digito do mes, deve ser 0 ou 1
        if (part.length == 1) {
            if (part != "0" && part != "1") {
                if ($.innerForm.isNumber(part)) {
                    part = "0" + part;
                }
            }
        }

        // segundo digito do mes, limita a 12
        if (part.length == 2) {
            if (!$.innerForm.isNumber(part[1])) {
                part = "0" + part[0];
            }
            var month = parseInt(part);
            if (month > 12) {
                part = "12";
            }
            // Só adiciona barra se ainda não termina com barra
            if (!part.endsWith("/")) {
                part = part + "/";
            }
        }

        // terceiro digito tem que ser uma barra ou numero, se for numero adiciona a barra antes dele
        if (part.length == 3) {
            if (part[2] == "/") {
                // Se já tem barra, mantém
                return part;
            } else if ($.innerForm.isNumber(part[2])) {
                part = part.substring(0, 2) + "/" + part[2];
            } else {
                part = part.substring(0, 2) + "/";
            }
        }

        // quarto e quinto digito, ano (YY), aceita qualquer digito numerico
        if (part.length == 4 || part.length == 5) {
            if (!$.innerForm.isNumber(part[part.length - 1])) {
                part = part.substring(0, part.length - 1);
            }
        }

        // se o proximo digito for espaco ou tilde, ajusta para " ~ "
        if (part.length == 6) {
            if ($.innerForm.isNumber(part[5])) {
                //se for numero, é o primeiro digito da proxima data, entao adiciona o espaco e o tilde antes dele
                part = part.substring(0, 5) + " ~ " + part[5];
            } else if (part[5] == " " || part[5] == "~") {
                // Se já tem espaço ou tilde, verifica se deve expandir para " ~ "
                if (!part.endsWith(" ~ ")) {
                    part = part.substring(0, 5) + " ~ ";
                }
            } else {
                part = part.substring(0, 5);
            }
        }

        // se passou de 8 é porque começou uma segunda data
        if (part.length >= 8) {
            var part2 = part.substring(8, part.length);
            part2 = $.innerForm.parseShortMonthYearPartial(part2);
            part = part.substring(0, 8) + part2;
        }

        return part;
    }

    /**
     * Parses and formats a partial month/year string "MM/YYYY" during input.
     * @param {string} part - The partial month/year string to parse
     * @returns {string} The formatted month/year string
     */
    $.innerForm.parseMonthYearPartial = function (part) {
        part = part || "";

        // remove tudo que nao for numero, barra ou espaco ou tilde
        part = part.replace(/[^\d\/ ~]/g, "");

        // normaliza os espacos
        part = part.replace(/\s+/g, " ");

        if (part.length > 17) part = part.substring(0, 17); // "MM/YYYY ~ MM/YYYY"

        // Se a string está vazia ou tem apenas separadores, retorna vazio
        if (part === "" || /^[\/ ~]*$/.test(part)) {
            return "";
        }

        // primeiro digito do mes, deve ser 0 ou 1
        if (part.length == 1) {
            if (part != "0" && part != "1") {
                if ($.innerForm.isNumber(part)) {
                    part = "0" + part;
                }
            }
        }

        // segundo digito do mes, limita a 12
        if (part.length == 2) {
            if (!$.innerForm.isNumber(part[1])) {
                part = "0" + part[0];
            }
            var month = parseInt(part);
            if (month > 12) {
                part = "12";
            }
            // Só adiciona barra se ainda não termina com barra
            if (!part.endsWith("/")) {
                part = part + "/";
            }
        }

        // terceiro digito tem que ser uma barra ou numero, se for numero adiciona a barra antes dele
        if (part.length == 3) {
            if (part[2] == "/") {
                // Se já tem barra, mantém
                return part;
            } else if ($.innerForm.isNumber(part[2])) {
                part = part.substring(0, 2) + "/" + part[2];
            } else {
                part = part.substring(0, 2) + "/";
            }
        }

        // do quarto e quinto digito, ano, aceita qualquer digito numerico
        if (part.length == 4 || part.length == 5) {
            if (!$.innerForm.isNumber(part[part.length - 1])) {
                part = part.substring(0, part.length - 1);
            }
        }
        // sexto tem que ser 1 numero ou espaco. se for espaco adiciona 20 ou 19 antes dos 2 digitos do ano digitados
        if (part.length == 6) {
            if (part[5] == " ") {
                var shortYear = part.substring(3, 5);
                var fullYear = $.innerForm.expandYear(shortYear);
                part = part.substring(0, 3) + fullYear;
            }
        }

        // setimo tem que ser 1 numero ou espaco. se for espaco adiciona 2 ou 1 antes dos 3 digitos do ano digitados
        if (part.length == 7) {
            if (part[6] == " ") {
                var shortYear = part.substring(3, 5);
                var fullYear = $.innerForm.expandYear(shortYear);
                part = part.substring(0, 3) + fullYear;
            }
        }

        // se o proximo digito for espaco ou tilde, ajusta para " ~ "
        if (part.length == 8) {
            if ($.innerForm.isNumber(part[7])) {
                //se for numero, é o primeiro digito da proxima data, entao adiciona o espaco e o tilde antes dele
                part = part.substring(0, 7) + " ~ " + part[7];
            } else if (part[7] == " " || part[7] == "~") {
                // Se já tem espaço ou tilde, verifica se deve expandir para " ~ "
                if (!part.endsWith(" ~ ")) {
                    part = part.substring(0, 7) + " ~ ";
                }
            } else {
                part = part.substring(0, 7);
            }
        }

        // se passou de 10 é porque começou uma segunda data
        if (part.length >= 10) {
            var part2 = part.substring(10, part.length);
            part2 = $.innerForm.parseMonthYearPartial(part2);
            part = part.substring(0, 10) + part2;
        }

        return part;
    }

    /**
     * Parses and formats a partial date string "DD/MM/YYYY" during input.
     * @param {*} part 
     * @returns 
     */
    $.innerForm.parseDatePartial = function (part) {
        part = part || "";

        // remove tudo que nao for numero, barra ou espaco ou tilde
        part = part.replace(/[^\d\/ ~]/g, "");

        // normaliza os espacos
        part = part.replace(/\s+/g, " ");

        if (part.length > 23) part = part.substring(0, 23);

        // Se a string está vazia ou tem apenas separadores, retorna vazio
        if (part === "" || /^[\/ ~]*$/.test(part)) {
            return "";
        }

        // primeiro digito
        if (part.length == 1) {
            if (part != "0" && part != "1" && part != "2" && part != "3") {
                if ($.innerForm.isNumber(part)) {
                    part = "0" + part;
                }
            }
        }

        // segundo digito, limita a 31
        if (part.length == 2) {
            if (!$.innerForm.isNumber(part[1])) {
                part = "0" + part[0];
            }
            if (parseInt(part) > 31) {
                part = "31";
            }
            // Só adiciona barra se ainda não termina com barra
            if (!part.endsWith("/")) {
                part = part + "/";
            }
        }

        /// terceiro digito tem que ser uma barra, 0 ou 1, se for 0 ou 1 adiciona a barra antes dele
        if (part.length == 3) {
            if (part[2] == "/") {
                // Se já tem barra, mantém
                return part;
            } else if (part[2] == "0" || part[2] == "1") {
                part = part.substring(0, 2) + "/" + part[2];
            } else if ($.innerForm.isNumber(part[2])) {
                part = "0" + part.substring(0, 2) + "/" + part[2];
            } else {
                part = part.substring(0, 2) + "/";
            }
        }

        // quarto digito, mes, primeiro numero tem que ser 0 ou 1
        if (part.length == 4) {
            if (part[3] == "0" || part[3] == "1") {
                //mantém
            }
            else if ($.innerForm.isNumber(part[3])) {
                part = part.substring(0, 3) + "0" + part[3];
            } else {
                part = part.substring(0, 3);
            }
        }

        // quinto digito, mes, segundo numero, limita a 12
        if (part.length == 5) {
            var m = part[3] + part[4];
            if (!$.innerForm.isNumber(part[4])) {
                part = part.substring(0, 4) + "0";
            }
            m = parseInt(m);
            if (m > 12) {
                part = part.substring(0, 3) + "12";
            }
            // Só adiciona barra se ainda não termina com barra
            if (!part.endsWith("/")) {
                part = part + "/";
            }
        }

        // sexto digito, tem que ser uma barra ou qualquer numero, se for numero adiciona a barra antes dele
        if (part.length == 6) {
            if (part[5] == "/") {
                // Se já tem barra, mantém
                return part;
            } else if (!$.innerForm.isNumber(part[5])) {
                part = part.substring(0, 5) + "/" + part[5];
            } else {
                part = part.substring(0, 5) + "/";
            }
        }

        // do setimo e oitavo digito, ano, aceita qualquer digito numerico
        if (part.length == 7 || part.length == 8) {
            if (!$.innerForm.isNumber(part[part.length - 1])) part = part.substring(0, part.length - 1);
        }

        // nona tem que ser 1 numero ou espaco. se for espaco adiciona 20 ou 19 antes dos 2 digitos do ano digitados
        if (part.length == 9) {
            if (part[8] == " ") {
                var shortYear = part.substring(6, 8);
                var fullYear = $.innerForm.expandYear(shortYear);
                part = part.substring(0, 6) + fullYear;
            }
        }

        // decima tem que ser 1 numero ou espaco. se for espaco adiciona 2 ou 1 antes dos 3 digitos do ano digitados
        if (part.length == 10) {
            if (part[9] == " ") {
                var shortYear = part.substring(6, 9);
                var fullYear = $.innerForm.expandYear(shortYear);
                part = part.substring(0, 6) + fullYear;
            }
        }

        // se o proximo digito for espaco ou tilde, ajusta para " ~ "
        if (part.length == 11) {
            if ($.innerForm.isNumber(part[10])) {
                //se for numero, é o primeiro digito da proxima data, entao adiciona o espaco e o tilde antes dele
                part = part.substring(0, 10) + " ~ " + part[10];
            } else if (part[10] == " " || part[10] == "~") {
                // Se já tem espaço ou tilde, verifica se deve expandir para " ~ "
                if (!part.endsWith(" ~ ")) {
                    part = part.substring(0, 10) + " ~ ";
                }
            } else {
                part = part.substring(0, 10);
            }
        }

        // se passou de 13 é porque começou uma segunda data
        if (part.length >= 13) {
            var part2 = part.substring(13, part.length);
            part2 = $.innerForm.parseDatePartial(part2);
            part = part.substring(0, 13) + part2;
        }

        return part;
    }



    /**
     * Apply a month/year range mask to an input field.
     * The expected format is "MM/YYYY ~ MM/YYYY".
     * @param {HTMLInputElement} input 
     */
    $.innerForm.applyMonthYearRangeMask = function (input = new HTMLInputElement()) {
        if ($.innerForm.isDeleting == true) {
            return;
        }
        // formato MM/AAAA ~ MM/AAAA
        var text = input.value || "";
        // Manter apenas dígitos, barras, ~ e espaços
        text = text.replace(/[^\d\/~\s]/g, "");
        text = text.replace(/\s+/g, " "); // Normalizar espaços

        // Remover múltiplos tildes
        text = text.replace(/~+/g, "~");

        text = $.innerForm.parseMonthYearPartial(text);

        if (text.length > 17) text = text.substring(0, 17);

        // se tiver o tilde, processa a segunda data
        if (text.includes("~")) {
            var parts = text.split("~");
            var part1 = parts[0] ? parts[0].trim() : "";
            var part2 = parts[1] ? parts[1].trim() : "";


            var date1 = $.innerForm.parseDate(part1);
            var date2 = $.innerForm.parseDate(part2);

            if (date1 && date2) {
                if (date1 > date2) {

                    part2 = `${$.innerForm.addLeadingZeros(date1.getMonth() + 1, 2)}/${date1.getFullYear()}`;
                    part1 = `${$.innerForm.addLeadingZeros(date2.getMonth() + 1, 2)}/${date2.getFullYear()}`;
                }
            }

            text = part1 + " ~ " + part2;
        }

        input.value = text;

    }



    /** * Apply a short month/year range mask to an input field.
     * The expected format is "MM/YY ~ MM/YY".
     * @param {HTMLInputElement} input 
     */
    $.innerForm.applyShortMonthYearRangeMask = function (input = new HTMLInputElement()) {
        if ($.innerForm.isDeleting == true) {
            return;
        }
        // formato MM/AA ~ MM/AA
        var text = input.value || "";
        // Manter apenas dígitos, barras, ~ e espaços
        text = text.replace(/[^\d\/~\s]/g, "");
        text = text.replace(/\s+/g, " "); // Normalizar espaços

        // Remover múltiplos tildes
        text = text.replace(/~+/g, "~");

        text = $.innerForm.parseShortMonthYearPartial(text);

        if (text.length > 13) text = text.substring(0, 13);

        // se tiver o tilde, processa a segunda data
        if (text.includes("~")) {
            var parts = text.split("~");
            var part1 = parts[0] ? parts[0].trim() : "";
            var part2 = parts[1] ? parts[1].trim() : "";

            var date1 = $.innerForm.parseDate(part1);
            var date2 = $.innerForm.parseDate(part2);

            if (date1 && date2) {
                if (date1 > date2) {
                    part2 = `${$.innerForm.addLeadingZeros(date1.getMonth() + 1, 2)}/${date1.getFullYear().toString().substring(2, 4)}`;
                    part1 = `${$.innerForm.addLeadingZeros(date2.getMonth() + 1, 2)}/${date2.getFullYear().toString().substring(2, 4)}`;
                }
            }
            text = part1 + " ~ " + part2;
        }

        input.value = text;
    }

    $.innerForm.checkLuhn = function (cardNumber) {
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

    $.innerForm.validateCardBrand = function (cardNumber) {
        cardNumber = cardNumber.replace(/[^0-9]+/g, "");
        var cards = {
            visa: /^4[0-9]{12}(?:[0-9]{3})/,
            mastercard: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
            elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
            maestro: /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/,
            diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
            amex: /^3[47][0-9]{13}/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
            hiper: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}/,
            aura: /^(5078\d{2})(\d{2})(\d{11})$/,
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

    $.innerForm.validateCPF = function (CPFNumber) {
        CPFNumber = CPFNumber.replace(/\D/g, "");
        CPFNumber = CPFNumber.replace(/\D/g, "");

        // Elimina CPFS invalidos conhecidos
        if (
            CPFNumber == "00000000000" ||
            CPFNumber == "11111111111" ||
            CPFNumber == "22222222222" ||
            CPFNumber == "33333333333" ||
            CPFNumber == "44444444444" ||
            CPFNumber == "55555555555" ||
            CPFNumber == "66666666666" ||
            CPFNumber == "77777777777" ||
            CPFNumber == "88888888888" ||
            CPFNumber == "99999999999" ||
            CPFNumber.length !== 11
        ) {
            return false;
        }

        var Soma = 0;
        var Resto = 0;

        for (x = 1; x <= 9; x++)
            Soma = Soma + parseInt(CPFNumber.substring(x - 1, x)) * (11 - x);
        Resto = (Soma * 10) % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        if (Resto != parseInt(CPFNumber.substring(9, 10))) {
            return false;
        }

        Soma = 0;
        for (x = 1; x <= 10; x++)
            Soma = Soma + parseInt(CPFNumber.substring(x - 1, x)) * (12 - x);
        Resto = (Soma * 10) % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        if (Resto != parseInt(CPFNumber.substring(10, 11))) {
            return false;
        }
        return true;
    }

    $.innerForm.validateCNPJ = function (CNPJNumber) {
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

    $.innerForm.validatePassword = function (input) {
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
        $.innerForm.log("replaceAll added to String.prototype");
    }


    $.innerForm.searchViaCEP = function (CEPNumber, homeNumber, delay, callbackFunction) {
        CEPNumber = CEPNumber || "";
        homeNumber = homeNumber || "";
        delay = delay || 0;
        callbackFunction = callbackFunction || function (o) { $.innerForm.log('No callback defined', o); }
        $.innerForm.log('Searching CEP', CEPNumber, homeNumber, delay);


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
                    $.innerForm.log("Getting info from ViaCEP...")

                },
                success: function (obj) {
                    obj["numero"] = obj["numero"] || "";
                    if (homeNumber != "") {
                        if (obj["numero"] == "") {
                            obj["numero"] = homeNumber;
                        } else {
                            obj["numero"] = ", " + homeNumber;
                        }
                    }

                    $.innerForm.log("ViaCEP Response", obj);

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
                    jQuery(".autocomplete.citystate:input")
                        .setOrReplaceVal(
                            obj.localidade +
                            " - " +
                            obj.uf
                        )
                        .change().focus();
                    jQuery(".autocomplete.fulladdress:input")
                        .setOrReplaceVal(
                            obj.logradouro + ', ' +
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

                    /// verifica se cidade ou estado são selects e se nao existe a opcao, adiciona
                    jQuery(".autocomplete.city:input").each(function () {
                        let val = obj.localidade || "";
                        if (jQuery(this).prop("tagName").toUpperCase() == "SELECT") {
                            $.innerForm.log("Setting city select to", val);
                            if (!jQuery(this).find("option[value='" + val + "']").length) {
                                jQuery(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                            //fire change to update any dependent selects
                        }
                        jQuery(this).val(val).change().focus();
                    });

                    jQuery(".autocomplete.state:input").each(function () {
                        let val = obj.uf || "";
                        if (jQuery(this).prop("tagName").toUpperCase() == "SELECT") {
                            $.innerForm.log("Setting state select to", val);
                            if (!jQuery(this).find("option[value='" + val + "']").length) {
                                jQuery(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                        }
                        jQuery(this).setOrReplaceVal(val).change().focus();
                    });

                    jQuery(".autocomplete.ibge:input").each(function () {
                        let val = obj.ibge || "";
                        if (jQuery(this).prop("tagName").toUpperCase() == "SELECT") {
                            $.innerForm.log("Setting ibge select to", val);
                            if (!jQuery(this).find("option[value='" + val + "']").length) {
                                jQuery(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                        }
                        jQuery(this).setOrReplaceVal(val).change().focus();
                    });

                    jQuery(".autocomplete.citystate:input").each(function () {
                        let val = (obj.localidade || "") + " - " + (obj.uf || "");
                        if (jQuery(this).prop("tagName").toUpperCase() == "SELECT") {
                            $.innerForm.log("Setting citystate select to", val);
                            if (!jQuery(this).find("option[value='" + val + "']").length) {
                                jQuery(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                        }
                        jQuery(this).setOrReplaceVal(val).change().focus();
                    });

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
                    jQuery(".autocomplete.citystate")
                        .not(":input")
                        .text(
                            obj.localidade + " - " + obj.uf
                        );
                    jQuery(".autocomplete.fulladdress")
                        .not(":input")
                        .text(
                            obj.logradouro + ', ' +
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
                        $.innerForm.error('Address not found');
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
                    $.innerForm.log("VIACEP error", xhr, ajaxOptions, thrownError);
                    setTimeout(function () {
                        jQuery(".autocomplete.address:input").focus();
                    }, delay);
                },
                complete: function () {
                    $.innerForm.log("VIACEP request completed");
                }
            });
        } else {
            $.innerForm.log("Awaiting a valid CEP", CEPNumber);
        }
    }

    /**
     * Sets a value to an input if that input is empty. If this input is not empty, set the value only if it does not contain the .noreplace class
     * @param {Object} value any input value 
     */
    jQuery.fn.setOrReplaceVal = function (value) {
        let valor = jQuery.trim(jQuery(this).val() || "");
        if (valor == "" || jQuery(this).is(".noreplace") == false) {
            jQuery(this).val(value).change();
        }
        return jQuery(this);
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
                        case "decimal":
                        case "money":
                        case "integer":
                        case "int":
                        case "num": {
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }

                            var sep = jQuery(this).attr("data-separator");
                            var dec = jQuery(this).attr("data-decimal");
                            var thousand = jQuery(this).attr("data-thousand");
                            var hasSep = typeof sep === "string" && sep.length > 0;
                            var hasDec = typeof dec === "string" && dec.length > 0 && !isNaN(dec);
                            var hasThousand = typeof thousand === "string" && thousand.length > 0;

                            if (urrentValid === 'integer' || currentValid === 'int') {
                                // Inteiro, ignora separador decimal
                                hasDec = false;
                                dec = "0";
                            }

                            if ((!hasSep && hasDec)) {
                                sep = ",";
                                hasSep = true;
                            }
                            if (hasSep && !hasDec) {
                                dec = "2";
                                hasDec = true;
                            }
                            if (!hasSep && !hasDec) {

                                if (currentValid === 'decimal' || currentValid === 'money') {
                                    // Decimal sem separador, assume 2 casas decimais
                                    dec = "2";
                                    sep = ",";
                                    hasSep = true;
                                    hasDec = true;
                                    hasThousand = currentValid === 'money'; // money usa milhar por padrão
                                } else {
                                    // Inteiro
                                    var reInt = hasThousand ? new RegExp("^([0-9]{1,3}(" + thousand.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "[0-9]{3})*)$", "g") : /^\d+$/g;
                                    results.push(reInt.test(value));
                                    break;
                                }

                            }
                            var sepRegex = sep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                            var thousandRegex = hasThousand ? thousand.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : null;
                            // Regex para validar número com separador de milhar, decimal e casas decimais
                            var regex;
                            if (hasThousand && thousand !== sep) {
                                regex = new RegExp("^([0-9]{1,3}(" + thousandRegex + "[0-9]{3})*)" + sepRegex + "?([0-9]{1," + dec + "})?$", "g");
                            } else {
                                regex = new RegExp("^\d+(" + sepRegex + "\d{1," + dec + "})?$", "g");
                            }
                            results.push(regex.test(value));
                            break;
                        }
                        case "ean":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validateEAN(value));
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
                            results.push($.innerForm.validDate(value));
                            break;
                        case "daterange":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validDateRange(value));
                            break;
                        case "monthyearrange":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validMonthYearRange(value));
                            break;
                        case "shortmonthyearrange":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validShortMonthYearRange(value));
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
                                results.push($.innerForm.validDate(comp[0]) && $.innerForm.validateTime(comp[1]));
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
                            results.push($.innerForm.validateTime(value, currentValid == "minutesecond"));
                            break;
                        case "month":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push(jQuery(this).isValid("int"));
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
                        case "cnpj":
                        case "cpf":
                            jQuery(this).removeAttr('data-doc');
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            if (currentValid == "cpf") {
                                const validCpf = $.innerForm.validateCPF(value);
                                results.push(validCpf);
                                if (validCpf) jQuery(this).attr('data-doc', 'cpf');
                            } else if (currentValid == "cnpj") {
                                const validCnpj = $.innerForm.validateCNPJ(value);
                                results.push(validCnpj);
                                if (validCnpj) jQuery(this).attr('data-doc', 'cnpj');
                            } else {
                                results.push(jQuery(this).isValid("cpf") || jQuery(this).isValid("cnpj"));
                            }
                            break;
                        case "debitcard":
                        case "creditcard":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            var vlu = $.innerForm.checkLuhn(value);

                            if (vlu) {
                                var flagcard = $.innerForm.validateCardBrand(value);
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
                                case "weak":
                                    strenght = 2;
                                    break;
                                case "veryweak":
                                    strenght = 1;
                                default:
                                    if (isNaN(strenght)) {
                                        strenght = 3;
                                    } else {
                                        strenght = parseInt(strenght);
                                    }
                                    break;
                            }

                            results.push($.innerForm.validatePassword(this) >= strenght);
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
                            if ((num.indexOf("today") || num.indexOf("/")) && $.innerForm.validDate(value)) {
                                value = $.innerForm.parseDateInt(value);
                                if (num == "today") {
                                    num = Date.now();
                                } else {
                                    num = $.innerForm.parseDateInt(num);
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

                            var valor1 = jQuery(this).val() || "";
                            valor1 = valor1.toString().replace("&nbsp;", " ");
                            if (valor2.toLowerCase() == "_space" || valor2.toLowerCase() == "_espaco" || valor2.toLowerCase() == "&nbsp;") {
                                valor2 = " ";
                            }

                            switch (currentValid) {
                                case "containsanychar":
                                case "containsanychars":
                                    results.push($.innerForm.validateAnyChar(valor1, valor2));
                                    break;
                                case "containschar":
                                case "containsallchar":
                                case "containsallchars":
                                    results.push($.innerForm.validateAllChar(valor1, valor2));
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
                                    results.push($.innerForm.validateNotChar(valor1, valor2));
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
                            var idade = $.innerForm.getAge(value);
                            results.push(idade >= parseInt(valids[i + 1]));
                            break;
                        case "maxage":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            var idade = $.innerForm.getAge(value);
                            results.push(idade <= parseInt(valids[i + 1]));
                            break;
                        case "age":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            var idade = $.innerForm.getAge(value);
                            results.push(idade == parseInt(valids[i + 1]));
                            break;
                        case "latitude":
                        case "lat":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validateLatitude(value));
                            break;
                        case "longitude":
                        case "long":
                        case "lng":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validateLongitude(value));
                            break;
                        case "coordinate":
                        case "coordinates":
                        case "coord":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validateCoordinate(value));
                            break;
                        case "uuid":
                        case "guid":
                            if (jQuery.trim(value) === "") {
                                results.push(true);
                                break;
                            }
                            results.push($.innerForm.validateUUID(value));
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
        jQuery(document).on("keydown", ":input", function (e) {
            if (e.key === "Backspace" || e.key === "Delete") {
                $.innerForm.isDeleting = true;
            } else {
                $.innerForm.isDeleting = false;
            }

        });
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
        jQuery(this).find(".mask.num, .mask.number, .mask.month, .mask.money, .mask.decimal, .mask.integer, .mask.int").numberMask();
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
        jQuery(this).find(".mask.uuid").uuidMask();
        jQuery(this).find(".mask.latitude, .mask.lat").latitudeMask();
        jQuery(this).find(".mask.longitude, .mask.long, .mask.lng").longitudeMask();

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
        time = time || $.innerForm.onTypeTimeout;
        let x = jQuery(this)
            .on("keyup", function () {
                var p = jQuery(this);
                p.removeClass("error");
                p.closest(".form-group").removeClass("has-error");
                if ($.innerForm.onTypeTimeoutFunction) {
                    clearTimeout($.innerForm.onTypeTimeoutFunction);
                }
                $.innerForm.onTypeTimeoutFunction = setTimeout(function () {
                    p.isValid();
                }, time);
            });
        $.innerForm.log("InnerFormValidation:", "Validation on Type started", x, "delay", time);
        return x;
    }

    /**
     * Fires validation when the input loses focus
     * @returns 
     */
    jQuery.fn.validateOnBlur = function () {
        return jQuery(this).validateOn("blur");
    }
    /**
     * Fires validation on the given event
     * @param {string} event 
     * @returns 
     */
    jQuery.fn.validateOn = function (event) {
        let x = jQuery(this)
            .on(event, function () {
                jQuery(this).isValid();
            });
        $.innerForm.log("InnerFormValidation:", "Validation on " + event + " started", x);
        return x;
    }

    jQuery.fn.validateOnChange = function () {
        return jQuery(this).validateOn("change");
    }


    jQuery.fn.phoneMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyPhoneMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "PhoneMask started", x);
        return x;
    }


    jQuery.fn.upperMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyUpperMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "UpperMask started", x);
        return x;
    }


    jQuery.fn.lowerMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyLowerMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "LowerMask started", x);
        return x;
    }

    jQuery.fn.cpfMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyCPFMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "CpfMask started", x);
        return x;
    }


    jQuery.fn.cepMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyCEPMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "CepMask started", x);
        return x;
    }


    jQuery.fn.cnpjMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyCNPJMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "CnpjMask started", x);
        return x;
    }

    jQuery.fn.cpfCnpjMask = function () {
        let x = jQuery(this).on('input', function () {
            $.innerForm.applyCPForCNPJMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "CpfCnpjMask started", x);
        return x;
    }


    jQuery.fn.creditCardMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyCreditCardMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "CreditCardMask started", x);
        return x;
    }

    jQuery.fn.dateMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyDateMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "DateMask started", x);
        return x;
    }

    jQuery.fn.monthYearMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyMonthYearMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "MonthYearMask started", x);
        return x;
    }

    jQuery.fn.numberMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyNumberMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "NumberMask started", x);
        return x;
    }

    jQuery.fn.dateRangeMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyDateRangeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "DateRangeMask started", x);
        return x;
    }

    jQuery.fn.shortMonthYearRangeMask = function () {

        let x = jQuery(this).on("input", function () {
            $.innerForm.applyShortMonthYearRangeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "ShortMonthYearRangeMask started", x);
        return x;

    }
    jQuery.fn.monthYearRangeMask = function () {

        let x = jQuery(this).on("input", function () {
            $.innerForm.applyMonthYearRangeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "MonthYearRangeMask started", x);
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
        $.innerForm.log("InnerFormValidation:", "LenMax started", x);
        return x;
    }

    jQuery.fn.cepAutoComplete = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.searchViaCEP(
                jQuery(this).val(),
                jQuery(".autocomplete.homenum").val() || jQuery(".autocomplete.homenumber").val() || jQuery(".autocomplete.number").val() || jQuery(".autocomplete.num").val(),
                jQuery(this).data('timeout') || 0
            );
        });
        $.innerForm.log("InnerFormValidation:", "Autocomplete for CEP started", x);
        return x;
    }

    jQuery.fn.timeMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyTimeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "TimeMask started", x);
        return x;
    }

    jQuery.fn.shortTimeMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyShortTimeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "ShortTimeMask started", x);
        return x;

    }

    jQuery.fn.dateShortTimeMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyDateShortMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "DateShortTimeMask started", x);
        return x;
    }

    jQuery.fn.dateTimeMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyDateTimeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "DateTimeMask started", x);
        return x;
    }

    jQuery.fn.alphaMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyAlphaMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "AlphaMask started", x);
        return x;
    }

    jQuery.fn.alphaNumericMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyAlphaNumericMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "AlphaNumericMask started", x);
        return x;
    }


    jQuery.fn.noSpaceMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyNoSpaceMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "NoSpaceMask started", x);
        return x;
    }

    jQuery.fn.uuidMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyUUIDMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "UUIDMask started", x);
        return x;
    }

    jQuery.fn.latitudeMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyLatitudeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "LatitudeMask started", x);
        return x;
    }

    jQuery.fn.longitudeMask = function () {
        let x = jQuery(this).on("input", function () {
            $.innerForm.applyLongitudeMask(this);
        });
        $.innerForm.log("InnerFormValidation:", "LongitudeMask started", x);
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
        $.innerForm.log("InnerFormValidation:", "MaxLenMask started", x);
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
                    $.innerForm.addLeadingZeros(jQuery(this).val(), tam)
                ).isValid();
            }
        });
        $.innerForm.log("InnerFormValidation:", "LeadingZeroMask started", x);
        return x;
    }

    /**
     * Obtém a localização atual do usuário usando a API de Geolocalização do navegador
     * @function getLocation
     * @memberof $.innerForm
     * @param {Object} [options] - Opções para a geolocalização
     * @param {number} [options.timeout=10000] - Tempo limite em milissegundos
     * @param {number} [options.maximumAge=60000] - Idade máxima aceitável para uma posição em cache (ms)
     * @param {boolean} [options.enableHighAccuracy=true] - Solicitar alta precisão
     * @returns {Promise} Promise que resolve com objeto contendo informações de localização
     */
    $.innerForm.getLocation = function (options) {
        return new Promise(function (resolve, reject) {
            // Verifica se a API de geolocalização está disponível
            if (!navigator.geolocation) {
                reject({
                    error: 'GEOLOCATION_NOT_SUPPORTED',
                    message: 'A geolocalização não é suportada neste navegador.'
                });
                return;
            }

            // Opções padrão
            var defaultOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            };

            // Mescla as opções fornecidas com as padrão
            var geoOptions = $.extend({}, defaultOptions, options || {});

            $.innerForm.log('Obtendo localização do usuário...', geoOptions);

            // Função de sucesso
            function onSuccess(position) {
                var coords = position.coords;
                var locationData = {
                    // Coordenadas principais
                    latitude: coords.latitude,
                    longitude: coords.longitude,

                    // Precisão
                    accuracy: coords.accuracy,
                    altitudeAccuracy: coords.altitudeAccuracy,

                    // Altitude (pode ser null)
                    altitude: coords.altitude,

                    // Direção e velocidade (podem ser null)
                    heading: coords.heading,
                    speed: coords.speed,

                    // Informações temporais
                    timestamp: position.timestamp,
                    formattedTime: new Date(position.timestamp).toLocaleString(),

                    // URLs úteis para mapas
                    googleMapsUrl: 'https://www.google.com/maps?q=' + coords.latitude + ',' + coords.longitude,
                    osmUrl: 'https://www.openstreetmap.org/?mlat=' + coords.latitude + '&mlon=' + coords.longitude + '&zoom=15',

                    // Informações formatadas para exibição
                    coordinates: coords.latitude.toFixed(6) + ', ' + coords.longitude.toFixed(6),
                    accuracyFormatted: Math.round(coords.accuracy) + ' metros'
                };

                // Preenche automaticamente os campos de latitude e longitude
                jQuery(".autocomplete.latitude:input, .autocomplete.lat:input")
                    .setOrReplaceVal(coords.latitude)
                    .change().focus();
                jQuery(".autocomplete.longitude:input, .autocomplete.long:input")
                    .setOrReplaceVal(coords.longitude)
                    .change().focus();

                // Preenche elementos não-input também
                jQuery(".autocomplete.latitude, .autocomplete.lat")
                    .not(":input")
                    .text(coords.latitude);
                jQuery(".autocomplete.longitude, .autocomplete.long")
                    .not(":input")
                    .text(coords.longitude);

                $.innerForm.log('Localização obtida com sucesso:', locationData);
                resolve(locationData);
            }

            // Função de erro
            function onError(error) {
                var errorInfo = {
                    code: error.code,
                    message: error.message
                };

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorInfo.error = 'PERMISSION_DENIED';
                        errorInfo.userMessage = 'Permissão negada pelo usuário para acessar a localização.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorInfo.error = 'POSITION_UNAVAILABLE';
                        errorInfo.userMessage = 'Informações de localização não estão disponíveis.';
                        break;
                    case error.TIMEOUT:
                        errorInfo.error = 'TIMEOUT';
                        errorInfo.userMessage = 'Tempo limite excedido ao tentar obter a localização.';
                        break;
                    default:
                        errorInfo.error = 'UNKNOWN_ERROR';
                        errorInfo.userMessage = 'Erro desconhecido ao obter a localização.';
                        break;
                }

                $.innerForm.error('Erro ao obter localização:', errorInfo);
                reject(errorInfo);
            }

            // Solicita a posição atual
            navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
        });
    };

    /**
     * Monitora continuamente a localização do usuário
     * @function watchLocation
     * @memberof $.innerForm  
     * @param {Function} callback - Função chamada a cada atualização de posição
     * @param {Function} [errorCallback] - Função chamada em caso de erro
     * @param {Object} [options] - Opções para a geolocalização
     * @returns {number} ID do watcher que pode ser usado para parar o monitoramento
     */
    $.innerForm.watchLocation = function (callback, errorCallback, options) {
        if (!navigator.geolocation) {
            if (errorCallback) {
                errorCallback({
                    error: 'GEOLOCATION_NOT_SUPPORTED',
                    message: 'A geolocalização não é suportada neste navegador.'
                });
            }
            return null;
        }

        var defaultOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000 // Para monitoramento, queremos dados mais frescos
        };

        var geoOptions = $.extend({}, defaultOptions, options || {});

        $.innerForm.log('Iniciando monitoramento de localização...', geoOptions);

        function onSuccess(position) {
            var coords = position.coords;
            var locationData = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy,
                altitudeAccuracy: coords.altitudeAccuracy,
                altitude: coords.altitude,
                heading: coords.heading,
                speed: coords.speed,
                timestamp: position.timestamp,
                formattedTime: new Date(position.timestamp).toLocaleString(),
                googleMapsUrl: 'https://www.google.com/maps?q=' + coords.latitude + ',' + coords.longitude,
                osmUrl: 'https://www.openstreetmap.org/?mlat=' + coords.latitude + '&mlon=' + coords.longitude + '&zoom=15',
                coordinates: coords.latitude.toFixed(6) + ', ' + coords.longitude.toFixed(6),
                accuracyFormatted: Math.round(coords.accuracy) + ' metros'
            };

            // Preenche automaticamente os campos de latitude e longitude
            jQuery(".autocomplete.latitude:input, .autocomplete.lat:input")
                .setOrReplaceVal(coords.latitude)
                .change().focus();
            jQuery(".autocomplete.longitude:input, .autocomplete.long:input")
                .setOrReplaceVal(coords.longitude)
                .change().focus();

            // Preenche elementos não-input também
            jQuery(".autocomplete.latitude, .autocomplete.lat")
                .not(":input")
                .text(coords.latitude);
            jQuery(".autocomplete.longitude, .autocomplete.long")
                .not(":input")
                .text(coords.longitude);

            callback(locationData);
        }

        function onError(error) {
            if (errorCallback) {
                var errorInfo = {
                    code: error.code,
                    message: error.message
                };

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorInfo.error = 'PERMISSION_DENIED';
                        errorInfo.userMessage = 'Permissão negada pelo usuário para acessar a localização.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorInfo.error = 'POSITION_UNAVAILABLE';
                        errorInfo.userMessage = 'Informações de localização não estão disponíveis.';
                        break;
                    case error.TIMEOUT:
                        errorInfo.error = 'TIMEOUT';
                        errorInfo.userMessage = 'Tempo limite excedido ao tentar obter a localização.';
                        break;
                    default:
                        errorInfo.error = 'UNKNOWN_ERROR';
                        errorInfo.userMessage = 'Erro desconhecido ao obter a localização.';
                        break;
                }

                errorCallback(errorInfo);
            }
        }

        return navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);
    };

    /**
     * Para o monitoramento de localização
     * @function clearLocationWatch
     * @memberof $.innerForm
     * @param {number} watchId - ID retornado por watchLocation
     */
    $.innerForm.clearLocationWatch = function (watchId) {
        if (watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
            $.innerForm.log('Monitoramento de localização parado:', watchId);
        }
    };

    $.innerForm.log('InnerFormValidation Loaded');
})(jQuery);
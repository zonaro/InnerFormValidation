(function (root) {

    var inputSelector = "input, select, textarea, button";
    var toArray = function (value) { return Array.prototype.slice.call(value || []); };
    var normalizeSelector = function (selector) {
        return selector.replace(/:input/g, inputSelector);
    };
    var select = function (selector, context) {
        context = context || (typeof document !== "undefined" ? document : null);
        if ((typeof document !== "undefined" && selector === document) || (typeof window !== "undefined" && selector === window)) return [selector];
        if (selector && selector.nodeType) return [selector];
        if (selector && selector.elements) return selector.elements;
        if (selector && selector.jquery) return toArray(selector);
        if (typeof selector !== "string") return [];
        if (!context || !context.querySelectorAll) return [];
        if (selector.indexOf(":input") >= 0) {
            return selector.split(",").reduce(function (result, part) {
                var cleanPart = part.trim().replace(/:input/g, "") || "*";
                return result.concat(toArray(context.querySelectorAll(cleanPart)).filter(function (element) {
                    return /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(element.tagName);
                }));
            }, []);
        }
        return toArray(context.querySelectorAll(normalizeSelector(selector)));
    };

    var matches = function (element, selector) {
        if (selector === ":checked") return !!element.checked;
        if (selector === ":input") return /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(element.tagName);
        if (selector.indexOf(":input") >= 0) return matches(element, selector.replace(/:input/g, "")) && /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(element.tagName);
        return element.matches(selector);
    };
    var query = function (selector, context) {
        var elements = Array.isArray(selector) ? selector : select(selector, context);
        var api = Object.create(InnerForm.fn);
        api.elements = elements;
        api.length = elements.length;
        for (var i = 0; i < elements.length; i++) api[i] = elements[i];
        return api;
    };

    /**
     * InnerForm is a lightweight DOM manipulation and validation library.
     * It provides methods for selecting elements, manipulating classes and attributes,
     * and handling form validation.
     */
    InnerForm = function (selector, context) { return query(selector, context); }
    InnerForm.fn = {};


    InnerForm.fn.each = function (callback) { this.elements.forEach(function (element, index) { callback.call(element, index, element); }); return this; }
    InnerForm.fn.find = function (selector) { var found = []; this.each(function () { found = found.concat(select(selector, this)); }); return query(found); }
    InnerForm.fn.get = function (index) { return index === undefined ? this.elements : this.elements[index]; }
    InnerForm.fn.first = function () { return query(this.elements.slice(0, 1)); }
    InnerForm.fn.not = function (selector) { return query(this.elements.filter(function (element) { return !matches(element, selector); })); }
    InnerForm.fn.is = function (selector) { return this.elements.some(function (element) { return matches(element, selector); }); }
    InnerForm.fn.closest = function (selector) { return query(this.elements.map(function (element) { return element.closest(selector); }).filter(Boolean)); }
    InnerForm.fn.addClass = function (name) { return this.each(function () { this.classList.add.apply(this.classList, name.split(/\s+/)); }); }
    InnerForm.fn.removeClass = function (name) { return this.each(function () { this.classList.remove.apply(this.classList, name.split(/\s+/)); }); }
    InnerForm.fn.hasClass = function (name) { return this.elements.some(function (element) { return element.classList.contains(name); }); }
    InnerForm.fn.attr = function (name, value) { if (value === undefined) return this.elements[0] ? this.elements[0].getAttribute(name) : undefined; return this.each(function () { this.setAttribute(name, value); }); }
    InnerForm.fn.removeAttr = function (name) { return this.each(function () { this.removeAttribute(name); }); }
    InnerForm.fn.prop = function (name, value) { if (value === undefined) return this.elements[0] ? this.elements[0][name] : undefined; return this.each(function () { this[name] = value; }); }
    InnerForm.fn.data = function (name, value) { name = name.replace(/^data-/, ""); if (value === undefined) return this.elements[0] ? this.elements[0].dataset[name] : undefined; return this.each(function () { this.dataset[name] = value; }); }
    InnerForm.fn.val = function (value) { if (value === undefined) return this.elements[0] && this.elements[0].value !== undefined ? this.elements[0].value : undefined; return this.each(function () { this.value = value; }); }
    InnerForm.fn.text = function (value) { if (value === undefined) return this.elements.map(function (element) { return element.textContent; }).join(""); return this.each(function () { this.textContent = value; }); }
    InnerForm.fn.append = function (html) { return this.each(function () { this.insertAdjacentHTML("beforeend", html); }); }
    InnerForm.fn.change = function () { return this.each(function () { this.dispatchEvent(new Event("change", { bubbles: true })); }); }
    InnerForm.fn.focus = function () { return this.each(function () { if (this.focus) this.focus(); }); }
    InnerForm.fn.on = function (event, selector, handler) { if (typeof selector === "function") { handler = selector; selector = null; } return this.each(function () { this.addEventListener(event, function (e) { if (!selector || matches(e.target, selector)) handler.call(e.target, e); }); }); }


    /**
     * Removes leading and trailing whitespace from a value or input.
     * @param {*} value - Value to trim
     * @returns {string} Trimmed value
     */
    InnerForm.trim = function (value) {
        //se for um input, da trim no input e retorna, senao trata como texto
        if (value instanceof HTMLInputElement || value instanceof HTMLTextAreaElement) {
            value.value = InnerForm.trim(value.value);
            return value;
        }
        //forca a conversão para string e trim
        return String(value || "").trim();
    };

    root.InnerForm = InnerForm;

    /**
     * Enables or disables verbose logging for debugging purposes.
     */
    InnerForm.verbose = false;

    /**
     * Timeout duration (in milliseconds) for input type events before triggering validation.
     */
    InnerForm.onTypeTimeout = 900;

    var isDeleting = false;

    /**
     * Logs messages to the console when verbose mode is enabled.
     * @function log
     * @memberof InnerFormValidation
     * @param {...*} arguments - Arguments to log to console
     */
    InnerForm.log = function () {
        if (InnerForm.verbose) console.log("InnerFormValidation:", arguments);
    }

    /**
     * Logs error messages to the console when verbose mode is enabled.
     * @function error
     * @memberof InnerFormValidation
     * @param {...*} arguments - Arguments to log as error
     */
    InnerForm.error = function () {
        if (InnerForm.verbose) console.error("InnerFormValidation:", arguments);
    }

    /**
     * Logs warning messages to the console when verbose mode is enabled.
     * @function warn
     * @memberof InnerFormValidation
     * @param {...*} arguments - Arguments to log as warning
     */
    InnerForm.warn = function () {
        if (InnerForm.verbose) console.warn("InnerFormValidation:", arguments);
    }

    /**
     * Adds leading zeros to a number to reach the specified total length.
     * @function addLeadingZeros
     * @memberof InnerFormValidation
     * @param {string|number} num - The number to pad with zeros
     * @param {number} totalLength - The desired total length of the string
     * @returns {string} The padded string
     */
    InnerForm.addLeadingZeros = function (num, totalLength) {
        num = num || ""
        num = InnerForm.trim(`${num}`);
        if (!isNaN(num) && num < 0) {
            const withoutMinus = String(num).slice(1);
            return '-' + withoutMinus.padStart(totalLength, '0');
        }

        return String(num).padStart(totalLength, '0');
    }

    /**
     * Calculates the checksum for a barcode using standard algorithms.
     * @function barcodeCheckSum
     * @memberof InnerFormValidation
     * @param {string} code - The barcode string to calculate checksum for
     * @returns {number} The calculated checksum digit
     */
    InnerForm.barcodeCheckSum = function (code) {
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
     * @memberof InnerFormValidation
     * @param {string} value - The time string to validate
     * @param {boolean} [minutesSeconds=false] - If true, validates as MM:SS format
     * @returns {boolean} True if the time format is valid, false otherwise
     */
    InnerForm.validateTime = function (value, minutesSeconds) {
        value = String(value || "");
        minutesSeconds = minutesSeconds || false;
        if (!/^\d{1,2}:\d{2}(?::\d{2})?$/.test(value)) return false;
        var comp = value.split(":");
        if (comp.length == 3) {
            minutesSeconds = false;
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
     * @memberof InnerFormValidation
     * @param {string} value - The EAN code to validate
     * @returns {boolean} True if the EAN is valid, false otherwise
     */
    InnerForm.validateEAN = function (value) {
        value = value || ""
        if (!isNaN(value) && value.length > 1 && value.length <= 16) {
            let bar = value.slice(0, -1);
            let ver = value.slice(-1);
            return InnerForm.barcodeCheckSum(bar) == ver;
        }
        return false;
    }

    /**
     * Calculates age based on birth date and reference date.
     * @function getAge
     * @memberof InnerFormValidation
     * @param {string|Date} birthDate - The birth date
     * @param {Date} [atDate=new Date()] - Reference date to calculate age at
     * @returns {number} The calculated age in years
     */
    InnerForm.getAge = function (birthDate, atDate) {
        atDate = atDate || new Date();
        return Math.floor((atDate - InnerForm.parseDateInt(birthDate)) / 3.15576e+10);
    };

    /**
     * Validates that a value does not contain any of the specified characters.
     * @function validateNotChar
     * @memberof InnerFormValidation
     * @param {string} value - The input value to check
     * @param {string} chars - String of characters that should not be present
     * @returns {boolean} True if none of the characters are found, false otherwise
     */
    InnerForm.validateNotChar = function (value, chars) {
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
     * @memberof InnerFormValidation
     * @param {string} value - The UUID string to validate
     * @returns {boolean} True if the value is a valid UUID, false otherwise
     */
    InnerForm.validateUUID = function (value) {
        value = value || "";
        // More flexible UUID pattern that accepts any hexadecimal characters
        // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        var uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return value != "00000000-0000-0000-0000-000000000000" && uuidPattern.test(value);
    };

    /**
     * Validates if a value is a valid Brazilian state abbreviation (UF).
     * @function validateUF
     * @memberof InnerFormValidation
     * @param {string} value - The UF string to validate (e.g., "SP", "RJ")
     * @returns {boolean} True if the value is a valid UF, false otherwise
     * @see https://en.wikipedia.org/wiki/States_of_Brazil
     */
    InnerForm.validateUF = function (value) {
        value = value || "";
        var ufsValidas = [
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
            "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
            "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ];
        var ufDigitada = value.trim().toUpperCase();
        return ufsValidas.includes(ufDigitada);
    };

    /**
     * Validates a Brazilian OAB registration number in the format NUMERIC(1-6) + UF.
     * Accepts raw values (511061SP) or formatted values (511.061/SP).
     * @function validateOAB
     * @memberof InnerFormValidation
     * @param {string} value - The OAB number to validate (e.g., "511061SP", "511.061/SP")
     * @returns {boolean} True if the OAB is valid, false otherwise
     */
    InnerForm.validateOAB = function (value) {
        value = value || "";
        var clean = value.trim().toUpperCase().replace(/[^0-9A-Z]/g, "");

        // Debe terminar con UF de dois caracteres
        if (clean.length < 3) {
            return false;
        }

        var uf = clean.slice(-2);
        var num = clean.slice(0, -2);

        if (!InnerForm.validateUF(uf)) {
            return false;
        }

        if (!/^[0-9]{1,6}$/.test(num)) {
            return false;
        }

        return true;
    };



    /**
     * Validates latitude coordinate values.
     * @function validateLatitude
     * @memberof InnerFormValidation
     * @param {string} value - The latitude value to validate
     * @returns {boolean} True if the value is a valid latitude (-90 to +90), false otherwise
     */
    InnerForm.validateLatitude = function (value) {
        value = String(value || "").trim().replace(',', '.');

        if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)) return false;

        // Verifica se é um número válido
        var numValue = Number(value);

        // Valida se é um número e está dentro dos limites da latitude
        return !isNaN(numValue) && numValue >= -90 && numValue <= 90;
    };

    /**
     * Validates longitude coordinate values.
     * @function validateLongitude
     * @memberof InnerFormValidation
     * @param {string} value - The longitude value to validate
     * @returns {boolean} True if the value is a valid longitude (-180 to +180), false otherwise
     */
    InnerForm.validateLongitude = function (value) {
        value = String(value || "").trim().replace(',', '.');

        if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)) return false;

        // Verifica se é um número válido
        var numValue = Number(value);

        // Valida se é um número e está dentro dos limites da longitude
        return !isNaN(numValue) && numValue >= -180 && numValue <= 180;
    };

    /**
     * Validates coordinate pairs in various formats.
     * @function validateCoordinate
     * @memberof InnerFormValidation
     * @param {string} value - The coordinate value to validate (e.g., "lat,lng" or "lat lng")
     * @returns {boolean} True if the value contains valid coordinates, false otherwise
     */
    InnerForm.validateCoordinate = function (value) {
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
        return InnerForm.validateLatitude(lat) && InnerForm.validateLongitude(lng);
    };

    /**
     * Validates that a value contains at least one of the specified characters.
     * @function validateAnyChar
     * @memberof InnerFormValidation
     * @param {string} value - The input value to check
     * @param {string} chars - String of characters where at least one should be present
     * @returns {boolean} True if any of the characters are found, false otherwise
     */
    InnerForm.validateAnyChar = function (value, chars) {
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
     * @memberof InnerFormValidation
     * @param {string} value - The input value to check
     * @param {string} chars - String of characters that must all be present
     * @returns {boolean} True if all characters are found, false otherwise
     */
    InnerForm.validateAllChar = function (value, chars) {
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
     * @memberof InnerFormValidation
     * @param {string} value - The date string to validate (DD/MM/YYYY format)
     * @returns {boolean} True if the date is valid, false otherwise
     */
    InnerForm.validDate = function (value) {
        var datenumber = InnerForm.parseDateInt(value);
        return datenumber != null && !isNaN(datenumber);
    }

    /**
     * Parses a date string and returns a int object.
     * @function parseDate
     * @memberof InnerFormValidation
     * @param {string} value - The date string to parse (DD/MM/YYYY or MM/YYYY format)
     * @returns {Date|null} The parsed Date object or null if invalid
     */
    InnerForm.parseDateInt = function (value) {
        value = String(value || "");
        var dt = 0;
        var d = 0;
        var m = 0;
        var y = 0;
        var comp = value.split(" ")[0].split("/");
        if (comp.length == 3) {
            comp[2] = comp[2].length == 2 ? InnerForm.expandYear(comp[2]) : comp[2];
            d = parseInt(comp[0], 10);
            m = parseInt(comp[1], 10) - 1;
            y = parseInt(comp[2], 10);
        }
        if (comp.length == 2) {
            comp[1] = comp[1].length == 2 ? InnerForm.expandYear(comp[1]) : comp[1];
            d = 1
            m = parseInt(comp[0], 10) - 1;
            y = parseInt(comp[1], 10);
        }
        if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y) || y < 1) return null;
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
     * @memberof InnerFormValidation
     * @param {string} value - The date string to parse (DD/MM/YYYY or MM/YYYY format)
     * @returns {Date|null} The parsed Date object or null if invalid
     */
    InnerForm.parseDate = function (value) {
        value = value || "";
        var datenumber = InnerForm.parseDateInt(value);
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
    InnerForm.validDateRange = function (value) {
        if (!value || typeof value !== 'string') return false;

        var parts = value.split(' ~ ');
        if (parts.length !== 2) return false;

        var date1 = parts[0].trim();
        var date2 = parts[1].trim();

        // Validate both dates individually
        if (!InnerForm.validDate(date1) || !InnerForm.validDate(date2)) {
            return false;
        }

        // Parse both dates to compare
        var parsedDate1 = InnerForm.parseDateInt(date1);
        var parsedDate2 = InnerForm.parseDateInt(date2);

        // First date should be <= second date
        return parsedDate1 <= parsedDate2;
    }

    /**
     * Validates a month/year range string in format "MM/YYYY ~ MM/YYYY"
     * @param {string} value - Month/year range string
     * @returns {boolean} True if both month/years are valid and first <= second
     */
    InnerForm.validMonthYearRange = function (value) {
        if (!value || typeof value !== 'string') return false;

        var parts = value.split(' ~ ');
        if (parts.length !== 2) return false;

        var monthYear1 = parts[0].trim();
        var monthYear2 = parts[1].trim();

        // Validate both month/years individually (add day 01 for validation)
        var testDate1 = "01/" + monthYear1;
        var testDate2 = "01/" + monthYear2;
        return InnerForm.validDateRange(testDate1 + " ~ " + testDate2);
    }

    /**
     * Validates a short month/year range string in format "MM/YY ~ MM/YY"
     * @function validShortMonthYearRange
     * @memberof InnerFormValidation
     * @param {string} value - Short month/year range string  
     * @returns {boolean} True if both month/years are valid and first <= second
     */
    InnerForm.validShortMonthYearRange = function (value) {
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
        var fullYear1 = InnerForm.expandYear(parseInt(comp1[1], 10), 20, 5);
        var fullYear2 = InnerForm.expandYear(parseInt(comp2[1], 10), 20, 5);

        var fullMonthYear1 = comp1[0] + "/" + fullYear1;
        var fullMonthYear2 = comp2[0] + "/" + fullYear2;

        return InnerForm.validMonthYearRange(fullMonthYear1 + " ~ " + fullMonthYear2);
    }

    /**
     * Expands a short year (YY) to a full year (YYYY) based on the current century.
     * If the expanded year is outside the range of (currentYear - pastDistance) to (currentYear + futureDistance),
     * it is adjusted to the previous century.
     * @function expandYear
     * @memberof InnerFormValidation
     * @param {number} year - The short year to expand.
     * @param {number} pastDistance - The number of years to consider for the past.
     * @param {number} futureDistance - The number of years to consider for the future.
     * @returns {number} The expanded full year
     */
    InnerForm.expandYear = function (year, pastDistance, futureDistance) {
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        pastDistance = pastDistance || (currentYear - century);
        futureDistance = futureDistance || 5;



        if (InnerForm.isNumber(pastDistance)) {
            pastDistance = parseInt(pastDistance, 10);
        } else {
            pastDistance = currentYear - century;
        }

        if (InnerForm.isNumber(futureDistance)) {
            futureDistance = parseInt(futureDistance, 10);
        } else {
            futureDistance = 5;
        }

        if (InnerForm.isNumber(year)) {
            year = parseInt(year, 10);
        } else {
            InnerForm.warn("Invalid year:", year);
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
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyUUIDMask = function (input = new HTMLInputElement()) {
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
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyLatitudeMask = function (input = new HTMLInputElement()) {
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
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyLongitudeMask = function (input = new HTMLInputElement()) {
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
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyNoSpaceMask = function (input = new HTMLInputElement()) {
        input.value = input.value
            .replace(/[ ]+/g, '');
    };

    /**
     * Applies an alphabetic mask that allows only letters and spaces.
     * @function applyAlphaMask
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyAlphaMask = function (input = new HTMLInputElement()) {
        input.value = input.value
            .replace(/[!@#$%¨&*()_+\d\-=¹²³£¢¬§´[`{\/?°ª~\]^}º\\,.;|<>:₢«»"'¶¿®þ]/g, '')
            .replace(/[ ]+/g, ' ');

    };

    /**
     * Formats an input as a two-letter uppercase Brazilian state abbreviation.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyUFMask = function (input = new HTMLInputElement()) {
        input.value = input.value
            .replace(/[^a-zA-Z]/g, '').toUpperCase();
        if (input.value.length > 2) {
            input.value = input.value.substring(0, 2);
        }
    };


    /**
     * Applies an alphanumeric mask that allows letters, numbers, and spaces.
     * @function applyAlphaNumericMask  
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyAlphaNumericMask = function (input = new HTMLInputElement()) {
        input.value = input.value
            .replace(/[!@#$%¨&*()_+\-=¹²³£¢¬§´[`{\/?°ª~\]^}º\\,.;|<>:₢«»"'¶¿®þ]/g, '')
            .replace(/[ ]+/g, ' ');

    };

    /**
     * Applies a phone number mask (Brazilian format).
     * @function applyPhoneMask
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyPhoneMask = function (input = new HTMLInputElement()) {
        var value = input.value;
        value = value.replace(/\D/g, "");
        value = value.replace(/^(\d{4})(\d{1,4})$/g, "$1-$2");
        value = value.replace(/^(\d{5})(\d{1,4})$/g, "$1-$2");
        value = value.replace(/^(\d{2})(\d{4})(\d{1,4})$/g, "($1) $2-$3");
        value = value.replace(/^(\d{2})(\d{5})(\d{1,4})$/g, "($1) $2-$3");
        input.maxLength = 15;
        input.value = value;

    };

    /**
     * Converts an input value to uppercase.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyUpperMask = function (input = new HTMLInputElement()) {
        input.value = input.value.toUpperCase();
    };

    /**
     * Converts an input value to lowercase.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyLowerMask = function (input = new HTMLInputElement()) {
        input.value = input.value.toLowerCase();
    };
    /**
     * Applies a date mask (DD/MM/YYYY format) to an input field.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyDateMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";
        if (isDeleting == false) {
            text = InnerForm.formatDate(text);
        }
        if (/^[\d]{2}\/[\d]{2}\/[\d]{4}$/g.test(text)) {
            input.maxLength = text.length;
        }
        input.value = text;
    };



    /**
     * Formats a date string by adding separators (DD/MM/YYYY format).
     * @function formatDate
     * @memberof InnerFormValidation
     * @param {string} text - The date string to format
     * @returns {string} The formatted date string
     */
    InnerForm.formatDate = function (text) {
        text = text || "";
        text = InnerForm.parseDatePartial(text);
        // remove tudo que nao for numero ou barra
        text = text.replace(/[^\d\/]/g, "");
        if (text.length > 10) text = text.substring(0, 10);
        return text;
    }



    /**
     * Applies a date-time mask (DD/MM/YYYY HH:MM:SS format).
     * @function applyDateTimeMask
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input] - The input element to apply the mask to
     */
    InnerForm.applyDateTimeMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4})(\d+)$/g, "$1 $2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2})(\d+)$/g, "$1:$2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})(\d+)$/g, "$1:$2");
        input.value = value;
        input.maxLength = 19;

    };

    /**
     * Formats an input as DD/MM/YYYY HH:MM.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyDateShortMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2})(\d+)$/g, "$1/$2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4})(\d+)$/g, "$1 $2");
        value = value.replace(/^(\d{2}\/\d{2}\/\d{4} \d{2})(\d+)$/g, "$1:$2");
        input.value = value;
        input.maxLength = 16;

    };

    /**
     * Formats an input as HH:MM:SS.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyTimeMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d+)$/g, "$1:$2");
        input.value = value.replace(/^(\d{2}:\d{2})(\d{1,2})$/g, "$1:$2");
        input.maxLength = 8;

    };

    /**
     * Formats an input as MM:SS.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyShortTimeMask = function (input = new HTMLInputElement()) {
        var value = input.value.replace(/\D/g, "");
        input.value = value.replace(/^(\d{2})(\d{1,2})$/g, "$1:$2");
        input.maxLength = 5;

    };


    /**
     * Formats an input as either CPF or CNPJ based on its length.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyCPForCNPJMask = function (input = new HTMLInputElement()) {
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


    /**
     * Formats an input as a Brazilian CPF.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyCPFMask = function (input = new HTMLInputElement()) {
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


    /**
     * Formats an input as an eight-digit Brazilian CEP.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyCEPMask = function (input = new HTMLInputElement()) {
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
    * @memberof InnerFormValidation
    * @param {*} input 
    */
    InnerForm.applyCNPJMask = function (input = new HTMLInputElement()) {
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

    /**
     * Formats an input as an eleven-digit Brazilian CNH.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyCNHMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";
        text = text.replace(/\D/g, "");
        text = text.substring(0, 11);
        text = text.replace(/^(\d{3})(\d+)/, "$1.$2");
        text = text.replace(/^(\d{3}\.\d{3})(\d+)/g, "$1.$2");
        text = text.replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/g, "$1-$2");
        if (/^[\d]{3}\.[\d]{3}\.[\d]{3}-[\d]{2}$/g.test(text)) {
            input.maxLength = text.length;
        } else {
            input.maxLength = 14;
        }
        input.value = text;
    };



    /**
     * Applies OAB (511.061/SP) mask to an input field.
     * @function applyOABMask
     * @memberof InnerFormValidation
     * @param {HTMLInputElement} [input]
     */
    InnerForm.applyOABMask = function (input = new HTMLInputElement()) {
        var value = input.value || "";
        value = value.toUpperCase().replace(/[^0-9A-Z]/g, "");

        var uf = "";
        var letters = value.match(/[A-Z]{1,2}$/);
        if (letters) {
            uf = letters[0];
            value = value.slice(0, -uf.length);
        }

        var num = value.replace(/\D/g, "").slice(0, 6);
        var formattedNum = "";
        if (num.length > 0) {
            var arr = num.split("").reverse().join("").match(/.{1,3}/g) || [];
            formattedNum = arr.join(".").split("").reverse().join("");
        }

        input.value = formattedNum + (uf ? "/" + uf : "");
        input.maxLength = 10;
    };


    /**
     * Groups a card number into four-digit blocks.
     * @param {HTMLInputElement} [input] - Input to format
     */
    InnerForm.applyCreditCardMask = function (input = new HTMLInputElement()) {
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

    /**
     * Checks whether a value can be parsed as a finite number.
     * @param {*} n - Value to check
     * @returns {boolean} Whether the value is numeric
     */
    InnerForm.isNumber = function (n) {
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
    InnerForm.applyNumberMask = function (input = new HTMLInputElement()) {
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


    /**
     * Formats an input as MM/YYYY.
     * @param {HTMLInputElement} [input] - Input to format
     * */
    InnerForm.applyMonthYearMask = function (input = new HTMLInputElement()) {
        var text = input.value || "";
        if (isDeleting == false) {
            text = InnerForm.parseMonthYearPartial(text);
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
    InnerForm.applyDateRangeMask = function (input = new HTMLInputElement()) {
        if (isDeleting == true) {
            return;
        }
        // formato DD/MM/AAAA ~ DD/MM/AAAA
        var text = input.value || "";
        // Manter apenas dígitos, barras, ~ e espaços
        text = text.replace(/[^\d\/~\s]/g, "");
        text = text.replace(/\s+/g, " "); // Normalizar espaços

        // Remover múltiplos tildes
        text = text.replace(/~+/g, "~");

        var dateDigits = text.replace(/\D/g, "");
        if (dateDigits.length >= 16) {
            var firstDate = dateDigits.substring(0, 8);
            var secondDate = dateDigits.substring(8, 16);
            var firstFormatted = firstDate.substring(0, 2) + "/" + firstDate.substring(2, 4) + "/" + firstDate.substring(4, 8);
            var secondFormatted = secondDate.substring(0, 2) + "/" + secondDate.substring(2, 4) + "/" + secondDate.substring(4, 8);
            var firstParsed = InnerForm.parseDate(firstFormatted);
            var secondParsed = InnerForm.parseDate(secondFormatted);
            if (firstParsed && secondParsed) {
                text = firstFormatted + " ~ " + secondFormatted;
                if (firstParsed > secondParsed) text = secondFormatted + " ~ " + firstFormatted;
                input.value = text;
                return;
            }
        }

        text = InnerForm.parseDatePartial(text);

        if (text.length > 23) text = text.substring(0, 23);

        // se tiver o tilde, processa a segunda data
        if (text.includes("~")) {
            var parts = text.split("~");
            var part1 = parts[0] ? parts[0].trim() : "";
            var part2 = parts[1] ? parts[1].trim() : "";


            var date1 = InnerForm.parseDate(part1);
            var date2 = InnerForm.parseDate(part2);

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
    InnerForm.parseShortMonthYearPartial = function (part) {
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
                if (InnerForm.isNumber(part)) {
                    part = "0" + part;
                }
            }
        }

        // segundo digito do mes, limita a 12
        if (part.length == 2) {
            if (!InnerForm.isNumber(part[1])) {
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
            } else if (InnerForm.isNumber(part[2])) {
                part = part.substring(0, 2) + "/" + part[2];
            } else {
                part = part.substring(0, 2) + "/";
            }
        }

        // quarto e quinto digito, ano (YY), aceita qualquer digito numerico
        if (part.length == 4 || part.length == 5) {
            if (!InnerForm.isNumber(part[part.length - 1])) {
                part = part.substring(0, part.length - 1);
            }
        }

        // se o proximo digito for espaco ou tilde, ajusta para " ~ "
        if (part.length == 6) {
            if (InnerForm.isNumber(part[5])) {
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
            part2 = InnerForm.parseShortMonthYearPartial(part2);
            part = part.substring(0, 8) + part2;
        }

        return part;
    }

    /**
     * Parses and formats a partial month/year string "MM/YYYY" during input.
     * @param {string} part - The partial month/year string to parse
     * @returns {string} The formatted month/year string
     */
    InnerForm.parseMonthYearPartial = function (part) {
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
                if (InnerForm.isNumber(part)) {
                    part = "0" + part;
                }
            }
        }

        // segundo digito do mes, limita a 12
        if (part.length == 2) {
            if (!InnerForm.isNumber(part[1])) {
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
            } else if (InnerForm.isNumber(part[2])) {
                part = part.substring(0, 2) + "/" + part[2];
            } else {
                part = part.substring(0, 2) + "/";
            }
        }

        // do quarto e quinto digito, ano, aceita qualquer digito numerico
        if (part.length == 4 || part.length == 5) {
            if (!InnerForm.isNumber(part[part.length - 1])) {
                part = part.substring(0, part.length - 1);
            }
        }
        // sexto tem que ser 1 numero ou espaco. se for espaco adiciona 20 ou 19 antes dos 2 digitos do ano digitados
        if (part.length == 6) {
            if (part[5] == " ") {
                var shortYear = part.substring(3, 5);
                var fullYear = InnerForm.expandYear(shortYear);
                part = part.substring(0, 3) + fullYear;
            }
        }

        // setimo tem que ser 1 numero ou espaco. se for espaco adiciona 2 ou 1 antes dos 3 digitos do ano digitados
        if (part.length == 7) {
            if (part[6] == " ") {
                var shortYear = part.substring(3, 5);
                var fullYear = InnerForm.expandYear(shortYear);
                part = part.substring(0, 3) + fullYear;
            }
        }

        // se o proximo digito for espaco ou tilde, ajusta para " ~ "
        if (part.length == 8) {
            if (InnerForm.isNumber(part[7])) {
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
            part2 = InnerForm.parseMonthYearPartial(part2);
            part = part.substring(0, 10) + part2;
        }

        return part;
    }

    /**
     * Parses and formats a partial date string "DD/MM/YYYY" during input.
     * @param {*} part 
     * @returns 
     */
    InnerForm.parseDatePartial = function (part) {
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
                if (InnerForm.isNumber(part)) {
                    part = "0" + part;
                }
            }
        }

        // segundo digito, limita a 31
        if (part.length == 2) {
            if (!InnerForm.isNumber(part[1])) {
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
            } else if (InnerForm.isNumber(part[2])) {
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
            else if (InnerForm.isNumber(part[3])) {
                part = part.substring(0, 3) + "0" + part[3];
            } else {
                part = part.substring(0, 3);
            }
        }

        // quinto digito, mes, segundo numero, limita a 12
        if (part.length == 5) {
            var m = part[3] + part[4];
            if (!InnerForm.isNumber(part[4])) {
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
            } else if (!InnerForm.isNumber(part[5])) {
                part = part.substring(0, 5) + "/" + part[5];
            } else {
                part = part.substring(0, 5) + "/";
            }
        }

        // do setimo e oitavo digito, ano, aceita qualquer digito numerico
        if (part.length == 7 || part.length == 8) {
            if (!InnerForm.isNumber(part[part.length - 1])) part = part.substring(0, part.length - 1);
        }

        // nona tem que ser 1 numero ou espaco. se for espaco adiciona 20 ou 19 antes dos 2 digitos do ano digitados
        if (part.length == 9) {
            if (part[8] == " ") {
                var shortYear = part.substring(6, 8);
                var fullYear = InnerForm.expandYear(shortYear);
                part = part.substring(0, 6) + fullYear;
            }
        }

        // decima tem que ser 1 numero ou espaco. se for espaco adiciona 2 ou 1 antes dos 3 digitos do ano digitados
        if (part.length == 10) {
            if (part[9] == " ") {
                var shortYear = part.substring(6, 9);
                var fullYear = InnerForm.expandYear(shortYear);
                part = part.substring(0, 6) + fullYear;
            }
        }

        // se o proximo digito for espaco ou tilde, ajusta para " ~ "
        if (part.length == 11) {
            if (InnerForm.isNumber(part[10])) {
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
            part2 = InnerForm.parseDatePartial(part2);
            part = part.substring(0, 13) + part2;
        }

        return part;
    }



    /**
     * Apply a month/year range mask to an input field.
     * The expected format is "MM/YYYY ~ MM/YYYY".
     * @param {HTMLInputElement} input 
     */
    InnerForm.applyMonthYearRangeMask = function (input = new HTMLInputElement()) {
        if (isDeleting == true) {
            return;
        }
        // formato MM/AAAA ~ MM/AAAA
        var text = input.value || "";
        // Manter apenas dígitos, barras, ~ e espaços
        text = text.replace(/[^\d\/~\s]/g, "");
        text = text.replace(/\s+/g, " "); // Normalizar espaços

        // Remover múltiplos tildes
        text = text.replace(/~+/g, "~");

        var monthYearDigits = text.replace(/\D/g, "");
        if (monthYearDigits.length >= 12) {
            var firstMonthYear = monthYearDigits.substring(0, 6);
            var secondMonthYear = monthYearDigits.substring(6, 12);
            var firstMonthYearFormatted = firstMonthYear.substring(0, 2) + "/" + firstMonthYear.substring(2, 6);
            var secondMonthYearFormatted = secondMonthYear.substring(0, 2) + "/" + secondMonthYear.substring(2, 6);
            var firstMonthYearParsed = InnerForm.parseDate("01/" + firstMonthYearFormatted);
            var secondMonthYearParsed = InnerForm.parseDate("01/" + secondMonthYearFormatted);
            if (firstMonthYearParsed && secondMonthYearParsed) {
                text = firstMonthYearFormatted + " ~ " + secondMonthYearFormatted;
                if (firstMonthYearParsed > secondMonthYearParsed) text = secondMonthYearFormatted + " ~ " + firstMonthYearFormatted;
                input.value = text;
                return;
            }
        }

        text = InnerForm.parseMonthYearPartial(text);

        if (text.length > 17) text = text.substring(0, 17);

        // se tiver o tilde, processa a segunda data
        if (text.includes("~")) {
            var parts = text.split("~");
            var part1 = parts[0] ? parts[0].trim() : "";
            var part2 = parts[1] ? parts[1].trim() : "";


            var date1 = InnerForm.parseDate(part1);
            var date2 = InnerForm.parseDate(part2);

            if (date1 && date2) {
                if (date1 > date2) {

                    part2 = `${InnerForm.addLeadingZeros(date1.getMonth() + 1, 2)}/${date1.getFullYear()}`;
                    part1 = `${InnerForm.addLeadingZeros(date2.getMonth() + 1, 2)}/${date2.getFullYear()}`;
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
    InnerForm.applyShortMonthYearRangeMask = function (input = new HTMLInputElement()) {
        if (isDeleting == true) {
            return;
        }
        // formato MM/AA ~ MM/AA
        var text = input.value || "";
        // Manter apenas dígitos, barras, ~ e espaços
        text = text.replace(/[^\d\/~\s]/g, "");
        text = text.replace(/\s+/g, " "); // Normalizar espaços

        // Remover múltiplos tildes
        text = text.replace(/~+/g, "~");

        text = InnerForm.parseShortMonthYearPartial(text);

        if (text.length > 13) text = text.substring(0, 13);

        // se tiver o tilde, processa a segunda data
        if (text.includes("~")) {
            var parts = text.split("~");
            var part1 = parts[0] ? parts[0].trim() : "";
            var part2 = parts[1] ? parts[1].trim() : "";

            var date1 = InnerForm.parseDate(part1);
            var date2 = InnerForm.parseDate(part2);

            if (date1 && date2) {
                if (date1 > date2) {
                    part2 = `${InnerForm.addLeadingZeros(date1.getMonth() + 1, 2)}/${date1.getFullYear().toString().substring(2, 4)}`;
                    part1 = `${InnerForm.addLeadingZeros(date2.getMonth() + 1, 2)}/${date2.getFullYear().toString().substring(2, 4)}`;
                }
            }
            text = part1 + " ~ " + part2;
        }

        input.value = text;
    }


    /** Validates a card number with the Luhn algorithm. @param {string} cardNumber - Card number @returns {boolean} Whether the checksum is valid */
    InnerForm.checkLuhn = function (cardNumber) {
        var s = 0;
        var doubleDigit = false;
        cardNumber = String(cardNumber || "").replace(/[^\d]+/g, "");
        if (!cardNumber) return false;
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

    /** Identifies the brand of a card number. @param {string} cardNumber - Card number @returns {string|boolean} Brand name or false */
    InnerForm.validateCardBrand = function (cardNumber) {
        cardNumber = String(cardNumber || "").replace(/[^0-9]+/g, "");
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

    /** Validates a Brazilian CPF. @param {string} CPFNumber - CPF value @returns {boolean} Whether the CPF is valid */
    InnerForm.validateCPF = function (CPFNumber) {
        CPFNumber = String(CPFNumber || "").replace(/\D/g, "");

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

        for (var x = 1; x <= 9; x++)
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

    /** Validates a Brazilian CNPJ. @param {string} CNPJNumber - CNPJ value @returns {boolean} Whether the CNPJ is valid */
    InnerForm.validateCNPJ = function (CNPJNumber) {
        CNPJNumber = String(CNPJNumber || "").replace(/\D/g, "");

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
        var tamanho = CNPJNumber.length - 2;
        var numeros = CNPJNumber.substring(0, tamanho);
        var digitos = CNPJNumber.substring(tamanho);
        var soma = 0;
        var pos = tamanho - 7;
        for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
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

    /** Validates a Brazilian CNH. @param {string} cnh - CNH value @returns {boolean} Whether the CNH is valid */
    InnerForm.validateCNH = function (cnh) {
        cnh = (cnh || "").toString();
        cnh = cnh.replace(/[^\d]/g, "");

        var char1 = cnh.charAt(0);

        if (cnh.length !== 11 || char1.repeat(11) === cnh) {
            return false;
        }

        for (var i = 0, j = 9, v = 0; i < 9; ++i, --j) {
            v += +(cnh.charAt(i) * j);
        }

        var dsc = 0,
            vl1 = v % 11;

        if (vl1 >= 10) {
            vl1 = 0;
            dsc = 2;
        }

        for (i = 0, j = 1, v = 0; i < 9; ++i, ++j) {
            v += +(cnh.charAt(i) * j);
        }

        var x = v % 11;
        var vl2 = (x >= 10) ? 0 : x - dsc;

        return ('' + vl1 + vl2) === cnh.substr(-2);
    };



    /** Calculates password strength from character classes. @param {Object} input - Input or selector accepted by InnerForm @returns {number} Number of matched character classes */
    InnerForm.validatePassword = function (input) {
        // Create an array and push all possible values that you want in password
        var matchedCase = new Array();
        matchedCase.push(/[!@#$%^&*()_\-+=}{\]\[`~<>?/\\|±!.,]/g);
        matchedCase.push(/[A-Z]/g);
        matchedCase.push(/[0-9]/g);
        matchedCase.push(/[a-z]/g);

        // Check the conditions
        var ctr = 0;
        for (var i = 0; i < matchedCase.length; i++) {
            if (matchedCase[i].test(InnerForm(input).val())) {
                ctr++;
            }
        }

        InnerForm(input).attr("data-pwstrength", ctr);
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
        InnerForm.log("replaceAll added to String.prototype");
    }

    /** Validates a Brazilian CEP (8 digits), ignoring mask characters. @param {string} CEPNumber - CEP value @returns {boolean} Whether the format is valid */
    InnerForm.validateCEP = function (CEPNumber) {
        CEPNumber = String(CEPNumber || "").replace(/\D/g, "");
        return /^[0-9]{8}$/.test(CEPNumber);
    }

    /** Looks up a CEP and fills matching autocomplete fields. @param {string} CEPNumber - CEP value @param {string} homeNumber - House number @param {number} delay - Focus delay in milliseconds @param {Function} callbackFunction - Response callback */
    InnerForm.searchViaCEP = function (CEPNumber, homeNumber, delay, callbackFunction) {
        CEPNumber = CEPNumber || "";
        homeNumber = homeNumber || "";
        delay = delay || 0;
        callbackFunction = callbackFunction || function (o) { InnerForm.log('No callback defined', o); }
        InnerForm.log('Searching CEP', CEPNumber, homeNumber, delay);
        var cepInput = InnerForm(".autocomplete.cep:input").first();


        if (InnerForm.validateCEP(CEPNumber)) {
            InnerForm.log("Getting info from ViaCEP...");
            return fetch("https://viacep.com.br/ws/" + CEPNumber + "/json/")
                .then(function (response) {
                    if (!response.ok) throw new Error(response.statusText);
                    return response.json();
                })
                .then(function (obj) {
                    obj["numero"] = obj["numero"] || "";
                    if (homeNumber != "") {
                        if (obj["numero"] == "") {
                            obj["numero"] = homeNumber;
                        } else {
                            obj["numero"] = ", " + homeNumber;
                        }
                    }

                    InnerForm.log("ViaCEP Response", obj);

                    InnerForm(".autocomplete.address:input")
                        .setOrReplaceVal(obj.logradouro)
                        .change().focus();
                    InnerForm(".autocomplete.complement:input")
                        .setOrReplaceVal(obj.complemento)
                        .change().focus();
                    InnerForm(".autocomplete.neighborhood:input")
                        .setOrReplaceVal(obj.bairro)
                        .change().focus();
                    InnerForm(".autocomplete.city:input")
                        .setOrReplaceVal(obj.localidade)
                        .change().focus();
                    InnerForm(".autocomplete.state:input")
                        .setOrReplaceVal(obj.uf)
                        .change().focus();
                    InnerForm(".autocomplete.ibge:input")
                        .setOrReplaceVal(obj.ibge)
                        .change().focus();
                    InnerForm(".autocomplete.gia:input")
                        .setOrReplaceVal(obj.gia)
                        .change().focus();
                    InnerForm(".autocomplete.ddd:input")
                        .setOrReplaceVal(obj.ddd)
                        .change().focus();
                    InnerForm(".autocomplete.siafi:input")
                        .setOrReplaceVal(obj.siafi)
                        .change().focus();
                    InnerForm(".autocomplete.citystate:input")
                        .setOrReplaceVal(
                            obj.localidade +
                            " - " +
                            obj.uf
                        )
                        .change().focus();
                    InnerForm(".autocomplete.fulladdress:input")
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
                    InnerForm(".autocomplete.city:input").each(function () {
                        let val = obj.localidade || "";
                        if (InnerForm(this).prop("tagName").toUpperCase() == "SELECT") {
                            InnerForm.log("Setting city select to", val);
                            if (!InnerForm(this).find("option[value='" + val + "']").length) {
                                InnerForm(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                            //fire change to update any dependent selects
                        }
                        InnerForm(this).val(val).change().focus();
                    });

                    InnerForm(".autocomplete.state:input").each(function () {
                        let val = obj.uf || "";
                        if (InnerForm(this).prop("tagName").toUpperCase() == "SELECT") {
                            InnerForm.log("Setting state select to", val);
                            if (!InnerForm(this).find("option[value='" + val + "']").length) {
                                InnerForm(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                        }
                        InnerForm(this).setOrReplaceVal(val).change().focus();
                    });

                    InnerForm(".autocomplete.ibge:input").each(function () {
                        let val = obj.ibge || "";
                        if (InnerForm(this).prop("tagName").toUpperCase() == "SELECT") {
                            InnerForm.log("Setting ibge select to", val);
                            if (!InnerForm(this).find("option[value='" + val + "']").length) {
                                InnerForm(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                        }
                        InnerForm(this).setOrReplaceVal(val).change().focus();
                    });

                    InnerForm(".autocomplete.citystate:input").each(function () {
                        let val = (obj.localidade || "") + " - " + (obj.uf || "");
                        if (InnerForm(this).prop("tagName").toUpperCase() == "SELECT") {
                            InnerForm.log("Setting citystate select to", val);
                            if (!InnerForm(this).find("option[value='" + val + "']").length) {
                                InnerForm(this).append("<option value='" + val + "' selected>" + val + "</option>");
                            }
                        }
                        InnerForm(this).setOrReplaceVal(val).change().focus();
                    });

                    InnerForm(".autocomplete.address")
                        .not(":input")
                        .text(obj.logradouro);
                    InnerForm(".autocomplete.complement")
                        .not(":input")
                        .text(obj.complemento);
                    InnerForm(".autocomplete.neighborhood")
                        .not(":input")
                        .text(obj.bairro);
                    InnerForm(".autocomplete.city")
                        .not(":input")
                        .text(obj.localidade);
                    InnerForm(".autocomplete.state")
                        .not(":input")
                        .text(obj.uf);
                    InnerForm(".autocomplete.ibge")
                        .not(":input")
                        .text(obj.ibge);
                    InnerForm(".autocomplete.gia")
                        .not(":input")
                        .text(obj.gia);
                    InnerForm(".autocomplete.siafi")
                        .not(":input")
                        .text(obj.siafi);
                    InnerForm(".autocomplete.ddd")
                        .not(":input")
                        .text(obj.ddd);
                    InnerForm(".autocomplete.citystate")
                        .not(":input")
                        .text(
                            obj.localidade + " - " + obj.uf
                        );
                    InnerForm(".autocomplete.fulladdress")
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
                            InnerForm(".autocomplete.num:input, .autocomplete.number:input").focus();
                            InnerForm(".autocomplete.homenum:input, .autocomplete.homenumber:input").focus();
                        }, delay);
                    } else {
                        InnerForm.error('Address not found');
                        let nft = cepInput.attr("data-addressnotfoundtext") || cepInput.attr("data-notfoundtext") || "";
                        InnerForm(".autocomplete.fulladdress")
                            .not(":input").text(nft);
                        InnerForm(".autocomplete.fulladdress:input")
                            .val(nft).change();
                        eval(cepInput.attr("data-addressnotfound") || cepInput.attr("data-notfound") || "void(0)");
                        setTimeout(function () {
                            InnerForm(".autocomplete.address:input").focus();
                        }, delay);
                    }
                    if (obj) callbackFunction(obj);
                })
                .catch(function (error) {
                    //Error event
                    InnerForm.log("VIACEP error", error);
                    setTimeout(function () {
                        InnerForm(".autocomplete.address:input").focus();
                    }, delay);
                })
                .finally(function () {
                    InnerForm.log("VIACEP request completed");
                });
        } else {
            InnerForm.log("Awaiting a valid CEP", CEPNumber);
            return Promise.resolve(null);
        }
    }

    /**
     * Sets a value to an input if that input is empty. If this input is not empty, set the value only if it does not contain the .noreplace class
     * @param {Object} value any input value 
     */
    InnerForm.fn.setOrReplaceVal = function (value) {
        let valor = InnerForm.trim(InnerForm(this).val() || "");
        if (valor == "" || InnerForm(this).is(".noreplace") == false) {
            InnerForm(this).val(value).change();
        }
        return InnerForm(this);
    }



    /**
     * Checks if an input, form or collection of inputs is valid
     * @arguments When empty, uses the validation classes contained in the class attribute. if specified, use each argument as a validation class
     * @return {Boolean} true if is valid, otherwise false
     */
    InnerForm.fn.isValid = function () {
        let results = [];

        if (InnerForm(this).length > 1 || InnerForm(this).prop("tagName") == "FORM") {
            eval(InnerForm(this).attr("data-beforevalidatecallback") || "void(0)");
            var elements = [];
            var config = Array.prototype.slice.call(arguments)[0];
            InnerForm(this)
                .find(":input.prevFocus" + (config || ""))
                .each(function () {
                    results.push(InnerForm(this).isValid());
                    elements.push(InnerForm(this));
                });

            for (var mm = 0; mm < results.length; mm++) {
                if (results[mm] === false) {
                    eval(InnerForm(this).attr("data-invalidcallback") || "void(0)");
                    eval(InnerForm(this).attr("data-aftervalidatecallback") || "void(0)");
                    return false;
                }
            }
            eval(InnerForm(this).attr("data-validcallback") || "void(0)");
            eval(InnerForm(this).attr("data-aftervalidatecallback") || "void(0)");
            return true;
        } else {
            if (!this.get(0)) return false;
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
                            if (InnerForm.isBlank(value)) {
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
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }

                            var sep = InnerForm(this).attr("data-separator");
                            var dec = InnerForm(this).attr("data-decimal");
                            var thousand = InnerForm(this).attr("data-thousand");
                            var hasSep = typeof sep === "string" && sep.length > 0;
                            var hasDec = typeof dec === "string" && dec.length > 0 && !isNaN(dec);
                            var hasThousand = typeof thousand === "string" && thousand.length > 0;

                            if (currentValid === 'integer' || currentValid === 'int') {
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
                                    if (hasThousand) thousand = ".";
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
                                regex = new RegExp("^\\d+(" + sepRegex + "\\d{1," + dec + "})?$", "g");
                            }
                            results.push(regex.test(value));
                            break;
                        }
                        case "ean":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateEAN(value));
                            break;
                        case "upper":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(!InnerForm.validateRegex(value, /[a-z]/));
                            break;
                        case "lower":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(!InnerForm.validateRegex(value, /[A-Z]/));

                            break;
                        case "alphanumeric":
                        case "alphanum":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateRegex(value, /^[A-Za-z0-9 ]+$/));
                            break;
                        case "alpha":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateRegex(value, /^[A-Za-z ]+$/));
                            break;
                        case "tel":
                        case "cel":
                        case "telephone":
                        case "mobilephone":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validatePhone(value));
                            break;
                        case "mail":
                        case "email":
                        case "e-mail":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            var re = /^[\w-]+(\.[\w-]+)*@[\w]+(\.[a-z]{2,6})*(\.[a-z]{2,6})$/gi;
                            results.push(InnerForm.validateRegex(value, re));
                            break;
                        case "required":
                        case "req":
                        case "obg":
                            if (type == "checkbox" || type == "radio") {
                                results.push(InnerForm(this).is(":checked"));
                            } else {
                                results.push(!(!value || InnerForm.isBlank(value)));
                            }
                            break;
                        case "url":
                        case "link":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }

                            var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
                            results.push(InnerForm.validateRegex(value, re));
                            break;
                        case "data":
                        case "date":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(value.split("/").length == 3)
                            results.push(InnerForm.validDate(value));
                            break;
                        case "daterange":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validDateRange(value));
                            break;
                        case "monthyearrange":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validMonthYearRange(value));
                            break;
                        case "shortmonthyearrange":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validShortMonthYearRange(value));
                            break;
                        case "datetime":
                        case "dateshorttime":
                        case "datetimeshort":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            var comp = value.split(" ");
                            if (comp.length == 2) {
                                results.push(InnerForm.validDate(comp[0]) && InnerForm.validateTime(comp[1]));
                                break;
                            }
                            results.push(false);
                            break;
                        case "time":
                        case "shorttime":
                        case "timeshort":
                        case "minutesecond":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateTime(value, currentValid == "minutesecond"));
                            break;
                        case "month":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm(this).isValid("int"));
                            var num = parseInt(value);
                            results.push(num > 0 && num <= 12);
                            break;
                        case "monthyear":
                            if (InnerForm.isBlank(value)) {
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
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateCEP(value));
                            break;
                        case "cpfcnpj":
                        case "cnpjcpf":
                        case "cnpj":
                        case "cpf":
                            InnerForm(this).removeAttr('data-doc');
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            if (currentValid == "cpf") {
                                const validCpf = InnerForm.validateCPF(value);
                                results.push(validCpf);
                                if (validCpf) InnerForm(this).attr('data-doc', 'cpf');
                            } else if (currentValid == "cnpj") {
                                const validCnpj = InnerForm.validateCNPJ(value);
                                results.push(validCnpj);
                                if (validCnpj) InnerForm(this).attr('data-doc', 'cnpj');
                            } else {
                                results.push(InnerForm(this).isValid("cpf") || InnerForm(this).isValid("cnpj"));
                            }
                            break;
                        case "cnh":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateCNH(value));
                            break;
                        case "debitcard":
                        case "creditcard":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            var vlu = InnerForm.checkLuhn(value);

                            if (vlu) {
                                var flagcard = InnerForm.validateCardBrand(value);
                                InnerForm(this).attr("data-flagcard", flagcard.toString());
                                if (
                                    InnerForm(this).is(
                                        ".visa, .mastercard, .diners, .amex, .discover, .hiper, .elo, .jcb, .aura, .maestro, .laser, .blanche, .switch, .korean, .union, .solo, .insta, .bcglobal, .rupay"
                                    )
                                ) {
                                    if (flagcard) {
                                        results.push(InnerForm(this).hasClass(flagcard.toString()));
                                    } else {
                                        results.push(false);
                                    }
                                } else {
                                    results.push(flagcard !== false);
                                }
                            } else {
                                InnerForm(this).attr("data-flagcard", false);
                                results.push(false);
                            }
                            break;
                        case "password":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }

                            var strenght = valids[i + 1] || "3";
                            strenght = strenght.toString().toLowerCase();

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

                            results.push(InnerForm.validatePassword(this) >= strenght);
                            break;

                        case "after":
                        case "before":

                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            if (typeof valids[i + 1] === "undefined") {
                                results.push(false);
                                break;
                            }

                            var num = valids[i + 1] || "0";
                            if ((num.indexOf("today") || num.indexOf("/")) && InnerForm.validDate(value)) {
                                value = InnerForm.parseDateInt(value);
                                if (num == "today") {
                                    num = Date.now();
                                } else {
                                    num = InnerForm.parseDateInt(num);
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
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            if (typeof valids[i + 1] === "undefined") {
                                results.push(false);
                                break;
                            }
                            var selector =
                                InnerForm(this).attr("data-eq") ||
                                InnerForm(this).data("data-equal") ||
                                valids[i + 1] ||
                                null;
                            var valor1 = InnerForm(this).val();
                            var valor2 = InnerForm(selector).val() || InnerForm(selector).text();
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

                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }

                            var valor2 =
                                InnerForm(this).attr("data-cnts") ||
                                InnerForm(this).attr("data-contains") ||
                                InnerForm(this).attr("data-string") ||
                                InnerForm(this).attr("data-value") ||
                                valids[i + 1] ||
                                "";

                            if (InnerForm.isBlank(valor2)) {
                                results.push(false);
                                break;
                            }

                            var valor1 = InnerForm(this).val() || "";
                            valor1 = valor1.toString().replace("&nbsp;", " ");
                            if (valor2.toLowerCase() == "_space" || valor2.toLowerCase() == "_espaco" || valor2.toLowerCase() == "&nbsp;") {
                                valor2 = " ";
                            }

                            switch (currentValid) {
                                case "containsanychar":
                                case "containsanychars":
                                    results.push(InnerForm.validateAnyChar(valor1, valor2));
                                    break;
                                case "containschar":
                                case "containsallchar":
                                case "containsallchars":
                                    results.push(InnerForm.validateAllChar(valor1, valor2));
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
                                    results.push(InnerForm.validateNotChar(valor1, valor2));
                                    break;
                                default:
                                    results.push(valor1.includes(valor2));
                                    break;
                            }
                            break;

                        case "len":
                            if (InnerForm.isBlank(value)) {
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
                            if (InnerForm.isBlank(value)) {
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
                            if (InnerForm.isBlank(value)) {
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
                            if (InnerForm.isBlank(value)) {
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
                            var v1 = InnerForm(this).isValid("after " + valids[i - 1]);
                            var v2 = InnerForm(this).isValid("before " + valids[i + 1]);
                            results.push(v1 && v2);
                            break;
                        case "minage":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            var idade = InnerForm.getAge(value);
                            results.push(idade >= parseInt(valids[i + 1]));
                            break;
                        case "maxage":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            var idade = InnerForm.getAge(value);
                            results.push(idade <= parseInt(valids[i + 1]));
                            break;
                        case "age":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            var idade = InnerForm.getAge(value);
                            results.push(idade == parseInt(valids[i + 1]));
                            break;
                        case "latitude":
                        case "lat":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateLatitude(value));
                            break;
                        case "longitude":
                        case "long":
                        case "lng":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateLongitude(value));
                            break;
                        case "coordinate":
                        case "coordinates":
                        case "coord":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateCoordinate(value));
                            break;
                        case "uuid":
                        case "guid":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateUUID(value));
                            break;

                        case 'pix':
                        case 'chavepix':
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }

                            results.push(InnerForm.validatePix(value));

                            break;
                        case 'regex':
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            var regext = InnerForm(this).attr('pattern') || InnerForm(this).data('regex') || "";
                            var flags = InnerForm(this).attr('data-regex-flags') || "";
                            if (InnerForm.isBlank(regext)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateRegex(value, regext, flags));
                            break;
                        case "oab":
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateOAB(value));
                            break;
                        case 'state':
                        case 'uf':
                            if (InnerForm.isBlank(value)) {
                                results.push(true);
                                break;
                            }
                            results.push(InnerForm.validateUF(value));
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
                    InnerForm(this).addClass("error");
                    InnerForm(this)
                        .closest(".form-group")
                        .addClass("has-error");
                    InnerForm(this)
                        .get(0)
                        .setCustomValidity(InnerForm(this).attr("data-invalidmessage") || "");
                    eval(InnerForm(this).attr("data-invalidcallback") || "void(0)");
                    eval(InnerForm(this).attr("data-aftervalidatecallback") || "void(0)");
                    return false;
                }
            }

            if (InnerForm.trim(value) !== "") {
                InnerForm(this).addClass("success");
            }
            InnerForm(this).removeClass("error");
            eval(InnerForm(this).attr("data-validcallback") || "void(0)");
            eval(InnerForm(this).attr("data-aftervalidatecallback") || "void(0)");
            return true;
        }
    };

    /** Validates an element or form through the InnerForm API. @param {Object|string} element - Element or selector @returns {boolean} Whether the target is valid */
    InnerForm.isValid = function (element) {
        var args = Array.prototype.slice.call(arguments, 1);
        return InnerForm(element).isValid.apply(InnerForm(element), args);
    };



    /** Checks whether a value is null, undefined, or empty after trimming. @param {*} value - Value to check @returns {boolean} Whether the value is blank */
    InnerForm.isBlank = function (value) {
        return value === null || value === undefined || InnerForm.trim(value) === "";
    };

    /** Validates a value against a regular expression. @param {string} value - Value to validate @param {string|RegExp} pattern - Pattern or expression source @param {string} [flags] - Regular expression flags @returns {boolean} Whether the value matches */
    InnerForm.validateRegex = function (value, pattern, flags) {
        var regex = new RegExp(pattern, flags);
        return regex.test(value);
    }


    /** Validates a Brazilian phone number (at least 8 digits, ignoring masks). @param {string} value - Phone value @returns {boolean} Whether the phone is valid */
    InnerForm.validatePhone = function (value) {
        value = String(value || "")
            .replaceAll("(", "")
            .replaceAll(")", "")
            .replaceAll(" ", "")
            .replaceAll("-", "");
        return !isNaN(value) && value.length >= 8;
    };

    /** Validates a PIX key as email, CPF, CNPJ, phone, or UUID. @param {string} value - PIX key @returns {boolean} Whether the key is valid */
    InnerForm.validatePix = function (value) {
        /// Validar se é um email, cpf, cnpj ou telefone válido, ou se é uma chave aleatória válida (UUID)
        return InnerForm.validateEmail(value) ||
            InnerForm.validateCPF(value) ||
            InnerForm.validateCNPJ(value) ||
            InnerForm.validatePhone(value) ||
            InnerForm.validateUUID(value);
    }




    /** Validates an email address. @param {string} value - Email address @returns {boolean} Whether the address is valid */
    InnerForm.validateEmail = function (value) {
        var re = /^[\w-]+(\.[\w-]+)*@[\w]+(\.[a-z]{2,6})*(\.[a-z]{2,6})$/gi;
        return InnerForm.validateRegex(value, re);

    }

    if (typeof document !== "undefined") {
        var initInnerForm = function () {
            setTimeout(function () {
                InnerForm(document).on("keydown", ":input", function (e) {
                    if (e.key === "Backspace" || e.key === "Delete") {
                        isDeleting = true;
                    } else {
                        isDeleting = false;
                    }

                });
                InnerForm('form.validate, form[data-validate="true"], form[data-validation="true"], .forcevalidate').startValidation().startMasks();
                InnerForm(":input").each(function () {
                    InnerForm(this).focus(function () {
                        InnerForm(this).addClass("prevFocus");
                    });
                });
            }, 0);
        };
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initInnerForm);
        else initInnerForm();
    }


    /** Starts automatic masks for the current collection. @returns {Object} Chainable InnerForm collection */
    InnerForm.fn.startMasks = function () {

        InnerForm(this).find(".mask.phone, .mask.tel, .mask.cel").phoneMask();
        InnerForm(this).find(".mask.upper").upperMask();
        InnerForm(this).find(".mask.lower, .mask.email, .mask.mail").lowerMask();
        InnerForm(this).find(".mask.cpf").cpfMask();
        InnerForm(this).find(".mask.cnh").cnhMask();
        InnerForm(this).find(".mask.cep").cepMask();
        InnerForm(this).find(".mask.cnpj").cnpjMask();
        InnerForm(this).find(".mask.cpfcnpj, .mask.cnpjcpf").cpfCnpjMask();
        InnerForm(this).find(".mask.creditcard, .mask.debitcard").creditCardMask();
        InnerForm(this).find(".mask.date, .mask.data").dateMask();
        InnerForm(this).find(".mask.monthyear").monthYearMask();
        InnerForm(this).find(".mask.num, .mask.number, .mask.month, .mask.money, .mask.decimal, .mask.integer, .mask.int").numberMask();
        InnerForm(this).find(".mask.len").lenMask();
        InnerForm(this).find(".autocomplete.cep").cepAutoComplete();
        InnerForm(this).find(".mask.time").timeMask();
        InnerForm(this).find(".mask.shorttime, .mask.timeshort, .mask.minutesecond").shortTimeMask();
        InnerForm(this).find(".mask.dateshorttime, .mask.datetimeshort").dateShortTimeMask();
        InnerForm(this).find(".mask.datetime").dateTimeMask();
        InnerForm(this).find(".mask.alpha").alphaMask();
        InnerForm(this).find(".mask.alphanum, .mask.alphanumeric").alphaNumericMask();
        InnerForm(this).find(".mask.state, .mask.uf").ufMask();
        InnerForm(this).find(".mask.nospace").noSpaceMask();
        InnerForm(this).find(".mask.maxlen").maxLenMask();
        InnerForm(this).find(".mask.leadingzero").leadingZeroMask();
        InnerForm(this).find(".mask.daterange").dateRangeMask();
        InnerForm(this).find(".mask.monthyearrange").monthYearRangeMask();
        InnerForm(this).find(".mask.shortmonthyearrange").shortMonthYearRangeMask();
        InnerForm(this).find(".mask.uuid").uuidMask();
        InnerForm(this).find(".mask.oab").oabMask();
        InnerForm(this).find(".mask.latitude, .mask.lat").latitudeMask();
        InnerForm(this).find(".mask.longitude, .mask.long, .mask.lng").longitudeMask();
        return InnerForm(this);
    }

    /** Starts blur, change, type, and submit validation for the current collection. @returns {Object} Chainable InnerForm collection */
    InnerForm.fn.startValidation = function () {
        InnerForm(this).not(".notonblur").validateOnBlur();
        InnerForm(this).not(".notonchange").validateOnChange();
        InnerForm(this).find(".onkeyup").validateOnType();
        return InnerForm(this).on("submit", function () {
            InnerForm(this).find(":input").addClass('prevFocus');
            return InnerForm(this).isValid();
        });

    }

    /** Starts automatic masks on an element or selector. @param {Object|string} element - Target element or selector @returns {Object} Chainable collection */
    InnerForm.startMasks = function (element) {
        return InnerForm(element).startMasks();
    };

    /** Starts validation on an element or selector. @param {Object|string} element - Target element or selector @returns {Object} Chainable collection */
    InnerForm.startValidation = function (element) {
        return InnerForm(element).startValidation();
    };


    /** Validates fields after typing pauses. @param {number} time - Delay in milliseconds @returns {Object} Chainable collection */
    InnerForm.fn.validateOnType = function (time) {
        time = time || InnerForm.onTypeTimeout;
        let x = InnerForm(this)
            .on("keyup", function () {
                var p = InnerForm(this);
                p.removeClass("error");
                p.closest(".form-group").removeClass("has-error");
                if (InnerForm.onTypeTimeoutFunction) {
                    clearTimeout(InnerForm.onTypeTimeoutFunction);
                }
                InnerForm.onTypeTimeoutFunction = setTimeout(function () {
                    p.isValid();
                }, time);
            });
        InnerForm.log("InnerFormValidation:", "Validation on Type started", x, "delay", time);
        return x;
    }

    /**
     * Fires validation when the input loses focus
     * @returns 
     */
    InnerForm.fn.validateOnBlur = function () {
        return InnerForm(this).validateOn("blur");
    }
    /**
     * Fires validation on the given event
     * @param {string} event 
     * @returns 
     */
    InnerForm.fn.validateOn = function (event) {
        let x = InnerForm(this)
            .on(event, function () {
                InnerForm(this).isValid();
            });
        InnerForm.log("InnerFormValidation:", "Validation on " + event + " started", x);
        return x;
    }

    InnerForm.fn.validateOnChange = function () {
        return InnerForm(this).validateOn("change");
    }


    InnerForm.fn.phoneMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyPhoneMask(this);
        });
        InnerForm.log("InnerFormValidation:", "PhoneMask started", x);
        return x;
    }


    /** Applies the uppercase mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.upperMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyUpperMask(this);
        });
        InnerForm.log("InnerFormValidation:", "UpperMask started", x);
        return x;
    }


    /** Applies the lowercase mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.lowerMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyLowerMask(this);
        });
        InnerForm.log("InnerFormValidation:", "LowerMask started", x);
        return x;
    }

    /** Applies the CPF mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.cpfMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyCPFMask(this);
        });
        InnerForm.log("InnerFormValidation:", "CpfMask started", x);
        return x;
    }


    /** Applies the CEP mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.cepMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyCEPMask(this);
        });
        InnerForm.log("InnerFormValidation:", "CepMask started", x);
        return x;
    }


    /** Applies the CNPJ mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.cnpjMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyCNPJMask(this);
        });
        InnerForm.log("InnerFormValidation:", "CnpjMask started", x);
        return x;
    }


    /** Applies the CNH mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.cnhMask = function () {
        let x = InnerForm(this).on('input', function () {
            InnerForm.applyCNHMask(this);
        });
        InnerForm.log('InnerFormValidation:', 'CNHMask started', x);
        return x;
    }

    /** Applies the CPF or CNPJ mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.cpfCnpjMask = function () {
        let x = InnerForm(this).on('input', function () {
            InnerForm.applyCPForCNPJMask(this);
        });
        InnerForm.log("InnerFormValidation:", "CpfCnpjMask started", x);
        return x;
    }


    /** Applies the credit card mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.creditCardMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyCreditCardMask(this);
        });
        InnerForm.log("InnerFormValidation:", "CreditCardMask started", x);
        return x;
    }

    /** Applies the date mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.dateMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyDateMask(this);
        });
        InnerForm.log("InnerFormValidation:", "DateMask started", x);
        return x;
    }

    /** Applies the month/year mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.monthYearMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyMonthYearMask(this);
        });
        InnerForm.log("InnerFormValidation:", "MonthYearMask started", x);
        return x;
    }

    /** Applies the number mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.numberMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyNumberMask(this);
        });
        InnerForm.log("InnerFormValidation:", "NumberMask started", x);
        return x;
    }

    /** Applies the date range mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.dateRangeMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyDateRangeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "DateRangeMask started", x);
        return x;
    }

    /** Applies the short month/year range mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.shortMonthYearRangeMask = function () {

        let x = InnerForm(this).on("input", function () {
            InnerForm.applyShortMonthYearRangeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "ShortMonthYearRangeMask started", x);
        return x;

    }
    /** Applies the month/year range mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.monthYearRangeMask = function () {

        let x = InnerForm(this).on("input", function () {
            InnerForm.applyMonthYearRangeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "MonthYearRangeMask started", x);
        return x;
    }

    /** Limits the length of fields in the current collection. @param {number} [tam] - Maximum length @returns {Object} Chainable collection */
    InnerForm.fn.lenMask = function (tam) {
        let x = InnerForm(this).on("input", function () {
            var array = InnerForm(this)
                .attr("class")
                .split(" ")
                .filter(function (el) {
                    return el != null && el != "";
                });
            tam = tam || parseInt(array[array.indexOf("len") + 1]);
            if (!isNaN(tam)) {
                InnerForm(this).attr("maxlength", tam);
                InnerForm(this).val(
                    InnerForm(this)
                        .val()
                        .substring(0, tam)
                );
            }
        });
        InnerForm.log("InnerFormValidation:", "LenMax started", x);
        return x;
    }

    /** Enables ViaCEP autocomplete for the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.cepAutoComplete = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.searchViaCEP(
                InnerForm(this).val(),
                InnerForm(".autocomplete.homenum").val() || InnerForm(".autocomplete.homenumber").val() || InnerForm(".autocomplete.number").val() || InnerForm(".autocomplete.num").val(),
                InnerForm(this).data('timeout') || 0
            );
        });
        InnerForm.log("InnerFormValidation:", "Autocomplete for CEP started", x);
        return x;
    }

    /** Applies the time mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.timeMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyTimeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "TimeMask started", x);
        return x;
    }

    /** Applies the short time mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.shortTimeMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyShortTimeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "ShortTimeMask started", x);
        return x;

    }

    /** Applies the short date/time mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.dateShortTimeMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyDateShortMask(this);
        });
        InnerForm.log("InnerFormValidation:", "DateShortTimeMask started", x);
        return x;
    }

    /** Applies the date/time mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.dateTimeMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyDateTimeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "DateTimeMask started", x);
        return x;
    }

    /** Applies the alphabetic mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.alphaMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyAlphaMask(this);
        });
        InnerForm.log("InnerFormValidation:", "AlphaMask started", x);
        return x;
    }

    /** Applies the alphanumeric mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.alphaNumericMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyAlphaNumericMask(this);
        });
        InnerForm.log("InnerFormValidation:", "AlphaNumericMask started", x);
        return x;
    }

    /** Applies the UF mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.ufMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyUFMask(this);
        });
        InnerForm.log("InnerFormValidation:", "UFMask started", x);
        return x;
    }


    /** Applies the no-space mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.noSpaceMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyNoSpaceMask(this);
        });
        InnerForm.log("InnerFormValidation:", "NoSpaceMask started", x);
        return x;
    }

    /** Applies the UUID mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.uuidMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyUUIDMask(this);
        });
        InnerForm.log("InnerFormValidation:", "UUIDMask started", x);
        return x;
    }

    /** Applies the OAB mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.oabMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyOABMask(this);
        });
        InnerForm.log("InnerFormValidation:", "OABMask started", x);
        return x;
    }

    /** Applies the latitude mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.latitudeMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyLatitudeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "LatitudeMask started", x);
        return x;
    }

    /** Applies the longitude mask to the current collection. @returns {Object} Chainable collection */
    InnerForm.fn.longitudeMask = function () {
        let x = InnerForm(this).on("input", function () {
            InnerForm.applyLongitudeMask(this);
        });
        InnerForm.log("InnerFormValidation:", "LongitudeMask started", x);
        return x;
    }

    /** Limits field values to the configured maximum length. @returns {Object} Chainable collection */
    InnerForm.fn.maxLenMask = function () {
        let x = InnerForm(this).on("input", function () {
            var array = InnerForm(this)
                .attr("class")
                .split(" ")
                .filter(function (el) {
                    return el != null && el != "";
                });
            var tam = parseInt(array[array.indexOf("len") + 1] || array[array.indexOf("maxlen") + 1]);
            if (!isNaN(tam)) {
                InnerForm(this).attr("maxlength", tam);
                InnerForm(this).val(
                    InnerForm(this)
                        .val()
                        .substring(0, tam)
                );
            }
        });
        InnerForm.log("InnerFormValidation:", "MaxLenMask started", x);
        return x;
    }



    /** Pads field values with leading zeros on blur. @returns {Object} Chainable collection */
    InnerForm.fn.leadingZeroMask = function () {
        let x = InnerForm(this).on("blur", function () {
            var array = InnerForm(this)
                .attr("class")
                .split(" ")
                .filter(function (el) {
                    return el != null && el != "";
                });
            var tam = parseInt(array[array.indexOf("len") + 1] || array[array.indexOf("minlen") + 1]);
            if (!isNaN(tam)) {
                InnerForm(this).val(
                    InnerForm.addLeadingZeros(InnerForm(this).val(), tam)
                ).isValid();
            }
        });
        InnerForm.log("InnerFormValidation:", "LeadingZeroMask started", x);
        return x;
    }

    /**
     * Obtém a localização atual do usuário usando a API de Geolocalização do navegador
     * @function getLocation
     * @memberof InnerFormValidation
     * @param {Object} [options] - Opções para a geolocalização
     * @param {number} [options.timeout=10000] - Tempo limite em milissegundos
     * @param {number} [options.maximumAge=60000] - Idade máxima aceitável para uma posição em cache (ms)
     * @param {boolean} [options.enableHighAccuracy=true] - Solicitar alta precisão
     * @returns {Promise} Promise que resolve com objeto contendo informações de localização
     */
    InnerForm.getLocation = function (options) {
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
            var geoOptions = Object.assign({}, defaultOptions, options || {});

            InnerForm.log('Obtendo localização do usuário...', geoOptions);

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
                InnerForm(".autocomplete.latitude:input, .autocomplete.lat:input")
                    .setOrReplaceVal(coords.latitude)
                    .change().focus();
                InnerForm(".autocomplete.longitude:input, .autocomplete.long:input")
                    .setOrReplaceVal(coords.longitude)
                    .change().focus();

                // Preenche elementos não-input também
                InnerForm(".autocomplete.latitude, .autocomplete.lat")
                    .not(":input")
                    .text(coords.latitude);
                InnerForm(".autocomplete.longitude, .autocomplete.long")
                    .not(":input")
                    .text(coords.longitude);

                InnerForm.log('Localização obtida com sucesso:', locationData);
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

                InnerForm.error('Erro ao obter localização:', errorInfo);
                reject(errorInfo);
            }

            // Solicita a posição atual
            navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
        });
    };

    /**
     * Monitora continuamente a localização do usuário
     * @function watchLocation
    * @memberof InnerFormValidation
     * @param {Function} callback - Função chamada a cada atualização de posição
     * @param {Function} [errorCallback] - Função chamada em caso de erro
     * @param {Object} [options] - Opções para a geolocalização
     * @returns {number} ID do watcher que pode ser usado para parar o monitoramento
     */
    InnerForm.watchLocation = function (callback, errorCallback, options) {
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

        var geoOptions = Object.assign({}, defaultOptions, options || {});

        InnerForm.log('Iniciando monitoramento de localização...', geoOptions);

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
            InnerForm(".autocomplete.latitude:input, .autocomplete.lat:input")
                .setOrReplaceVal(coords.latitude)
                .change().focus();
            InnerForm(".autocomplete.longitude:input, .autocomplete.long:input")
                .setOrReplaceVal(coords.longitude)
                .change().focus();

            // Preenche elementos não-input também
            InnerForm(".autocomplete.latitude, .autocomplete.lat")
                .not(":input")
                .text(coords.latitude);
            InnerForm(".autocomplete.longitude, .autocomplete.long")
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
     * @memberof InnerFormValidation
     * @param {number} watchId - ID retornado por watchLocation
     */
    InnerForm.clearLocationWatch = function (watchId) {
        if (watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
            InnerForm.log('Monitoramento de localização parado:', watchId);
        }
    };


    /// implements jQuery plugin if jQuery is present
    if (root.jQuery && root.jQuery.fn) {
        var previousJQueryConfig = root.jQuery.innerForm;
        if (previousJQueryConfig && previousJQueryConfig !== InnerForm) {
            if (typeof previousJQueryConfig.verbose === "boolean") {
                InnerForm.verbose = previousJQueryConfig.verbose;
            }
            if (typeof previousJQueryConfig.onTypeTimeout === "number") {
                InnerForm.onTypeTimeout = previousJQueryConfig.onTypeTimeout;
            }
        }
        root.jQuery.innerForm = InnerForm;

        // Create a helper to convert jQuery object to InnerForm collection
        var toInnerForm = function (jq) {
            return InnerForm(jq.get());
        };

        // Wrap InnerForm.fn methods to work with jQuery objects
        var wrapMethod = function (methodName) {
            var originalMethod = InnerForm.fn[methodName];
            if (typeof originalMethod !== "function") return;
            root.jQuery.fn[methodName] = function () {
                var innerFormCollection = toInnerForm(this);
                var result = originalMethod.apply(innerFormCollection, arguments);
                // If the result is an InnerForm collection, return the jQuery object for chaining
                // Otherwise return the actual result
                return (result && result.elements) ? this : result;
            };
        };

        // Only add methods that don't already exist in jQuery.fn
        Object.keys(InnerForm.fn).forEach(function (methodName) {
            if (!(methodName in root.jQuery.fn)) {
                wrapMethod(methodName);
            }
        });
    }

    InnerForm.log('InnerFormValidation Loaded');
})(typeof window !== "undefined" ? window : globalThis);
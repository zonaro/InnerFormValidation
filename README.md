# 🚀 InnerFormValidation

**A complete JavaScript library for form masking and validation, dependency-free and with a native callable API.**

## Documentation

See the [complete documentation site](index.html), with interactive examples, API reference, standalone installation, jQuery compatibility, postal-code autocomplete, and geolocation.

[![CDN](https://img.shields.io/badge/CDN-Available-brightgreen)](https://cdn.jsdelivr.net/gh/zonaro/InnerFormValidation@master/InnerFormValidation.js)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Standalone](https://img.shields.io/badge/JavaScript-standalone-brightgreen)](index.html)

## 📖 Table of Contents

1. [Installation and Configuration](#installation-and-configuration)
2. [Basic Configuration](#basic-configuration)
3. [Validation Classes](#validation-classes)
4. [Mask Classes](#mask-classes)
5. [Advanced Validations](#advanced-validations)
6. [Callbacks System](#callbacks-system)
7. [Address Autocomplete](#address-autocomplete)
8. [Geolocation](#geolocation)
9. [Practical Examples](#practical-examples)
10. [JavaScript API](#javascript-api)
11. [InnerFormValidation Functions](#innerformvalidation-functions)
12. [Visual Customization](#visual-customization)

---

## 🛠️ Installation and Configuration

### CDN
```html
<!-- Recommended: works without jQuery -->
<script src="https://cdn.jsdelivr.net/gh/zonaro/InnerFormValidation@master/InnerFormValidation.js"></script>
<script>
    InnerForm.validateCPF('529.982.247-25');
</script>
```

To use it as a jQuery plugin, load jQuery before the same CDN address:
```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>jQuery.innerForm = { verbose: true }</script>
<script src="https://cdn.jsdelivr.net/gh/zonaro/InnerFormValidation@master/InnerFormValidation.js"></script>
```

### Local Download
1. Download the `InnerFormValidation.js` file
2. Include it in your project:
```html
<script>InnerForm.verbose = true</script>
<script src="path/to/InnerFormValidation.js"></script>
```

### Dependencies
- None for the standalone API.
- jQuery is optional and enables the legacy plugin methods in `jQuery.fn`.
- The library never overwrites `$` or uses jQuery in its core.

### Standalone API
```html
<script src="InnerFormValidation.js"></script>
<script>
    const valid = InnerForm.validateCPF('529.982.247-25');
    InnerForm.applyCPFMask(document.querySelector('#cpf'));
    InnerForm.isValid(document.querySelector('form'));
</script>
```

---

## ⚙️ Basic Configuration

### 1. Base HTML Structure
```html
<form class="validate">
    <input type="text" class="form-control obg minlen 5" placeholder="Minimum 5 characters">
    <button type="submit">Enviar</button>
</form>
```

### 2. Fundamental Classes
- **`validate`**: Add to the `<form>` element to enable validation
- **`mask`**: Combine with other classes to apply masks automatically
- **`onkeyup`**: Validate as the user types (with a 900ms delay)

### 3. Global Configuration
```javascript
InnerForm.verbose = true;
InnerForm.onTypeTimeout = 1000;
```

To select elements with the native API, use the function itself:
```javascript
InnerForm('#meu-formulario').isValid();
```

---

## ✅ Validation Classes

### **Required Fields**

| Class                  | Description    | Example               |
| ---------------------- | -------------- | --------------------- |
| `obg` `req` `required` | Required field | `<input class="obg">` |

### **Format Validation**

| Class                    | Description                        | Mask Compatible | Example                          |
| ------------------------ | ---------------------------------- | --------------- | -------------------------------- |
| `email` `mail`           | Valid email                        | ❌               | `<input class="email">`          |
| `url` `link`             | Valid URL                          | ✅               | `<input class="mask url">`       |
| `cpf`                    | Valid Brazilian CPF                | ✅               | `<input class="mask cpf">`       |
| `cnpj`                   | Valid Brazilian CNPJ               | ✅               | `<input class="mask cnpj">`      |
| `cpfcnpj`                | Valid CPF or CNPJ                  | ✅               | `<input class="mask cpfcnpj">`   |
| `cep`                    | Valid Brazilian postal code        | ✅               | `<input class="mask cep">`       |
| `cnh`                    | Valid Brazilian CNH                | ✅               | `<input class="mask cnh">`       |
| `tel` `cel`              | Brazilian phone/mobile             | ✅               | `<input class="mask tel">`       |
| `ean`                    | EAN barcode                        | ❌               | `<input class="ean">`            |
| `uuid`                   | Valid UUID/GUID                    | ✅               | `<input class="mask uuid">`      |
| `pix` `chavepix`         | Valid PIX key                      | ❌               | `<input class="pix">`            |
| `latitude` `lat`         | Latitude coordinate                | ✅               | `<input class="mask latitude">`  |
| `longitude` `long` `lng` | Longitude coordinate               | ✅               | `<input class="mask longitude">` |
| `uf` `state`             | State abbreviation (UF)            | ✅               | `<input class="mask uf">`        |
| `oab`                    | OAB registration (1-6 digits + UF) | ✅               | `<input class="mask oab">`       |


### **Number Validation and Masking with Custom Separators**

Fields with the `num` or `number` classes now support the following attributes for format customization:

| Attribute        | Description                                                                          | Example                                         |
| ---------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `data-separator` | Defines the decimal separator (e.g. `,` or `.`). Takes priority over `data-decimal`. | `<input class="mask num" data-separator="," />` |
| `data-decimal`   | Defines the number of decimal places (e.g. `2`).                                     | `<input class="mask num" data-decimal="2" />`   |
| `data-thousand`  | Defines the thousands separator (e.g. `.` or `,`).                                   | `<input class="mask num" data-thousand="." />`  |

**Priority rules:**
- If `data-separator` exists, it is used as the decimal separator.
- Otherwise, the value of `data-decimal` is used (default: 2 decimal places, separator `,`).
- The `data-thousand` attribute is optional and defines the thousands separator.

**Usage example:**
```html
<!-- Number with comma as decimal separator and period as thousands separator -->
<input class="form-control mask num" data-separator="," data-thousand="." placeholder="1.234,56">

<!-- Number with period as decimal separator and comma as thousands separator -->
<input class="form-control mask num" data-separator="." data-thousand="," placeholder="1,234.56">

<!-- Number with 3 decimal places and no thousands separator -->
<input class="form-control mask num" data-decimal="3" placeholder="1234,567">
```

**Validation also respects these attributes and accepts only the configured format.**

---
### **Character Validation**

| Class                     | Description         | Mask Compatible | Example                         |
| ------------------------- | ------------------- | --------------- | ------------------------------- |
| `alpha`                   | Letters only (A-Z)  | ✅               | `<input class="mask alpha">`    |
| `alphanumeric` `alphanum` | Letters and numbers | ✅               | `<input class="mask alphanum">` |
| `num` `number`            | Numbers only        | ✅               | `<input class="mask num">`      |
| `upper`                   | Uppercase only      | ✅               | `<input class="mask upper">`    |
| `lower`                   | Lowercase only      | ✅               | `<input class="mask lower">`    |
| `nospace`                 | Forbid spaces       | ✅               | `<input class="mask nospace">`  |

### **Date and Time Validation**

| Class                   | Format                  | Mask Compatible | Example                                    |
| ----------------------- | ----------------------- | --------------- | ------------------------------------------ |
| `date` `data`           | dd/MM/yyyy              | ✅               | `<input class="mask date">`                |
| `time`                  | hh:mm:ss                | ✅               | `<input class="mask time">`                |
| `timeshort` `shorttime` | hh:mm                   | ✅               | `<input class="mask timeshort">`           |
| `datetime`              | dd/MM/yyyy hh:mm:ss     | ✅               | `<input class="mask datetime">`            |
| `datetimeshort`         | dd/MM/yyyy hh:mm        | ✅               | `<input class="mask datetimeshort">`       |
| `minutesecond`          | mm:ss                   | ✅               | `<input class="mask minutesecond">`        |
| `monthyear`             | MM/yyyy                 | ✅               | `<input class="mask monthyear">`           |
| `daterange`             | dd/MM/yyyy ~ dd/MM/yyyy | ✅               | `<input class="mask daterange">`           |
| `monthyearrange`        | MM/yyyy ~ MM/yyyy       | ✅               | `<input class="mask monthyearrange">`      |
| `shortmonthyearrange`   | MM/yy ~ MM/yy           | ✅               | `<input class="mask shortmonthyearrange">` |

### **Length Validation**

| Class                  | Description            | Example                              |
| ---------------------- | ---------------------- | ------------------------------------ |
| `len <number>`         | Exactly X characters   | `<input class="len 10">`             |
| `minlen <number>`      | At least X characters  | `<input class="minlen 5">`           |
| `maxlen <number>`      | At most X characters   | `<input class="maxlen 20">`          |
| `leadingzero <number>` | Pad with leading zeros | `<input class="mask leadingzero 8">` |

---

## 🔍 Specific Validations: UF, OAB, and CNH

- `uf` or `state`: validates whether the abbreviation is a valid Brazilian UF.
- `oab`: validates whether the input uses the format `Nº(1-6 digits)` + `UF` (e.g. `511061SP` or `511.061/SP`).
- `cnh`: validates whether the Brazilian CNH is valid and does not contain a repeated sequence (e.g. `000.000.000-00`).

### HTML Usage
```html
<input type="text" class="form-control uf onkeyup" placeholder="SP" />
<input type="text" class="form-control mask oab onkeyup" placeholder="511061SP" />
```

### Available JavaScript API
```js
InnerForm.validateUF('RJ');           // true
InnerForm.validateUF('ZZ');           // false
InnerForm.validateOAB('511061SP');    // true
InnerForm.validateOAB('511.061/SP');  // true
InnerForm.validateOAB('12345RJ');     // true
InnerForm.validateOAB('123456SA');    // false (invalid UF)

InnerForm.validateCNH('98765432100'); // true/false conforme DV
InnerForm.validateCNH('00000000000'); // false
InnerForm.validateCNH('987.654.321-00'); // true/false
InnerForm.validateCEP('01310-100'); // true (ignora a máscara)
InnerForm.validatePhone('(11) 98765-4321'); // true
```
---

## ✅ Mask Classes

> **Note**: Add the `mask` class together with the specific class to apply masks automatically.

### **Document Masks**
```html
<!-- CPF: 123.456.789-01 -->
<input class="form-control mask cpf">

<!-- CNPJ: 12.345.678/0001-90 -->
<input class="form-control mask cnpj">

<!-- Automatic CPF or CNPJ -->
<input class="form-control mask cpfcnpj">

<!-- CEP: 12345-678 -->
<input class="form-control mask cep">

<!-- CNH: 123.456.789-00 -->
<input class="form-control mask cnh">
```

### **Date and Time Masks**
```html
<!-- Date: dd/mm/yyyy -->
<input class="form-control mask date">

<!-- Date and time: dd/mm/yyyy hh:mm:ss -->
<input class="form-control mask datetime">

<!-- Time: hh:mm:ss -->
<input class="form-control mask time">

<!-- Month/Year: mm/yyyy -->
<input class="form-control mask monthyear">

<!-- Date range: dd/mm/yyyy ~ dd/mm/yyyy -->
<input class="form-control mask daterange">

<!-- Month/Year range: mm/yyyy ~ mm/yyyy -->
<input class="form-control mask monthyearrange">

<!-- Short Month/Year range: mm/yy ~ mm/yy -->
<input class="form-control mask shortmonthyearrange">
```

### **Communication Masks**
```html
<!-- Telefone: (11) 1234-5678 ou (11) 12345-6789 -->
<input class="form-control mask tel">

<!-- URL: automaticamente formata -->
<input class="form-control mask url">
```

### **Card Masks**
```html
<!-- Any card: 1234 5678 9012 3456 -->
<input class="form-control mask creditcard">

<!-- Specific card (Visa only) -->
<input class="form-control mask creditcard visa">
```

### **Formatting Masks**
```html
<!-- Uppercase only -->
<input class="form-control mask upper">

<!-- Lowercase only -->
<input class="form-control mask lower alpha">

<!-- No spaces -->
<input class="form-control mask nospace">

<!-- Numbers with leading zeros -->
<input class="form-control mask num len 8 leadingzero">

<!-- UUID/GUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -->
<input class="form-control mask uuid">
```

---

## 🔥 Advanced Validations

### **Age Validation**
```html
<!-- Over 18 years old -->
<input class="form-control mask date minage 18" placeholder="Date of Birth">

<!-- Under 65 years old -->
<input class="form-control mask date maxage 65">

<!-- Exactly 30 years old -->
<input class="form-control mask date age 30">
```

### **Numeric Comparison Validation**
```html
<!-- Greater than 10 -->
<input class="form-control num after 10">

<!-- Less than 100 -->
<input class="form-control num before 100">

<!-- Between 1 and 10 -->
<input class="form-control num 1 to 10">
```

### **Date Comparison Validation**
```html
<!-- After today -->
<input class="form-control mask date after today">

<!-- Before a specific date -->
<input class="form-control mask date before 31/12/2023">

<!-- Between two dates -->
<input class="form-control mask date 01/01/2023 to 31/12/2023">
```

### **Password Validation**
```html
<!-- Strong password (4 of 4 criteria: uppercase, lowercase, number, symbol) -->
<input type="password" class="form-control password strong minlen 8">

<!-- Medium password (3 of 4 criteria) -->
<input type="password" class="form-control password medium minlen 6">

<!-- Custom password (2 of 4 criteria) -->
<input type="password" class="form-control password 2 minlen 4">
```

### **Credit Card Validation**

#### Supported Cards:
- `visa` - Visa
- `mastercard` - Mastercard  
- `amex` - American Express
- `diners` - Diners Club
- `discover` - Discover
- `elo` - Elo
- `hiper` - Hiper
- `jcb` - JCB
- `aura` - Aura
- `maestro` - Maestro

```html
<!-- Any valid card -->
<input class="form-control mask creditcard">

<!-- Visa or Mastercard only -->
<input class="form-control mask creditcard visa mastercard">
```

### **UUID/GUID Validation**
```html
<!-- Valid UUID/GUID in any format -->
<input class="form-control uuid">

<!-- UUID with automatic masking -->
<input class="form-control mask uuid">
```

### **PIX Key Validation**
```html
<!-- Accepts email, CPF, CNPJ, phone number, or UUID -->
<input class="form-control pix">

<!-- Equivalent alias -->
<input class="form-control chavepix">
```

### **String Content Validation**
```html
<!-- Must contain a space -->
<input class="form-control contains _space">

<!-- Must contain specific text -->
<input class="form-control contains @gmail.com">

<!-- Must contain any of the characters -->
<input class="form-control containsanychar {}()">

<!-- Must contain all of the characters -->
<input class="form-control containsallchar ABC">

<!-- Must NOT contain specific characters -->
<input class="form-control notcontainschar ABCD">
```

### **Equality Validation**
```html
<!-- Compare with another field -->
<input id="senha" type="password" class="form-control">
<input class="form-control eq #senha" placeholder="Confirm Password">

<!-- Compare with a specific value -->
<input class="form-control eqv admin" placeholder="Digite 'admin'">
```

---

## 🎯 Callbacks System

Use `data-*` attributes to run JavaScript code on validation events:

### **Available Callbacks**
```html
<input class="form-control obg" 
    data-beforevalidatecallback="console.log('Before validation')"
    data-validcallback="$('#success').show()"
    data-invalidcallback="$('#error').show()"
    data-aftervalidatecallback="console.log('After validation')">
```

### **HTML5 Message Callback**
```html
<input class="form-control obg" 
    data-invalidmessage="This field is required! 😊">
```

### **Practical Callback Example**
```html
<input class="form-control obg eq #div_OK" 
    data-invalidcallback="$('#status').text('❌ Invalid').css('color','red')"
    data-validcallback="$('#status').text('✅ Valid').css('color','green')">
<div id="status"></div>
```

---

## 🏠 Address Autocomplete System

InnerFormValidation includes integration with the **ViaCEP** API for Brazilian address autocomplete.

### **Autocomplete Classes**

| Class                               | Description                                    | Example                                     |
| ----------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `autocomplete cep`                  | Postal-code field that searches for an address | `<input class="autocomplete cep mask">`     |
| `autocomplete address`              | Recebe logradouro                              | `<input class="autocomplete address">`      |
| `autocomplete neighborhood`         | Recebe bairro                                  | `<input class="autocomplete neighborhood">` |
| `autocomplete city`                 | Recebe cidade                                  | `<input class="autocomplete city">`         |
| `autocomplete state`                | Recebe estado (UF)                             | `<input class="autocomplete state">`        |
| `autocomplete fulladdress`          | Receives the complete address                  | `<p class="autocomplete fulladdress"></p>`  |
| `autocomplete num` `number`         | Number field (receives focus)                  | `<input class="autocomplete num">`          |
| `autocomplete homenum` `homenumber` | House number (alphanumeric)                    | `<input class="autocomplete homenum">`      |
| `autocomplete ddd`                  | Regional area code                             | `<input class="autocomplete ddd">`          |
| `autocomplete ibge`                 | IBGE code                                      | `<input class="autocomplete ibge">`         |
| `autocomplete gia`                  | GIA code                                       | `<input class="autocomplete gia">`          |
| `autocomplete latitude` `lat`       | Recebe latitude automaticamente                | `<input class="autocomplete latitude">`     |
| `autocomplete longitude` `long`     | Recebe longitude automaticamente               | `<input class="autocomplete longitude">`    |
| `autocomplete siafi`                | SIAFI code                                     | `<input class="autocomplete siafi">`        |

### **Complete Address Example**
```html
<div class="row">
    <div class="col-md-4">
        <label>CEP</label>
        <input class="form-control mask cep autocomplete obg" placeholder="00000-000">
    </div>
    <div class="col-md-6">
        <label>Address</label>
        <input class="form-control autocomplete address" readonly>
    </div>
    <div class="col-md-2">
        <label>Number</label>
        <input class="form-control autocomplete homenum">
    </div>
    <div class="col-md-4">
        <label>Bairro</label>
        <input class="form-control autocomplete neighborhood" readonly>
    </div>
    <div class="col-md-4">
        <label>Cidade</label>
        <input class="form-control autocomplete city" readonly>
    </div>
    <div class="col-md-4">
        <label>Estado</label>
        <input class="form-control autocomplete state" readonly>
    </div>
</div>
```

### **Controlling Value Replacement**
```html
<!-- Do not replace value if already filled -->
<input class="form-control autocomplete address noreplace">
```

---

## 📍 Geolocation

InnerFormValidation includes advanced geolocation functions that use the browser's native API to obtain the user's location information.

### **Main Function: `InnerForm.getLocation()`**

Asynchronously obtains the user's current location using Promises.

```javascript
// Basic usage
InnerForm.getLocation()
    .then(function(location) {
        console.log('Latitude:', location.latitude);
        console.log('Longitude:', location.longitude);
        console.log('Accuracy:', location.accuracyFormatted);
        
        // Fill form fields
        $('#latitude').val(location.latitude);
        $('#longitude').val(location.longitude);
    })
    .catch(function(error) {
        console.error('Error:', error.userMessage);
        alert('Error obtaining location: ' + error.userMessage);
    });

// Usage with custom options
InnerForm.getLocation({
    enableHighAccuracy: true,  // High accuracy
    timeout: 15000,           // 15-second timeout
    maximumAge: 60000         // 60-second cache
})
.then(function(location) {
    // Location obtained successfully
    console.log('Coordinates:', location.coordinates);
    console.log('Google Maps:', location.googleMapsUrl);
})
.catch(function(error) {
    // Handle error
    console.error('Geolocation error:', error);
});
```

### **Location Response Object**

The function returns a rich object with location information:

```javascript
{
    // Main coordinates
    latitude: -23.5505,
    longitude: -46.6333,
    
    // Accuracy
    accuracy: 65.0,                    // In meters
    accuracyFormatted: "65 meters",    // Formatted for display
    altitudeAccuracy: 12.0,            // Altitude accuracy
    
    // Altitude (may be null)
    altitude: 760.5,                   // In meters
    
    // Heading and speed (may be null)
    heading: 180.5,                    // Heading in degrees
    speed: 2.5,                        // Speed in m/s
    
    // Time information
    timestamp: 1704067200000,          // Timestamp
    formattedTime: "01/01/2024 10:00:00", // Formatted date/time
    
    // Useful map URLs
    googleMapsUrl: "https://www.google.com/maps?q=-23.5505,-46.6333",
    osmUrl: "https://www.openstreetmap.org/?mlat=-23.5505&mlon=-46.6333&zoom=15",
    
    // Information formatted for display
    coordinates: "-23.550500, -46.633300",  // Formatted coordinates
}
```

### **Geolocation Autocomplete**

**Automatic Coordinate Population**

Fields with geolocation classes are automatically populated when a location is obtained:

```html
<!-- Automatically populated fields -->
<input type="text" class="form-control autocomplete latitude" readonly>
<input type="text" class="form-control autocomplete longitude" readonly>

<!-- Short versions -->
<input type="text" class="form-control autocomplete lat" readonly>
<input type="text" class="form-control autocomplete long" readonly>

<!-- Non-input elements are populated as well -->
<div class="autocomplete latitude">Waiting for location...</div>
<span class="autocomplete longitude">-</span>
```

**Autocomplete behavior:**
- 🔄 **Automatic**: Populated every time `getLocation()` or `watchLocation()` returns a position
- 📝 **Editable fields**: If the field does not have `readonly`, uses `.setOrReplaceVal()` (only fills it when empty or without `.noreplace`)
- 🔗 **Non-input elements**: Divs, spans, etc. have their `text()` updated
- ⚡ **Real time**: During continuous monitoring, fields are updated with every position change

**Usage Example:**

```javascript
// When this function is called, the .autocomplete.latitude
// and .autocomplete.longitude fields are automatically populated!
InnerForm.getLocation().then(function(location) {
    console.log('Fields populated automatically!');
    // location.latitude -> .autocomplete.latitude
    // location.longitude -> .autocomplete.longitude
});

// During monitoring, fields are updated in real time
var watchId = InnerForm.watchLocation(function(location) {
    // Fields updated automatically with every change
    console.log('Position updated:', location.coordinates);
});
```

### **Continuous Location Monitoring**

For applications that need to track location changes:

```javascript
// Start monitoring
var watchId = InnerForm.watchLocation(
    function(location) {
        // Callback called on every position update
        console.log('New position:', location.coordinates);
        
        // Update the interface
        $('#latitude').val(location.latitude);
        $('#longitude').val(location.longitude);
        $('#lastUpdate').text(location.formattedTime);
    },
    function(error) {
        // Error callback
        console.error('Monitoring error:', error.userMessage);
        
        // Stop monitoring in case of error
        InnerForm.clearLocationWatch(watchId);
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,           // Shorter monitoring timeout
        maximumAge: 5000          // Smaller cache for fresher data
    }
);

// Stop monitoring when needed
InnerForm.clearLocationWatch(watchId);
```

### **Form Integration**

Practical example of integrating form fields:

```html
<form class="validate">
    <div class="row">
        <div class="col-md-6">
            <label>Latitude</label>
            <input type="text" id="latitude" class="form-control autocomplete latitude" readonly>
        </div>
        <div class="col-md-6">
            <label>Longitude</label>
            <input type="text" id="longitude" class="form-control autocomplete longitude" readonly>
        </div>
        <div class="col-md-12">
            <button type="button" class="btn btn-primary" onclick="obterLocalizacao()">
                📍 Get My Location
            </button>
        </div>
    </div>
</form>

<script>
function obterLocalizacao() {
    // Mostrar loading
    $('#latitude').val('Obtendo...');
    $('#longitude').val('Obtendo...');
    
    InnerForm.getLocation()
        .then(function(location) {
            // Preencher campos
            $('#latitude').val(location.latitude);
            $('#longitude').val(location.longitude);
            
            // Feedback visual
            $('#latitude, #longitude').addClass('success');
        })
        .catch(function(error) {
            // Clear fields on error
            $('#latitude').val('');
            $('#longitude').val('');
            
            alert('Error: ' + error.userMessage);
        });
}
</script>
```

### **Error Handling**

The geolocation API can fail for several reasons. The library provides user-friendly messages:

```javascript
InnerForm.getLocation()
    .catch(function(error) {
        switch (error.error) {
            case 'PERMISSION_DENIED':
                alert('You must allow location access');
                break;
            case 'POSITION_UNAVAILABLE':
                alert('Location is currently unavailable');
                break;
            case 'TIMEOUT':
                alert('Tempo limite excedido. Tente novamente');
                break;
            case 'GEOLOCATION_NOT_SUPPORTED':
                alert('Your browser does not support geolocation');
                break;
            default:
                alert('Error desconhecido: ' + error.message);
        }
    });
```

### **Configuration Options**

| Option               | Type    | Default | Description                                |
| -------------------- | ------- | ------- | ------------------------------------------ |
| `enableHighAccuracy` | boolean | true    | Requests high accuracy (GPS when possible) |
| `timeout`            | number  | 10000   | Tempo limite em milissegundos              |
| `maximumAge`         | number  | 60000   | Maximum acceptable cache age (ms)          |

### **Requirements and Limitations**

1. **HTTPS Required**: Geolocation works only on HTTPS sites (or localhost)
2. **User Permission**: The browser always requests permission
3. **Variable Accuracy**: Depends on the device (GPS, WiFi, cell towers)
4. **Compatibility**: Works in modern browsers that support the Geolocation API

### **Practical Examples**

See the included example files:
- `ExampleSimples.html` - Basic implementation
- `ExampleGeolocalizacao.html` - Complete interface with monitoring
- `TestForm.html` - Dedicated section with all features

### **Complete Geolocation API**

```javascript
// Main function - get a single location
InnerForm.getLocation(options) // Retorna Promise

// Continuous monitoring
InnerForm.watchLocation(successCallback, errorCallback, options) // Retorna watchId

// Stop monitoring
InnerForm.clearLocationWatch(watchId)
```

---

## 🧪 Practical Examples

### **Complete Registration Form**
```html
<form class="validate">
    <div class="row">
        <!-- Dados Pessoais -->
        <div class="col-md-6">
            <label>Nome Completo *</label>
            <input class="form-control obg alpha" placeholder="Digite seu nome">
        </div>
        
        <div class="col-md-6">
            <label>Date of Birth (18+) *</label>
            <input class="form-control mask date obg minage 18" placeholder="dd/mm/aaaa">
        </div>
        
        <div class="col-md-6">
            <label>CPF *</label>
            <input class="form-control mask cpf obg" placeholder="000.000.000-00">
        </div>
        
        <div class="col-md-6">
            <label>Telefone *</label>
            <input class="form-control mask tel obg" placeholder="(00) 00000-0000">
        </div>
        
        <!-- Email -->
        <div class="col-md-12">
            <label>E-mail *</label>
            <input class="form-control email obg" placeholder="seu@email.com">
        </div>
        
        <!-- Address via CEP -->
        <div class="col-md-4">
            <label>CEP *</label>
            <input class="form-control mask cep autocomplete obg" placeholder="00000-000">
        </div>
        
        <div class="col-md-6">
            <label>Address</label>
            <input class="form-control autocomplete address" readonly>
        </div>
        
        <div class="col-md-2">
            <label>Number</label>
            <input class="form-control autocomplete homenum">
        </div>
        
        <!-- Password -->
        <div class="col-md-6">
            <label>Password *</label>
            <input id="password" type="password" class="form-control password strong minlen 8 obg">
        </div>
        
        <div class="col-md-6">
            <label>Confirm Password *</label>
            <input type="password" class="form-control eq #password obg">
        </div>
    </div>
    
    <button type="submit" class="btn btn-primary">Cadastrar</button>
</form>
```

### **Financial Form**
```html
<form class="validate">
    <!-- Card Details -->
    <div class="col-md-8">
        <label>Card Number</label>
        <input class="form-control mask creditcard visa mastercard obg">
    </div>
    
    <div class="col-md-4">
        <label>Validade</label>
        <input class="form-control mask monthyear obg">
    </div>
    
    <!-- Valores -->
    <div class="col-md-6">
        <label>Minimum Amount</label>
        <input class="form-control mask num after 0">
    </div>
    
    <div class="col-md-6">
        <label>Maximum Amount</label>
        <input class="form-control mask num 1 to 10000">
    </div>
    
    <!-- CNPJ da Empresa -->
    <div class="col-md-12">
        <label>CNPJ da Empresa</label>
        <input class="form-control mask cnpj obg">
    </div>
</form>
```

---

## 🔧 JavaScript API

### **Programmatic Validation**

#### Validate a specific element:
```javascript
// Validate an individual input
var isValid = $('#meuInput').isValid();

// Validate with custom classes
var isValid = $('#meuInput').isValid('obg', 'minlen 5');

 
```

#### Validate a complete form:
```javascript
// Validate the entire form
var isValid = $('#meuForm').isValid();

// Validate only fields that received focus
$('#meuForm').find(':input').addClass('prevFocus');
var isValid = $('#meuForm').isValid();
```

### **Draft Mode (Modo Rascunho)**

Draft mode ignores the **required** rule so an incomplete form can be saved as a draft — while other validations (email, CPF, etc.) still apply.

#### Enable draft mode

**1. HTML attribute** — add `data-draft` to the form:
```html
<form class="validate" data-draft>
    <input type="text" class="obg email" placeholder="Email">
    <button type="submit">Salvar rascunho</button>
</form>
```

**2. CSS class** — add the `draft` class to the form:
```html
<form class="validate draft">
    <input type="text" class="obg email" placeholder="Email">
</form>
```

**3. Global flag** — enable for all forms:
```javascript
InnerForm.draftMode = true;
```

**4. Programmatically** — via the API:
```javascript
// Enable draft mode on a form
$('#meuForm').draft();

// Check if draft mode is active
var isDraft = $('#meuForm').isDraft(); // true

// Disable draft mode
$('#meuForm').undraft();
```

#### How it works
- In draft mode, only the **required** rule (`obg`, `req`, `required`) is ignored — empty required fields don't block the form.
- **All other validations still apply**: a filled field with an invalid email, CPF, etc. keeps the form invalid even in draft mode.
- The `data-beforevalidatecallback`, `data-validcallback` and `data-aftervalidatecallback` still run; `data-invalidcallback` runs when a non-required validation fails.
- `data-draft="false"` explicitly disables draft mode for that form.
- Static API: `InnerForm.draft(form)`, `InnerForm.undraft(form)`, `InnerForm.isDraft(form)`.

### **Apply Masks Manually**

```javascript
// Apply all masks
$('#meuForm').startMasks();

// Apply validations
$('#meuForm').startValidation();

// Specific masks
$('#telefone').phoneMask();
$('#data').dateMask();
$('#cpf').cpfMask();
$('#uuid').uuidMask();  
```

### **Programmatic Postal-Code Search**

```javascript
InnerForm.searchViaCEP('01310-100', '123', 0, function(dadosEndereco) {
    console.log('Address encontrado:', dadosEndereco);
    // dadosEndereco contains: logradouro, bairro, localidade, uf, etc.
});
```

### **Configure Validation Timeout**
```javascript
// Validate with a 1-second delay
$('#input').validateOnType(1000);

// Validate in real time
$('#input').validateOnType(0);
```

### **Value Assignment Utility**
```javascript
// Set the value only if the field is empty
// If not empty, only replaces it if it does not have the class 'noreplace'
$('#campo').setOrReplaceVal('New value');
```

### **Geolocation API**

```javascript
// Get a single location
InnerForm.getLocation()
    .then(function(location) {
        $('#latitude').val(location.latitude);
        $('#longitude').val(location.longitude);
        console.log('Accuracy:', location.accuracyFormatted);
    })
    .catch(function(error) {
        console.error('Error:', error.userMessage);
    });

// Get location with custom options
InnerForm.getLocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000
})
.then(function(location) {
    // Use location data
    window.open(location.googleMapsUrl, '_blank');
});

// Monitor location continuously
var watchId = InnerForm.watchLocation(
    function(location) {
        // Success callback - called on every update
        $('#coordenadas').text(location.coordinates);
        $('#precisao').text(location.accuracyFormatted);
    },
    function(error) {
        // Error callback
        console.error('Monitoring error:', error.userMessage);
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
    }
);

// Stop monitoring
InnerForm.clearLocationWatch(watchId);
```

---

## 🛠️ InnerFormValidation Functions

The library exposes several utility functions through the `InnerFormValidation` object. The main available functions are documented below:

### **Logging and Debug Functions**

#### `log(...arguments)`
Logs messages to the console when verbose mode is enabled.
```javascript
InnerForm.verbose = true;
InnerForm.log('Mensagem de debug', dados);
```

#### `error(...arguments)` 
Logs error messages to the console when verbose mode is enabled.
```javascript
    InnerForm.error('Error found:', error);
```

#### `warn(...arguments)`
Logs warnings to the console when verbose mode is enabled.
```javascript
InnerForm.warn('Aviso:', dados);
```

### **Utility Functions**

#### `addLeadingZeros(num, totalLength)`
Adds leading zeros to reach the specified length.
```javascript
InnerForm.addLeadingZeros(123, 5); // "00123"
InnerForm.addLeadingZeros(-45, 4);  // "-045"
```

#### `barcodeCheckSum(code)`
Calculates the check digit of barcodes using standard algorithms.
```javascript
InnerForm.barcodeCheckSum("1234567"); // Returns the checksum number
```

#### `getAge(birthDate, fromDate)`
Calculates age based on the birth date and reference date.
```javascript
InnerForm.getAge("15/03/1990"); // Idade atual
InnerForm.getAge("15/03/1990", new Date("2025-01-01")); // Idade em 2025
```

#### `expandYear(year, pastDistance, futureDistance)`
Expands a two-digit year (YY) to four digits (YYYY) based on the current century.
```javascript
InnerForm.expandYear(25, 20, 5); // 2025 (near 2024)
InnerForm.expandYear(90, 20, 5); // 1990 (fora do range futuro)
```

### **Validation Functions**

#### `validateUUID(value)`
Validates whether a string is a valid UUID/GUID. Accepts flexible formats, not only RFC 4122.
```javascript
InnerForm.validateUUID("ff2bc94c-8ce0-417f-08ce-08ddfce17182"); // true
InnerForm.validateUUID("12345678-1234-1234-1234-123456789abc"); // true
InnerForm.validateUUID("invalid-uuid"); // false
```

#### `validatePhone(value)` - **🆕 NOVA**
Validates Brazilian phone numbers (landline or mobile), ignoring masks, spaces, parentheses and hyphens. Requires at least 8 digits.
```javascript
InnerForm.validatePhone("(11) 98765-4321"); // true
InnerForm.validatePhone("1132221234");      // true
InnerForm.validatePhone("1234567");         // false (menos de 8 dígitos)
```

#### `validateCEP(value)` - **🆕 NOVA**
Validates Brazilian ZIP codes (CEP) with or without mask (8 digits).
```javascript
InnerForm.validateCEP("01310100");  // true
InnerForm.validateCEP("01310-100"); // true (ignora a máscara)
InnerForm.validateCEP("0131010");   // false
```

#### `validateLatitude(value)` - **🆕 NOVA**
Validates whether a value is a valid latitude coordinate (-90 to +90 degrees).
```javascript
InnerForm.validateLatitude("-23.550520"); // true
InnerForm.validateLatitude("45.5");       // true
InnerForm.validateLatitude("91");         // false (fora do limite)
InnerForm.validateLatitude("-90.5");      // false (fora do limite)
```

#### `validateLongitude(value)` - **🆕 NOVA**
Validates whether a value is a valid longitude coordinate (-180 to +180 degrees).
```javascript
InnerForm.validateLongitude("-46.633308"); // true
InnerForm.validateLongitude("180");        // true
InnerForm.validateLongitude("181");        // false (fora do limite)
InnerForm.validateLongitude("-180.1");     // false (fora do limite)
```

#### `validateCoordinate(value)` - **🆕 NOVA**
Validates whether a value contains a valid coordinate pair in several formats.
```javascript
InnerForm.validateCoordinate("-23.550520,-46.633308"); // true
InnerForm.validateCoordinate("-23.5 -46.6");           // true
InnerForm.validateCoordinate("45;90");                 // true
InnerForm.validateCoordinate("91,200");                // false (invalid coordinates)
```

#### `parseShortMonthYearPartial(part)`
Parses and formats a partial short month/year string "MM/YY" during input.
```javascript
InnerForm.parseShortMonthYearPartial("0325"); // "03/25"
InnerForm.parseShortMonthYearPartial("12231 02"); // "12/23 ~ 02"
```

#### `parseMonthYearPartial(part)`
Parses and formats a partial month/year string "MM/YYYY" during input.
```javascript
InnerForm.parseMonthYearPartial("032025"); // "03/2025"
InnerForm.parseMonthYearPartial("122024 01"); // "12/2024 ~ 01"
```

#### `parseDatePartial(part)`
Parses and formats a partial date string "DD/MM/YYYY" during input with smart validation.
```javascript
InnerForm.parseDatePartial("25122024"); // "25/12/2024"
InnerForm.parseDatePartial("311220241 01"); // "31/12/2024 ~ 01"
```

#### `validDate(value)`
Validates whether a string represents a valid date no formato DD/MM/YYYY.
```javascript
InnerForm.validDate("31/12/2023"); // true
InnerForm.validDate("31/02/2023"); // false
InnerForm.validDate("15/03/90");   // true (ano expandido)
```

#### `parseDate(value)`
Converts a date string into a Date object.
```javascript
InnerForm.parseDate("25/12/2023"); // Date object
InnerForm.parseDate("12/2023");    // 01/12/2023
InnerForm.parseDate("25/12/23");   // 25/12/2023 (ano expandido)
```

#### `validDateRange(value)`
Validates a date range no formato "DD/MM/YYYY ~ DD/MM/YYYY".
```javascript
InnerForm.validDateRange("01/01/2023 ~ 31/12/2023"); // true
InnerForm.validDateRange("31/12/2023 ~ 01/01/2023"); // false (ordem)
```

#### `validMonthYearRange(value)`
Validates a month/year range no formato "MM/YYYY ~ MM/YYYY".
```javascript
InnerForm.validMonthYearRange("01/2023 ~ 12/2023"); // true
InnerForm.validMonthYearRange("12/2023 ~ 01/2023"); // false
```

#### `validShortMonthYearRange(value)`
Validates a month/year range abreviado no formato "MM/YY ~ MM/YY".
```javascript
InnerForm.validShortMonthYearRange("01/23 ~ 12/23"); // true
InnerForm.validShortMonthYearRange("12/23 ~ 01/23"); // false
```

#### `validateTime(value, minutesSeconds)`
Valida formatos de tempo (HH:MM:SS, HH:MM ou MM:SS).
```javascript
InnerForm.validateTime("14:30:45");        // true
InnerForm.validateTime("14:30");           // true  
InnerForm.validateTime("90:30", true);     // true (MM:SS)
InnerForm.validateTime("25:30");           // false
```

#### `validateEAN(value)`
Validates EAN barcodes (European Article Number) with checksum verification.
```javascript
InnerForm.validateEAN("1234567890123"); // Validates whether the checksum is correct
```

#### `validateNotChar(value, chars)`
Validates that a string contains NONE of the specified characters.
```javascript
InnerForm.validateNotChar("abc123", "xyz"); // true
InnerForm.validateNotChar("abc123", "abc"); // false
```

#### `validateAnyChar(value, chars)`
Validates that a string contains AT LEAST ONE of the specified characters.
```javascript
InnerForm.validateAnyChar("password123", "123"); // true
InnerForm.validateAnyChar("password", "123");    // false
```

#### `validateAllChar(value, chars)`
Validates that a string contains ALL of the specified characters.
```javascript
InnerForm.validateAllChar("password123", "123"); // true
InnerForm.validateAllChar("password12", "123");  // false
```

### **New Validation Functions**

#### `validShortMonthYearRange(value)`
Validates a short month/year range in the format "MM/YY ~ MM/YY".
```javascript
InnerForm.validShortMonthYearRange("01/23 ~ 12/23"); // true
InnerForm.validShortMonthYearRange("12/23 ~ 01/23"); // false (primeira > segunda)
```

#### `validMonthYearRange(value)`
Validates a month/year range in the format "MM/YYYY ~ MM/YYYY".
```javascript
InnerForm.validMonthYearRange("01/2023 ~ 12/2023"); // true
InnerForm.validMonthYearRange("12/2023 ~ 01/2023"); // false (primeira > segunda)
```

#### `validDateRange(value)`
Valida um intervalo de datas no formato "DD/MM/YYYY ~ DD/MM/YYYY".
```javascript
InnerForm.validDateRange("01/01/2023 ~ 31/12/2023"); // true
InnerForm.validDateRange("31/12/2023 ~ 01/01/2023"); // false (primeira > segunda)
```

#### `validateUUID(value)` - **🆕 ATUALIZADA**
Validates whether a string is a valid UUID/GUID. **Now accepts more flexible formats**, not only RFC 4122.
```javascript
InnerForm.validateUUID("ff2bc94c-8ce0-417f-08ce-08ddfce17182"); // true
InnerForm.validateUUID("12345678-1234-1234-1234-123456789abc"); // true
InnerForm.validateUUID("invalid-uuid"); // false
```

#### `validateNotChar(value, chars)`
Validates that a value contains none of the specified characters.
```javascript
InnerForm.validateNotChar("teste123", "!@#"); // true
InnerForm.validateNotChar("test@123", "@#"); // false
```

#### `validateAnyChar(value, chars)`
Validates that a value contains at least one of the specified characters.
```javascript
InnerForm.validateAnyChar("teste123", "123"); // true
InnerForm.validateAnyChar("teste", "123"); // false
```

#### `validateAllChar(value, chars)`
Validates that a value contains all of the specified characters.
```javascript
InnerForm.validateAllChar("teste123!", "t3!"); // true
InnerForm.validateAllChar("teste", "tx"); // false
```

### **New Smart Parsing Functions**

#### `parseShortMonthYearPartial(part)` - **🆕 NOVA**
Parses and formats a partial short month/year string "MM/YY" during input with smart validation.
```javascript
InnerForm.parseShortMonthYearPartial("0325"); // "03/25"
InnerForm.parseShortMonthYearPartial("12231 02"); // "12/23 ~ 02"
InnerForm.parseShortMonthYearPartial("1323"); // "12/23" (limits month to 12)
```

#### `parseMonthYearPartial(part)` - **🆕 NOVA**
Parses and formats a partial month/year string "MM/YYYY" during input with smart validation.
```javascript
InnerForm.parseMonthYearPartial("032025"); // "03/2025"
InnerForm.parseMonthYearPartial("122024 01"); // "12/2024 ~ 01"
InnerForm.parseMonthYearPartial("1320245"); // "12/2024 ~ 05" (limits month to 12)
```

#### `parseDatePartial(part)` - **🔄 MELHORADA**
Parses and formats a partial date string "DD/MM/YYYY" during input with improved smart validation.
```javascript
InnerForm.parseDatePartial("25122024"); // "25/12/2024"
InnerForm.parseDatePartial("311220241 01"); // "31/12/2024 ~ 01"
InnerForm.parseDatePartial("32122024"); // "31/12/2024" (limita dia a 31)
InnerForm.parseDatePartial("25132024"); // "25/12/2024" (limits month to 12)
```

### **Mask Functions**

#### `applyNoSpaceMask(input)`
Applies a mask that removes all spaces from the input.
```javascript
InnerForm.applyNoSpaceMask(document.getElementById('field'));
```

#### `applyAlphaMask(input)`
Applies a mask that allows only letters and spaces.
```javascript
InnerForm.applyAlphaMask(document.getElementById('nome'));
```

#### `applyAlphaNumericMask(input)`
Applies a mask that allows letters, numbers, and spaces.
```javascript
InnerForm.applyAlphaNumericMask(document.getElementById('codigo'));
```

#### `applyPhoneMask(input)`
Applies a Brazilian phone mask (automatic format).
```javascript
InnerForm.applyPhoneMask(document.getElementById('telefone'));
```

#### `formatDate(text)`
Formats a string of digits as a date (DD/MM/YYYY).
```javascript
InnerForm.formatDate("25122023"); // "25/12/2023"
```

#### `applyDateTimeMask(input)`
Applies a date and time mask (DD/MM/YYYY HH:MM:SS).
```javascript
InnerForm.applyDateTimeMask(document.getElementById('dataHora'));
```

#### `applyDateRangeMask(input)`
Applies a date-range mask (DD/MM/YYYY ~ DD/MM/YYYY).
```javascript
InnerForm.applyDateRangeMask(document.getElementById('periodo'));
```

#### `applyMonthYearRangeMask(input)`
Applies a month/year range mask (MM/YYYY ~ MM/YYYY) with smart parsing.
```javascript
InnerForm.applyMonthYearRangeMask(document.getElementById('periodoMensal'));
```

#### `applyShortMonthYearRangeMask(input)`
Applies a month/year range mask curto (MM/YY ~ MM/YY) with smart parsing.
```javascript
InnerForm.applyShortMonthYearRangeMask(document.getElementById('periodoMensalCurto'));
```

#### `applyUUIDMask(input)`
Applies a UUID/GUID mask with automatic hyphen formatting.
```javascript
InnerForm.applyUUIDMask(document.getElementById('uuid'));
```

#### `applyLatitudeMask(input)` - **🆕 NOVA**
Applies a mask for latitude coordinates with range validation (-90 a +90).
```javascript
InnerForm.applyLatitudeMask(document.getElementById('latitude'));
// Supports the 'precision' class to limit decimal places
// Example: <input class="mask latitude precision 6">
```

#### `applyLongitudeMask(input)` - **🆕 NOVA**
Applies a mask for longitude coordinates with range validation (-180 a +180).
```javascript
InnerForm.applyLongitudeMask(document.getElementById('longitude'));
// Supports the 'precision' class to limit decimal places
// Example: <input class="mask longitude precision 4">
```

#### `applyShortMonthYearRangeMask(input)`
Applies a month/year range mask abreviado (MM/YY ~ MM/YY).
```javascript
InnerForm.applyShortMonthYearRangeMask(document.getElementById('periodoAbrev'));
```

### **Specialized Functions**

#### `checkLuhn(cardNumber)`
Validates a credit card number using the Luhn algorithm.
```javascript
InnerForm.checkLuhn("4111111111111111"); // true (valid Visa)
```

#### `validateCardBrand(cardNumber)`
Identifies the credit card brand and validates the format.
```javascript
InnerForm.validateCardBrand("4111111111111111"); // "visa"
InnerForm.validateCardBrand("5555555555554444"); // "mastercard"
```

#### `validateCNPJ(CNPJNumber)`
Validates Brazilian CNPJ with check-digit verification.
```javascript
InnerForm.validateCNPJ("11.222.333/0001-81"); // true/false
```

#### `validatePassword(input)`
Analyzes password strength based on multiple criteria.
```javascript
InnerForm.validatePassword("MinhaSenh@123"); 
// Retorna objeto com: score, hasUpper, hasLower, hasNumber, hasSymbol
```

#### `searchViaCEP(CEPNumber, homeNumber, delay, callbackFunction)`
Searches for address data through the ViaCEP API and runs a callback with the results.
```javascript
InnerForm.searchViaCEP("01310-100", "123", 500, function(dados) {
    console.log("Logradouro:", dados.logradouro);
    console.log("Bairro:", dados.bairro);
    console.log("Cidade:", dados.localidade);
    console.log("UF:", dados.uf);
});
```

### **Geolocation Functions - 🆕 NEW**

#### `getLocation(options)`
Gets the user's current location using the browser Geolocation API.
```javascript
// Basic usage
InnerForm.getLocation()
    .then(function(location) {
        console.log('Latitude:', location.latitude);
        console.log('Longitude:', location.longitude);
        console.log('Accuracy:', location.accuracyFormatted);
        console.log('Google Maps:', location.googleMapsUrl);
    })
    .catch(function(error) {
        console.error('Error:', error.userMessage);
    });

// With custom options
InnerForm.getLocation({
    enableHighAccuracy: true,   // High accuracy (GPS)
    timeout: 15000,            // Timeout de 15 segundos
    maximumAge: 60000          // Cache de 60 segundos
});
```

**Response object:**
```javascript
{
    latitude: -23.5505,                // Latitude
    longitude: -46.6333,              // Longitude
    accuracy: 65.0,                   // Accuracy em metros
    accuracyFormatted: "65 metros",   // Accuracy formatada
    altitude: 760.5,                  // Altitude (pode ser null)
    altitudeAccuracy: 12.0,           // Accuracy da altitude
    heading: 180.5,                   // Direction in degrees (may be null)
    speed: 2.5,                       // Speed in m/s (may be null)
    timestamp: 1704067200000,         // Timestamp
    formattedTime: "01/01/2024 10:00:00", // Formatted date/time
    coordinates: "-23.550500, -46.633300", // Formatted coordinates
    googleMapsUrl: "https://www.google.com/maps?q=-23.5505,-46.6333",
    osmUrl: "https://www.openstreetmap.org/?mlat=-23.5505&mlon=-46.6333&zoom=15"
}
```

#### `watchLocation(successCallback, errorCallback, options)`
Continuously monitors the user's location, calling the callback on every update.
```javascript
var watchId = InnerForm.watchLocation(
    function(location) {
            // Success callback - called on every new position
            console.log('New position:', location.coordinates);
        $('#latitude').val(location.latitude);
        $('#longitude').val(location.longitude);
    },
    function(error) {
        // Error callback
        console.error('Monitoring error:', error.userMessage);
        alert('Error: ' + error.userMessage);
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,           // Shorter monitoring timeout
        maximumAge: 5000          // Shorter cache for fresher data
    }
);

// Returns a watcher ID for control
console.log('Watch ID:', watchId);
```

#### `clearLocationWatch(watchId)`
Stops active location monitoring.
```javascript
// Stop specific monitoring
InnerForm.clearLocationWatch(watchId);

// In SPAs, always stop monitoring when changing pages
window.addEventListener('beforeunload', function() {
    InnerForm.clearLocationWatch(watchId);
});
```

**Error handling:**
```javascript
// Possible errors:
// - PERMISSION_DENIED: User denied permission
// - POSITION_UNAVAILABLE: Location unavailable
// - TIMEOUT: Time limit exceeded
// - GEOLOCATION_NOT_SUPPORTED: Browser does not support geolocation
// - UNKNOWN_ERROR: Unknown error

InnerForm.getLocation()
    .catch(function(error) {
        switch (error.error) {
            case 'PERMISSION_DENIED':
                alert('Permission denied. Enable location access in your browser.');
                break;
            case 'POSITION_UNAVAILABLE':
                alert('Location is currently unavailable.');
                break;
            case 'TIMEOUT':
                alert('Time limit exceeded. Try again.');
                break;
            default:
                alert('Error: ' + error.userMessage);
        }
    });
```

### **Global Configuration**

#### Configurable Properties:
```javascript
// Enable detailed logs
InnerForm.verbose = true;

// Validation timeout while typing (ms)
InnerForm.onTypeTimeout = 900;
```

### **Advanced Usage**

The functions can be used individually for custom validation or integration with other systems:

```javascript
// Custom validation
function validarFormularioCustomizado() {
    let isValid = true;
    
    // Validate date
    if (!InnerForm.validDate($('#data').val())) {
        isValid = false;
        alert('Invalid date!');
    }
    
    // Validate age
    if (InnerForm.getAge($('#nascimento').val()) < 18) {
        isValid = false;
        alert('Underage!');
    }
    
    return isValid;
}

// Apply masks programmatically
$('#telefone').on('input', function() {
    InnerForm.applyPhoneMask(this);
});

// Search for a postal code with error handling
InnerForm.searchViaCEP(cep, num, 0, function(dados) {
    if (dados.erro) {
        console.warn('Postal code not found');
        return;
    }
    
    $('#endereco').val(dados.logradouro);
    $('#bairro').val(dados.bairro);
    $('#cidade').val(dados.localidade);
    $('#uf').val(dados.uf);
});
```

---

## 🎨 Visual Customization

### **Automatically Applied CSS Classes**

InnerFormValidation automatically adds CSS classes according to the field state:

```css
/* Valid field (applied only to non-empty values) */
.success {
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* Invalid field */
.error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Bootstrap compatibility */
.has-error .form-control {
    border-color: #dc3545;
}
```

### **Advanced Customization**
```css
/* Style for required fields */
.obg::before {
    content: "* ";
    color: red;
}

/* Error animation */
.error {
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Password strength indicator */
[data-pwstrength="4"] {
    border-left: 5px solid #28a745; /* Verde - Forte */
}

[data-pwstrength="3"] {
    border-left: 5px solid #ffc107; /* Yellow - Medium */
}

[data-pwstrength="2"],
[data-pwstrength="1"] {
    border-left: 5px solid #dc3545; /* Red - Weak */
}
```

### **Information Available via Attributes**

After validation, some elements receive `data-*` attributes with useful information:

```javascript
// Password strength (0-4)
var forcaSenha = $('#senha').attr('data-pwstrength');

// Detected card brand
var bandeiraCartao = $('#cartao').attr('data-flagcard');
```

---

## 📚 Special Classes

### **Behavior Control**

| Class         | Description                                  |
| ------------- | -------------------------------------------- |
| `onkeyup`     | Validar conforme digita (com delay)          |
| `notonblur`   | Do NOT validate on blur                      |
| `notonchange` | Do NOT validate when the value changes       |
| `noreplace`   | Autocomplete does not replace existing value |

### **Special Use Cases**
```html
<!-- Validate only when submitting the form -->
<input class="obg notonblur notonchange">

<!-- Validar em tempo real -->
<input class="obg onkeyup">

<!-- Postal code that does not replace an existing address -->
<input class="mask cep autocomplete noreplace">
```

---

## 🐛 Debugging and Logs

### **Enable Detailed Logs**
```html
<script>
InnerForm.verbose = true; // Enables detailed console logs
</script>
```

### **Available Logs**
- ✅ **Success**: `InnerForm.log()`
- ⚠️ **Warning**: `InnerForm.warn()`
- ❌ **Error**: `InnerForm.error()`

### **Debug Example**
```javascript
// In the browser console, you will see:
// InnerFormValidation: Validation started
// InnerFormValidation: PhoneMask started  
// InnerFormValidation: Valid input detected
```

---

## ⚠️ Important Notes

1. **Class Order**: Class order may matter in complex validations
2. **Performance**: For large forms, consider using `notonblur` on less critical fields
3. **Compatibility**: jQuery is optional; when present, legacy plugins are connected to `jQuery.fn` without changing `$`
4. **Empty Fields**: Most validations allow empty fields (except `obg`/`required`)
5. **Masks vs. Validation**: Not every validation has an equivalent mask, and vice versa

---

## 🚀 Changelog

### V2.8.0 - Coordinate Masks and Validations 🌍
- ✅ **Coordinate masks** `.mask.latitude` and `.mask.longitude`
- ✅ **Coordinate validations** `.latitude`, `.longitude`, `.coordinate`
- ✅ **Precision support** with the `precision <number>` class
- ✅ **Automatic range validation** (-90/+90 for latitude, -180/+180 for longitude)
- ✅ **Smart masks** that accept comma or period decimal separators
- ✅ **Short classes** `.lat`, `.long`, `.lng` to reduce code

### V2.7.0 - Geolocation Autocomplete ✨
- ✅ **Automatic autocomplete** for geolocation coordinates
- ✅ **Automatic population** of `.autocomplete.latitude` and `.autocomplete.longitude` fields
- ✅ **Support for short classes** `.autocomplete.lat` and `.autocomplete.long`
- ✅ **Dedicated example** with `ExampleAutoComplete.html`
- ✅ **Seamless integration** with existing geolocation functions

### Main Features:
- ✅ **Automated masks** for 30+ data types
- ✅ **Configurable real-time validation**
- ✅ **Robust callbacks system**
- ✅ **Address autocomplete** via ViaCEP
- ✅ **Coordinate autocomplete** via Geolocation
- ✅ **Complete, modern geolocation system**
- ✅ **Credit card validation** with 15+ brands
- ✅ **Password validation** with configurable criteria
- ✅ **Full support** for Brazilian documents
- ✅ **JavaScript API** for programmatic validation

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributions

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📞 Support

- **Documentation**: [GitHub Pages](https://zonaro.github.io/InnerFormValidation/TestForm)
- **Issues**: [GitHub Issues](https://github.com/zonaro/InnerFormValidation/issues)
- **Examples**: See the `TestForm.html` file for practical examples

---

---

## 🆕 Recent News and Improvements

### **v2.6.0 - October 2025**

#### **🌍 Complete Geolocation System - NEW!**
- **New function**: `InnerForm.getLocation()` - Gets the user's current location
- **New function**: `InnerForm.watchLocation()` - Continuously monitors location
- **New function**: `InnerForm.clearLocationWatch()` - Stops active monitoring
- **Advanced features**:
    - Modern Promise-based API
    - Rich response object with coordinates, accuracy, altitude, and speed
    - Automatic Google Maps and OpenStreetMap URLs
    - Smart error handling with friendly messages
    - Support for high-accuracy and configurable cache options
- **Included examples**:
    - `ExampleSimples.html` - Basic implementation
    - `ExampleGeolocalizacao.html` - Complete interface
    - Dedicated section in `TestForm.html`

### **v2.5.0 - Setembro 2025**

#### **✅ Improved UUID/GUID Validation**
- **Important fix**: UUID validation now accepts more flexible formats
- **Before**: Only strict RFC 4122 UUIDs were accepted
- **Now**: Any structurally valid GUID is accepted, including .NET/C# GUIDs
- **Example**: `ff2bc94c-8ce0-417f-08ce-08ddfce17182` now validates correctly ✅

#### **🎯 Smart Parsing for Ranges**
- **New function**: `parseMonthYearPartial()` - Smart formatting for MM/YYYY ~ MM/YYYY
- **New function**: `parseShortMonthYearPartial()` - Smart formatting for MM/YY ~ MM/YY
- **Improvements**: Automatic month validation (maximum 12) and progressive formatting
- **Experience**: Range masks now have the same fluidity as date masks

#### **🔧 Improved Masks**
- **UUID mask**: New mask for automatic GUID formatting
- **Improved ranges**: `monthyearrange` and `shortmonthyearrange` masks completely rewritten
- **Progressive validation**: Fields are validated as the user types, with immediate feedback

#### **📝 Additional Features**
- **Year expansion**: `expandYear()` function for smart YY → YYYY conversion
- **Robust validation**: New validation functions for date and range values
- **Compatibility**: Maintains 100% compatibility with previous versions

---

**⭐ If this project was useful, don't forget to star it on GitHub!**

# 🚀 InnerFormValidation

**A complete JavaScript library for form masking and validation, dependency-free and with a native callable API.**

## Documentação

See the [complete documentation site](docs/index.html), with interactive examples, API reference, standalone installation, jQuery compatibility, postal-code autocomplete, and geolocation.

[![CDN](https://img.shields.io/badge/CDN-Available-brightgreen)](https://cdn.jsdelivr.net/gh/zonaro/InnerFormValidation@master/InnerFormValidation.js)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Standalone](https://img.shields.io/badge/JavaScript-standalone-brightgreen)](docs/index.html)

## 📖 Índice

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
    <input type="text" class="form-control obg minlen 5" placeholder="Mínimo 5 caracteres">
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

| Classe                  | Formato                 | Compatível com Máscara | Exemplo                                    |
| ----------------------- | ----------------------- | ---------------------- | ------------------------------------------ |
| `date` `data`           | dd/MM/yyyy              | ✅                      | `<input class="mask date">`                |
| `time`                  | hh:mm:ss                | ✅                      | `<input class="mask time">`                |
| `timeshort` `shorttime` | hh:mm                   | ✅                      | `<input class="mask timeshort">`           |
| `datetime`              | dd/MM/yyyy hh:mm:ss     | ✅                      | `<input class="mask datetime">`            |
| `datetimeshort`         | dd/MM/yyyy hh:mm        | ✅                      | `<input class="mask datetimeshort">`       |
| `minutesecond`          | mm:ss                   | ✅                      | `<input class="mask minutesecond">`        |
| `monthyear`             | MM/yyyy                 | ✅                      | `<input class="mask monthyear">`           |
| `daterange`             | dd/MM/yyyy ~ dd/MM/yyyy | ✅                      | `<input class="mask daterange">`           |
| `monthyearrange`        | MM/yyyy ~ MM/yyyy       | ✅                      | `<input class="mask monthyearrange">`      |
| `shortmonthyearrange`   | MM/yy ~ MM/yy           | ✅                      | `<input class="mask shortmonthyearrange">` |

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
InnerForm.validateOAB('123456SA');    // false (UF inválida)

InnerForm.validateCNH('98765432100'); // true/false conforme DV
InnerForm.validateCNH('00000000000'); // false
InnerForm.validarCNH('987.654.321-00'); // true/false
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

<!-- CPF ou CNPJ automático -->
<input class="form-control mask cpfcnpj">

<!-- CEP: 12345-678 -->
<input class="form-control mask cep">

<!-- CNH: 123.456.789-00 -->
<input class="form-control mask cnh">
```

### **Date and Time Masks**
```html
<!-- Data: dd/mm/aaaa -->
<input class="form-control mask date">

<!-- Data e Hora: dd/mm/aaaa hh:mm:ss -->
<input class="form-control mask datetime">

<!-- Hora: hh:mm:ss -->
<input class="form-control mask time">

<!-- Mês/Ano: mm/aaaa -->
<input class="form-control mask monthyear">

<!-- Período de Datas: dd/mm/aaaa ~ dd/mm/aaaa -->
<input class="form-control mask daterange">

<!-- Período de Mês/Ano: mm/aaaa ~ mm/aaaa -->
<input class="form-control mask monthyearrange">

<!-- Período de Mês/Ano Abreviado: mm/aa ~ mm/aa -->
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
<!-- Qualquer cartão: 1234 5678 9012 3456 -->
<input class="form-control mask creditcard">

<!-- Cartão específico (Visa apenas) -->
<input class="form-control mask creditcard visa">
```

### **Formatting Masks**
```html
<!-- Apenas maiúsculas -->
<input class="form-control mask upper">

<!-- Apenas minúsculas -->
<input class="form-control mask lower alpha">

<!-- Sem espaços -->
<input class="form-control mask nospace">

<!-- Números com zeros à esquerda -->
<input class="form-control mask num len 8 leadingzero">

<!-- UUID/GUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -->
<input class="form-control mask uuid">
```

---

## 🔥 Advanced Validations

### **Age Validation**
```html
<!-- Maior de 18 anos -->
<input class="form-control mask date minage 18" placeholder="Data de Nascimento">

<!-- Menor de 65 anos -->
<input class="form-control mask date maxage 65">

<!-- Exatamente 30 anos -->
<input class="form-control mask date age 30">
```

### **Numeric Comparison Validation**
```html
<!-- Maior que 10 -->
<input class="form-control num after 10">

<!-- Menor que 100 -->
<input class="form-control num before 100">

<!-- Entre 1 e 10 -->
<input class="form-control num 1 to 10">
```

### **Date Comparison Validation**
```html
<!-- Após hoje -->
<input class="form-control mask date after today">

<!-- Antes de uma data específica -->
<input class="form-control mask date before 31/12/2023">

<!-- Entre duas datas -->
<input class="form-control mask date 01/01/2023 to 31/12/2023">
```

### **Password Validation**
```html
<!-- Senha forte (4 de 4 critérios: maiúscula, minúscula, número, símbolo) -->
<input type="password" class="form-control password strong minlen 8">

<!-- Senha média (3 de 4 critérios) -->
<input type="password" class="form-control password medium minlen 6">

<!-- Senha customizada (2 de 4 critérios) -->
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
<!-- Qualquer cartão válido -->
<input class="form-control mask creditcard">

<!-- Apenas Visa ou Mastercard -->
<input class="form-control mask creditcard visa mastercard">
```

### **UUID/GUID Validation**
```html
<!-- UUID/GUID válido em qualquer formato -->
<input class="form-control uuid">

<!-- UUID com máscara automática -->
<input class="form-control mask uuid">
```

### **PIX Key Validation**
```html
<!-- Aceita email, CPF, CNPJ, telefone ou UUID -->
<input class="form-control pix">

<!-- Alias equivalente -->
<input class="form-control chavepix">
```

### **String Content Validation**
```html
<!-- Deve conter espaço -->
<input class="form-control contains _space">

<!-- Deve conter texto específico -->
<input class="form-control contains @gmail.com">

<!-- Deve conter qualquer um dos caracteres -->
<input class="form-control containsanychar {}()">

<!-- Deve conter todos os caracteres -->
<input class="form-control containsallchar ABC">

<!-- NÃO deve conter caracteres específicos -->
<input class="form-control notcontainschar ABCD">
```

### **Equality Validation**
```html
<!-- Comparar com outro campo -->
<input id="senha" type="password" class="form-control">
<input class="form-control eq #senha" placeholder="Confirmar Senha">

<!-- Comparar com valor específico -->
<input class="form-control eqv admin" placeholder="Digite 'admin'">
```

---

## 🎯 Callbacks System

Use `data-*` attributes to run JavaScript code on validation events:

### **Available Callbacks**
```html
<input class="form-control obg" 
    data-beforevalidatecallback="console.log('Antes da validação')"
    data-validcallback="$('#success').show()"
    data-invalidcallback="$('#error').show()"
    data-aftervalidatecallback="console.log('Após validação')">
```

### **HTML5 Message Callback**
```html
<input class="form-control obg" 
    data-invalidmessage="Este campo é obrigatório! 😊">
```

### **Practical Callback Example**
```html
<input class="form-control obg eq #div_OK" 
    data-invalidcallback="$('#status').text('❌ Inválido').css('color','red')"
    data-validcallback="$('#status').text('✅ Válido').css('color','green')">
<div id="status"></div>
```

---

## 🏠 Address Autocomplete System

InnerFormValidation includes integration with the **ViaCEP** API for Brazilian address autocomplete.

### **Autocomplete Classes**

| Class                               | Description                       | Example                                     |
| ----------------------------------- | --------------------------------- | ------------------------------------------- |
| `autocomplete cep`                  | Campo CEP que busca endereço      | `<input class="autocomplete cep mask">`     |
| `autocomplete address`              | Recebe logradouro                 | `<input class="autocomplete address">`      |
| `autocomplete neighborhood`         | Recebe bairro                     | `<input class="autocomplete neighborhood">` |
| `autocomplete city`                 | Recebe cidade                     | `<input class="autocomplete city">`         |
| `autocomplete state`                | Recebe estado (UF)                | `<input class="autocomplete state">`        |
| `autocomplete fulladdress`          | Recebe endereço completo          | `<p class="autocomplete fulladdress"></p>`  |
| `autocomplete num` `number`         | Campo número (recebe foco)        | `<input class="autocomplete num">`          |
| `autocomplete homenum` `homenumber` | Número residencial (alfanumérico) | `<input class="autocomplete homenum">`      |
| `autocomplete ddd`                  | Código DDD da região              | `<input class="autocomplete ddd">`          |
| `autocomplete ibge`                 | Código IBGE                       | `<input class="autocomplete ibge">`         |
| `autocomplete gia`                  | Código GIA                        | `<input class="autocomplete gia">`          |
| `autocomplete latitude` `lat`       | Recebe latitude automaticamente   | `<input class="autocomplete latitude">`     |
| `autocomplete longitude` `long`     | Recebe longitude automaticamente  | `<input class="autocomplete longitude">`    |
| `autocomplete siafi`                | Código SIAFI                      | `<input class="autocomplete siafi">`        |

### **Complete Address Example**
```html
<div class="row">
    <div class="col-md-4">
        <label>CEP</label>
        <input class="form-control mask cep autocomplete obg" placeholder="00000-000">
    </div>
    <div class="col-md-6">
        <label>Endereço</label>
        <input class="form-control autocomplete address" readonly>
    </div>
    <div class="col-md-2">
        <label>Número</label>
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
                📍 Obter Minha Localização
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
            // Limpar campos em caso de erro
            $('#latitude').val('');
            $('#longitude').val('');
            
            alert('Erro: ' + error.userMessage);
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
                alert('Você precisa permitir o acesso à localização');
                break;
            case 'POSITION_UNAVAILABLE':
                alert('Localização não disponível no momento');
                break;
            case 'TIMEOUT':
                alert('Tempo limite excedido. Tente novamente');
                break;
            case 'GEOLOCATION_NOT_SUPPORTED':
                alert('Seu navegador não suporta geolocalização');
                break;
            default:
                alert('Erro desconhecido: ' + error.message);
        }
    });
```

### **Configuration Options**

| Opção                | Tipo    | Padrão | Descrição                                    |
| -------------------- | ------- | ------ | -------------------------------------------- |
| `enableHighAccuracy` | boolean | true   | Solicita alta precisão (GPS quando possível) |
| `timeout`            | number  | 10000  | Tempo limite em milissegundos                |
| `maximumAge`         | number  | 60000  | Idade máxima aceitável do cache (ms)         |

### **Requirements and Limitations**

1. **HTTPS Required**: Geolocation works only on HTTPS sites (or localhost)
2. **User Permission**: The browser always requests permission
3. **Variable Accuracy**: Depends on the device (GPS, WiFi, cell towers)
4. **Compatibility**: Works in modern browsers that support the Geolocation API

### **Practical Examples**

See the included example files:
- `ExemploSimples.html` - Basic implementation
- `ExemploGeolocalizacao.html` - Complete interface with monitoring
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
            <label>Data de Nascimento (18+) *</label>
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
        
        <!-- Endereço via CEP -->
        <div class="col-md-4">
            <label>CEP *</label>
            <input class="form-control mask cep autocomplete obg" placeholder="00000-000">
        </div>
        
        <div class="col-md-6">
            <label>Endereço</label>
            <input class="form-control autocomplete address" readonly>
        </div>
        
        <div class="col-md-2">
            <label>Número</label>
            <input class="form-control autocomplete homenum">
        </div>
        
        <!-- Senha -->
        <div class="col-md-6">
            <label>Senha *</label>
            <input id="password" type="password" class="form-control password strong minlen 8 obg">
        </div>
        
        <div class="col-md-6">
            <label>Confirmar Senha *</label>
            <input type="password" class="form-control eq #password obg">
        </div>
    </div>
    
    <button type="submit" class="btn btn-primary">Cadastrar</button>
</form>
```

### **Financial Form**
```html
<form class="validate">
    <!-- Dados do Cartão -->
    <div class="col-md-8">
        <label>Número do Cartão</label>
        <input class="form-control mask creditcard visa mastercard obg">
    </div>
    
    <div class="col-md-4">
        <label>Validade</label>
        <input class="form-control mask monthyear obg">
    </div>
    
    <!-- Valores -->
    <div class="col-md-6">
        <label>Valor Mínimo</label>
        <input class="form-control mask num after 0">
    </div>
    
    <div class="col-md-6">
        <label>Valor Máximo</label>
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
    console.log('Endereço encontrado:', dadosEndereco);
    // dadosEndereco contém: logradouro, bairro, localidade, uf, etc.
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
// Define valor apenas se campo estiver vazio
// Se não estiver vazio, só substitui se não tiver classe 'noreplace'
$('#campo').setOrReplaceVal('Novo valor');
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
InnerForm.error('Erro encontrado:', erro);
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
InnerForm.barcodeCheckSum("1234567"); // Retorna número do checksum
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
InnerForm.expandYear(25, 20, 5); // 2025 (próximo de 2024)
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
InnerForm.validateCoordinate("91,200");                // false (coordenadas inválidas)
```

#### `parseShortMonthYearPartial(part)`
Analisa e formata uma string parcial de mês/ano curto "MM/YY" durante a entrada.
```javascript
InnerForm.parseShortMonthYearPartial("0325"); // "03/25"
InnerForm.parseShortMonthYearPartial("12231 02"); // "12/23 ~ 02"
```

#### `parseMonthYearPartial(part)`
Analisa e formata uma string parcial de mês/ano "MM/YYYY" durante a entrada.
```javascript
InnerForm.parseMonthYearPartial("032025"); // "03/2025"
InnerForm.parseMonthYearPartial("122024 01"); // "12/2024 ~ 01"
```

#### `parseDatePartial(part)`
Analisa e formata uma string parcial de data "DD/MM/YYYY" durante a entrada com validação inteligente.
```javascript
InnerForm.parseDatePartial("25122024"); // "25/12/2024"
InnerForm.parseDatePartial("311220241 01"); // "31/12/2024 ~ 01"
```

#### `validDate(value)`
Valida se uma string representa uma data válida no formato DD/MM/YYYY.
```javascript
InnerForm.validDate("31/12/2023"); // true
InnerForm.validDate("31/02/2023"); // false
InnerForm.validDate("15/03/90");   // true (ano expandido)
```

#### `parseDate(value)`
Converte uma string de data em objeto Date.
```javascript
InnerForm.parseDate("25/12/2023"); // Objeto Date
InnerForm.parseDate("12/2023");    // 01/12/2023
InnerForm.parseDate("25/12/23");   // 25/12/2023 (ano expandido)
```

#### `validDateRange(value)`
Valida um período de datas no formato "DD/MM/YYYY ~ DD/MM/YYYY".
```javascript
InnerForm.validDateRange("01/01/2023 ~ 31/12/2023"); // true
InnerForm.validDateRange("31/12/2023 ~ 01/01/2023"); // false (ordem)
```

#### `validMonthYearRange(value)`
Valida um período de mês/ano no formato "MM/YYYY ~ MM/YYYY".
```javascript
InnerForm.validMonthYearRange("01/2023 ~ 12/2023"); // true
InnerForm.validMonthYearRange("12/2023 ~ 01/2023"); // false
```

#### `validShortMonthYearRange(value)`
Valida um período de mês/ano abreviado no formato "MM/YY ~ MM/YY".
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
Valida códigos de barras EAN (European Article Number) com verificação de checksum.
```javascript
InnerForm.validateEAN("1234567890123"); // Valida se o checksum está correto
```

#### `validateNotChar(value, chars)`
Valida que uma string NÃO contém nenhum dos caracteres especificados.
```javascript
InnerForm.validateNotChar("abc123", "xyz"); // true
InnerForm.validateNotChar("abc123", "abc"); // false
```

#### `validateAnyChar(value, chars)`
Valida que uma string contém PELO MENOS UM dos caracteres especificados.
```javascript
InnerForm.validateAnyChar("senha123", "123"); // true
InnerForm.validateAnyChar("senha", "123");    // false
```

#### `validateAllChar(value, chars)`
Valida que uma string contém TODOS os caracteres especificados.
```javascript
InnerForm.validateAllChar("senha123", "123"); // true
InnerForm.validateAllChar("senha12", "123");  // false
```

### **New Validation Functions**

#### `validShortMonthYearRange(value)`
Valida um intervalo de mês/ano curto no formato "MM/YY ~ MM/YY".
```javascript
InnerForm.validShortMonthYearRange("01/23 ~ 12/23"); // true
InnerForm.validShortMonthYearRange("12/23 ~ 01/23"); // false (primeira > segunda)
```

#### `validMonthYearRange(value)`
Valida um intervalo de mês/ano no formato "MM/YYYY ~ MM/YYYY".
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
Valida se uma string é um UUID/GUID válido. **Agora aceita formatos mais flexíveis**, não apenas RFC 4122.
```javascript
InnerForm.validateUUID("ff2bc94c-8ce0-417f-08ce-08ddfce17182"); // true
InnerForm.validateUUID("12345678-1234-1234-1234-123456789abc"); // true
InnerForm.validateUUID("invalid-uuid"); // false
```

#### `validateNotChar(value, chars)`
Valida que um valor não contém nenhum dos caracteres especificados.
```javascript
InnerForm.validateNotChar("teste123", "!@#"); // true
InnerForm.validateNotChar("test@123", "@#"); // false
```

#### `validateAnyChar(value, chars)`
Valida que um valor contém pelo menos um dos caracteres especificados.
```javascript
InnerForm.validateAnyChar("teste123", "123"); // true
InnerForm.validateAnyChar("teste", "123"); // false
```

#### `validateAllChar(value, chars)`
Valida que um valor contém todos os caracteres especificados.
```javascript
InnerForm.validateAllChar("teste123!", "t3!"); // true
InnerForm.validateAllChar("teste", "tx"); // false
```

### **New Smart Parsing Functions**

#### `parseShortMonthYearPartial(part)` - **🆕 NOVA**
Analisa e formata uma string parcial de mês/ano curto "MM/YY" durante a entrada com validação inteligente.
```javascript
InnerForm.parseShortMonthYearPartial("0325"); // "03/25"
InnerForm.parseShortMonthYearPartial("12231 02"); // "12/23 ~ 02"
InnerForm.parseShortMonthYearPartial("1323"); // "12/23" (limita mês a 12)
```

#### `parseMonthYearPartial(part)` - **🆕 NOVA**
Analisa e formata uma string parcial de mês/ano "MM/YYYY" durante a entrada com validação inteligente.
```javascript
InnerForm.parseMonthYearPartial("032025"); // "03/2025"
InnerForm.parseMonthYearPartial("122024 01"); // "12/2024 ~ 01"
InnerForm.parseMonthYearPartial("1320245"); // "12/2024 ~ 05" (limita mês a 12)
```

#### `parseDatePartial(part)` - **🔄 MELHORADA**
Analisa e formata uma string parcial de data "DD/MM/YYYY" durante a entrada com validação inteligente melhorada.
```javascript
InnerForm.parseDatePartial("25122024"); // "25/12/2024"
InnerForm.parseDatePartial("311220241 01"); // "31/12/2024 ~ 01"
InnerForm.parseDatePartial("32122024"); // "31/12/2024" (limita dia a 31)
InnerForm.parseDatePartial("25132024"); // "25/12/2024" (limita mês a 12)
```

### **Mask Functions**

#### `applyNoSpaceMask(input)`
Applies a mask that removes all spaces from the input.
```javascript
InnerForm.applyNoSpaceMask(document.getElementById('campo'));
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
Aplica máscara de telefone brasileiro (formato automático).
```javascript
InnerForm.applyPhoneMask(document.getElementById('telefone'));
```

#### `formatDate(text)`
Formata uma string de dígitos como data (DD/MM/YYYY).
```javascript
InnerForm.formatDate("25122023"); // "25/12/2023"
```

#### `applyDateTimeMask(input)`
Aplica máscara de data e hora (DD/MM/YYYY HH:MM:SS).
```javascript
InnerForm.applyDateTimeMask(document.getElementById('dataHora'));
```

#### `applyDateRangeMask(input)`
Aplica máscara para período de datas (DD/MM/YYYY ~ DD/MM/YYYY).
```javascript
InnerForm.applyDateRangeMask(document.getElementById('periodo'));
```

#### `applyMonthYearRangeMask(input)`
Aplica máscara para período de mês/ano (MM/YYYY ~ MM/YYYY) com parsing inteligente.
```javascript
InnerForm.applyMonthYearRangeMask(document.getElementById('periodoMensal'));
```

#### `applyShortMonthYearRangeMask(input)`
Aplica máscara para período de mês/ano curto (MM/YY ~ MM/YY) com parsing inteligente.
```javascript
InnerForm.applyShortMonthYearRangeMask(document.getElementById('periodoMensalCurto'));
```

#### `applyUUIDMask(input)`
Aplica máscara para UUID/GUID com formatação automática de hífens.
```javascript
InnerForm.applyUUIDMask(document.getElementById('uuid'));
```

#### `applyLatitudeMask(input)` - **🆕 NOVA**
Aplica máscara para coordenadas de latitude com validação de limites (-90 a +90).
```javascript
InnerForm.applyLatitudeMask(document.getElementById('latitude'));
// Suporte a classe 'precision' para limitar casas decimais
// Exemplo: <input class="mask latitude precision 6">
```

#### `applyLongitudeMask(input)` - **🆕 NOVA**
Aplica máscara para coordenadas de longitude com validação de limites (-180 a +180).
```javascript
InnerForm.applyLongitudeMask(document.getElementById('longitude'));
// Suporte a classe 'precision' para limitar casas decimais
// Exemplo: <input class="mask longitude precision 4">
```

#### `applyShortMonthYearRangeMask(input)`
Aplica máscara para período de mês/ano abreviado (MM/YY ~ MM/YY).
```javascript
InnerForm.applyShortMonthYearRangeMask(document.getElementById('periodoAbrev'));
```

### **Specialized Functions**

#### `checkLuhn(cardNumber)`
Valida número de cartão de crédito usando o algoritmo de Luhn.
```javascript
InnerForm.checkLuhn("4111111111111111"); // true (Visa válido)
```

#### `validateCardBrand(cardNumber)`
Identifica a bandeira do cartão de crédito e valida o formato.
```javascript
InnerForm.validateCardBrand("4111111111111111"); // "visa"
InnerForm.validateCardBrand("5555555555554444"); // "mastercard"
```

#### `validateCNPJ(CNPJNumber)`
Valida CNPJ brasileiro com verificação de dígitos verificadores.
```javascript
InnerForm.validateCNPJ("11.222.333/0001-81"); // true/false
```

#### `validatePassword(input)`
Analisa a força de uma senha baseada em critérios múltiplos.
```javascript
InnerForm.validatePassword("MinhaSenh@123"); 
// Retorna objeto com: score, hasUpper, hasLower, hasNumber, hasSymbol
```

#### `searchViaCEP(CEPNumber, homeNumber, delay, callbackFunction)`
Busca dados de endereço na API ViaCEP e executa callback com os resultados.
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
Obtém a localização atual do usuário usando a API de Geolocalização do navegador.
```javascript
// Uso básico
InnerForm.getLocation()
    .then(function(location) {
        console.log('Latitude:', location.latitude);
        console.log('Longitude:', location.longitude);
        console.log('Precisão:', location.accuracyFormatted);
        console.log('Google Maps:', location.googleMapsUrl);
    })
    .catch(function(error) {
        console.error('Erro:', error.userMessage);
    });

// Com opções customizadas
InnerForm.getLocation({
    enableHighAccuracy: true,   // Alta precisão (GPS)
    timeout: 15000,            // Timeout de 15 segundos
    maximumAge: 60000          // Cache de 60 segundos
});
```

**Objeto de resposta:**
```javascript
{
    latitude: -23.5505,                // Latitude
    longitude: -46.6333,              // Longitude
    accuracy: 65.0,                   // Precisão em metros
    accuracyFormatted: "65 metros",   // Precisão formatada
    altitude: 760.5,                  // Altitude (pode ser null)
    altitudeAccuracy: 12.0,           // Precisão da altitude
    heading: 180.5,                   // Direção em graus (pode ser null)
    speed: 2.5,                       // Velocidade em m/s (pode ser null)
    timestamp: 1704067200000,         // Timestamp
    formattedTime: "01/01/2024 10:00:00", // Data/hora formatada
    coordinates: "-23.550500, -46.633300", // Coordenadas formatadas
    googleMapsUrl: "https://www.google.com/maps?q=-23.5505,-46.6333",
    osmUrl: "https://www.openstreetmap.org/?mlat=-23.5505&mlon=-46.6333&zoom=15"
}
```

#### `watchLocation(successCallback, errorCallback, options)`
Monitora continuamente a localização do usuário, chamando o callback a cada atualização.
```javascript
var watchId = InnerForm.watchLocation(
    function(location) {
        // Callback de sucesso - chamado a cada nova posição
        console.log('Nova posição:', location.coordinates);
        $('#latitude').val(location.latitude);
        $('#longitude').val(location.longitude);
    },
    function(error) {
        // Callback de erro
        console.error('Erro no monitoramento:', error.userMessage);
        alert('Erro: ' + error.userMessage);
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,           // Timeout menor para monitoramento
        maximumAge: 5000          // Cache menor para dados mais frescos
    }
);

// Retorna ID do watcher para controle
console.log('Watch ID:', watchId);
```

#### `clearLocationWatch(watchId)`
Para o monitoramento de localização ativo.
```javascript
// Parar monitoramento específico
InnerForm.clearLocationWatch(watchId);

// Em aplicações SPA, sempre pare o monitoramento ao trocar de página
window.addEventListener('beforeunload', function() {
    InnerForm.clearLocationWatch(watchId);
});
```

**Tratamento de erros:**
```javascript
// Erros possíveis:
// - PERMISSION_DENIED: Usuário negou permissão
// - POSITION_UNAVAILABLE: Localização indisponível
// - TIMEOUT: Tempo limite excedido
// - GEOLOCATION_NOT_SUPPORTED: Navegador não suporta
// - UNKNOWN_ERROR: Erro desconhecido

InnerForm.getLocation()
    .catch(function(error) {
        switch (error.error) {
            case 'PERMISSION_DENIED':
                alert('Permissão negada. Habilite a localização no navegador.');
                break;
            case 'POSITION_UNAVAILABLE':
                alert('Localização não disponível no momento.');
                break;
            case 'TIMEOUT':
                alert('Tempo limite excedido. Tente novamente.');
                break;
            default:
                alert('Erro: ' + error.userMessage);
        }
    });
```

### **Global Configuration**

#### Configurable Properties:
```javascript
// Ativar logs detalhados
InnerForm.verbose = true;

// Timeout para validação durante digitação (ms)
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
/* Estilo para campos obrigatórios */
.obg::before {
    content: "* ";
    color: red;
}

/* Animação para erros */
.error {
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Indicador de força da senha */
[data-pwstrength="4"] {
    border-left: 5px solid #28a745; /* Verde - Forte */
}

[data-pwstrength="3"] {
    border-left: 5px solid #ffc107; /* Amarelo - Média */
}

[data-pwstrength="2"],
[data-pwstrength="1"] {
    border-left: 5px solid #dc3545; /* Vermelho - Fraca */
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

| Class         | Description                                 |
| ------------- | ------------------------------------------- |
| `onkeyup`     | Validar conforme digita (com delay)         |
| `notonblur`   | NÃO validar ao sair do campo                |
| `notonchange` | NÃO validar quando valor muda               |
| `noreplace`   | Autocompletar não substitui valor existente |

### **Special Use Cases**
```html
<!-- Validar apenas ao enviar formulário -->
<input class="obg notonblur notonchange">

<!-- Validar em tempo real -->
<input class="obg onkeyup">

<!-- CEP que não substitui endereço já preenchido -->
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

### V2.8.0 - Máscaras e Validações de Coordenadas 🌍
- ✅ **Máscaras para coordenadas** `.mask.latitude` e `.mask.longitude`
- ✅ **Validações de coordenadas** `.latitude`, `.longitude`, `.coordinate`
- ✅ **Suporte a precisão** com classe `precision <número>`
- ✅ **Validação automática de limites** (-90/+90 para latitude, -180/+180 para longitude)
- ✅ **Máscaras inteligentes** que aceitam vírgula ou ponto decimal
- ✅ **Classes abreviadas** `.lat`, `.long`, `.lng` para economia de código

### V2.7.0 - AutoComplete de Geolocalização ✨
- ✅ **AutoComplete automático** para coordenadas de geolocalização
- ✅ **Preenchimento automático** de campos `.autocomplete.latitude` e `.autocomplete.longitude` 
- ✅ **Suporte a classes abreviadas** `.autocomplete.lat` e `.autocomplete.long`
- ✅ **Exemplo dedicado** com `ExemploAutoComplete.html`
- ✅ **Integração perfeita** com funções de geolocalização existentes

### Funcionalidades Principais:
- ✅ **Máscaras automatizadas** para 30+ tipos de dados
- ✅ **Validações em tempo real** configuráveis  
- ✅ **Sistema de callbacks** robusto
- ✅ **Autocompletar endereços** via ViaCEP
- ✅ **Autocompletar coordenadas** via Geolocalização
- ✅ **Sistema de geolocalização** completo e moderno
- ✅ **Validação de cartões de crédito** com 15+ bandeiras
- ✅ **Validação de senhas** com critérios configuráveis
- ✅ **Suporte completo** a documentos brasileiros
- ✅ **API JavaScript** para validação programática

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor, abra uma issue ou faça um pull request.

---

## 📞 Suporte

- **Documentação**: [GitHub Pages](https://zonaro.github.io/InnerFormValidation/TestForm)
- **Issues**: [GitHub Issues](https://github.com/zonaro/InnerFormValidation/issues)
- **Exemplos**: Veja o arquivo `TestForm.html` para exemplos práticos

---

---

## 🆕 Novidades e Melhorias Recentes

### **v2.6.0 - Outubro 2025**

#### **🌍 Sistema de Geolocalização Completo - NOVO!**
- **Nova função**: `InnerForm.getLocation()` - Obtém localização atual do usuário
- **Nova função**: `InnerForm.watchLocation()` - Monitoramento contínuo de localização  
- **Nova função**: `InnerForm.clearLocationWatch()` - Para monitoramento ativo
- **Recursos avançados**: 
  - Promise-based API moderna
  - Objeto de resposta rico com coordenadas, precisão, altitude, velocidade
  - URLs automáticas para Google Maps e OpenStreetMap
  - Tratamento inteligente de erros com mensagens amigáveis
  - Suporte a opções de alta precisão e cache configurável
- **Exemplos incluídos**: 
  - `ExemploSimples.html` - Implementação básica
  - `ExemploGeolocalizacao.html` - Interface completa
  - Seção dedicada no `TestForm.html`

### **v2.5.0 - Setembro 2025**

#### **✅ Validação de UUID/GUID Aprimorada**
- **Correção importante**: A validação de UUID agora aceita formatos mais flexíveis
- **Antes**: Apenas UUIDs RFC 4122 rigorosos eram aceitos
- **Agora**: Qualquer GUID válido em formato é aceito, incluindo GUIDs do .NET/C#
- **Exemplo**: `ff2bc94c-8ce0-417f-08ce-08ddfce17182` agora valida corretamente ✅

#### **🎯 Parsing Inteligente para Períodos**
- **Nova função**: `parseMonthYearPartial()` - Formatação inteligente para MM/YYYY ~ MM/YYYY
- **Nova função**: `parseShortMonthYearPartial()` - Formatação inteligente para MM/YY ~ MM/YY  
- **Melhorias**: Validação automática de mês (máximo 12) e formatação progressiva
- **Experiência**: Máscaras de período agora têm a mesma fluidez das máscaras de data

#### **🔧 Máscaras Aprimoradas**
- **Máscara UUID**: Nova máscara para formatação automática de GUIDs
- **Períodos melhorados**: Máscaras de `monthyearrange` e `shortmonthyearrange` completamente reescritas
- **Validação progressiva**: Campos são validados conforme o usuário digita, com feedback imediato

#### **📝 Funcionalidades Adicionais**
- **Expansão de anos**: Função `expandYear()` para conversão inteligente YY → YYYY
- **Validações robustas**: Novas funções de validação para intervalos de datas e períodos
- **Compatibilidade**: Mantém 100% de compatibilidade com versões anteriores

---

**⭐ Se este projeto foi útil, não esqueça de dar uma estrela no GitHub!**

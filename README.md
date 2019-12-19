# InnerFormValidation
Mask and Validate Forms with jQuery and CSS classes



### Examples

[Formulário de teste]( https://innercodebr.github.io/InnerFormValidation/TestForm )

### CDN

```html
<script src="https://gitcdn.xyz/repo/Innercodebr/InnerFormValidation/master/InnerFormValidation.js"></script>
```



### How to:



Add  `validate` class on`form` tag

Add one or more classes to any `input` element;

> Optional: Add `mask` class combined with any class below to use the respective mask

#### Validation/Mask Classes

- **obg** or **req** - Required field;
  
- **aphanumeric** - Only Aplhanumeric characters (A to Z, 0 to 9);
  
- **upper** - Only uppercase characters (allow non alphanumeric);
  
- **lower** - Only lowercase characters (allow non alphanumeric);
  
- **minlen** `numericvalue` - Minimum `numericvalue` characters;

- **maxlen** `numericvalue` - Maximum `numericvalue` characters;

- **len** `numericvalue` - Exact `numericvalue` of characters;

- **date** or **data** - Valid Date  ( in *dd/MM/yyyy* format);

- **mail** or **email** - Valid Email;

- **cpf** - Valid  Brazilian CPF;

- **cnpj** - Valid Brazilian CNPJ;

- **cep** - Valid  Brazilian PostalCode;

- **eq** `selector` - Equal selector (eg: `eq #user_email`);

-  **eqv** `value` - Equal value (eg: `eqv 20`);

-  **tel** - Telephone/Mobile number;

-  **link** or **url** - Valid URL;

- **password** - Validate Password Strenght (*Uppercase, Lowercase, Special Character and Number* ):

  - **strong** - Need 4 of 4 criteria;
  - **medium** - Need 3 of 4 criteria;
  - `numericvalue` - Need `numericavalue` of 4 criteria;

  > OBS.: Define minimum password lenght using **minlen**; After validation, this plugin adds a `data-pwstrenght` with the number of matched criterias

- **creditcard** or **debitcard** - Valid Credit Card Number:

  - **visa** 
  - **mastercard**
  - **diners**
  - **amex**
  - **discover**
  - **hiper**
  - **elo**
  - **jcb**
  - **aura**
  
  > OBS.: Define one or more brand classes to validate allowed flags. Use only  `creditcard ` class to validate any flag. After validation, this plugin adds the flagname on a `data-flagcard` attr
  
- **after** `numericvalue` - Numbers greater than `numericvalue`;

- **before** `numericvalue` - Numbers smaller than `numericvalue`;

- `numericvalue1` **to** `numericvalue2` - Numbers between `numericvalue1` and `numericvalue2`;

- **after** `date` - Date greater than `date`;

- **before** `date` - Date smaller than `date`;

- `date1` **to** `date2` - Date between `date1` and `date2`;

  > OBS.: you can also use the class `today` in place of `date`
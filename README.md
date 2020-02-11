# InnerFormValidation
Mask and Validate Forms with jQuery and CSS classes



### Examples

[Formulário de teste]( https://innercodebr.github.io/InnerFormValidation/TestForm )

### CDN

```html
<script src="https://gitcdn.xyz/repo/Innercodebr/InnerFormValidation/master/InnerFormValidation.js"></script>
```



### How to:

#### Mask and Validation Classes

Add  `validate` class on`form` tag

Add one or more classes to any `input` element;

> Optional: Add `mask` class combined with any class below to use the respective mask

#### Validation/Mask Classes

- **obg** or **req** - Required field;
  
- **alphanumeric** or **alphanum** - Only Aplhanumeric characters (A to Z, 0 to 9);
  
- **apha** - Only Alphabetical characters (A to 9);
  
- **upper** - Only uppercase characters (allow non alphanumeric);
  
- **lower** - Only lowercase characters (allow non alphanumeric);
  
- **minlen** `numericvalue` - Minimum `numericvalue` characters;

- **maxlen** `numericvalue` - Maximum `numericvalue` characters;

- **len** `numericvalue` - Exact `numericvalue` of characters;

- **date** or **data** - Valid Date  ( in *dd/MM/yyyy* format);

- **datetime** - Valid Date and Time (in dd/MM/yyyy hh:mm:ss format);

- **datetimeshort** - Valid Date and Time (in dd/MM/yyyy hh:mm format);

- **monthyear** - Valid Date (in MM/yy format);

- **time** - Valid Time (in hh:mm:ss format);

- **timeshort** - Valid Time (in hh:mm format);

- **mail** or **email** - Valid Email;

- **cpf** - Valid  Brazilian CPF;

- **cnpj** - Valid Brazilian CNPJ;

- **cpfcnpj** - Valid Brazilian CPF or CNPJ;

- **cep** - Valid  Brazilian PostalCode;

- **eq** `selector` - Equal selector (eg: `eq #user_email`);

-  **eqv** `value` - Equal value (eg: `eqv 20`);

-  **contains** `value` - contains value (eg: `contains test`);
	
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
  - **maestro**
  - **laser**
  - **blanche**
  - **switch**
  - **korean**
  - **union**
  - **solo**
  - **insta**
  - **bcglobal**
  - **rupay**
  
  > OBS.: Define one or more brand classes to validate allowed flags. Use only  `creditcard ` class to validate any flag. After validation, this plugin adds the flagname on a `data-flagcard` attr
  
- **after** `numericvalue` - Numbers greater than `numericvalue`;

- **before** `numericvalue` - Numbers smaller than `numericvalue`;

- `numericvalue1` **to** `numericvalue2` - Numbers between `numericvalue1` and `numericvalue2`;

- **after** `date` - Date greater than `date`;

- **before** `date` - Date smaller than `date`;

- `date1` **to** `date2` - Date between `date1` and `date2`;

  > OBS.: you can also use the class `today` in place of `date`


- **contains** `string` - value contains string;

- **containschar** `string` - value contains all chars of string (in any order);

- **containsanychar** `string` - value contains any chars of string (in any order);

- **notcontainschar** `string` - value contains none of chars of string (in any order);

  >  OBS.: you can also use the class `_space` to validate blank spaces in string






### Brazilian Address Autocomplete Classes

Add the  `autocomplete` class followed by:

 - **cep** - to use this input to find a address using a valid Postal Code;
 - **fulladdress** - to print the full address on input or element;
 - **address** - to print the address on input or element;
 - **neighborhood** - to print the neighborhood on input or element;
 - **city** - to print the city on input or element;
 - **state** - to print the state on input or element;
 - **num** or **number** - to add the address number. It is focused after a successfully address search;
   


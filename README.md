# 🚀 InnerFormValidation

**Uma biblioteca JavaScript completa para mascaramento e validação de formulários utilizando jQuery e classes CSS.**

[![CDN](https://img.shields.io/badge/CDN-Available-brightgreen)](https://cdn.jsdelivr.net/gh/innercodetech/innerformvalidation@master/InnerFormValidation.js)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![jQuery](https://img.shields.io/badge/Requires-jQuery-blue)](https://jquery.com/)

## 📖 Índice

1. [Instalação e Configuração](#instalação-e-configuração)
2. [Configuração Básica](#configuração-básica)
3. [Classes de Validação](#classes-de-validação)
4. [Classes de Máscara](#classes-de-máscara)
5. [Validações Avançadas](#validações-avançadas)
6. [Sistema de Callbacks](#sistema-de-callbacks)
7. [Autocompletar Endereços](#autocompletar-endereços)
8. [Exemplos Práticos](#exemplos-práticos)
9. [API JavaScript](#api-javascript)
10. [Personalização Visual](#personalização-visual)

---

## 🛠️ Instalação e Configuração

### CDN
```html
<!-- Adicione antes do script principal para ver mensagens detalhadas no console -->
<script>window.innerForm = { verbose: true }</script>
<script src="https://cdn.jsdelivr.net/gh/innercodetech/innerformvalidation@master/InnerFormValidation.js"></script>
```

### Download Local
1. Baixe o arquivo `InnerFormValidation.js`
2. Inclua no seu projeto:
```html
<script>window.innerForm = { verbose: true }</script>
<script src="path/to/InnerFormValidation.js"></script>
```

### Dependências
- jQuery 3.0+ (obrigatório)

---

## ⚙️ Configuração Básica

### 1. Estrutura HTML Base
```html
<form class="validate">
    <input type="text" class="form-control obg minlen 5" placeholder="Mínimo 5 caracteres">
    <button type="submit">Enviar</button>
</form>
```

### 2. Classes Fundamentais
- **`validate`**: Adicione ao elemento `<form>` para ativar a validação
- **`mask`**: Combinar com outras classes para aplicar máscaras automaticamente
- **`onkeyup`**: Validar conforme o usuário digita (com delay de 900ms)

### 3. Configuração Global
```javascript
window.innerForm = {
    verbose: true,           // Exibir logs detalhados no console
    onTypeTimeout: 1000     // Delay para validação durante digitação (ms)
};
```

---

## ✅ Classes de Validação

### **Campos Obrigatórios**

| Classe                 | Descrição         | Exemplo               |
| ---------------------- | ----------------- | --------------------- |
| `obg` `req` `required` | Campo obrigatório | `<input class="obg">` |

### **Validação de Formato**

| Classe         | Descrição                   | Compatível com Máscara | Exemplo                        |
| -------------- | --------------------------- | ---------------------- | ------------------------------ |
| `email` `mail` | Email válido                | ❌                      | `<input class="email">`        |
| `url` `link`   | URL válida                  | 🎭                      | `<input class="mask url">`     |
| `cpf`          | CPF brasileiro válido       | 🎭                      | `<input class="mask cpf">`     |
| `cnpj`         | CNPJ brasileiro válido      | 🎭                      | `<input class="mask cnpj">`    |
| `cpfcnpj`      | CPF ou CNPJ válido          | 🎭                      | `<input class="mask cpfcnpj">` |
| `cep`          | CEP brasileiro válido       | 🎭                      | `<input class="mask cep">`     |
| `tel` `cel`    | Telefone/Celular brasileiro | 🎭                      | `<input class="mask tel">`     |
| `ean`          | Código de barras EAN        | ❌                      | `<input class="ean">`          |

### **Validação de Caracteres**

| Classe                    | Descrição           | Compatível com Máscara | Exemplo                         |
| ------------------------- | ------------------- | ---------------------- | ------------------------------- |
| `alpha`                   | Apenas letras (A-Z) | 🎭                      | `<input class="mask alpha">`    |
| `alphanumeric` `alphanum` | Letras e números    | 🎭                      | `<input class="mask alphanum">` |
| `num` `number`            | Apenas números      | 🎭                      | `<input class="mask num">`      |
| `upper`                   | Apenas maiúsculas   | 🎭                      | `<input class="mask upper">`    |
| `lower`                   | Apenas minúsculas   | 🎭                      | `<input class="mask lower">`    |
| `nospace`                 | Proibir espaços     | 🎭                      | `<input class="mask nospace">`  |

### **Validação de Data e Hora**

| Classe                  | Formato             | Compatível com Máscara | Exemplo                              |
| ----------------------- | ------------------- | ---------------------- | ------------------------------------ |
| `date` `data`           | dd/MM/yyyy          | 🎭                      | `<input class="mask date">`          |
| `time`                  | hh:mm:ss            | 🎭                      | `<input class="mask time">`          |
| `timeshort` `shorttime` | hh:mm               | 🎭                      | `<input class="mask timeshort">`     |
| `datetime`              | dd/MM/yyyy hh:mm:ss | 🎭                      | `<input class="mask datetime">`      |
| `datetimeshort`         | dd/MM/yyyy hh:mm    | 🎭                      | `<input class="mask datetimeshort">` |
| `minutesecond`          | mm:ss               | 🎭                      | `<input class="mask minutesecond">`  |
| `monthyear`             | MM/yyyy             | 🎭                      | `<input class="mask monthyear">`     |

### **Validação de Comprimento**

| Classe                 | Descrição                      | Exemplo                              |
| ---------------------- | ------------------------------ | ------------------------------------ |
| `len <número>`         | Exatamente X caracteres        | `<input class="len 10">`             |
| `minlen <número>`      | Mínimo X caracteres            | `<input class="minlen 5">`           |
| `maxlen <número>`      | Máximo X caracteres            | `<input class="maxlen 20">`          |
| `leadingzero <número>` | Completar com zeros à esquerda | `<input class="mask leadingzero 8">` |

---

## 🎭 Classes de Máscara

> **Nota**: Adicione a classe `mask` junto com a classe específica para aplicar máscaras automaticamente.

### **Máscaras de Documento**
```html
<!-- CPF: 123.456.789-01 -->
<input class="form-control mask cpf">

<!-- CNPJ: 12.345.678/0001-90 -->
<input class="form-control mask cnpj">

<!-- CPF ou CNPJ automático -->
<input class="form-control mask cpfcnpj">

<!-- CEP: 12345-678 -->
<input class="form-control mask cep">
```

### **Máscaras de Data e Hora**
```html
<!-- Data: dd/mm/aaaa -->
<input class="form-control mask date">

<!-- Data e Hora: dd/mm/aaaa hh:mm:ss -->
<input class="form-control mask datetime">

<!-- Hora: hh:mm:ss -->
<input class="form-control mask time">

<!-- Mês/Ano: mm/aaaa -->
<input class="form-control mask monthyear">
```

### **Máscaras de Comunicação**
```html
<!-- Telefone: (11) 1234-5678 ou (11) 12345-6789 -->
<input class="form-control mask tel">

<!-- URL: automaticamente formata -->
<input class="form-control mask url">
```

### **Máscaras de Cartão**
```html
<!-- Qualquer cartão: 1234 5678 9012 3456 -->
<input class="form-control mask creditcard">

<!-- Cartão específico (Visa apenas) -->
<input class="form-control mask creditcard visa">
```

### **Máscaras de Formatação**
```html
<!-- Apenas maiúsculas -->
<input class="form-control mask upper">

<!-- Apenas minúsculas -->
<input class="form-control mask lower alpha">

<!-- Sem espaços -->
<input class="form-control mask nospace">

<!-- Números com zeros à esquerda -->
<input class="form-control mask num len 8 leadingzero">
```

---

## 🔥 Validações Avançadas

### **Validação por Idade**
```html
<!-- Maior de 18 anos -->
<input class="form-control mask date minage 18" placeholder="Data de Nascimento">

<!-- Menor de 65 anos -->
<input class="form-control mask date maxage 65">

<!-- Exatamente 30 anos -->
<input class="form-control mask date age 30">
```

### **Validação por Comparação Numérica**
```html
<!-- Maior que 10 -->
<input class="form-control num after 10">

<!-- Menor que 100 -->
<input class="form-control num before 100">

<!-- Entre 1 e 10 -->
<input class="form-control num 1 to 10">
```

### **Validação por Comparação de Data**
```html
<!-- Após hoje -->
<input class="form-control mask date after today">

<!-- Antes de uma data específica -->
<input class="form-control mask date before 31/12/2023">

<!-- Entre duas datas -->
<input class="form-control mask date 01/01/2023 to 31/12/2023">
```

### **Validação de Senhas**
```html
<!-- Senha forte (4 de 4 critérios: maiúscula, minúscula, número, símbolo) -->
<input type="password" class="form-control password strong minlen 8">

<!-- Senha média (3 de 4 critérios) -->
<input type="password" class="form-control password medium minlen 6">

<!-- Senha customizada (2 de 4 critérios) -->
<input type="password" class="form-control password 2 minlen 4">
```

### **Validação de Cartões de Crédito**

#### Cartões Suportados:
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

### **Validação de Conteúdo de String**
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

### **Validação de Igualdade**
```html
<!-- Comparar com outro campo -->
<input id="senha" type="password" class="form-control">
<input class="form-control eq #senha" placeholder="Confirmar Senha">

<!-- Comparar com valor específico -->
<input class="form-control eqv admin" placeholder="Digite 'admin'">
```

---

## 🎯 Sistema de Callbacks

Use atributos `data-*` para executar código JavaScript em eventos de validação:

### **Callbacks Disponíveis**
```html
<input class="form-control obg" 
    data-beforevalidatecallback="console.log('Antes da validação')"
    data-validcallback="$('#success').show()"
    data-invalidcallback="$('#error').show()"
    data-aftervalidatecallback="console.log('Após validação')">
```

### **Callback para Mensagem HTML5**
```html
<input class="form-control obg" 
    data-invalidmessage="Este campo é obrigatório! 😊">
```

### **Exemplo Prático de Callbacks**
```html
<input class="form-control obg eq #div_OK" 
    data-invalidcallback="$('#status').text('❌ Inválido').css('color','red')"
    data-validcallback="$('#status').text('✅ Válido').css('color','green')">
<div id="status"></div>
```

---

## 🏠 Sistema de Autocompletar Endereços

O InnerFormValidation inclui integração com a API **ViaCEP** para autocompletar endereços brasileiros.

### **Classes de Autocompletar**

| Classe                              | Descrição                         | Exemplo                                     |
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
| `autocomplete siafi`                | Código SIAFI                      | `<input class="autocomplete siafi">`        |

### **Exemplo Completo de Endereço**
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

### **Configurações de Timeout**
```html
<!-- Timeout customizado para busca (padrão: 0ms) -->
<input class="form-control mask cep autocomplete" data-timeout="500">
```

### **Controlando Substituição de Valores**
```html
<!-- Não substituir valor se já preenchido -->
<input class="form-control autocomplete address noreplace">
```

---

## 🧪 Exemplos Práticos

### **Formulário de Cadastro Completo**
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

### **Formulário Financeiro**
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

## 🔧 API JavaScript

### **Validação Programática**

#### Validar elemento específico:
```javascript
// Validar input individual
var isValid = $('#meuInput').isValid();

// Validar com classes customizadas
var isValid = $('#meuInput').isValid('obg', 'minlen 5');

// Validar valor direto
var isValid = $.isValid('teste@email.com', 'email');
```

#### Validar formulário completo:
```javascript
// Validar formulário inteiro
var isValid = $('#meuForm').isValid();

// Validar apenas campos que receberam foco
$('#meuForm').find(':input').addClass('prevFocus');
var isValid = $('#meuForm').isValid();
```

### **Aplicar Máscaras Manualmente**

```javascript
// Aplicar todas as máscaras
$('#meuForm').startMasks();

// Aplicar validações
$('#meuForm').startValidation();

// Máscaras específicas
$('#telefone').phoneMask();
$('#data').dateMask();
$('#cpf').cpfMask();
```

### **Busca de CEP Programática**

```javascript
searchViaCEP('01310-100', '123', 0, function(dadosEndereco) {
    console.log('Endereço encontrado:', dadosEndereco);
    // dadosEndereco contém: logradouro, bairro, localidade, uf, etc.
});
```

### **Configurar Timeout de Validação**
```javascript
// Validar com delay de 1 segundo
$('#input').validateOnType(1000);

// Validar em tempo real
$('#input').validateOnType(0);
```

### **Utilitário para Definir Valores**
```javascript
// Define valor apenas se campo estiver vazio
// Se não estiver vazio, só substitui se não tiver classe 'noreplace'
$('#campo').setOrReplaceVal('Novo valor');
```

---

## 🎨 Personalização Visual

### **Classes CSS Aplicadas Automaticamente**

O InnerFormValidation adiciona classes CSS automaticamente conforme o estado do campo:

```css
/* Campo válido (aplicado apenas em valores não-vazios) */
.success {
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* Campo inválido */
.error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Bootstrap compatibility */
.has-error .form-control {
    border-color: #dc3545;
}
```

### **Personalização Avançada**
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

### **Informações Disponíveis via Atributos**

Após validação, alguns elementos recebem atributos `data-*` com informações úteis:

```javascript
// Força da senha (0-4)
var forcaSenha = $('#senha').attr('data-pwstrength');

// Bandeira do cartão detectada
var bandeiraCartao = $('#cartao').attr('data-flagcard');
```

---

## 📚 Classes Especiais

### **Controle de Comportamento**

| Classe        | Descrição                                   |
| ------------- | ------------------------------------------- |
| `onkeyup`     | Validar conforme digita (com delay)         |
| `notonblur`   | NÃO validar ao sair do campo                |
| `notonchange` | NÃO validar quando valor muda               |
| `noreplace`   | Autocompletar não substitui valor existente |

### **Casos de Uso Especiais**
```html
<!-- Validar apenas ao enviar formulário -->
<input class="obg notonblur notonchange">

<!-- Validar em tempo real -->
<input class="obg onkeyup">

<!-- CEP que não substitui endereço já preenchido -->
<input class="mask cep autocomplete noreplace">
```

---

## 🐛 Debugging e Logs

### **Ativar Logs Detalhados**
```html
<script>
window.innerForm = { 
    verbose: true  // Ativa logs detalhados no console
};
</script>
```

### **Logs Disponíveis**
- ✅ **Sucesso**: `window.innerForm.log()`
- ⚠️ **Aviso**: `window.innerForm.warn()`  
- ❌ **Erro**: `window.innerForm.error()`

### **Exemplo de Debug**
```javascript
// No console do navegador, você verá:
// InnerFormValidation: Validation started
// InnerFormValidation: PhoneMask started  
// InnerFormValidation: Valid input detected
```

---

## ⚠️ Notas Importantes

1. **Ordem das Classes**: A ordem das classes pode importar em validações complexas
2. **Performance**: Para formulários grandes, considere usar `notonblur` em campos menos críticos
3. **Compatibilidade**: Testado com jQuery 3.0+ e Bootstrap 4+
4. **Campos Vazios**: A maioria das validações permite campos vazios (exceto `obg`/`required`)
5. **Máscaras vs Validação**: Nem toda validação tem máscara equivalente e vice-versa

---

## 🚀 Changelog

### Funcionalidades Principais:
- ✅ **Máscaras automatizadas** para 30+ tipos de dados
- ✅ **Validações em tempo real** configuráveis  
- ✅ **Sistema de callbacks** robusto
- ✅ **Autocompletar endereços** via ViaCEP
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

**⭐ Se este projeto foi útil, não esqueça de dar uma estrela no GitHub!**
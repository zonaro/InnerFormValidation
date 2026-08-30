(function () {
    var api = window.InnerForm;
    var fieldMenu = document.getElementById('field-menu');
    var activeField = null;
    document.querySelectorAll('form input, form select, form textarea, #callback-demo').forEach(function (field, index) {
        if (field.closest('.field-tools')) return;
        var tools = document.createElement('span');
        tools.className = 'field-tools';
        field.parentNode.insertBefore(tools, field);
        tools.appendChild(field);
        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'field-menu-trigger';
        trigger.setAttribute('aria-label', 'Ações para o campo ' + (field.name || field.id || index + 1));
        trigger.setAttribute('aria-expanded', 'false');
        trigger.innerHTML = '<span aria-hidden="true">⋮</span>';
        trigger.addEventListener('click', function () {
            activeField = field;
            var rect = trigger.getBoundingClientRect();
            fieldMenu.hidden = false;
            fieldMenu.style.top = Math.min(rect.bottom + 6, window.innerHeight - fieldMenu.offsetHeight - 8) + 'px';
            fieldMenu.style.left = Math.min(rect.right - fieldMenu.offsetWidth, window.innerWidth - fieldMenu.offsetWidth - 8) + 'px';
            document.querySelectorAll('.field-menu-trigger').forEach(function (button) { button.setAttribute('aria-expanded', button === trigger ? 'true' : 'false'); });
        });
        tools.appendChild(trigger);
    });
    function copyText(text) { if (navigator.clipboard) return navigator.clipboard.writeText(text); var area = document.createElement('textarea'); area.value = text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); return Promise.resolve(); }
    fieldMenu.addEventListener('click', function (event) {
        var action = event.target.dataset.fieldAction;
        if (!activeField || !action) return;
        copyText(action === 'html' ? activeField.outerHTML : activeField.className).then(function () { var original = event.target.textContent; event.target.textContent = 'Copiado'; setTimeout(function () { event.target.textContent = original; }, 900); });
    });
    document.addEventListener('click', function (event) { if (!event.target.closest('.field-menu') && !event.target.closest('.field-menu-trigger')) fieldMenu.hidden = true; });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') fieldMenu.hidden = true; });
    // A biblioteca se auto-inicializa pelas classes dos campos (máscaras, validação e
    // autocomplete de CEP). Aqui fica apenas a UI de demonstração: feedback do resultado
    // no <output> de cada formulário do laboratório.
    document.querySelectorAll('[data-demo-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var valid = api.isValid(form);
            var output = form.querySelector('output');
            output.textContent = valid ? '✓ Válido' : 'Revise os campos destacados';
            output.className = valid ? 'valid' : 'invalid';
        });
    });
    document.getElementById('cep-button').addEventListener('click', function () { var status = document.getElementById('cep-status'); status.textContent = 'Consultando ViaCEP...'; api.searchViaCEP(document.getElementById('cep-input').value, document.querySelector('#cep-form .homenum').value, 0, function (data) { status.textContent = data.erro ? 'CEP não encontrado.' : 'Endereço preenchido com sucesso.'; }); });
    var geoWatchId = null;
    function showLocation(location) { var result = document.getElementById('geo-result'); result.innerHTML = '<dt>Coordenadas</dt><dd>' + location.coordinates + '</dd><dt>Precisão</dt><dd>' + location.accuracyFormatted + '</dd><dt>Horário</dt><dd>' + location.formattedTime + '</dd><dt>Mapas</dt><dd><a href="' + location.googleMapsUrl + '" target="_blank" rel="noopener">Google Maps</a> · <a href="' + location.osmUrl + '" target="_blank" rel="noopener">OpenStreetMap</a></dd>'; document.getElementById('geo-status').textContent = 'Localização recebida.'; }
    function showGeoError(error) { document.getElementById('geo-status').textContent = error.userMessage || error.message || 'Não foi possível obter a localização.'; }
    document.getElementById('geo-get').addEventListener('click', function () { document.getElementById('geo-status').textContent = 'Solicitando permissão...'; api.getLocation({ enableHighAccuracy: true }).then(showLocation).catch(showGeoError); });
    document.getElementById('geo-watch').addEventListener('click', function () { if (geoWatchId !== null) return; geoWatchId = api.watchLocation(showLocation, showGeoError, { enableHighAccuracy: true, maximumAge: 5000 }); document.getElementById('geo-status').textContent = geoWatchId === null ? 'Geolocalização indisponível.' : 'Monitoramento ativo.'; });
    document.getElementById('geo-stop').addEventListener('click', function () { if (geoWatchId !== null) api.clearLocationWatch(geoWatchId); geoWatchId = null; document.getElementById('geo-status').textContent = 'Monitoramento parado.'; });
    document.getElementById('callback-button').addEventListener('click', function () { api.isValid(document.getElementById('callback-demo')); });
    var translations = {
        en: {
            '10 Autocomplete de CEP': '10 ZIP code autocomplete', '11 Geolocalização': '11 Geolocation', '12 Callbacks declarativos': '12 Declarative callbacks', '13 CSS por variáveis': '13 CSS variables', '14 API': '14 API', 'Autocomplete de CEP': 'ZIP code autocomplete',
            '00 Configuração': '00 Configuration', 'Configure o plugin de verdade': 'Configure the plugin for real', 'Ativação automática': 'Automatic activation', 'Ativação manual': 'Manual activation', 'Quando validar': 'When to validate', 'Classes que controlam a aparência': 'Classes that control appearance', 'Atributos': 'Attributes', 'para personalizar a experiência': 'to customize the experience',
            'Modo rascunho': 'Draft mode', 'Em modo rascunho, apenas a validação de obrigatório é ignorada — campos obrigatórios vazios não bloqueiam o envio. As demais validações continuam valendo: um e-mail inválido, por exemplo, mantém o formulário inválido.': 'In draft mode, only the required rule is ignored — empty required fields don\'t block submission. Other validations still apply: an invalid email, for example, keeps the form invalid.', 'Também funciona com a classe': 'Also works with the', 'no formulário.': 'class on the form.', 'desativa explicitamente o modo.': 'explicitly disables the mode.', 'E-mail obrigatório': 'Required email', 'Salvar rascunho': 'Save draft', 'modo rascunho': 'draft mode',
            'Início': 'Start', 'Laboratório': 'Lab', 'Integrações': 'Integrations', 'Valide cada detalhe do seu formulário.': 'Validate every detail of your form.',
            'JavaScript toolkit · documentação completa': 'JavaScript toolkit · complete documentation', 'Máscaras, regras brasileiras, conteúdo, datas, cartões, callbacks, CEP e geolocalização. Tudo funciona com JavaScript puro. Se jQuery existir, os plugins legados são conectados sem alterar o $.': 'Masks, Brazilian rules, content, dates, cards, callbacks, ZIP code and geolocation. Everything works with plain JavaScript. If jQuery exists, legacy plugins are connected without changing $.',
            '1º passo · CDN jsDelivr': 'Step 1 · jsDelivr CDN', 'Abrir laboratório': 'Open lab', 'Conteúdo': 'Contents', 'Básicas': 'Basics', 'Caracteres': 'Characters', 'Comprimento': 'Length', 'Documentos': 'Documents', 'Data e hora': 'Date and time', 'Idade e comparação': 'Age and comparison', 'Senhas': 'Passwords', 'Cartões': 'Cards', 'Conteúdo': 'Content', 'CEP e geo': 'ZIP code and geo', 'Callbacks': 'Callbacks',
            'Laboratório interativo': 'Interactive lab', 'Todas as regras, em um lugar': 'Every rule, in one place', 'Digite nos campos. A biblioteca aplica a máscara e valida as classes em tempo real. O botão testa o formulário inteiro.': 'Type in the fields. The library applies masks and validates classes in real time. The button tests the entire form.',
            'Validações básicas': 'Basic validation', 'Caracteres e texto': 'Characters and text', 'Comprimento e números': 'Length and numbers', 'Documentos, localização e identificadores': 'Documents, location and identifiers', 'Data, hora e períodos': 'Dates, time and ranges', 'Idade e comparação': 'Age and comparison', 'Força de senha': 'Password strength', 'Cartões de crédito': 'Credit cards', 'Conteúdo e igualdade': 'Content and equality',
            'Validações básicas': 'Basic validation', 'Obrigatório': 'Required', 'E-mail': 'Email', 'Regex com pattern': 'Regex with pattern', 'Validar bloco': 'Validate block', 'Apenas letras': 'Letters only', 'Alfanumérico': 'Alphanumeric', 'Número': 'Number', 'Maiúsculas': 'Uppercase', 'Minúsculas': 'Lowercase', 'Sem espaços': 'No spaces', 'Exatamente 8': 'Exactly 8', 'Mínimo 4': 'Minimum 4', 'Máximo 12': 'Maximum 12', 'Inteiro com milhar': 'Integer with thousands', 'Decimal BR': 'Brazilian decimal', 'Zeros à esquerda': 'Leading zeros',
            'CPF ou CNPJ': 'CPF or CNPJ', 'UF / state': 'State / UF', 'Coordenadas': 'Coordinates', 'Período de datas': 'Date range', 'Período mês/ano': 'Month/year range', 'Período curto': 'Short range', 'Data e hora': 'Date and time', 'Hora': 'Time', 'Hora curta': 'Short time', 'Minutos e segundos': 'Minutes and seconds', 'Mês e ano': 'Month and year', 'Maior de 18': 'Over 18', 'Menor de 65': 'Under 65', 'Exatamente 30': 'Exactly 30', 'Maior que 10': 'Greater than 10', 'Menor que 100': 'Less than 100', 'Entre 1 e 10': 'Between 1 and 10', 'Após hoje': 'After today', 'Antes de uma data': 'Before a date', 'Forte': 'Strong', 'Média': 'Medium', 'Customizada': 'Custom', 'Qualquer bandeira': 'Any brand', 'Somente Visa': 'Visa only', 'Contém texto': 'Contains text', 'Contém qualquer': 'Contains any', 'Contém todos': 'Contains all', 'Não contém': 'Does not contain', 'Igual ao campo': 'Equal to field', 'Valor admin': 'Admin value', 'Validar documentos': 'Validate documents', 'Validar datas': 'Validate dates', 'Validar comparações': 'Validate comparisons', 'Validar senhas': 'Validate passwords', 'Validar cartões': 'Validate cards', 'Validar conteúdo': 'Validate content',
            'Integrações que fazem o formulário viver': 'Integrations that bring forms to life', 'Autocomplete por CEP': 'ZIP code autocomplete', 'O CEP é o primeiro campo. A busca ViaCEP preenche endereço, complemento, bairro, cidade, UF, IBGE, GIA, DDD, SIAFI e endereço completo.': 'ZIP code comes first. ViaCEP fills in the street, complement, neighborhood, city, state, IBGE, GIA, area code, SIAFI and full address.', 'Buscar na ViaCEP': 'Search ViaCEP', 'Geolocalização': 'Geolocation', 'Obter localização': 'Get location', 'Iniciar monitoramento': 'Start watching', 'Parar monitoramento': 'Stop watching', 'Aguardando ação.': 'Waiting for action.', 'Callbacks e visual customizável': 'Callbacks and customizable visuals', 'Callbacks declarativos': 'Declarative callbacks', 'CSS por variáveis': 'CSS variables', 'API pública': 'Public API', 'Referência': 'Reference', 'Válido': 'Valid', 'Revise os campos destacados': 'Review highlighted fields', 'Copiar classes CSS de validação': 'Copy validation CSS classes', 'Copiar HTML': 'Copy HTML'
        },
        es: {
            '10 Autocomplete de CEP': '10 Autocompletado de código postal', '11 Geolocalização': '11 Geolocalización', '12 Callbacks declarativos': '12 Callbacks declarativos', '13 CSS por variáveis': '13 CSS por variables', '14 API': '14 API', 'Autocomplete de CEP': 'Autocompletado de código postal',
            '00 Configuração': '00 Configuración', 'Configure o plugin de verdade': 'Configura el plugin de verdad', 'Ativação automática': 'Activación automática', 'Ativação manual': 'Activación manual', 'Quando validar': 'Cuándo validar', 'Classes que controlam a aparência': 'Clases que controlan la apariencia', 'Atributos': 'Atributos', 'para personalizar a experiência': 'para personalizar la experiencia',
            'Modo rascunho': 'Modo borrador', 'Em modo rascunho, apenas a validação de obrigatório é ignorada — campos obrigatórios vazios não bloqueiam o envio. As demais validações continuam valendo: um e-mail inválido, por exemplo, mantém o formulário inválido.': 'En modo borrador, solo se ignora la validación de obligatorio — los campos obligatorios vacíos no bloquean el envío. Las demás validaciones siguen aplicando: un correo inválido, por ejemplo, mantiene el formulario inválido.', 'Também funciona com a classe': 'También funciona con la clase', 'no formulário.': 'en el formulario.', 'desativa explicitamente o modo.': 'desactiva explícitamente el modo.', 'E-mail obrigatório': 'Correo obligatorio', 'Salvar rascunho': 'Guardar borrador', 'modo rascunho': 'modo borrador',
            'Início': 'Inicio', 'Laboratório': 'Laboratorio', 'Integrações': 'Integraciones', 'Valide cada detalhe do seu formulário.': 'Valida cada detalle de tu formulario.',
            'JavaScript toolkit · documentação completa': 'JavaScript toolkit · documentación completa', 'Máscaras, regras brasileiras, conteúdo, datas, cartões, callbacks, CEP e geolocalização. Tudo funciona com JavaScript puro. Se jQuery existir, os plugins legados são conectados sem alterar o $.': 'Máscaras, reglas brasileñas, contenido, fechas, tarjetas, callbacks, código postal y geolocalización. Todo funciona con JavaScript puro. Si existe jQuery, los plugins heredados se conectan sin modificar $.',
            '1º passo · CDN jsDelivr': 'Paso 1 · CDN jsDelivr', 'Abrir laboratório': 'Abrir laboratorio', 'Conteúdo': 'Contenido', 'Básicas': 'Básicas', 'Caracteres': 'Caracteres', 'Comprimento': 'Longitud', 'Documentos': 'Documentos', 'Data e hora': 'Fecha y hora', 'Idade e comparação': 'Edad y comparación', 'Senhas': 'Contraseñas', 'Cartões': 'Tarjetas', 'CEP e geo': 'Código postal y geo', 'Callbacks': 'Callbacks', 'Laboratório interativo': 'Laboratorio interactivo', 'Todas as regras, em um lugar': 'Todas las reglas, en un solo lugar', 'Digite nos campos. A biblioteca aplica a máscara e valida as classes em tempo real. O botão testa o formulário inteiro.': 'Escribe en los campos. La biblioteca aplica máscaras y valida clases en tiempo real. El botón prueba todo el formulario.',
            'Validações básicas': 'Validaciones básicas', 'Obrigatório': 'Obligatorio', 'E-mail': 'Correo electrónico', 'Regex com pattern': 'Regex con patrón', 'Caracteres e texto': 'Caracteres y texto', 'Comprimento e números': 'Longitud y números', 'Documentos, localização e identificadores': 'Documentos, ubicación e identificadores', 'Data, hora e períodos': 'Fechas, horas y períodos', 'Força de senha': 'Fuerza de contraseña', 'Cartões de crédito': 'Tarjetas de crédito', 'Conteúdo e igualdade': 'Contenido e igualdad', 'Validar bloco': 'Validar bloque', 'Apenas letras': 'Solo letras', 'Alfanumérico': 'Alfanumérico', 'Número': 'Número', 'Maiúsculas': 'Mayúsculas', 'Minúsculas': 'Minúsculas', 'Sem espaços': 'Sin espacios', 'CPF ou CNPJ': 'CPF o CNPJ', 'UF / state': 'Estado / UF', 'Coordenadas': 'Coordenadas', 'Período de datas': 'Período de fechas', 'Período mês/ano': 'Período mes/año', 'Data e hora': 'Fecha y hora', 'Hora': 'Hora', 'Período mês/ano': 'Período mes/año', 'Maior de 18': 'Mayor de 18', 'Menor de 65': 'Menor de 65', 'Forte': 'Fuerte', 'Média': 'Media', 'Customizada': 'Personalizada', 'Qualquer bandeira': 'Cualquier marca', 'Somente Visa': 'Solo Visa', 'Não contém': 'No contiene', 'Senha': 'Contraseña', 'Igual ao campo': 'Igual al campo', 'Valor admin': 'Valor admin', 'Validar documentos': 'Validar documentos', 'Validar datas': 'Validar fechas', 'Validar comparações': 'Validar comparaciones', 'Validar senhas': 'Validar contraseñas', 'Validar cartões': 'Validar tarjetas', 'Validar conteúdo': 'Validar contenido',
            'Integrações que fazem o formulário viver': 'Integraciones que hacen vivir al formulario', 'Autocomplete por CEP': 'Autocompletado por código postal', 'Buscar na ViaCEP': 'Buscar en ViaCEP', 'Geolocalização': 'Geolocalización', 'Obter localização': 'Obtener ubicación', 'Iniciar monitoramento': 'Iniciar seguimiento', 'Parar monitoramento': 'Detener seguimiento', 'Aguardando ação.': 'Esperando una acción.', 'Callbacks e visual customizável': 'Callbacks y visual personalizable', 'Callbacks declarativos': 'Callbacks declarativos', 'CSS por variáveis': 'CSS por variables', 'API pública': 'API pública', 'Válido': 'Válido', 'Revise os campos destacados': 'Revisa los campos destacados', 'Copiar classes CSS de validação': 'Copiar clases CSS de validación', 'Copiar HTML': 'Copiar HTML'
        }
    };
    function translate(lang) {
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
        var dictionary = translations[lang] || {};
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        var node;
        while (node = walker.nextNode()) {
            if (node.parentElement.closest('script, style, pre, code, input, select')) continue;
            if (!node._ifvOriginal) node._ifvOriginal = node.nodeValue;
            var original = node._ifvOriginal;
            var trimmed = original.trim();
            if (lang === 'pt') node.nodeValue = original;
            else if (dictionary[trimmed]) node.nodeValue = original.replace(trimmed, dictionary[trimmed]);
        }
        document.querySelectorAll('.field-menu-trigger').forEach(function (button) { button.setAttribute('aria-label', lang === 'en' ? 'Field actions' : lang === 'es' ? 'Acciones del campo' : 'Ações do campo'); });
    }
    document.getElementById('language').addEventListener('change', function (event) { translate(event.target.value); });
}());

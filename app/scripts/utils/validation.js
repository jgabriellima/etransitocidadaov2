/*
data-req="true" 
data-validation="date/cpf/email/placa"
data-eq-value=""
*/
function vform(id) {
    var obj = {
        status: true,
        validation: {}
    };
    $(id + " input").each(function(value, index) {
        var c = $(index);
        if (c.attr("id")) {
            if (c.attr("data-req") === 'true' && isEmpty(c.val())) {
                obj.validation[c.attr("title")] = "<b>" + c.attr("title") + "</b>" + ": não pode ser vazio";
            } else {
                if (c.attr("data-req")) {
                    if (c.attr("data-validation") === 'date') {
                        var dataval = c.val();
                        try {
                            var v = c.val().split("-");
                            var dataval = v[2] + "/" + v[1] + "/" + v[0];
                        } catch (e) {}
                        if (!validaDat(dataval)) {
                            obj.validation[c.attr("title")] = " Insira uma data válida; ";
                        } else {
                            var data_1 = new Date(c.val());
                            var data_2 = new Date();
                            if (data_1 > data_2) {
                                obj.validation[c.attr("title")] = " A data não pode ser maior que a atual.";
                            }
                        }
                    }
                    if (c.attr("data-validation") === 'email') {
                        if (!validateEmail(c.val())) {
                            obj.validation[c.attr("title")] = " Insira um e-mail válido.";
                        }
                    }
                    if (c.attr("data-validation") === 'placa') {
                        if (!isPlaca(c.val())) {
                            obj.validation[c.attr("title")] = " Insira uma placa válida.";
                        }
                    }
                    if (c.attr("data-validation") === 'renavam') {
                        if (c.val().length !== 9) {
                            obj.validation[c.attr("title")] = " Insira um renavam válido.";
                        }
                    }
                    if (c.attr("data-validation") === 'cpf') {
                        if (!validarCPF(c.val())) {
                            obj.validation[c.attr("title")] = " Insira um CPF válido.";
                        }
                    }
                    if (c.attr("data-eq-value") !== null) {
                        if (c.val() !== $("#" + c.attr("data-eq-value")).val()) {
                            obj.validation[c.attr("title")] = "Os campos <b>" + $("#" + c.attr("data-eq-value")).attr("title") + "</b> e <b>" + c.attr("title") + "</b> não correspondem";
                        }
                    }
                }
            }
        }
    });
    if (!isEmpty(obj.validation)) {
        obj.status = false;
        obj.template = "<div style='text-align:center'>";
        for (var b in obj.validation) {
            obj.template += obj.validation[b] + "<br/>";
        }
        obj.template += "</div>";
    }
    return obj;
}

/*
onkeypress="mascara(this,cpf_mask)" onkeyup="mascara(this,cpf_mask)"
*/
function isCPF(value) {
    console.log(value);
    // value = jQuery.trim(value);
    cpf = value.toString(); //.replace(/.|-|/gi, ''); // elimina .(ponto), -(hifem) e /(barra)
    while (cpf.length < 11) cpf = "0" + cpf;
    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
    var a = [];
    var b = new Number;
    var c = 11;
    for (i = 0; i < 11; i++) {
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
    }
    if ((x = b % 11) < 2) {
        a[9] = 0
    } else {
        a[9] = 11 - x
    }
    b = 0;
    c = 11;
    for (var y = 0; y < 10; y++) b += (a[y] * c--);
    if ((x = b % 11) < 2) {
        a[10] = 0;
    } else {
        a[10] = 11 - x;
    }
    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) return false;
    return true;
}


function isPlaca(placa) {
    var er = /[a-z]{3}-?\d{4}/gim;
    er.lastIndex = 0;
    return er.test(placa);
}

function maxLengthCheck(object) {
    if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
}

var v_obj, v_fun;

function mascara(o, f) {
    v_obj = o;
    v_fun = f;
    setTimeout("execmascara()", 1);
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value);
}

function leech(v) {
    v = v.replace(/o/gi, "0");
    v = v.replace(/i/gi, "1");
    v = v.replace(/z/gi, "2");
    v = v.replace(/e/gi, "3");
    v = v.replace(/a/gi, "4");
    v = v.replace(/s/gi, "5");
    v = v.replace(/t/gi, "7");
    return v;
}

function soNumeros(v) {
    return v.replace(/\D/g, "");
}

function telefone(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d\d)(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/(\d{5})(\d)/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}

function cpf_mask(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
}

function cep(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{5})(\d)/, "$1-$2"); //Esse é tão fácil que não merece explicações
    return v;
}

function vplaca(v) {
    // /[a-zA-Z]+/g
    // v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    // v = v.replace(/^(\d{3})(\d)/, "$1-$2"); //Esse é tão fácil que não merece explicações
    return v;
}

function cnpj(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, "$1.$2"); //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2"); //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca um hífen depois do bloco de quatro dígitos
    return v;
}

function romanos(v) {
    v = v.toUpperCase(); //Maiúsculas
    v = v.replace(/[^IVXLCDM]/g, ""); //Remove tudo o que não for I, V, X, L, C, D ou M
    //Essa é complicada! Copiei daqui: http://www.diveintopython.org/refactoring/refactoring.html
    while (v.replace(/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/, "") != "");
    v = v.replace(/.$/, "");
    return v
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function site(v) {
    //Esse sem comentarios para que você entenda sozinho ;-)
    v = v.replace(/^http:\/\/?/, "");
    dominio = v;
    caminho = "";
    if (v.indexOf("/") > -1);
    dominio = v.split("/")[0];
    caminho = v.replace(/[^\/]*/, "");
    dominio = dominio.replace(/[^\w\.\+-:@]/g, "");
    caminho = caminho.replace(/[^\w\d\+-@:\?&=%\(\)\.]/g, "");
    caminho = caminho.replace(/([\?&])=/, "$1");
    if (caminho != "") dominio = dominio.replace(/\.+$/, "");
    v = "http://" + dominio + caminho;
    return v;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito 
    var add = 0;
    for (var i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito 
    add = 0;
    for (var i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito 
    var add = 0;
    for (var i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito 
    add = 0;
    for (var i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
};

function empty(val) {

    if (val === undefined)
        return true;

    if (typeof(val) == 'function' || typeof(val) == 'number' || typeof(val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
        return false;

    if (val == null || val.length === 0) // null or 0 length array
        return true;

    if (typeof(val) == "object") {
        // empty object

        var r = true;

        for (var f in val)
            r = false;

        return r;
    }

    return false;
}

function isEmpty(value) {
    var isEmptyObject = function(a) {
        if (typeof a.length === 'undefined') { // it's an Object, not an Array
            var hasNonempty = Object.keys(a).some(function nonEmpty(element) {
                return !isEmpty(a[element]);
            });
            return hasNonempty ? false : isEmptyObject(Object.keys(a));
        }

        return !a.some(function nonEmpty(element) { // check if array is really not empty as JS thinks
            return !isEmpty(element); // at least one element should be non-empty
        });
    };
    return (
        value == false || typeof value === 'undefined' || value == null || (typeof value === 'object' && isEmptyObject(value))
    );
}

function validaDat(valor) {
    var date = valor;
    var ardt = new Array;
    var ExpReg = new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
    ardt = date.split("/");
    erro = false;
    if (date.search(ExpReg) == -1) {
        erro = true;
    } else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30))
        erro = true;
    else if (ardt[1] == 2) {
        if ((ardt[0] > 28) && ((ardt[2] % 4) != 0))
            erro = true;
        if ((ardt[0] > 29) && ((ardt[2] % 4) == 0))
            erro = true;
    }
    if (erro) {
        return false;
    }
    return true;
}

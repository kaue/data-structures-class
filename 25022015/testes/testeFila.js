var Fila = require('../entidades/fila');
//
// Teste da Implementação de Pilha
//
function obterNumeroAleatorio(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
var fila = new Fila();
var numeroAleatorio = obterNumeroAleatorio(0,100);
console.log('Inserir elemento (%s) na Fila...', numeroAleatorio);
fila.push(numeroAleatorio);
var numeroAleatorio = obterNumeroAleatorio(0,100);
console.log('Inserir elemento (%s) na Fila...', numeroAleatorio);
fila.push(numeroAleatorio);
console.log('Utilizar o metodo .obterCount() da Fila...');
console.log('Resultado = %s', fila.obterCount());
console.log('Utilizar metodo .pop() da Fila...');
console.log('Resultado = Item %s removido da Pilha', fila.pop());
console.log('Utilizar o metodo .obterCount() da Fila...');
console.log('Resultado = %s', fila.obterCount());

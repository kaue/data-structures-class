var Pilha = require('../entidades/pilha');

//
// Teste da Implementação de Pilha
//
function obterNumeroAleatorio(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
var pilha = new Pilha();
var numeroAleatorio = obterNumeroAleatorio(0,100);
console.log('Inserir elemento (%s) na Pilha...', numeroAleatorio);
pilha.push(numeroAleatorio);
var numeroAleatorio = obterNumeroAleatorio(0,100);
console.log('Inserir elemento (%s) na Pilha...', numeroAleatorio);
pilha.push(numeroAleatorio);
console.log('Utilizar o metodo .obterCount() da Pilha...');
console.log('Resultado = %s', pilha.obterCount());
console.log('Mostrar todos itens da Pilha...');
console.log(pilha.mostrarTudo());
console.log('Obter Topo da Pilha...');
console.log('Resultado = %s', pilha.obterTopo());
console.log('Utilizar metodo .pop() da Pilha...');
console.log('Resultado = Item %s removido da Pilha', pilha.pop());
console.log('Mostrar todos itens da Pilha...');
console.log(pilha.mostrarTudo());

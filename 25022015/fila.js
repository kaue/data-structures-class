var Node = require('./node.js');

/*
*   Implementação de Fila
*/
function Fila(){
    this.first = null;
    this.count = 0;

    this.obterCount = function(){
        return this.count;
    }

    this.push = function(data){
        var node = new Node(data);

        if (!this.first){
            this.first = node;
        } else {
            n = this.first;
            while (n.next) {
                n = n.next;
            }
            n.next = node;
        }

        this.count += 1;
        return node;
    }
    
    this.pop = function(){
        temp = this.first;
        this.first = this.first.next;
        this.size -= 1;
        return temp.data;
    }
}

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

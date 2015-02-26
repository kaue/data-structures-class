var Node = require('./node.js');

/*
*   Implementação de Pilha
*/
function Pilha(){
    this.top = null;
    this.count = 0;

    this.obterCount = function(){
        return this.count;
    }

    this.obterTopo = function(){
        return this.top.data;
    }

    this.push = function(data){
        var node = new Node(data);

        node.next = this.top;
        this.top = node;

        this.count++;
    }
    
    this.pop = function(){
        if(this.top === null){
            return null;
        }else{
            var out = this.top;
            this.top = this.top.next;
            if(this.count>0){
                this.count--;
            }

            return out.data;
        }
    }

    this.mostrarTudo = function(){
        if(this.top === null){
            return null;
        }else{
            var arr = new Array();
            var current = this.top;            
            for(var i = 0;i<this.count;i++){
                arr[i] = current.data;
                current = current.next;
            }

            return arr;
        }
    }
}
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

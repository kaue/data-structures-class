var Node = require('./node.js');

/*
*   Implementação de Pilha
*/
module.exports = function(){
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

        this.count += 1;
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

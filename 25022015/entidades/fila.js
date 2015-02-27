var Node = require('./node.js');

/*
*   Implementação de Fila
*/
module.exports = function(){
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
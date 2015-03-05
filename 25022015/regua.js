var chBig = '-- ',
    chSmall = '-',
    intStart = 0,
    intEnd = 30; //Qtd centimetros

/*
* Implementação da Regua
*/
(function r(n,l) {
    console.log(n%10==0?chBig+n/10:chSmall);
    if(n/10<l)
        return r(n+1, l);
})(intStart,intEnd);



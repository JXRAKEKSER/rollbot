
const randomize = (diceStr) => {

    const regForDice = new RegExp(/[dD]\d{1,3}/);

    switch (diceStr.match(regForDice)[0].slice(1)){
        case '4':
            return Math.floor(4*Math.random());
            break;
        case '6':
            return Math.floor(6*Math.random());
            break;
        case '8':
            return Math.floor(8*Math.random());
            break;
        case '12':
            return Math.floor(12*Math.random());
            break;
        case '20':
            return Math.floor(20*Math.random());
            break;
        case '100':
            return Math.floor(100*Math.random());
            break;
        default:
            return -1;
    }
}
 module.exports = randomize;
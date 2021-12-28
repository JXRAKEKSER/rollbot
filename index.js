const TelegramBot = require('node-telegram-bot-api')
const randomize = require('./utils/randomize');
const token = '5021210314:AAGsgdeK5tXqNG6iJ43XXeFkyF-OyV5pQS8'

const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/start/, (msg, match) => {
    bot.sendMessage(msg.chat.id, 'Привет, этот бот поможет тебе зароллить качеcтвенную игру\n Leshhh, goooo!!!');
});

bot.onText(/\/help/, (msg, match) => {
    bot.sendMessage(msg.chat.id, 'Введи строку в формате \'MdN+K\', ' +
        'где M - количество костей при броске, d - буква, обозначающая кость, N - количество граней кости, K - дополнительные коэффиценты, ' +
        'если они у вас есть, конечно же\n Если M = 1, то единицу можно не указывать\n' +
        'Строка 4d6 будет интерпретирована как 4 кости с 6-ю гранями, то есть 4 обычных игральных куба\n' +
        );
})



bot.onText(/^[^\/].+/, (msg, match) => {

    const regexpDice = /\b\s?\d{0,3}[dD]\d{1,3}\s?\b/g;
    const regexpNumberConst = /[+-]\s?\d+\b/g;
    const regexpMathSigns = /\b[+-]\b/g;
    const userStr = match[0];

    const matchesDice = userStr.match(regexpDice) || [];
    const matchesNumberConst = userStr.match(regexpNumberConst) || [];
    const matchesMathSigns = userStr.match(regexpMathSigns) || [];

    let matchesDiceLength = 0;
    matchesDice.forEach( diceMatch => {
        matchesDiceLength += diceMatch.length;
    });
    let matchesNumberConstLength = 0;
    matchesNumberConst.forEach( numberMatch => {
        matchesNumberConstLength+= numberMatch.length;
    })
    let matchesMathSignsLength = 0;
    matchesMathSigns.forEach( mathSignMatch => {
        matchesMathSignsLength+= mathSignMatch.length;
    })
    let regexpMatchesLength = matchesNumberConstLength - matchesNumberConst.length + matchesDiceLength +matchesMathSignsLength;



    if(regexpMatchesLength !== userStr.length){
        bot.sendMessage(msg.chat.id, 'Некорректный ввод');
    }else{
        let userStrPos = 0;
        const errorObj = {
            error: false,
            errorDice: ''
        }
      const dicesSum = matchesDice.reduce((previosValue, matchDice, index) => {

          const reg = new RegExp(matchDice);
          const searchResult = reg.exec(userStr.slice(userStrPos));


          if (randomize(matchDice)===-1){
              errorObj.error = true;
              errorObj.errorDice = matchDice;
          }
              if(index===0){
                  if(matchDice.match(/\d{0,3}[dD]/)[0].length === 1){
                      previosValue+=randomize(matchDice);
                  }else{
                      const multiplier = matchDice.match(/\d{0,3}[dD]/)[0].slice(0,-1);
                      previosValue+= parseInt(multiplier)*randomize(matchDice);
                  }


              }else if(userStr.slice(userStrPos)[searchResult.index-1] === '+'){
                  if(matchDice.match(/\d{0,3}[dD]/)[0].length === 1){
                      previosValue+=randomize(matchDice);
                  }else{
                      const multiplier = matchDice.match(/\d{0,3}[dD]/)[0].slice(0,-1);
                      previosValue+= parseInt(multiplier)*randomize(matchDice);
                  }
              }else if(userStr.slice(userStrPos)[searchResult.index-1] === '-'){
                  if(matchDice.match(/\d{0,3}[dD]/)[0].length === 1){
                      previosValue-=randomize(matchDice);

                  }else{
                      const multiplier = matchDice.match(/\d{0,3}[dD]/)[0].slice(0,-1);
                      previosValue-= parseInt(multiplier)*randomize(matchDice);
                  }
              }
              userStrPos += searchResult[0].length;
          return previosValue;
        }, 0);
        const numbersSum = matchesNumberConst.reduce((previousValue, matchNumber) => {

            if(matchNumber[0] === '+'){
                previousValue+= parseInt(matchNumber.match(/\d+/));

            }else if(matchNumber[0] === '-'){
                previousValue-= parseInt(matchNumber.match(/\d+/));
            }
            return previousValue;
        }, 0)



        if(errorObj.error){
            bot.sendMessage(msg.chat.id, `У нас нет костей со значением ${errorObj.errorDice}`);
        }else{
            bot.sendMessage(msg.chat.id, (dicesSum+numbersSum));
        }
    }
})

bot.on("polling_error", console.log);
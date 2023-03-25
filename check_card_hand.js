function pokerHands(arr) {
  let cardValues = {2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, T:10, J:11, Q:12, K:13, A:14}
  let winsP1=0, winsP2=0;
  let handP1, handP2;
  let scoreP1, scoreP2;

  for (let hands of arr) {
    handP1 = hands.split(" ");
    handP2 = handP1.splice(5,5);

    scoreP1 = calcHand(handP1);
    scoreP2 = calcHand(handP2);
    
    for (let x in scoreP1) {
      if (scoreP1[x] > scoreP2[x]) {
        winsP1++;
        break;
      } else if (scoreP2[x] > scoreP1[x]) {
        winsP2++;
        break;
      }
    }
  }

  return winsP1;

  // function calcHand - Returns the score for a hand ------------------------
  function calcHand (theHand) {
    let suits = {}, cards = {};

    // Score [hand score, first high, second high, extra high, extra high, extra high]
    let score = [0,0,0,0,0,0]  

    // Build card number counts, and suit counts
    for (let card of theHand) {
      cards[cardValues[card[0]]] = (cards[cardValues[card[0]]] + 1) || 1;
      suits[card[1]] = (suits[card[1]] + 1) || 1;
    }
    
    let cardLen = Object.keys(cards).length;
    let suitLen = Object.keys(suits).length;

    // If 5 different cards - check for straight or highcard
    if (cardLen == 5) {     
      score = straight(Object.keys(cards));

      // If flush, adjust score accordingly
      if (suitLen == 1) { 
        score[0] += 5;
      }  
    }

    // If 2 different cards - check if 4 of kind or full house
    if (cardLen == 2) {
      let twoCards = Object.keys(cards);
      switch(cards[twoCards[0]]) {
        case 1: score = [8, twoCards[1], twoCards[0], 0, 0, 0];break;
        case 4: score = [8, twoCards[0], twoCards[1], 0, 0, 0];break;
        case 2: score = [7, twoCards[1], twoCards[0], 0, 0, 0];break;
        case 3: score = [7, twoCards[0], twoCards[1], 0, 0, 0];break;
      }
    }

    // If 3 different cards, then three of a kind or two pair
    if (cardLen == 3) {

      // If three of a kind
      if (Object.values(cards).includes(3)) {
        score[0] = 4;
        let leftovers = [];
        for (let card3 in cards) {
          if (cards[card3] == 3) {
            score[1] = parseInt(card3);
          } else {
            leftovers.push(parseInt(card3));
          }
          score[2] = Math.max(...leftovers);
          score[3] = Math.min(...leftovers);
        }

      // If two pair  
      } else {
        score[0] = 3;
        let majors = [];
        for (let card22 in cards) {
          if (cards[card22] == 2) {
            majors.push(parseInt(card22));
          } else {
            score[3] = parseInt(card22);
          }
          score[1] = Math.max(...majors);
          score[2] = Math.min(...majors);
        }
      }
    }

    // If 4 different cards, then one pair
    if (cardLen == 4) {
        score[0] = 2;
        let minors = [];
        for (let card2 in cards) {
          if (cards[card2] == 2) {
            score[1] = parseInt(card2);
          } else {
            minors.push(parseInt(card2));
          }
          minors.sort((a,b) => b-a);
          score[2] = minors[0];
          score[3] = minors[1];
          score[4] = minors[2];
        }
    }

    return score;
  }



  //function straight --- calculates the score for a possible straight -----------
  function straight(cardNums) {
    cardNums = cardNums.map(item => parseInt(item));
    cardNums.sort( (a,b) => b-a );

    //If straight detected, return score of 5, or 1 for highcard
    if (cardNums[0] - cardNums[4] == 4) {
      return [5].concat(cardNums);
    } else {
      return [1].concat(cardNums);
    }
  }
}

const testArr = [
  '8C TS KC 9H 4S 7D 2S 5D 3S AC',
  '5C AD 5D AC 9C 7C 5H 8D TD KS',
  '3H 7H 6S KC JS QH TD JC 2D 8S',
  'TH 8H 5C QS TC 9H 4D JC KS JS',
  '7C 5H KC QH JD AS KH 4C AD 4S'
];

console.log(pokerHands(testArr));

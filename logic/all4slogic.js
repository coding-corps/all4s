
const CARD_VALUE_MAP = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const SUITS = ["♠", "♣", "♥", "♦"];
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export class Player {
  constructor() {
    this.hand = [];
    this.dealer = false;
    this.points = [];
    this.position = 0;
  }

  get numberOfCards() {
    return this.hand.length;
  }

  setPos(p) {
    this.position = p;
  }

  isDealer() {
    this.dealer = true;
  }

  addPoint(point) {
    // high , low , jack, hangjack, game
    // to tell who played what
    this.points.append(point);
  }
  play() {
    return this.hand.shift();
  }

  draw(card) {
    this.hand.push(card);
  }
}
export class Game {
  constructor(players) {
    this.players = players;
    this.teams = [];
    this.hands = [];
    this.winner = null;
    this.deck = new Deck();
    this.round = 0;
  }

  setUpHands(noOfPlayers){
    // Create element:
    // Append to another element:
    var table = document.getElementById("table")
    for (var i = 1; i <= noOfPlayers; i++) {
      console.log("adding player", i)
      var hand = document.createElement("div");
      hand.setAttribute("id", "player"+i);
      hand.classList.add('hand');
      console.log(hand.innerHTML)
      table.appendChild(hand);
    }
  }

  initDeck() {
    this.deck = new Deck();
  }

  firstJack() {
    // how many players
    var positions = [];
    for (var i = 1; i <= this.players.length; i++) {
      positions.push(i);
      // this.players[i].position = i
    }

    var starting = new Deck();

    starting.shuffle();
    var p = positions[0];
    var dealerPos = 0;
   
    var del = 0 
    do {
      var card = starting.deal();
      this.players[p - 1].hand.push(card);
          card.dealHTML("player"+p, del)
      if (card.value === "J") {
        this.players[p - 1].dealer  = true
        dealerPos = p-1
      }

      if (p === positions[positions.length - 1]) {
        p = positions[0];
      } else {
      p++
    }
    del = del + 0.3

   } while (card.value !== "J");
   var dealer = dealerPos+1
   var msg = 'player '+dealer+' will deal first'
   setTimeout(function(){ alert(msg ); }, (del*1000)+600);
    console.log('player',dealerPos+1 ,  this.players[dealerPos])
  }

  deal() {

  }


}
export class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red";
  }

  get getVal() {
    return this.value;
  }

  dealHTML(hand, del) {
    document.getElementById(hand).innerHTML += '<div class="card animated_div" style="color:'+this.color+'; animation-delay: '+del+'s; "><div class="tl">'+ this.value + this.suit +'</div> <div class="m">'+ this.suit+ '</div><div class="br">'+ this.value + this.suit +'</div></div>';
  }
  getHTML(hand) {
    document.getElementById(hand).innerHTML += '<div class="card" style="color:'+this.color+';"><div class="tl">'+ this.value + this.suit +'</div> <div class="m">'+ this.suit+ '</div><div class="br">'+ this.value + this.suit +'</div></div>';
  }
  getFaceDown(hand){
    document.getElementById(hand).innerHTML += '<div class="card flip-card-back" style="color:'+this.color+';"><div class="tl">'+ this.value + this.suit +'</div> <div class="m">'+ this.suit+ '</div><div class="br">'+ this.value + this.suit +'</div></div>';
  }
  dealFaceDownHTML(hand, del) {
    document.getElementById(hand).innerHTML += '<div class="card flip-card-back animated_div"; style="animation-delay: '+del+'s; "></div>';
  }
}
export class Team {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.score = 0;
  }

  get score() {
    return this.score;
  }

  addChalk(point) {
    this.chalk = this.chalk + point;
  }
  high() {
    this.addpoint(1);
  }
  low() {
    this.addpoint(1);
  }
  jack() {
    this.addpoint(1);
  }
  game(game) {
    this.addpoint(game);
  }
  hangJack() {
    this.addpoint(3);
  }
  kickJack() {
    this.addpoint(1);
  }
}
export class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  pop() {
    return this.cards.shift();
  }

  push(card) {
    this.cards.push(card);
  }

  deal() {
    var c = this.cards.shift();
    console.log(c);
    return c;
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}
const computerCardSlot = document.querySelector(".computer-card-slot");
const playerCardSlot = document.querySelector(".player-card-slot");
const computerDeckElement = document.querySelector(".computer-deck");
const playerDeckElement = document.querySelector(".player-deck");
const text = document.querySelector(".text");

let playerDeck, computerDeck, inRound, stop;

document.addEventListener("click", () => {
  if (stop) {
    startGame();
    return;
  }

  if (inRound) {
    cleanBeforeRound();
  } else {
    flipCards();
  }
});

function cleanBeforeRound() {
  inRound = false;
  computerCardSlot.innerHTML = "";
  playerCardSlot.innerHTML = "";
  text.innerText = "";

  updateDeckCount();
}

function flipCards() {
  inRound = true;

  const playerCard = playerDeck.pop();
  const computerCard = computerDeck.pop();

  playerCardSlot.appendChild(playerCard.getHTML());
  computerCardSlot.appendChild(computerCard.getHTML());

  updateDeckCount();

  if (isRoundWinner(playerCard, computerCard)) {
    text.innerText = "Win";
    playerDeck.push(playerCard);
    playerDeck.push(computerCard);
  } else if (isRoundWinner(computerCard, playerCard)) {
    text.innerText = "Lose";
    computerDeck.push(playerCard);
    computerDeck.push(computerCard);
  } else {
    text.innerText = "Draw";
    playerDeck.push(playerCard);
    computerDeck.push(computerCard);
  }

  if (isGameOver(playerDeck)) {
    text.innerText = "You Lose!!";
    stop = true;
  } else if (isGameOver(computerDeck)) {
    text.innerText = "You Win!!";
    stop = true;
  }
}

function updateDeckCount() {
  computerDeckElement.innerText = computerDeck.numberOfCards;
  playerDeckElement.innerText = playerDeck.numberOfCards;
}

function isRoundWinner(cardOne, cardTwo) {
  return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value];
}

function isGameOver(deck) {
  return deck.numberOfCards === 0;
}

function isTrump(card) {}

function freshDeck() {
  return SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return new Card(suit, value);
    });
  });
}

startGame();
function startGame() {
  // allfours
  var p1 = new Player();
  var p2 = new Player();
  var p3 = new Player();
  var p4 = new Player();
  var prs = [p1, p2,p3,p4];
  var game = new Game(prs);

  game.setUpHands(prs.length)

  game.firstJack();

  game.deal();
  
  console.log("game", game);

  // const deckMidpoint = Math.ceil(deck.numberOfCards / 2)
  // playerDeck = new Deck(deck.cards.slice(0, deckMidpoint))
  // computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))
  // inRound = false
  // stop = false
  // cleanBeforeRound()
}

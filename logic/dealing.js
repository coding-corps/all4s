function firstJack(Game) {
    // how many players
    var positions = [];
    for (var i = 1; i <= Game.players.length; i++) {
      positions.push(i);
      // this.players[i].position = i
    }

    var starting = new Deck();

    starting.shuffle();
    var p = positions[0];
    var dealerPos = 0;
   
    do {
      var card = starting.deal();
      Game.players[p - 1].hand.push(card);
          card.getHTML("player"+p)
      if (card.value === "J") {
        Game.players[p - 1].dealer  = true
        dealerPos = p-1
      }

      if (p === positions[positions.length - 1]) {
        p = positions[0];
      } else {
      p++
    }
  
   } while (card.value !== "J");
    console.log('player',dealerPos+1 , "will deal first" )
    console.log('player',dealerPos+1 ,  Game.players[dealerPos])
  }
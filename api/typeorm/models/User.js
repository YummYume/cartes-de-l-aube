export class User {
  constructor(id, username, password, image, orundum, rankingPoints, deck, operators, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.image = image;
    this.orundum = orundum;
    this.rankingPoints = rankingPoints;
    this.deck = deck;
    this.operators = operators;
    this.role = role;
  }
}

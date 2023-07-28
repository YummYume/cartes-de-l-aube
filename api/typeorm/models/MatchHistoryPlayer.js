export class MatchHistoryPlayer {
  /**
   * The match id.
   * @type {number} id
   */
  id;

  /**
   * The deck used by the player.
   * @type {string[]} deck
   */
  deck;

  /**
   * The status of the player (winner or not).
   * @type {'winner'|'loser'|'abandon'} status
   */
  status;

  /**
   * The rankingPoints earned by the player.
   * @type {number} rankingPoints
   */
  rankingPoints;

  /**
   * The user who played the match.
   * @type {import('./User').User} user
   */
  user;

  /**
   * The match history.
   * @type {import('./MatchHistory').MatchHistory} matchHistory
   */
  matchHistory;

  /**
   * Creates an instance of MatchHistoryPlayer.
   * @class
   * @param {typeof MatchHistoryPlayer.prototype.id} id
   * @param {typeof MatchHistoryPlayer.prototype.deck} deck
   * @param {typeof MatchHistoryPlayer.prototype.status} status
   * @param {typeof MatchHistoryPlayer.prototype.rankingPoints} rankingPoints
   * @param {typeof MatchHistoryPlayer.prototype.user} user
   * @param {typeof MatchHistoryPlayer.prototype.matchHistory} matchHistory
   */
  constructor(id, deck, status, rankingPoints, user, matchHistory) {
    this.id = id;
    this.deck = deck;
    this.status = status;
    this.rankingPoints = rankingPoints;
    this.user = user;
    this.matchHistory = matchHistory;
  }
}

export const MatchStatusEnum = {
  WINNER: 'winner',
  LOSER: 'loser',
  ABANDON: 'abandon',
};

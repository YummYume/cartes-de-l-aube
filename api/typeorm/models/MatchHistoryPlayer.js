export class MatchHistoryPlayer {
  /**
   * The match id.
   * @type {number} id
   */
  id;

  /**
   * The operators used by the player.
   * @type {string[]} operators
   */
  operators;

  /**
   * The status of the player (winner or not).
   * @type {'winner'|'loser'|'abandon'} status
   */
  status;

  /**
   * The orundum earned by the player.
   * @type {number} orundum
   */
  orundum;

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
   * @param {typeof MatchHistoryPlayer.prototype.operators} operators
   * @param {typeof MatchHistoryPlayer.prototype.status} status
   * @param {typeof MatchHistoryPlayer.prototype.orundum} orundum
   * @param {typeof MatchHistoryPlayer.prototype.user} user
   * @param {typeof MatchHistoryPlayer.prototype.matchHistory} matchHistory
   */
  constructor(id, operators, status, orundum, user, matchHistory) {
    this.id = id;
    this.operators = operators;
    this.status = status;
    this.orundum = orundum;
    this.user = user;
    this.matchHistory = matchHistory;
  }
}

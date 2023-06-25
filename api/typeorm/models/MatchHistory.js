export class MatchHistory {
  /**
   * The match id.
   * @type {number} id
   */
  id;

  /**
   * When the match started.
   * @type {Date} startedAt
   */
  startedAt;

  /**
   * When the match ended.
   * @type {Date} endedAt
   */
  endedAt;

  /**
   * The two players who played the match.
   * @type {import('./MatchHistoryPlayer').MatchHistoryPlayer[]} players
   */
  players;

  /**
   * Creates an instance of MatchHistory.
   * @class
   * @param {typeof MatchHistory.prototype.id} id
   * @param {typeof MatchHistory.prototype.startedAt} startedAt
   * @param {typeof MatchHistory.prototype.endedAt} endedAt
   * @param {typeof MatchHistory.prototype.players} players
   */
  constructor(id, startedAt, endedAt, players) {
    this.id = id;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.players = players;
  }
}

/**
 * User types
 * @typedef {{ username: string, password: string, passwordConfirm: string, image: string }} SignupPayload
 * @typedef {{ username: string, password: string }} SigninPayload
 * @typedef {{ id: number, username: string, orundum: number, image?: string, role: 'user' | 'admin', rankingPoints: number, deck: string[], operators: string[] }} User
 * @typedef {import('vue').Ref<User>} Auth
 * @typedef {typeof import('@/utils/api').default} api
 * @typedef {{ message: string }} Message
 * Operator types
 * @typedef {{ id: number, name: string, rarity: string, alter?: string, description?: string, class: string, statistics: { hp: number, atk: number, def: number, cost: number }, art: { name: string, link: string }[] }} Operator
 * @typedef {{ operator: Operator, new: boolean, orundum: number }} OperatorPull
 * Match types
 * @typedef {User & { status: 'winner'|'loser'|'abandon', orundum: number, operators: Operator[] }} MatchHistoryPlayer
 * @typedef {{ startedAt: Date, endedAt: Date, players: MatchHistoryPlayer[] }} MatchHistory
 * Deck types
 * @typedef {Operator[]} Deck
 * Store types
 * @typedef {{ orderTypeId: number, price: number, amount: number, pulls: number, savedPercentage: number }} StoreItem
 * @typedef {{ id: number, price: number, amount: number, paidAt: string }} Payment
 */

// Description: This file contains all the jsDoc declarations for the project.

// Fastify
/**
 * @typedef {import('fastify').FastifyInstance & {
 * typeorm: import('typeorm').DataSource,
 * mongoose: import('mongoose').Connection,
 * }} Fastify
 * @typedef {import('fastify').FastifyPluginOptions} FpOptions
 * @typedef {import("fastify").FastifyRequest} RequestFastify
 * @typedef {RequestFastify & { user: ?User }} CustomRequest
 * @typedef {import("fastify").FastifyReply} ReplyFastify
 */

// Websocket
/**
 * @typedef {import('@fastify/websocket').SocketStream} SocketStream
 */

// TypeORM
/**
 * @typedef {import('./typeorm/models/User.js').User} User
 * @typedef {import('./typeorm/models/Payment.js').Payment} Payment
 * @typedef {import('./typeorm/models/MatchHistory.js').MatchHistory} MatchHistory
 * @typedef {import('./typeorm/models/MatchHistoryPlayer.js').MatchHistoryPlayer} MatchHistoryPlayer
 * @typedef {import('typeorm').Repository<User>} TypeOrmUserRepository
 * @typedef {typeof import('./typeorm/repositories/UserRepository.js').default} CustomUserRepository
 * @typedef {TypeOrmUserRepository & CustomUserRepository} UserRepository
 * @typedef {import('typeorm').Repository<Payment>} TypeOrmPaymentRepository
 * @typedef {TypeOrmPaymentRepository} PaymentRepository
 * @typedef {import('typeorm').Repository<MatchHistory>} TypeOrmMatchHistoryRepository
 * @typedef {TypeOrmMatchHistoryRepository} MatchHistoryRepository
 * @typedef {import('typeorm').Repository<MatchHistoryPlayer>} TypeOrmMatchHistoryPlayerRepository
 * @typedef {TypeOrmMatchHistoryPlayerRepository} MatchHistoryPlayerRepository
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

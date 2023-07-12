/**
 * @typedef {import('./typeorm/models/User.js').User} User
 * @typedef {import('fastify').FastifyInstance} Fastify
 * @typedef {import("fastify").FastifyRequest} RequestFastify
 * @typedef {RequestFastify & { user: ?User }} CustomRequest
 * @typedef {import("fastify").FastifyReply} ReplyFastify
 * @typedef {import('typeorm').Repository<User>} TypeOrmUserRepository
 * @typedef {typeof import('./typeorm/repositories/UserRepository.js').default} CustomUserRepository
 * @typedef {TypeOrmUserRepository & CustomUserRepository} UserRepository
 */

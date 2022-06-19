import request from 'supertest'
import { server, updateUser } from '../index'

describe('New user with error', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(true), 500)) // avoid jest open handle error
    })

    it('error create user without hobbies', async () => {
        const user = {
            username: 'John Smith',
            age: 32,
            // hobbies: ['games']
        }

        const res = await requestReady
            .post('/api/users')
            .send(user)

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBe('Field [hobbies] is required')
    })

    it('error create user where hobbies is not a string', async () => {
        const user = {
            username: 'John Smith',
            age: 32,
            hobbies: [33, undefined, null]
        }

        const res = await requestReady
            .post('/api/users')
            .send(user)

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBe('Field [hobbies] must contain string type')
    })

    it('error create user without age', async () => {
        const user = {
            username: 'John Smith',
            // age: 32,
            hobbies: ['games']
        }

        const res = await requestReady
            .post('/api/users')
            .send(user)

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBe('Field [age] is required')
    })

    it('error create user without username', async () => {
        const user = {
            // username: 'John Smith',
            age: 32,
            hobbies: ['games']
        }

        const res = await requestReady
            .post('/api/users')
            .send(user)

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBe('Field [username] is required')
    })
})

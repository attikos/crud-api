import request from 'supertest'
import { server, updateUser } from '../index'

describe('New user is success', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(true), 500)) // avoid jest open handle error
        requestReady
    })

    it('Empty user list', async () => {
        const res = await requestReady
            .get('/api/users')

        expect(res.statusCode).toBe(200)
    })

    it('success create user', async () => {
        const user = {
            username: 'John Smith',
            age: 32,
            hobbies: ['games']
        }

        const res = await requestReady
            .post('/api/users')
            .send(user)

        expect(res.statusCode).toBe(201)
        expect(res.body.error).toBe(undefined)
    })
})

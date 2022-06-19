import request from 'supertest'
import { server, updateUser } from '../index'

describe('User list', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(true), 500)) // avoid jest open handle error
        requestReady
    })

    it('create 3 users and check count of result', async () => {
        const user = {
            username: 'John Smith',
            age: 32,
            hobbies: ['games']
        }

        await requestReady
            .post('/api/users')
            .send(user)

        await requestReady
            .post('/api/users')
            .send(user)

        await requestReady
            .post('/api/users')
            .send(user)

        const res = await requestReady
                .get('/api/users')

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveLength(3)
    })
})

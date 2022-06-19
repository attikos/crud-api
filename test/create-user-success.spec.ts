import request from 'supertest'
import { server, updateUser } from '../index'

describe('New user is success', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    it('Empty user list', async () => {
        const res = await requestReady
            .get('/api/users')

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveLength(0)
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

        const resUserList = await requestReady
            .get('/api/users')

        const {id} = resUserList.body[0];

        const resUser = await requestReady
            .get(`/api/users/${id}`)

        expect(resUser.body).toEqual({ ...user, id })
    })
})

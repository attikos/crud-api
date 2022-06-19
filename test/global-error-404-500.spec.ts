import request from 'supertest'
import { server, updateUser } from '../index'

describe('Global error', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    it('Not existing route, 404', async () => {
        const res = await requestReady
            .get('/qwerty')

        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe('Route not found')
    })

    it('Wrong body params, 500', async () => {
        const res = await requestReady
            .post('/api/users')
            .send('wrong data qwe : e, , [ ( %%$')

        expect(res.statusCode).toBe(500)
        expect(res.body.error).toBe('Wrong params')
    })
})

import request from 'supertest'
import { server, updateUser } from '../index'

describe('Not existing route', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    it('request for 404', async () => {
        const res = await requestReady
            .get('/qwerty')

        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe('Route not found')
    })
})

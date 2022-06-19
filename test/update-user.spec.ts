import request from 'supertest'
import { server, updateUser } from '../index'
import { v4 } from 'uuid'
import { IUser } from '../src/types'

describe('Update user', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    it('success update', async () => {
        const user: IUser = {
            id: v4(),
            username: 'John Smith',
            age: 32,
            hobbies: ['games']
        }

        updateUser({
            [user.id] : user
        })

        const newUser = {
            username: 'Brain',
            age: 28,
            hobbies: ['base jumping']
        }

        const res = await requestReady
            .put(`/api/users/${user.id}`)
            .send(newUser)

        expect(res.statusCode).toBe(200)
        expect(res.body.error).toBe(undefined)

        const resUserList = await requestReady
            .get('/api/users')

        expect(resUserList.body).toHaveLength(1)
        expect(resUserList.body[0]).toEqual({ ...newUser, id: user.id })
    })
})

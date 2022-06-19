import request from 'supertest'
import { server, updateUser } from '../index'
import { v4 } from 'uuid'
import { IUser } from '../src/types'

describe('Delete user', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(true), 500)) // avoid jest open handle error
    })

    it('delete user not found', async () => {
        const user : IUser = {
            id: v4(),
            username: 'John Smith',
            age: 32,
            hobbies: ['games']
        }

        updateUser({
            [user.id] : user
        })

        const res = await requestReady
            .delete(`/api/users/5331e11f-21b5-43d0-b910-6cae71e83d77`)

        expect(res.statusCode).toBe(404)
        expect(res.body.error).toBe('User not exist')
    })

    it('delete user unvalid uuid', async () => {
        const user = {
            id: v4(),
            username: 'John Smith',
            age: 32,
            hobbies: ['games']
        }

        updateUser({
            [user.id] : user
        })

        const res = await requestReady
            .delete(`/api/users/777abc`)

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBe('Invalid uuid. Please input correct uuid')
    })

    it('create user and delete them', async () => {
        const user = {
            id: v4(),
            username: 'John Smith',
            age: 32,
            hobbies: ['games']
        }

        updateUser({
            [user.id] : user
        })

        const res = await requestReady
            .delete(`/api/users/${user.id}`)

        expect(res.statusCode).toBe(204)

        const resUsersAfter = await requestReady
            .get('/api/users')

        expect(resUsersAfter.statusCode).toBe(200)
        expect(resUsersAfter.body).toHaveLength(0)
    })
})

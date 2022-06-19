import request from 'supertest'
import { server, updateUser } from '../index'
import { v4 } from 'uuid'
import { IUser } from '../src/types'

describe('User list', () => {
    let requestReady = request(server)

    beforeEach( () => {
        updateUser({});
    })

    it('create 3 users and check count of result', async () => {
        const createUser = (): IUser => ({
            id: v4(),
            username: 'John Smith',
            age: 32,
            hobbies: ['games']
        })

        const userList = [createUser(), createUser(), createUser()]

        updateUser({
            [userList[0].id] : userList[0],
            [userList[1].id] : userList[1],
            [userList[2].id] : userList[2],
        })

        const res = await requestReady
            .get('/api/users')

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveLength(3)
    })
})

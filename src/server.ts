import http from 'http'
import 'dotenv/config'
import { render, parseBody } from './server-helpers'
import { createOrUpdateUser, parseAndGetUser } from './users-service'
import { IUser, TState } from './types'

// GET /api/users/:userId
// POST /api/users/
// PUT /api/users/:userId
// DELETE /api/users/:userId
// GET /api/users/

export const runServer = (state: TState, updateUser: (users: Record<string, IUser>) => void) => {
    const PORT: number = Number(process.env.PORT || '8000')

    const server = http.createServer( async (req, res) => {
        const url = req.url?.replace(/\/$/, '') || ''
        const method = req.method || ''

        if (method === 'GET' && /^\/api\/users\/.+$/.test(url)) {
            const [user, error] = parseAndGetUser(url, state.users)

            if (error) {
                return render(res, 400, {error})
            }

            if (user) {
                return render(res, 200, user)
            }

            return render(res, 404, { error: 'User not exist' })
        }
        else if (method === 'PUT' && /^\/api\/users\/.+$/.test(url)) {
            const [user, error] = parseAndGetUser(url, state.users)

            if (error) {
                return render(res, 400, {error})
            }

            if (user) {
                let body
                try {
                    body = await parseBody(req)
                } catch (error) {
                    console.log(error)
                    return render(res, 500, {error: 'Wrong params'})
                }

                const error = createOrUpdateUser(body, state.users, updateUser, user.id)

                if (error) {
                    return render(res, 400, {error})
                }

                return render(res, 200, {message: 'User successfully updated'})
            }

            return render(res, 404, { error: 'User not exist' })
        }
        else if (method === 'DELETE' && /^\/api\/users\/.+$/.test(url)) {
            const [user, error] = parseAndGetUser(url, state.users)

            if (error) {
                return render(res, 400, {error})
            }

            if (user) {
                delete state.users[user.id]
                updateUser(state.users)

                return render(res, 204, {message: 'User successfully deleted'})
            }

            return render(res, 404, { error: 'User not exist' })
        }
        // create user
        else if (method === 'POST' && /^\/api\/users$/.test(url)) {
            let body

            try {
                body = await parseBody(req)
            }
            catch(error) {
                console.log(error)
                return render(res, 500, {error: 'Wrong params'})
            }

            const error = createOrUpdateUser(body, state.users, updateUser)

            if (error) {
                return render(res, 400, {error})
            }

            return render(res, 201, {message: 'User successfully created'})
        }
        else if (method === 'GET' && /^\/api\/users$/.test(url)) {
            const userList = Object.values(state.users)

            render(res, 200, userList)
        }
        else {
            render(res, 404, { error: 'Route not found'})
        }
    })

    if (process.env.NODE_ENV !== 'testing') {
        server.listen(PORT, undefined, () => {
            console.log(`Server is listening on port ${PORT}`)
        })
    }

    return server
}

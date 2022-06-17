import http from 'http'
import 'dotenv/config'
import { render, parseBody } from './src/server-helpers'
import { createOrUpdateUser, parseAndGetUser, users } from './src/user-state'

const PORT: number = parseInt(process.env.PORT || '8000')

// GET /api/users/:userId
// POST /api/users/
// PUT /api/users/:userId
// DELETE /api/users/:userId
// GET /api/users/

const server = http.createServer( async (req, res) => {
    const url = req.url?.replace(/\/$/, '') || ''
    const method = req.method || ''

    if (method === 'GET' && /^\/api\/users\/.+$/.test(url)) {
        const [user, error] = parseAndGetUser(url)

        if (error) {
            return render(res, 400, {error})
        }

        if (user) {
            return render(res, 200, user)
        }

        return render(res, 404, { error: 'User not exist' })
    }
    else if (method === 'PUT' && /^\/api\/users\/.+$/.test(url)) {
        const [user, error] = parseAndGetUser(url)

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

            const error = createOrUpdateUser(body, user.id)

            if (error) {
                return render(res, 400, {error})
            }

            return render(res, 200, {message: 'User successfully updated'})
        }

        return render(res, 404, { error: 'User not exist' })
    }
    else if (method === 'DELETE' && /^\/api\/users\/.+$/.test(url)) {
        const [user, error] = parseAndGetUser(url)

        if (error) {
            return render(res, 400, {error})
        }

        if (user) {
            delete users[user.id]

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

        const error = createOrUpdateUser(body)

        if (error) {
            return render(res, 400, {error})
        }

        return render(res, 201, {message: 'User successfully created'})
    }
    else if (method === 'GET' && /^\/api\/users$/.test(url)) {
        const userList = Object.values(users)

        render(res, 200, userList)
    }
    else {
        render(res, 404, { error: 'Route not found'})
    }
})

server.listen(PORT)
console.log(`Server is listening on port ${PORT}`)

import { IUser } from './src/types'
import { runServer } from './src/server'
import { users } from './src/users-db'

const state = {
    users,
}

const updateUser = (users: Record<string, IUser>) => {
    state.users = users
}

runServer(state, updateUser)

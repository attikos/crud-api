import { randomUUID } from 'crypto'
import { IUser, TUserPost } from './types'
import { checkUuid } from './common-helpers'

// export const users: Record<string, IUser> = {}

export class User implements IUser {
    id: string
    username: string
    age: number
    hobbies: string[]

    constructor(username: string, age: number, hobbies: string[]) {
        this.id = randomUUID()
        this.username = username
        this.age = age
        this.hobbies = hobbies
    }
}

export const parseAndGetUser = (url: string, users: Record<string, IUser>) : [IUser|null, string|null] => {
    const urlChunks: string[] = url.split('/')
    const userId: string = urlChunks[urlChunks.length - 1]

    if (!userId || !checkUuid(userId)) {
        return [null, 'Invalid uuid. Please input correct uuid']
    }

    return [users[userId], null]
}

export const createOrUpdateUser = (
    data: TUserPost,
    users: Record<string, IUser>,
    updateUser: (users: Record<string, IUser>) => void,
    id?: string
): string|void => {
    const {
        username,
        age,
        hobbies
    } = data

    if (!username) {
        return 'Field [username] is required'
    }

    if (!age) {
        return 'Field [age] is required'
    }

    if (!hobbies || !Array.isArray(hobbies)) {
        return 'Field [hobbies] is required'
    }

    if (hobbies && hobbies.some(x => typeof x !== 'string')) {
        return 'Field [hobbies] must contain string type'
    }

    if (id) {
        users[id] = {id, username, age, hobbies}

        updateUser(users)

        return;
    }

    const newUser = new User(username, age, hobbies)
    users[newUser.id] = newUser

    updateUser(users)

    return
}

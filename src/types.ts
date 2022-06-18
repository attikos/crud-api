export interface IUser {
    id: string
    username: string
    age: number
    hobbies: string[]
}

export type TUserPost = {
    username: string
    age: number
    hobbies: string[]
}

export type TState = {
    users: Record<string, IUser>
}

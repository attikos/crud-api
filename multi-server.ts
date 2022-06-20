import cluster, { type Worker} from 'cluster'
import os from 'os'
import { IUser } from './src/types'
import { runServer } from './src/server'

const pid = process.pid

if (cluster.isPrimary) {
    const { users } = require('./src/users-db')
    const cpuCount = os.cpus().length

    const state = {
        users,
    }

    console.log(`Primary pid: ${pid}`)
    console.log(`Starting ${cpuCount} forks`)

    const workers: Worker[] = [];

    for (let i = 0; i < cpuCount; i++) {
        const worker = cluster.fork();
        worker.send(JSON.stringify(state.users))

        workers.push(worker)
    }

    workers.forEach(worker => {
        worker.on('message', function(users) {
            state.users = JSON.parse(users)
            workers.forEach(worker => worker.send(users))
        })
    })
} else {
    if (cluster.worker) {
        const id = cluster.worker.id
        console.log(`Worker: ${id}, pid: ${pid}`)

        const state = {
            users : {}
        }

        process.on('message', (users: string) => {
            state.users = JSON.parse(users || '{}')
        })

        const updateUser = (users: Record<string, IUser>) => {
            process.send?.(JSON.stringify(users))
            state.users = users
        }

        runServer(state, updateUser)
    }
}

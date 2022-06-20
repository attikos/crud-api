import http from 'http'

export const render = (res: http.ServerResponse, code: number, body: object = {}) => {
    res.writeHead(code, { 'Content-Type': 'application/json' })

    try {
        res.end(JSON.stringify(body))
    }
    catch (error) {
        console.log(error)
    }
}

export const parseBody = async (req: http.IncomingMessage) => {
    const buffers = []
    let data

    try {
        for await (const chunk of req) {
            if (chunk) {
                buffers.push(chunk)
            }
        }

        data = Buffer.concat(buffers).toString()
    } catch (error) {
        console.log(error)
    }

    return JSON.parse(data || '{}')
}

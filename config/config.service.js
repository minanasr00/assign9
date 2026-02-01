import { resolve } from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV

const envPath = {
    development: `.env.development`,
    production: `.env.production`,
}
console.log({ en: envPath[NODE_ENV] });


config({ path: resolve(`./config/${envPath[NODE_ENV]}`) })


export const port = process.env.PORT ?? 7000

//dataBase
export const DB_uri=process.env.DB_URI

//encryption
export const algorithm = process.env.ALGORITHM
export const securityKey = process.env.SECRET_KEY
export const JWT_SECRET = process.env.JWT_SECRET


export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? '10')
console.log({SALT_ROUND});

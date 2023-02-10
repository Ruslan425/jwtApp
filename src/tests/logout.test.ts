import {MongoMemoryServer} from 'mongodb-memory-server'
import TokenService from "../services/TokenService";
import start from "../app";
import {Express} from "express";
import supertest from 'supertest'
import UserImp, {User} from "../models/User";
import RoleImpl, {Role} from "../models/Role";
import bcrypt from "bcryptjs";
import {UserResponse} from "../models/UserResponse";
import {Types} from "mongoose";

describe('Testing logout function in TokenService', () => {

    let app: Express
    let mongoServer: MongoMemoryServer
    let adminId: Types.ObjectId

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create()
        app = await start(mongoServer.getUri())
        await RoleImpl.create({value: "user"})
        const admin = await RoleImpl.create({
            value: "admin"
        })
        adminId = admin._id
    })

    afterEach(async () => {
        await mongoServer.stop()
    })

    it('error on delete from UserToken model', async () => {
        const result = await TokenService.deleteTokens("error")
        expect(result).toBe('Some Error')
    })

    it('Admin User get all users', async () => {
        const password: string = "pass"
        const username: string = "admin"
        const hashPass = await bcrypt.hash(password, 2)

        const admin: User = {
            username: username,
            password: hashPass,
            roles: [adminId]
        }

        await UserImp.create(admin)

        const tokensResponse = await supertest(app).post('/auth/login')
            .send({
                username: admin.username,
                password: password
            })
        const tokens: UserResponse = tokensResponse.body

        const auth = {
            authorization: tokens.accessToken
        }
        const expectedUsers = {
            users: [{
                username: username
            }]
        }
        const response = await supertest(app)
            .get('/utils/get_list')
            .set(auth)
            .expect(200)

        expect(response.body).toMatchObject(expectedUsers)

    })

    it('Check missing authorization token', async () => {

        const expectedError = {
            message: 'Missing authorization token'
        }
        const response = await supertest(app)
            .get('/utils/get_list')
            .expect(401)

        expect(response.body).toMatchObject(expectedError)
    })

    it('Check user have user role, cant get users list', async () => {

        const newUser = {
            username: 'Test@m.tu',
            password: 'Testtest5'
        }
        const newUserTokens = await supertest(app).post('/auth/reg').send(newUser)
        const auth = {
            authorization: newUserTokens.body.accessToken
        }
        const expectedError = {
            message: '"Forbidden". The client does not have permission.'
        }
        const response = await supertest(app)
            .get('/utils/get_list')
            .set(auth)
            .expect(403)

        expect(response.body).toMatchObject(expectedError)
    })

    it('Check that the accessToken is destroyed after a certain period of time', async () => {

        const accessTokenLive = process.env.ACCESS_TOKEN_LIVE

        process.env.ACCESS_TOKEN_LIVE = "1"

        const password: string = "Testtest5"
        const username: string = "admin@df.re"

        const hashPass = await bcrypt.hash(password, 2)

        const newUser = {
            username: username,
            password: hashPass,
            roles: [adminId]
        }

        await UserImp.create(newUser)

        const userTokens = await supertest(app)
            .post('/auth/login')
            .send({
                username,
                password
            })

        const auth = {
            authorization: userTokens.body.accessToken
        }

        await supertest(app)
            .get('/utils/get_list')
            .set(auth)
            .expect(401)

        process.env.ACCESS_TOKEN_LIVE = accessTokenLive
    })

    it('Checking refresh accessToken function is work', async () => {
        const accessTokenLive = process.env.ACCESS_TOKEN_LIVE

        const username = 'Test1@k.r'
        const password = 'Testtest2'
        const hashPassword = await bcrypt.hash(password, 2)

        await UserImp.create({
            username: username,
            password: hashPassword,
            roles: [adminId]
        })

        const user = {
            username,
            password
        }

        process.env.ACCESS_TOKEN_LIVE = '1'

        const userTokens = await supertest(app)
            .post('/auth/login')
            .send(user)
            .expect(200)

        const auth = {
            authorization: userTokens.body.accessToken
        }

        await supertest(app)
            .get('/utils/get_list')
            .send(auth)
            .expect(401)

        const refreshToken = {
            userId: userTokens.body.userId,
            refreshToken: userTokens.body.refreshToken
        }

        const expectedObject: UserResponse = {
            userId: expect.any(String),
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        }

        const response = await supertest(app)
            .post('/auth/refresh')
            .send(refreshToken)
            .expect(200)

        expect(response.body).toMatchObject(expectedObject)

        process.env.ACCESS_TOKEN_LIVE = accessTokenLive
    })

    it('Checking logout fun, delete user tokens from db', async () =>{


        await supertest(app)
            .get('/auth/logout')
            .set(auth)
            .expect(200)


        expect(expectedObject).toBeUndefined()

    })

})






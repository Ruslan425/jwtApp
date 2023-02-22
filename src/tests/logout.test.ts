import {MongoMemoryServer} from 'mongodb-memory-server'
import TokenService from "../services/TokenService";
import start from "../app";
import {Express} from "express";
import supertest from 'supertest'
import UserImp, {User} from "../models/User";
import RoleImpl from "../models/Role";
import bcrypt from "bcryptjs";
import {UserResponse} from "../models/UserResponse";
import {Types} from "mongoose";
import UserTokenImp from "../models/UserToken";


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

    it('Checking logout fun, delete user tokens from db', async () => {

        const newUser = {
            username: 'Aew@ew.re',
            password: 'Testtes5'
        }

        const userTokens = await supertest(app)
            .post('/auth/reg')
            .send(newUser)
            .expect(200)

        const accessToken = userTokens.body.accessToken

        const auth = {
            authorization: accessToken
        }

        await supertest(app)
            .get('/auth/logout')
            .set(auth)
            .expect(200)

        const expectedObject = await UserTokenImp.findOne({accessToken})

        expect(expectedObject).toBeNull()

    })

})






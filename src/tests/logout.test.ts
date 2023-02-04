import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from "mongodb";
import TokenService from "../services/TokenService";
import start from "../app";
import {Express} from "express";
import supertest from 'supertest'
import UserImp, {User} from "../models/User";
import RoleImpl, {Role} from "../models/Role";
import bcrypt from "bcryptjs";
import {UserResponse} from "../models/UserResponse";

describe('Testing logout function in TokenService' ,() => {

    let app: Express
    let mongoServer: MongoMemoryServer

    beforeAll(async ()=> {
        mongoServer = await MongoMemoryServer.create()
        app = await start(mongoServer.getUri())
    })

    afterAll( async () => {
        await mongoServer.stop()
    })

    it('delete tokens from UserToken model', async () => {
        const generateToken = TokenService.generateTokens({ 'test': 'test' })
        const saveToken = await TokenService.saveTokens(new ObjectId("111111111111"), generateToken.refreshToken, generateToken.accessToken)
        const result = await TokenService.deleteTokens(saveToken?.refreshToken)
        expect(result).toBe('logout')
    })

    it('error on delete from UserToken model', async () => {
       const result = await TokenService.deleteTokens("error") 
       expect(result).toBe('Some Error')
    })

    it('Admin User get all users', async ()=> {

        const adminRole = await RoleImpl.create({
            value: "admin"
        })

        const password: string = "pass"
        const username: string = "admin"
        const hashPass = await bcrypt.hash(password, 2)

        const admin: User = {
            username: username,
            password: hashPass,
            roles: [ adminRole._id ]
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
            users: [ {
                username: username
            }]
        }

        const response = await supertest(app)
            .get('/auth/ref')
            .set(auth)
            .expect(200)

        console.log(response.error)
        console.log(response.statusCode)


        expect(response.body).toMatchObject(expectedUsers)

    })

})






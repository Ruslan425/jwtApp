import {Express} from "express";
import {MongoMemoryServer} from "mongodb-memory-server";
import {Types} from "mongoose";
import start from "../app";
import RoleImpl from "../models/Role";
import {accessTokenLive} from "../Config";
import bcrypt from "bcryptjs";
import UserImp from "../models/User";
import supertest from "supertest";
import {UserResponse} from "../models/UserResponse";

jest.mock("../Config")

describe('Testing Tokens logic work', () => {

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

    it('Check that the accessToken is destroyed after a certain period of time', async () => {

       // jest.mocked(accessTokenLive).mockImplementation(() => '1');
        jest.mocked(accessTokenLive).mockReturnValue('1')

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

    })

    it('Checking refresh accessToken function is work', async () => {

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

        jest.mocked(accessTokenLive).mockReturnValue('1');

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

    })



})
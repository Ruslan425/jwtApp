import bcrypt from "bcryptjs";
import supertest from "supertest";
import UserImp from "../models/User";
import {Express} from "express";
import {MongoMemoryServer} from "mongodb-memory-server";
import start from "../app";
import RoleImpl from "../models/Role";

jest.mock("bcryptjs")

describe('Checking password security save', () => {

    let app: Express
    let mongoServer: MongoMemoryServer

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create()
        app = await start(mongoServer.getUri())
        await RoleImpl.create({value: "user"})
    })

    afterEach(async () => {
        await mongoServer.stop()
    })

    it('Checking hash password add to db', async () => {

        const user = {
            username: "Test@er.re",
            password: "Testtset32"
        }

        const mockHash = 'test'

        jest.mocked(bcrypt.hash).mockImplementation(() => mockHash)

        const response = await supertest(app)
            .post('/auth/reg')
            .send(user)
            .expect(200)

        console.log(response.body)

        const userOnDb = await UserImp.findById(response.body.userId)

        expect(userOnDb!.password).toEqual(mockHash)

    })
})




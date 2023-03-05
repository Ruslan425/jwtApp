import {MongoMemoryServer} from "mongodb-memory-server";
import start from "../app";
import RoleImpl, {Role} from "../models/Role";
import UserImp, {User} from "../models/User";
import bcrypt from "bcryptjs";
import supertest from "supertest";
import {Express} from "express";

describe('Admin options', () => {

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

    it('Admin can change user roles', async () => {

        const adminRole = await RoleImpl.create({value: "admin"})

        const adminUsername = 'admin@a.a'
        const adminPassword = 'Aqwertyo2'
        const hashAdminPass = await bcrypt.hash(adminPassword, 2)

        const usualUsername = 'Test@er.ru'
        const usualPassword = 'UserUser2'

        const adminUser: User = {
            username: adminUsername,
            password: hashAdminPass,
            roles: [adminRole._id]
        }
        await UserImp.create(adminUser)

        const response = await supertest(app)
            .post('/auth/reg')
            .send({
                username: usualUsername,
                password: usualPassword
            })
            .expect(200)

        const loginAdmin = await supertest(app)
            .post('/auth/login')
            .send({
                username: adminUsername,
                password: adminPassword
            })
            .expect(200)

        const auth = {
            authorization: loginAdmin.body.accessToken
        }

        await supertest(app)
            .post('/utils/changeRole')
            .set(auth)
            .send({
                id: response.body.userId,
                role: 'admin'
            })
            .expect(200)

        const usualUser = await UserImp.findById(response.body.userId)
        const expectRole = await RoleImpl.findById(usualUser!.roles[0])

        expect(expectRole!.value).toEqual(adminRole.value)
    })

})
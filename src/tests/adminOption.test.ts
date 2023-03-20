import {MongoMemoryServer} from "mongodb-memory-server";
import start from "../app";
import RoleImpl, {Role} from "../models/Role";
import UserImp, {User} from "../models/User";
import bcrypt from "bcryptjs";
import supertest from "supertest";
import {Express} from "express";
import {Document, Types} from "mongoose";

describe('Admin options', () => {

    let app: Express
    let mongoServer: MongoMemoryServer
    let adminRole: Document<unknown, any, Role> & Role & { _id: Types.ObjectId }
    let userRole: Document<unknown, any, Role> & Role & { _id: Types.ObjectId }

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create()
        app = await start(mongoServer.getUri())
        adminRole = await RoleImpl.create({value: "admin"})
        userRole = await RoleImpl.create({value: "user"})

    })

    afterEach(async () => {
        await mongoServer.stop()
    })

    it('Admin can change user roles', async () => {

        const adminUsername = 'admin@a.a'
        const adminPassword = 'Aqwertyo2'
        const hashAdminPass = await bcrypt.hash(adminPassword, 2)

        const usualUsername = 'Test@er.ru'
        const usualPassword = 'UserUser2'

        const admin: User = {
            username: adminUsername,
            password: hashAdminPass,
            roles: [adminRole._id]
        }
        const user: User = {
            username: usualUsername,
            password: usualPassword,
            roles: [userRole._id]
        }
        await UserImp.create(admin)
        const userId = await UserImp.create(user)

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
            .post('/utils/change_role')
            .set(auth)
            .send({
                id: userId._id,
                role: 'admin'
            })
            .expect(200)

        const usualUser = await UserImp.findById(userId._id)
        const expectRole = await RoleImpl.findById(usualUser!.roles[0])

        expect(expectRole!.value).toEqual(adminRole.value)
    })

    it('Admin can delete user', async () => {

        const username = "user@ma.ru"
        const pass = "Testtest3"
        const password = await bcrypt.hash(pass, 2)
        const user: User = {
            username,
            password,
            roles: [userRole._id]
        }
        await UserImp.create(user)

        const adminUser = "admin@admin.ru"
        const adminPass = "AdminAdmin12"
        const adminHashPass = await bcrypt.hash(adminPass, 2)
        const admin: User = {
            username: adminUser,
            password: adminHashPass,
            roles: [adminRole._id]
        }
        await UserImp.create(admin)

        const accessToken = await supertest(app)
            .post('/auth/login')
            .send({
                username: adminUser,
                password: adminPass
            })
            .expect(200)

        await supertest(app)
            .post('/utils/delete_user')
            .set({authorization: accessToken.body.accessToken})
            .send({user: username})
            .expect(200)

        expect(await UserImp.findOne({username})).toBeNull()

    })
})



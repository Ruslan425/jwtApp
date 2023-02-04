import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose';
import dotnet from 'dotenv';
import { ObjectId } from "mongodb";
import TokenService from "../services/TokenService";


describe('Testing logout function in TokenService' ,() => {
    beforeAll(async ()=> {
        dotnet.config(); 
        const mongoMemory = await MongoMemoryServer.create()
        await mongoose.connect( mongoMemory.getUri())
    })

    afterAll( async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
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

})



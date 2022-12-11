export default class UserResponse {
    userId: string
    token: string
    
    constructor(userId: string, token: string) {
        this.token = token
        this.userId = userId
    }
}

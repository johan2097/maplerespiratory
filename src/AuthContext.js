import React from 'react'
import Axios from 'axios';

const AuthContext = React.createContext({
    isAuth: false
})

class AuthProvider extends React.Component {
    state = { isAuth: false }

    constructor() {
        super()
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
    }

    async isLoggedIn() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            if (!user || !user.documento) {
                return false
            }
            // console.log(user.documento)
            const res = await Axios.get(`/user/${user.documento}`)
            if (res.status !== 200) {
                console.log("user doesn't exists.")
                localStorage.clear()
                Axios.defaults.headers.common['Authorization'] = ""
                return false
            } else {
                localStorage.setItem("userInfo", JSON.stringify(res.data))
                return true
            }
        } catch (err) {
            localStorage.clear()
            Axios.defaults.headers.common['Authorization'] = ""
            return false
        }
    }

    async componentDidMount() {
        this.setState({ isAuth: await this.isLoggedIn() })
    }

    async login(username, password) {
        try {
            const res = await Axios.post('/user/login', {
                username,
                password
            })
            // console.log(res)

            if (res.status !== 200) {
                return false
            }

            const token = res.data.token

            if (!token) {
                console.log(`[Token error]: Not found`)
                return false
            }

            await this.loginWithToken(token)
            this.setState({ isAuth: true })
            return true
        } catch (err) {
            console.log(`[Login error]: ${err}`)
            this.setState({ isAuth: false })
            return false
        }
    }

    async loginWithToken(token) {
        const authToken = `Bearer ${token}`
        const dat = JSON.parse(atob(token.split(".")[1]))
        // console.log(dat)
        if (!dat.documento)
            return
        const user = { documento: dat.documento }
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('authToken', authToken)

        Axios.defaults.headers.common['Authorization'] = authToken
        const res = await Axios.get(`/user/${user.documento}`)
        if (res.status === 200) {
            localStorage.setItem("userInfo", JSON.stringify(res.data))
        }
    }
    logout() {
        localStorage.clear()
        Axios.defaults.headers.common['Authorization'] = ""
        this.setState({ isAuth: false })
        return true
    }

    render() {
        return (
            <AuthContext.Provider
                value={{
                    isAuth: this.state.isAuth,
                    login: this.login,
                    logout: this.logout,
                    loginWithToken: this.loginWithToken,
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }

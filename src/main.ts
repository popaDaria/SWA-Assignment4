import {createApp} from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import {createRouter, createWebHistory} from 'vue-router'
import UserScores from './components/UserScores.vue';
import LoginUser from './components/LoginUser.vue';
import RegisterUser from './components/RegisterUser.vue';
import UserProfile from './components/UserProfile.vue';
import GameBoard from './components/GameBoard.vue';
import {model} from '@/api/store'

const routes = [
    {path: '/', component: LoginUser, name: 'login'},
    {path: '/login', component: LoginUser, name: 'login'},
    {path: '/register', component: RegisterUser, name: 'register'},
    {path: '/profile', component: UserProfile, name: 'profile'},
    {path: '/game', component: GameBoard, name: 'game'},
    {path: '/scores', component: UserScores, name: 'scores'},
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to) => {
    if (
        // make sure the user is authenticated
        model.user.token === undefined &&
        // ❗️ Avoid an infinite redirect
        to.name !== 'login' && to.name !== 'register'
    ) {

        return {name: 'login'}

    }
})

createApp(App).use(router).mount('#app')

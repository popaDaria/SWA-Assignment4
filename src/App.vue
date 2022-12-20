<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import UserScores from './components/UserScores.vue';
import LoginUser from './components/LoginUser.vue';
import RegisterUser from './components/RegisterUser.vue';
import UserProfile from './components/UserProfile.vue';
import GameBoard from './components/GameBoard.vue';
import * as api from "@/api/api";
import {model} from "@/api/store";

@Options({
  components: {
    UserScores,
    LoginUser,
    RegisterUser,
    UserProfile,
    GameBoard
  },
})
export default class App extends Vue {
  logOut() {
    if(model.user.token !== undefined) {
      api.logoutUser(model.user.token).then((result) => {
        model.logout();
      });
    }
  }
}
</script>

<template>
  <div id="nav">
    <router-link to="/game">Game</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to="/scores">Score</router-link> |
    <router-link to="/login" @click="logOut()">Logout</router-link>
  </div>
  <router-view/>
</template>
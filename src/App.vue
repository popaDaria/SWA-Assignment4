<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import UserScores from './components/UserScores.vue';
import LoginUser from './components/LoginUser.vue';
import RegisterUser from './components/RegisterUser.vue';
import UserProfile from './components/UserProfile.vue';
import GameBoard from './components/GameBoard.vue';
import * as api from "@/api/api";
import { model } from "@/api/store";

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
  isLogedIn() {
    if (model.user.token && model.user.token !== '')
      return true;
    return false;
  }
  logOut() {
    if (model.user.token !== undefined) {
      api.logoutUser(model.user.token).then(() => {
        model.logout();
      });
    }
  }
}
</script>

<template>
  <div id="nav">
    <div v-if="isLogedIn()" class="btn-group btn-group-justified" style="width: 100%">
      <router-link class="btn btn-info m-2" to="/game">Game</router-link>
      <router-link class="btn btn-info m-2" to="/profile">Profile</router-link>
      <router-link class="btn btn-info m-2" to="/scores">High Scores</router-link>
      <router-link class="btn btn-info m-2" to="/login" @click="logOut()">Logout</router-link>
    </div>
    <div v-else class="btn-group" style="width: 100%">
      <router-link class="btn btn-info m-2" to="/login">Login</router-link>
    </div>
  </div>
  <router-view />
</template>
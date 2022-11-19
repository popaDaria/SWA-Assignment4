<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import UserScores from './components/UserScores.vue';
import LoginUser from './components/LoginUser.vue';
import RegisterUser from './components/RegisterUser.vue';
import UserProfile from './components/UserProfile.vue';
import GameBoard from './components/GameBoard.vue';

@Options({
  components: {
    UserScores,
    LoginUser,
    RegisterUser,
    UserProfile,
    GameBoard
  },
})
export default class App extends Vue { }
</script>

<template>
  <UserScores />
  <LoginUser />
  <RegisterUser />
  <UserProfile />
  <GameBoard />
</template>
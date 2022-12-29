<script lang="ts">
import * as api from '@/api/api'
import { model } from '@/api/store'

export default {
  data() {
    return { model }
  },
  mounted() {
    if (model.user.token !== undefined) {
      api.getAllGames(model.user.token!).then((result) => {
        model.games = result!
      })
    }
  }
}
</script>

<template>
  <div class='mt-5'>
    <div class='mt-5'>
      <h2>Top 10 Scores:</h2>
      <div class='d-flex flex-row flex-wrap'>
        <div
          v-for="game in model.games.filter((game) => game.completed).sort((a, b) => b.score - a.score).splice(0, 10)"
          class='alert alert-info m-auto mb-2' v-bind:key="game.id">
          <span v-if="game.user === model.user.userId"> YOU </span>
          <span v-else>Player {{ game.user }} </span>
          - {{ game.score }} points
        </div>
      </div>
    </div>
    <div>
      <h2 class='mt-3'>Your Top 3 Scores:</h2>
      <div
        v-for="game in model.games.filter((game) => game.completed && game.user === model.user.userId).sort((a, b) => b.score - a.score).splice(0, 3)"
        class='alert alert-info' v-bind:key="game.id">
        Game {{ game.id }} - Score: {{ game.score }}
      </div>
    </div>
  </div>
</template>
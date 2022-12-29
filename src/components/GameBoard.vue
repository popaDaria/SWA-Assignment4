<script lang="ts">
import * as api from '@/api/api'
import { model } from '@/api/store'
import GameBoardElement from '@/components/GameBoardElement.vue'
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      model,
      playStarted: false,
    }
  },
  methods: {
    backToMain() {
      this.playStarted = false;
    },
    continueGame(id: number) {
      this.playStarted = false;
      model.emptyGameData();
      let hasBoard = true;
      api.getGameById(model.user.token!, id)
        .then((result) => {
          model.setGameData(result), result.board ? hasBoard = true : hasBoard = false
        })
        .then(() => {
          if (!hasBoard) {
            model.initializeNewBoard();
            api.updateGame(model.user.token!, model.game.id, model.game);
          }
        })
        .then(() => this.playStarted = true);
    },
    startAnotherGame() {
      this.playStarted = false;
      model.emptyGameData();
      model.initializeNewBoard();
      api.startNewGame(this.model.user.token!)
        .then((result) => {
          api.updateGame(model.user.token!, result.id, {
            ...this.model.game, id: result.id, user: model.user.userId!
          }),
            model.setGameData({ ...model.game, id: result.id })
        })
        .then(() => this.playStarted = true);
    }
  },
  mounted() {
    const findGames = async () => {
      if (model.user.token !== undefined) {
        api.getAllGames(model.user.token!).then((result) => {
          model.games = result!
        })
      }
      setTimeout(findGames, 5000)
    }

    findGames()
  },
  components: {
    GameBoardElement
  },
})
</script>

<template>
  <div>
    <div v-if="playStarted" class="board-parent">
      <div>
        <button class='btn btn-warning' v-if="!model.play.calculatingMove" @click="backToMain()">Back to main
          page
        </button>
      </div>
      <div class='play-info' v-if="!model.game.completed">
        <div class='play-target-score'>
          TARGET SCORE: {{ model.game.targetScore }}
        </div>
        <div class='play-score'>
          YOUR SCORE: {{ model.game.score }}
        </div>
        <div class='play-moves'>
          MOVES LEFT: {{ model.game.nrOfMoves }}
        </div>
      </div>
      <div class='play-end' v-else>
        <div v-if="model.game.score >= model.game.targetScore" class="text-success">Congrats! You won with a score of {{
            model.game.score
        }} and {{ model.game.nrOfMoves }} moves left.
        </div>
        <div v-else class="text-danger">You were {{ (model.game.targetScore - model.game.score) }} points away! Try
          again?</div>
      </div>
      <div class='row' v-for="(row, index) in model.game.board?.content" v-bind:key="'Row' + index">
        <div class='element' v-for="(element, colIndex) in row" v-bind:key="'Tile' + index + ',' + colIndex">
          <GameBoardElement :rowIndex='index' :colIndex='colIndex' :element='element' />
        </div>
      </div>
      <div class='play-message text-danger'>
        {{ model.play.message }}
      </div>
    </div>
    <div v-else-if="model.games" class="board-parent">
      <h2 v-if="model.games.filter((game) => !game.completed && game.user === model.user.userId).length > 0">Continue
        your
        games:</h2>
      <div class='container'>
        <div class='row'>
          <button class='btn btn-light btn-block col-4'
            v-for="game in model.games.filter((game) => !game.completed && game.user === model.user.userId)"
            v-bind:key="game.id" @click="continueGame(game.id)">Game {{ game.id }}
          </button>
        </div>
      </div>
      <div>
        <h2 class='mt-3'>Start a new game:</h2>
        <button class='btn btn-info btn-wide' @click="startAnotherGame()">New Game</button>
      </div>
    </div>
  </div>
</template>

<style>
.board-parent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.element {
  width: 50px !important;
  padding: 0 !important;
  margin-top: 0 !important;
}

.row {
  margin-left: 5px !important;
}

.btn-wide {
  width: 100%;
}
</style>
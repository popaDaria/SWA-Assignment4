<script lang="ts">
import * as BoardModel from '@/api/model'
import * as api from '@/api/api'
import { model } from '@/api/store'
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        rowIndex: {
            type: Number,
            required: true
        },
        colIndex: {
            type: Number,
            required: true
        },
        element: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            model,
            selected: false,
            generator: new BoardModel.RandomGenerator('A,B,C,D'),
        }
    },
    methods: {
        timeout(delay: number) {
            return new Promise(res => setTimeout(res, delay));
        },
        async selectedElement() {
            if (!model.play.calculatingMove && !model.game.completed) {
                this.selected = true;
                if (model.play.selectedPiece) {
                    model.setCalculatingMove(true) // block user for making other moves until we resolve this
                    const moveResults = BoardModel.move(this.generator, { ...model.game.board }, model.play.selectedPiece, { row: this.rowIndex, col: this.colIndex })
                    if (moveResults.effects.length > 0) {
                        model.decreaseMoves() //made a valid move, decrease nr of moves left this game
                        const newBoard: BoardModel.Board<string> = JSON.parse(JSON.stringify(model.game.board)) as typeof model.game.board;
                        newBoard.content[model.play.selectedPiece.row][model.play.selectedPiece.col] = BoardModel.piece(newBoard, { row: this.rowIndex, col: this.colIndex })!;
                        newBoard.content[this.rowIndex][this.colIndex] = BoardModel.piece(model.game.board, model.play.selectedPiece)!;
                        model.setBoard(newBoard);
                        model.setSelectedPiece(undefined)
                        this.selected = false;
                        for (let effect of moveResults.effects) {
                            if (effect.kind === 'Match') {
                                if (effect.match?.positions.length) {
                                    model.increaseScore((effect.match?.positions.length - 2) * 5) // 5 points for a 3 match, +5 points for each additional piece in a match (i.e. a 5 piece match is 15 points)
                                }
                                model.setMatches(effect.match?.positions ? effect.match?.positions : [])
                            } else {
                                model.setMessage("Making refill")
                                await this.timeout(1000)
                                model.setBoard(effect.board!)
                                model.setMessage('')
                                model.clearMatches()
                            }
                        }
                        await this.timeout(1000)
                    } else {
                        model.setMessage("CAN'T MAKE MOVE");
                        setTimeout(() => {
                            model.setMessage('')
                        }, 1000);
                    }
                    model.setSelectedPiece(undefined);
                    this.selected = false;
                    model.setCalculatingMove(false); //user can make moves again

                    if (!model.play.calculatingMove) {
                        if (model.game.score >= model.game.targetScore || (model.game.nrOfMoves === 0 && model.game.score < model.game.targetScore)) {
                            model.endGame();
                            api.updateGame(model.user.token!, model.game.id, { ...model.game, completed: true })
                        } else {
                            api.updateGame(model.user.token!, model.game.id, model.game)
                        }
                    }
                } else {
                    model.setSelectedPiece({ row: this.rowIndex, col: this.colIndex })
                    this.selected = false;
                }
            }
        }
    }
})
</script>

<template>
    <button class="row-element" :class="{
        'row-element--selected': (selected
            || (model.play.selectedPiece?.row === rowIndex && model.play.selectedPiece.col === colIndex)
            || (model.play.matches.some((pos) => pos.row === rowIndex && pos.col === colIndex)))
    }"
        @click="selectedElement()">
        {{ element }}
    </button>
</template>

<style>
.row-element {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;

    background-color: aliceblue;
    padding: 10px;
    margin: 5px;
}

.row-element--selected {
    background-color: aqua;
}
</style>
import { reactive } from 'vue'
import type { GameData, PlayData, UserData, Board, Position } from '@/api/model'
import * as BoardModel from '@/api/model'

export type Model = {
    games: GameData[],
    readonly game: Readonly<GameData>,
    readonly play: Readonly<PlayData>,
    readonly user: Readonly<UserData>,

    setGameData(game: GameData): void,
    initializeNewBoard(): void,
    setBoard(board: Board<string>): void,
    increaseScore(score: number): void,
    decreaseMoves(): void,
    endGame(): void,
    emptyGameData(): void,

    setSelectedPiece(position: Position | undefined): void,
    setMessage(message: string): void,
    setMatches(positions: Position[]): void,
    clearMatches(): void,
    setCalculatingMove(calculatingMove: boolean): void,

    login(user: UserData): void,
    logout(): void
}

const generator: BoardModel.RandomGenerator = new BoardModel.RandomGenerator('A,B,C,D');
const initBoard = BoardModel.create(generator, 5, 5);
BoardModel.handleMatches(BoardModel.getMatches(initBoard), initBoard, generator, [])

export const model: Model = reactive({
    games: [] as GameData[],
    game: {
        user: 0,
        id: 0,
        board: initBoard,
        score: 0,
        nrOfMoves: 15,
        targetScore: 200,
        completed: false
    } as GameData,
    play: {
        selectedPiece: undefined,
        message: '',
        matches: [],
        calculatingMove: false,
    } as PlayData,
    user: {
        username: '',
        password: '',
        token: undefined,
        userId: 0,
        admin: false
    } as UserData,

    setGameData(game: GameData) {
        this.game = { ...game }
        if (!game.nrOfMoves) {
            this.game.nrOfMoves = 15;
        }
        if (!game.targetScore) {
            this.game.targetScore = 200;
        }
    },
    initializeNewBoard() {
        const initBoard = BoardModel.create(generator, 5, 5);
        BoardModel.handleMatches(BoardModel.getMatches(initBoard), initBoard, generator, [])
        this.game = { ...this.game, board: initBoard };
    },
    setBoard(board: Board<string>) {
        this.game.board = { ...board };
    },
    increaseScore(score: number) {
        this.game.score += score;
    },
    decreaseMoves() {
        --this.game.nrOfMoves;
    },
    endGame() {
        this.game.completed = true;
    },
    emptyGameData() {
        this.game = {
            user: 0,
            id: 0,
            board: initBoard,
            score: 0,
            nrOfMoves: 15,
            targetScore: 200,
            completed: false
        }
    },

    setSelectedPiece(position: Position | undefined) {
        this.play.selectedPiece = position ? { row: position.row, col: position.col } : undefined;
    },
    setMessage(message: string) {
        this.play.message = message;
    },
    setMatches(positions: Position[]) {
        this.play.matches.push(...positions)
    },
    clearMatches() {
        this.play.matches = []
    },
    setCalculatingMove(calculatingMove: boolean) {
        this.play.calculatingMove = calculatingMove
    },

    login(user: UserData) {
        this.user = { ...user }
    },
    logout() {
        this.user = {
            username: '',
            password: '',
            token: undefined,
            userId: 0,
            admin: false
        }
    }
})

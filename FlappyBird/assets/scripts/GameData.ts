const BEST_SCORE_KEY = 'bestScore';

export class GameData {
    private static score = 0;

    static getScore() {
        return this.score;
    }

    static addToScore(points: number) {
        this.score += points;
    }

    static getBestScore() {
        return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
    }

    static saveScore() {
        const bestScore = Math.max(this.score, this.getBestScore());
        localStorage.setItem(BEST_SCORE_KEY, bestScore.toString());
    }

    static resetScore() {
        this.score = 0;
    }

    static clear() {
        localStorage.removeItem(BEST_SCORE_KEY);
    }
}

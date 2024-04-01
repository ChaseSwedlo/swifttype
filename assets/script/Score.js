'use strict';

class Score {
    #date;
    #hits;
    #percentage;
    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    get() { return this.#date; }
    get() { return this.#hits; }
    get() { return this.#percentage }
}

export default Score;
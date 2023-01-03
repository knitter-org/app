export interface Doc {
    _id: string,
    type: 'feed' | 'entry',
}

export interface FeedDoc extends Doc {
    type: 'feed',
    title: string,
    url: string,
    fetch: {
        lastSuccessfulAt: Date,
    }
}

export interface EntryDoc extends Doc {
    type: 'entry',
    title: string,
    text: string,
    url: string,
    publishedAt: Date,
}

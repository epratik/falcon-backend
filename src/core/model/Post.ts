export type Post = {
    postId: number,
    listId: number,
    tag: string,
    subTag: string | undefined,
    url: string,
    urlDescription: string,
    likes: number
}
export type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

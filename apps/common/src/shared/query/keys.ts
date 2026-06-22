export const queryKeys = {
  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
    detail: (id: string) => [...queryKeys.user.all, id] as const,
  },
  post: {
    all: ['post'] as const,
    list: (params?: { page?: number }) => [...queryKeys.post.all, 'list', params] as const,
  },
}

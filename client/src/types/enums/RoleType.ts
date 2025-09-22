export const RoleType = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export type RoleType = typeof RoleType[keyof typeof RoleType];
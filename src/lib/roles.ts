export const roles = ["admin", "teacher", "student"] as const;

export type Role = (typeof roles)[number];

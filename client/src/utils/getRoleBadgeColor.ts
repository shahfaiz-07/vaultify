import { RoleType } from "../types";

export const getRoleBadgeColor = (role: RoleType) => {
    return role === RoleType.ADMIN ? 'badge-primary' : 'badge-secondary'
};
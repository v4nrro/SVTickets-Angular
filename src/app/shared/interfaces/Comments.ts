import { User } from "../../auth/interfaces/user";

export interface MyComment{
    id: number,
    comment: string,
    date: string,
    user: User
}
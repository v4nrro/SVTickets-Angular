import { User } from "../../auth/interfaces/user";
import { MyEvent } from "../../events/interfaces/MyEvent";
import { MyComment } from "./Comments";

export interface EventsResponse {
    events: MyEvent[];
    more: boolean;
    page: number;
    count: number;
}

export interface SingleEventResponse {
    event: MyEvent;
}

export interface TokenResponse {
    accessToken: string;
}

export interface SingleUserResponse {
    user: User;
}

export interface AvatarResponse {
    avatar: string;
}

export interface UsersResponse {
    users: User[];
}

export interface CommentsResponse {
    comments: MyComment[];
}

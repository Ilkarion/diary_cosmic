import {create} from "zustand"

type UserInfoStore = {
    update: boolean,
    user: {
        username: string,
        email: string,
        created_at: string
    }
}

export const useUserInfoStore = create<UserInfoStore>(()=>({
    update: true,
    user: {
        username: "",
        email: "",
        created_at: ""
    }
}))
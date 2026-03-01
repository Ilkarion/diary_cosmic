import { useUserInfoStore } from "./userInfoStore"


export const getUserInfo = () => {
    return useUserInfoStore.getState().user
}


export const getUpdateUserStatus = () => {
    return useUserInfoStore.getState().update
}

export const setUserInfo = (username:string, email:string, created_at:string) => {
    useUserInfoStore.setState(()=>({
        user: {
            username: username,
            email: email,
            created_at: created_at
        }
    }))
}

export const setUpdateUser = (status:boolean)=> {
    useUserInfoStore.setState(()=>({
        update: status
    }))
}


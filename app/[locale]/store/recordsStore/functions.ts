import { fetchDiary } from "../../allFunctions/newEntry/functions"
import { AllTags_Records } from "../../allTypes/typesTS"
import { addTextErrors } from "../errorsStore/functions"
import { useRecordsStore } from "./recordsStore"


export const setRecords_TagsStore = (allRecords_Tags:AllTags_Records) => {
    useRecordsStore.setState(()=>({
        allTagsRecords: {
            diaryAllTags: allRecords_Tags.diaryAllTags,
            diaryRecords: allRecords_Tags.diaryRecords            
        }

    }))
}




export const getRecords_TagsFrontEnd = () => {
    return useRecordsStore.getState().allTagsRecords
}

export const getUpdateStatus = () => {
    return useRecordsStore.getState().update
}

export const setUpdateTrue = () => {
    useRecordsStore.setState(() => ({
        update: true
    }))
}

export const setUpdateFalse = () => {
    useRecordsStore.setState(() => ({
        update: false
    }))
}

export const setfetchedOnceTrue = () => {
    useRecordsStore.setState(()=>({
        fetchedOnce: true
    }))
}

export const getFetchedOnceStatus = () => {
    return useRecordsStore.getState().fetchedOnce
}

export const getRecords_TagsBackEnd = async () => {
    const dataDiary = await fetchDiary();
    if (!dataDiary) {
        addTextErrors("Can't take your data from database. Error 500", "error");
        return;
    }
    setRecords_TagsStore(dataDiary);
};
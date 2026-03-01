import { AlertType } from "../../allTypes/typesTS";
import { useErrorStore } from "./errorStore";


export const getTextErrors = () => {
  return useErrorStore.getState().errors;
};


export const addTextErrors = (
  text: string,
  type: AlertType
) => {

  const newError = {
    id: crypto.randomUUID(),
    errorText: text,
    type,
  };

  useErrorStore.setState((state) => ({
    errors: [
      ...state.errors,
      newError,
    ],
  }));

};


export const removeTextError = (id: string) => {

  useErrorStore.setState((state) => ({
    errors: state.errors.filter(
      err => err.id !== id
    ),
  }));

};
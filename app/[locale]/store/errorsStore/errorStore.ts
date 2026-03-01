import { create } from "zustand";
import { AlertType } from "../../allTypes/typesTS";

export type ErrorItem = {
  id: string;
  errorText: string;
  type: AlertType;
};

type ErrorStore = {
  errors: ErrorItem[];
};

export const useErrorStore = create<ErrorStore>(() => ({
  errors: [],
}));
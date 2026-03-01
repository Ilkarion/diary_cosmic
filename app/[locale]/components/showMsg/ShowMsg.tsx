'use client'

import { useEffect } from "react";
import { ErrorItem, useErrorStore } from "../../store/errorsStore/errorStore";
import { removeTextError } from "../../store/errorsStore/functions";
import "./showMsg.scss";


function ErrorMessage({
  id,
  errorText,
  type,
}: ErrorItem) {

  useEffect(() => {

    const timer = setTimeout(() => {
      removeTextError(id);
    }, 8000);

    return () => clearTimeout(timer);

  }, [id]);

  return (
    <div
      className={`customizingErrorMsgComp
      ${type === "error"
        ? "errorMsg"
        : type === "success"
        ? "successMsg"
        : "infoMsg"}
    `}
    >
      <span>{errorText}</span>
      <div className="msgTimerBar" />
    </div>
  );
}


export default function ShowMsg() {

  const errors = useErrorStore(
    s => s.errors
  );

  if (!errors.length) return null;

  return (
    <div className="wrapperErrorMsgs">
      {errors.map(err => (

        <ErrorMessage
          key={err.id}
          id={err.id}
          errorText={err.errorText}
          type={err.type}
        />

      ))}
    </div>
  );
}
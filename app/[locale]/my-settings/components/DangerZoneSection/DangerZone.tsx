"use client";


import { useState } from "react";
import "./dangerZone.scss";
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions";

import Image from "next/image";

//Icons
import warningIcon from "@/public/imgs/warning.svg"
import { deleteUser, logoutUser } from "@/app/[locale]/allFunctions/mySettings/functions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function DangerZone() {

  const t = useTranslations("SettingsPage.DangerZone")

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter()

  const handleDeleteAccount = async () => {
    // Здесь можно вызвать NextAuth sign-out или API бэкенда
    try {
      const result = await deleteUser()
      addTextErrors(result.message, "success")
    } catch (e) {
      if(e instanceof Error) addTextErrors(`Error: ${e.message}`, "error")
    }
    addTextErrors("Account deleted", "success");
    setShowDeleteModal(false);
    router.push("/sign")
  };

  async function logoutMe() {
    const result = await logoutUser();
    if (result.message === "Logged out") {
      addTextErrors("User logged out successfully", "success")
      router.push("/")
    } else {
      addTextErrors("Logout failed: ", result.message);
    }
  }

  return (
    <>
      <section className="danger-card">
        <div className="danger-bg-circle"></div>
        <h3 className="danger-title">
          <div className="warning-icon"><Image src={warningIcon} alt=""/></div> {t("Header")}
        </h3>
        <p className="danger-text">
          {t("danger_text")}
        </p>
        <div className="dangerBtns">
          <button
            className="danger-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            {t("delete_btn")}
          </button>
          <button className="logoutDanger" onClick={()=>logoutMe()}>{t("logout_btn")}</button>
        </div>

      </section>

      {showDeleteModal && (
        <div className="danger-modal-backdrop">
          <div className="danger-modal">
            <h3 className="modal-title">{t("delete_question")}</h3>
            <p className="modal-text">
              {t("delete_question_explain")}
            </p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                {t("dalete_cancel")}
              </button>
              <button
                className="modal-confirm"
                onClick={handleDeleteAccount}
              >
                {t("delete_delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
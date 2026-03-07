"use client";


import { useState } from "react";
import "./dangerZone.scss";
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions";

import Image from "next/image";

//Icons
import warningIcon from "@/public/imgs/warning.svg"
import { deleteUser, logoutUser } from "@/app/[locale]/allFunctions/mySettings/functions";
import { useRouter } from "next/navigation";

export default function DangerZone() {
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
          <div className="warning-icon"><Image src={warningIcon} alt=""/></div> Danger Zone
        </h3>
        <p className="danger-text">
          Once you delete your account, there is no going back. All your records,
          tags, and settings will be permanently destroyed. Please be certain.
        </p>
        <div className="dangerBtns">
          <button
            className="danger-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
          <button className="logoutDanger" onClick={()=>logoutMe()}>Logout</button>
        </div>

      </section>

      {showDeleteModal && (
        <div className="danger-modal-backdrop">
          <div className="danger-modal">
            <h3 className="modal-title">Are you absolutely sure?</h3>
            <p className="modal-text">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-confirm"
                onClick={handleDeleteAccount}
              >
                Yes, delete my account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
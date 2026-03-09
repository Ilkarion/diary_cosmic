'use client'
import { useState } from "react";
import "./security.scss"
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions";
import Image from "next/image";

//Icons
import keyIcon from "@/public/imgs/password.svg"
import { changePassword } from "@/app/[locale]/allFunctions/mySettings/functions";
import { useTranslations } from "next-intl";
export default function Security() {

  const t = useTranslations("SettingsPage.Security")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleSavePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!currentPassword || !newPassword) {
          addTextErrors("Please fill all password fields", "info");
      }
      if(currentPassword === newPassword) {
        addTextErrors("Same passwords", "info")
        return
      }else {
        if(0 < newPassword.length && newPassword.length <= 5) {
          addTextErrors("Password must be at least 6 characters", "info")
          return
        } else if(newPassword.length===0) {
          addTextErrors("Fill 'New Password' field", "info")
          return
        }else if(newPassword != currentPassword) {
          const result = await changePassword(currentPassword, newPassword)
          addTextErrors(result.message, "success")
          setCurrentPassword("");
          setNewPassword("");
        }
      }

    }catch(e) {
      if(e instanceof Error) addTextErrors(`Error: ${e.message}`, "error")
    }


  };

  return (
    <section className="security-card">
      <h3 className="security-title">
        <div className="security-icon"><Image src={keyIcon} alt=""/></div> {t("Header")}
      </h3>
      <form onSubmit={handleSavePassword} className="security-form">
        <div className="security-field">
          <label htmlFor="current-password">{t("pas1Header")}</label>
          <input
            id="current-password"
            type="password"
            placeholder={t("pas1PlaceHolder")}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            
          />
        </div>
        <div className="security-field">
          <label htmlFor="new-password">{t("pas2Header")}</label>
          <input
            id="new-password"
            type="password"
            placeholder={t("pas2PlaceHolder")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="security-btn">
          {t("btn")}
        </button>
      </form>
    </section>
  );
};


"use client";

import "./scss/register.scss"

import passwordIcon from "@/public/imgs/password.svg"
import Image from "next/image";
import starsIcon from "@/public/imgs/stars.svg"
import gmailIcon from "@/public/imgs/gmail.svg"
import userIcon from "@/public/imgs/user.svg"
import { useEffect, useState } from "react";
import { FormFields, loginUser, registerUser, validate, validateErrorsServer } from "../allFunctions/sign/functions";
import { redirect } from "next/navigation";
import { addTextErrors } from "../store/errorsStore/functions";

export default function Page() {
  const [transForm, setTransForm] = useState(true)
  const [wait, setWait] = useState(false)

  const [login, setLogin] = useState(false)

  useEffect(()=>{
    if(login===true) {
      redirect("/checkAuthUser")
    }
  }, [login])

  async function onRegister(username:string, email:string, password:string) {
    
    const result = await registerUser(username, email, password);
    if (!result.ok) {
      const errorText = validateErrorsServer(result.message)
      if(errorText)addTextErrors(errorText, "error")
      setWait(false)
      return;
    }
    setWait(false)
    addTextErrors(result.message, "success")
  }
  async function onLogin(email:string, password:string) {
    const result = await loginUser(email, password);

    if (!result.ok) {
      setLogin(false);
      const errorText = validateErrorsServer(result.message)
      if(errorText)addTextErrors(errorText, "error")
      setWait(false)
      return;
    }
    setWait(false)
    setLogin(true)
 }


  function handleSign(e: React.FormEvent<HTMLFormElement>) {
    setWait(true)
    //getting information from form
    e.preventDefault()
    const form = e.currentTarget; 
    const formData = new FormData(form)
    const data:FormFields = Object.fromEntries(formData.entries())

    //check correct writing
    const errorsForm = validate(data, transForm)

    //handle errors
    if(errorsForm.length > 0) {
      errorsForm.forEach(item => addTextErrors(item, "error"))
      setWait(false)
      return
    }

    //sending to the data
    if(errorsForm.length === 0) {
      if(!transForm && data.username && data.email && data.password) {
        onRegister(data.username, data.email, data.password)
      }else if(transForm && data.email && data.password) {
        onLogin(data.email, data.password)
      }
    }
  }




  return (
    <div className="register">
      <div className="register__card">
        <div className="starsRegIcon spin">
            <Image src={starsIcon} alt="" />
            <Image src={starsIcon} alt=""  className="positionBlur blur-2xl"/>
        </div>
        <h2 className="register__title">{transForm ? "Welcome Back" : "Join the Cosmos"}</h2>

        <form className="register__form" onSubmit={handleSign}>
          {!transForm ?
          <>
            <label>Username</label>
            <div className="register__input">
              <div className="register__input-icon">
                  <Image src={userIcon} alt=""/>
              </div>
              <input name="username" type="text" placeholder="Choose a username" />
            </div>          
          </> : <></>}


          <label>Email</label>
          <div className="register__input">
            <div className="register__input-icon">
                <Image src={gmailIcon} alt=""/>
            </div>
            <input name="email" type="email" placeholder="your@email.com" />
          </div>

          <label>Password</label>
          <div className="register__input">
            <div className="register__input-icon">
                <Image src={passwordIcon} alt=""/>
            </div>
            <input name="password" type="password" placeholder="••••••••" />
          </div>

          <button 
            disabled={wait}
            type="submit" 
            className="register__btn"
          >
            {transForm ? "Launch Into Space" : "Create Account"}
          </button>
        </form>

        <p className="register__footer">
          {transForm ? 
          <>Need an account? <span onClick={()=>{
            setTransForm(false)
          }
          }>Sign up</span></> 
          :
          <>Already have an account? <span onClick={()=>{
            setTransForm(true)
          }
          }>Log in</span></>
          }
          
        </p>
      </div>
    </div>
  );
}

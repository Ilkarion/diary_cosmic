"use client";

import "./scss/register.scss"

import passwordIcon from "@/public/imgs/password.svg"
import Image from "next/image";
import starsIcon from "@/public/imgs/stars.svg"
import gmailIcon from "@/public/imgs/gmail.svg"
import userIcon from "@/public/imgs/user.svg"
import { useEffect, useState } from "react";
import { FormFields, loginUser, registerUser, validate, validateErrorsServer } from "./functions/functions";
import ErrorList from "../components/errorList/ErrorList";
import SuccessMsgs from "../components/successMsgs/SuccessMsgs";
import { redirect } from "next/navigation";

export default function Page() {
  const [transForm, setTransForm] = useState(true)
  const [errorList, setErrorList] = useState<string[]>([])
  const [successList, setSuccessList] = useState<string>()

  const [login, setLogin] = useState(false)

  useEffect(()=>{
    if(login===true) {
      redirect("/checkAuthUser")
    }
  }, [login])

  async function onRegister(username:string, email:string, password:string) {
    
    const result = await registerUser(username, email, password);
    if (!result.ok) {
      setSuccessList("")
      console.log("Error:", result.message);
      const errorText = validateErrorsServer(result.message)
      if(errorText)setErrorList([errorText])
      return;
    }
    setErrorList([])
    console.log("Register:", result);
    setSuccessList(result.message)
  }
  async function onLogin(email:string, password:string) {
    const result = await loginUser(email, password);

    if (!result.ok) {
      setLogin(false)
      console.log("Error:", result.message);
      const errorText = validateErrorsServer(result.message)
      if(errorText)setErrorList([errorText])
      return;
    }
    setErrorList([])
    setLogin(true)
    console.log(result);
 }


  function handleSign(e: React.FormEvent<HTMLFormElement>) {
    //getting information from form
    e.preventDefault()
    const form = e.currentTarget; 
    const formData = new FormData(form)
    const data:FormFields = Object.fromEntries(formData.entries())

    //check correct writing
    const errorsForm = validate(data, transForm)

    //handle errors
    if(errorsForm.length > 0) {
      console.log(errorsForm)
      setErrorList(errorsForm)
      return
    }
    setErrorList([]);

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
      {errorList && <ErrorList errors={errorList}/>}
      {successList && <SuccessMsgs msg={successList}/>}
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

          <button type="submit" className="register__btn">{transForm ? "Launch Into Space" : "Create Account"}</button>
        </form>

        <p className="register__footer">
          {transForm ? 
          <>Need an account? <span onClick={()=>{
            setTransForm(false)
            setErrorList([])
            setSuccessList("")
          }
          }>Sign up</span></> 
          :
          <>Already have an account? <span onClick={()=>{
            setTransForm(true)
            setErrorList([])
            setSuccessList("")
          }
          }>Log in</span></>
          }
          
        </p>
      </div>
    </div>
  );
}

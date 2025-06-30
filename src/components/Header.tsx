import { SignUp } from "./authorization/SignUp";
import { SignIn } from "./authorization/SignIn";
import { useState } from "react";
interface PropsType {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
  isUserSignIn: boolean;
}
import { PiTextAlignLeft } from "react-icons/pi";
import { supabase } from "../supabase-client";
import { useUserContext } from "./useUserContext";

export function Header({
  setSidebarIsOpen,
  setModalIsOpen,
  sidebarIsOpen,
  isUserSignIn,
}: PropsType) {
  const { loadingData } = useUserContext();
  const [showAuthorizationForm, setShowAuthorizationForm] = useState({
    signIn: false,
    signOut: false,
  });

  const signOutHandler = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.log("Sign out error: " + signOutError.message);
      return;
    }
    window.location.reload();
  };

  return (
    <header className="flex items-center justify-between w-full h-15 bg-bg border-b-2 border-border">
      <PiTextAlignLeft
        onClick={() => {
          if (!isUserSignIn) return;
          setSidebarIsOpen(true);
          setModalIsOpen(true);
        }}
        className={`${
          loadingData
            ? "text-button-hover animate-pulse pointer-events-none"
            : "text-text-main"
        } cursor-pointer ml-5 size-10  hover:text-button-hover transition-colors duration-300 ${
          sidebarIsOpen ? "invisible" : "visible"
        }`}
      />
      <div className="flex mr-3 text-2xl text-text-main">
        {loadingData ? (
          <span className="w-23 h-8 bg-button-hover animate-pulse rounded-2xl"></span>
        ) : isUserSignIn ? (
          <span
            className="cursor-pointer hover:text-button-hover"
            onClick={signOutHandler}
          >
            Sign Out
          </span>
        ) : (
          <>
            <span
              className="cursor-pointer hover:text-button-hover"
              onClick={() => {
                setShowAuthorizationForm({
                  signIn: false,
                  signOut: true,
                });
              }}
            >
              Sign Up
            </span>
            /
            <span
              className="cursor-pointer hover:text-button-hover"
              onClick={() => {
                setShowAuthorizationForm({
                  signIn: true,
                  signOut: false,
                });
              }}
            >
              Sign In
            </span>
          </>
        )}
      </div>
      {showAuthorizationForm.signIn && (
        <SignIn setShowAuthorizationForm={setShowAuthorizationForm} />
      )}
      {showAuthorizationForm.signOut && (
        <SignUp setShowAuthorizationForm={setShowAuthorizationForm} />
      )}
    </header>
  );
}

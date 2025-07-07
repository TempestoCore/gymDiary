import { SignUp } from "./authorization/SignUp";
import { SignIn } from "./authorization/SignIn";
import { useState } from "react";
interface PropsType {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
  isUserSignIn: boolean;
  userName: string | undefined;
}
import { PiTextAlignLeft } from "react-icons/pi";
import { supabase } from "../supabase-client";
import { useUserContext } from "./useUserContext";

export function Header({
  setSidebarIsOpen,
  setModalIsOpen,
  sidebarIsOpen,
  isUserSignIn,
  userName,
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
    <header className="bg-bg-secondary border-border flex h-15 w-full items-center justify-between border-b-2">
      <PiTextAlignLeft
        onClick={() => {
          if (!isUserSignIn) return;
          setSidebarIsOpen(true);
          setModalIsOpen(true);
        }}
        className={`${
          loadingData
            ? "text-button-hover pointer-events-none animate-pulse"
            : "text-text-main"
        } hover:text-button-hover ml-5 size-10 cursor-pointer transition-colors duration-300 ${
          sidebarIsOpen ? "invisible" : "visible"
        }`}
      />
      <span className="text-text-secondary mr-10 ml-auto justify-end truncate text-2xl">
        {userName}
      </span>
      <div className="text-text-main mr-3 flex text-2xl">
        {loadingData ? (
          <span className="bg-button-hover h-8 w-23 animate-pulse rounded-2xl"></span>
        ) : isUserSignIn ? (
          <span
            className="hover:text-button-hover active:text-button-hover ease cursor-pointer transition-colors duration-300"
            onClick={signOutHandler}
          >
            Sign Out
          </span>
        ) : (
          <>
            <span
              className="hover:text-button-hover active:text-button-hover cursor-pointer"
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
              className="hover:text-button-hover active:text-button-hover cursor-pointer"
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

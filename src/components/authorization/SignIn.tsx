import { useState } from "react";
import { supabase } from "../../supabase-client";
interface PropsType {
  setShowAuthorizationForm: React.Dispatch<
    React.SetStateAction<{
      signIn: boolean;
      signOut: boolean;
    }>
  >;
}

export function SignIn({ setShowAuthorizationForm }: PropsType) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const SignInHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.log("Sign In error: " + signInError.message);
        return;
      }
      // setIsUserSignIn(true);
      // setShowAuthorizationForm({ signIn: false, signOut: false });
      window.location.reload();
    } catch {
      console.log("Error");
    }
  };

  return (
    <div className=" fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-bg text-2xl text-text-main">
      <form
        onSubmit={(e) => SignInHandler(e)}
        className="flex relative flex-col justify-center items-center gap-10 w-100 h-100 bg-bg border-2 border-border"
      >
        <span
          onClick={() => {
            setShowAuthorizationForm({
              signIn: false,
              signOut: false,
            });
          }}
          className="absolute top-0 right-0 pr-5 hover:text-error cursor-pointer"
        >
          Close
        </span>
        <input
          className="outline-0 bg-bg-secondary border-2 border-border px-2"
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="outline-0 bg-bg-secondary border-2 border-border px-2"
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          type="submit"
          className="border-2 border-border py-2 px-4 rounded-xl bg-bg-secondary hover:bg-button-hover transition-colors duration-300"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

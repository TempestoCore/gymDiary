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
  const [signInNote, setSignInNote] = useState("");
  const SignInHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (password.length < 6) {
        setSignInNote("Password need minimum 6 symbols");
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.log("Sign In error: " + signInError.message);
        setSignInNote("Wrong email or password");
        return;
      }
      window.location.reload();
    } catch {
      console.log("Error");
    }
  };

  return (
    <div className="bg-bg text-text-main fixed top-0 left-0 flex h-screen w-screen items-center justify-center text-2xl">
      <form
        onSubmit={(e) => SignInHandler(e)}
        className="bg-bg border-border relative flex h-100 w-88 flex-col items-center justify-center gap-10 rounded-xl border-2 sm:w-100"
      >
        <span
          onClick={() => {
            setShowAuthorizationForm({
              signIn: false,
              signOut: false,
            });
          }}
          className="hover:text-error active:text-error absolute top-0 right-0 cursor-pointer pr-5"
        >
          Close
        </span>
        <input
          className="bg-bg-secondary border-border border-2 px-2 outline-0"
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="bg-bg-secondary border-border border-2 px-2 outline-0"
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <span className="text-error text-xl empty:hidden">{signInNote}</span>
        <button
          type="submit"
          className="border-border active:bg-button-hover bg-bg-secondary hover:bg-button-hover cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

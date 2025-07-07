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

export function SignUp({ setShowAuthorizationForm }: PropsType) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpNote, setSignUpNote] = useState("");
  const signUpHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (password.length < 6) {
        setSignUpNote("Password need minimum 6 symbols");
        return;
      }
      const { data: user, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (signUpError) {
        console.log("Sign Up error: " + signUpError.message);
        console.log(signUpError.message);
        setSignUpNote("Sign Up error");
        return;
      }
      const { error: insertUserPlansError } = await supabase
        .from("user_plans")
        .insert([{ user_id: user.user?.id }]);
      if (insertUserPlansError) {
        console.log(
          "Insert email in db error: " + insertUserPlansError.message,
        );
      }
      const { error: insertUserDietDataError } = await supabase
        .from("userDietData")
        .insert([{ user_id: user.user?.id }]);
      if (insertUserDietDataError) {
        console.log(
          "Insert user diet data error: " + insertUserDietDataError.message,
        );
      }
      return true;
    } catch {
      console.log("Supabase is unavailable");
    }
  };

  return (
    <div className="bg-bg text-text-main fixed top-0 left-0 flex h-screen w-screen items-center justify-center text-2xl">
      <form
        onSubmit={(e) =>
          signUpHandler(e).then((res) => {
            if (res) {
              window.location.reload();
            }
            return;
          })
        }
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
        <span className="text-error text-xl empty:hidden">{signUpNote}</span>
        <button
          type="submit"
          className="border-border bg-bg-secondary hover:bg-button-hover active:bg-button-hover cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

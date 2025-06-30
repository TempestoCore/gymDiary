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

  const signUpHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data: user, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (signUpError) {
        console.log("Sign Up error: " + signUpError.message);
        return;
      }
      const { error: insertUserPlansError } = await supabase
        .from("user_plans")
        .insert([{ user_id: user.user?.id }]);
      if (insertUserPlansError) {
        console.log(
          "Insert email in db error: " + insertUserPlansError.message
        );
      }
      const { error: insertUserDietDataError } = await supabase
        .from("userDietData")
        .insert([{ user_id: user.user?.id }]);
      if (insertUserDietDataError) {
        console.log(
          "Insert user diet data error: " + insertUserDietDataError.message
        );
      }
    } catch {
      console.log("Supabase is unavailable");
    }
  };

  return (
    <div className=" fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-bg text-2xl text-text-main">
      <form
        onSubmit={(e) =>
          signUpHandler(e).then(() => {
            window.location.reload();
          })
        }
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
          Sign Up
        </button>
      </form>
    </div>
  );
}

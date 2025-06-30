import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { useState, useEffect } from "react";
import { Home } from "./components/home/Home";
import { Workout } from "./components/workout/Workout";
import { Diet } from "./components/diet/Diet";
import { Plan } from "./components/plan/Plan";
import { Statistics } from "./components/statistics/Statistics";
import { UserContextProvider } from "./components/UserContext";
import { supabase } from "./supabase-client";

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [openTab, setOpenTab] = useState("Home");
  const [isUserSignIn, setIsUserSignIn] = useState(false);

  const getUser = async () => {
    const { error: getUserError } = await supabase.auth.getUser();
    if (getUserError) {
      console.log("Get user error: " + getUserError.message);
      return;
    }

    setIsUserSignIn(true);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContextProvider>
      <div id="App" className="flex flex-col relative z-10  min-h-screen bg-bg">
        {modalIsOpen && (
          <div
            onClick={() => {
              setModalIsOpen(false);
              setSidebarIsOpen(false);
            }}
            className="absolute z-10 top-0 left-0 w-screen h-screen bg-black opacity-50"
          ></div>
        )}
        <Header
          setSidebarIsOpen={setSidebarIsOpen}
          setModalIsOpen={setModalIsOpen}
          sidebarIsOpen={sidebarIsOpen}
          isUserSignIn={isUserSignIn}
        />
        {openTab === "Workout" ? (
          <Workout />
        ) : openTab === "Diet" ? (
          <Diet />
        ) : openTab === "Plan" ? (
          <Plan />
        ) : openTab === "Statistics" ? (
          <Statistics />
        ) : (
          <Home isUserSignIn={isUserSignIn} />
        )}
        <div>
          <Sidebar
            sidebarIsOpen={sidebarIsOpen}
            setSidebarIsOpen={setSidebarIsOpen}
            setModalIsOpen={setModalIsOpen}
            setOpenTab={setOpenTab}
          />
        </div>
      </div>
    </UserContextProvider>
  );
}

export default App;

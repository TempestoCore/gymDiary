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
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const getUser = async () => {
    const { data, error: getUserError } = await supabase.auth.getUser();
    if (getUserError) {
      console.log("Get user error: " + getUserError.message);
      return;
    }
    setUserName(data.user.email);
    setIsUserSignIn(true);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContextProvider>
      <div
        id="App"
        className="bg-bg relative z-10 flex min-h-screen flex-col md:flex-row"
      >
        {modalIsOpen && (
          <div
            onClick={() => {
              setModalIsOpen(false);
              setSidebarIsOpen(false);
            }}
            className="absolute top-0 left-0 z-10 h-screen w-screen bg-black opacity-50 md:hidden"
          ></div>
        )}
        <Sidebar
          sidebarIsOpen={sidebarIsOpen}
          setSidebarIsOpen={setSidebarIsOpen}
          setModalIsOpen={setModalIsOpen}
          setOpenTab={setOpenTab}
          openTab={openTab}
        />
        <div className="w-full">
          <Header
            setSidebarIsOpen={setSidebarIsOpen}
            setModalIsOpen={setModalIsOpen}
            sidebarIsOpen={sidebarIsOpen}
            isUserSignIn={isUserSignIn}
            userName={userName}
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
        </div>
      </div>
    </UserContextProvider>
  );
}

export default App;

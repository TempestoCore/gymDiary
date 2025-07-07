import { PiTextAlignRight, PiBookFill } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { GiGymBag } from "react-icons/gi";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosStats } from "react-icons/io";
interface PropsType {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
  setOpenTab: React.Dispatch<React.SetStateAction<string>>;
  openTab: string;
}

export function Sidebar({
  sidebarIsOpen,
  setModalIsOpen,
  setSidebarIsOpen,
  setOpenTab,
  openTab,
}: PropsType) {
  const openTapHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setOpenTab(`${e.currentTarget.innerText}`);
  };

  const switchThemeHandler = () => {
    document.documentElement.classList.add("theme-changing");
    document.documentElement.classList.toggle("dark");

    setTimeout(() => {
      document.documentElement.classList.remove("theme-changing");
    }, 50);
  };

  return (
    <div
      className={`bg-bg fixed top-0 left-0 z-60 flex h-screen flex-col md:relative ${
        sidebarIsOpen ? "w-50 translate-x-0" : "w-0 -translate-x-50"
      } border-border border-r-2 transition-all duration-200`}
    >
      <div className="border-border bg-bg-secondary flex h-15 w-full items-center justify-between border-b-2">
        <h1 className="text-button ml-2 text-2xl">Gym Dairy</h1>
        <PiTextAlignRight
          onClick={() => {
            setModalIsOpen(false);
            setSidebarIsOpen(false);
          }}
          className="text-text-main active:text-button-hover hover:text-button-hover mr-5 size-10 cursor-pointer transition-colors duration-300"
        />
      </div>
      <ul className="text-text-main flex w-50 flex-col text-2xl">
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Home" ? "bg-bg-secondary border-border border-r-2" : "border-0"} hover:border-t-bg-secondary flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2 hover:border-r-2 hover:border-b-2`}
        >
          <FaHome className="text-button" />
          Home
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Workout" ? "bg-bg-secondary border-border border-r-2" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2 hover:border-r-2`}
        >
          <GiGymBag className="text-button" />
          Workout
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Diet" ? "bg-bg-secondary border-border border-r-2" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2 hover:border-r-2`}
        >
          <IoFastFoodOutline className="text-button" />
          Diet
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Plan" ? "bg-bg-secondary border-border border-r-2" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2 hover:border-r-2`}
        >
          <PiBookFill className="text-button" />
          Plan
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Statistics" ? "bg-bg-secondary border-border border-r-2" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2 hover:border-r-2`}
        >
          <IoIosStats className="text-button" />
          Statistics
        </li>
      </ul>
      <div className="flex grow flex-col items-center justify-end pb-10">
        <button
          onClick={switchThemeHandler}
          className="bg-bg-secondary active:bg-button-hover border-border text-text-main hover:bg-button-hover transition-color w-5/10 cursor-pointer rounded-xl border-2 py-2 text-2xl duration-300 select-none active:scale-96"
        >
          Theme
        </button>
      </div>
    </div>
  );
}

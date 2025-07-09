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
      className={`bg-bg fixed top-0 left-0 z-60 flex h-full flex-col overflow-x-hidden md:relative ${
        sidebarIsOpen ? "w-50 border-r-2" : "w-0"
      } border-border transition-all duration-300`}
    >
      <div className="border-border bg-bg-secondary flex h-15 w-50 items-center justify-around overflow-hidden border-b-2">
        <h1 className="text-button nowrap ml-2 flex w-30 text-2xl whitespace-nowrap">
          Gym Dairy
        </h1>
        <PiTextAlignRight
          onClick={() => {
            setModalIsOpen(false);
            setSidebarIsOpen(false);
          }}
          className="text-text-main active:text-button-hover hover:text-button-hover mr-10 size-10 cursor-pointer transition-colors duration-300"
        />
      </div>
      <ul className="text-text-main flex flex-col text-2xl">
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Home" ? "bg-bg-secondary border-border" : "border-0"} hover:border-t-bg-secondary flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2 hover:border-b-2`}
        >
          <FaHome className="text-button" />
          Home
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Workout" ? "bg-bg-secondary border-border" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2`}
        >
          <GiGymBag className="text-button" />
          Workout
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Diet" ? "bg-bg-secondary border-border" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2`}
        >
          <IoFastFoodOutline className="text-button" />
          Diet
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Plan" ? "bg-bg-secondary border-border" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2`}
        >
          <PiBookFill className="text-button" />
          Plan
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className={`hover:bg-bg-secondary active:bg-bg-secondary hover:border-border ${openTab === "Statistics" ? "bg-bg-secondary border-border" : "border-0"} flex h-13 w-full cursor-pointer items-center gap-1 pl-2 select-none hover:border-y-2`}
        >
          <IoIosStats className="text-button" />
          Statistics
        </li>
      </ul>
      <div className="flex grow flex-col items-center justify-end pb-10">
        <button
          onClick={switchThemeHandler}
          className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease text-text-main cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
        >
          Theme
        </button>
      </div>
    </div>
  );
}

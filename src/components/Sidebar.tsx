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
}

export function Sidebar({
  sidebarIsOpen,
  setModalIsOpen,
  setSidebarIsOpen,
  setOpenTab,
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
      className={`fixed flex flex-col top-0 left-0 z-60 h-screen w-50 bg-bg ${
        sidebarIsOpen ? "translate-x-0" : "-translate-x-50"
      } border-r-2 border-border transition-all duration-200`}
    >
      <div className="flex justify-between items-center h-15 w-full ">
        <h1 className="text-2xl ml-2 text-button">Gym Dairy</h1>
        <PiTextAlignRight
          onClick={() => {
            setModalIsOpen(false);
            setSidebarIsOpen(false);
          }}
          className="size-10 mr-5 text-text-main hover:text-button-hover transition-colors duration-300"
        />
      </div>
      <ul className="flex flex-col gap-1 w-50 text-2xl text-text-main">
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className="flex items-center gap-1 hover:bg-bg-secondary w-full h-10 pl-2 select-none hover:border-y-1
         hover:border-border hover:border-r-2"
        >
          <FaHome className="text-button" />
          Home
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className="flex items-center gap-1 hover:bg-bg-secondary w-full h-10 pl-2 select-none hover:border-y-1
         hover:border-border hover:border-r-2"
        >
          <GiGymBag className="text-button" />
          Workout
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className="flex items-center gap-1 hover:bg-bg-secondary w-full h-10 pl-2 select-none hover:border-y-1
         hover:border-border hover:border-r-2"
        >
          <IoFastFoodOutline className="text-button" />
          Diet
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className="flex items-center gap-1 hover:bg-bg-secondary w-full h-10 pl-2 select-none hover:border-y-1
         hover:border-border hover:border-r-2"
        >
          <PiBookFill className="text-button" />
          Plan
        </li>
        <li
          onClick={(e) => {
            openTapHandler(e);
          }}
          className="flex items-center gap-1 hover:bg-bg-secondary w-full h-10 pl-2 select-none hover:border-y-1
         hover:border-border hover:border-r-2"
        >
          <IoIosStats className="text-button" />
          Statistics
        </li>
      </ul>
      <div className="flex flex-col grow justify-end items-center pb-10">
        <button
          onClick={switchThemeHandler}
          className="bg-bg-secondary border-2 border-border text-text-main select-none text-2xl py-2 rounded-sm w-5/10
           hover:bg-button-hover transition-color duration-300"
        >
          Theme
        </button>
      </div>
    </div>
  );
}

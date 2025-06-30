import { useEffect, useRef } from "react";

interface PropsType {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}
export function ContextMenu({ x, y, onDelete, onClose }: PropsType) {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const closeMenuHandler = (e: MouseEvent) => {
      if (menuRef.current != e.target) {
        onClose();
      }
    };
    document.addEventListener("mousedown", closeMenuHandler);
    return () => document.removeEventListener("mousedown", closeMenuHandler);
  });
  return (
    <div
      ref={menuRef}
      onClick={handleDelete}
      style={{
        left: x,
        top: y - 60,
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
      className={`cursor-pointer text-2xl text-text-main py-2 px-4 rounded-xl hover:bg-error absolute  bg-bg-secondary border-2 border-border z-1000`}
    >
      Delete
    </div>
  );
}

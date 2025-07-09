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
      className={`text-text-main border-border "border-border bg-bg-secondary active:border-error hover:border-error active:bg-error ease active:scale-96" absolute z-1000 cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300`}
    >
      Delete
    </div>
  );
}

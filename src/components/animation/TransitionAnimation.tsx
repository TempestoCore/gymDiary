interface PropsType {
  size?: number;
}
export function TransitionAnimation({ size }: PropsType) {
  return (
    <div className="flex w-full grow items-center justify-center">
      <div className={`${size ? `size-${size}` : "size-40"} flex items-end`}>
        <div className="bg-button-hover animate-transitionAnimationBox1 h-10 w-1/4 rounded-full"></div>
        <div className="bg-button-hover animate-transitionAnimationBox2 h-10 w-1/4 rounded-full"></div>
        <div className="bg-button-hover animate-transitionAnimationBox3 h-10 w-1/4 rounded-full"></div>
        <div className="bg-button-hover animate-transitionAnimationBox4 h-10 w-1/4 rounded-full"></div>
      </div>
    </div>
  );
}

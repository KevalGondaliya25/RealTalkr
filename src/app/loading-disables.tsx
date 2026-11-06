export default function Loading() {
  return (
    <div>
      <div className="flex justify-center items-center fixed h-full w-full left-0 top-0 z-[900]">
        <div className="absolute z-[100] flex flex-col justify-center items-center">
          <div className="h-[9em] w-[9em] rounded-full border-[10px] border-[#00000033] border-t-primary my-auto animate-spin"></div>
          <div className="text-[5em] font-[Montserrat, sans-serif] font-bold text-center select-none">
            <span
              data-text="R"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              R
            </span>
            <span
              data-text="E"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_0.2s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              E
            </span>
            <span
              data-text="A"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_0.4s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              A
            </span>
            <span
              data-text="L"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_0.6s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              L
            </span>
            <span
              data-text="T"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_0.8s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              T
            </span>
            <span
              data-text="A"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_1s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              A
            </span>
            <span
              data-text="L"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_1s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              L
            </span>
            <span
              data-text="K"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_1s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              K
            </span>
            <span
              data-text="R"
              className="inline-block relative text-[#00000033] before:text-primary before:content-[attr(data-text)] before:animate-[characters_4s_infinite_1s] before:left-0 before:top-0 before:opacity-0 before:absolute -before:rotate-y-90"
            >
              R
            </span>
          </div>
        </div>
        <div className="fixed top-0 left-0 bg-white w-[calc(50%+1px)] h-full"></div>
        <div className="fixed top-0 right-0 bg-white w-[calc(50%+1px)] h-full"></div>
      </div>
    </div>
  );
}

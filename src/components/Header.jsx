import { ZeroSvg } from './Svgs';

function Header({ func }) {
  const { openSidebar } = func;
  return (
    <header className="flex h-[50px] items-center justify-between border-b-1 border-zinc-200 px-3">
      <div className="flex items-center gap-4">
        <button onClick={openSidebar} className="cursor-pointer active:scale-95 md:hidden">
          <ZeroSvg className="sidebar-svg" width="30" height="30" />
        </button>
        <span className="font-medium max-md:text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)]">ZeroNote</span>
      </div>

      <div>additionals</div>
    </header>
  );
}

export default Header;

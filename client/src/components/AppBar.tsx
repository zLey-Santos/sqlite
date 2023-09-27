import { Link } from 'react-router-dom';
import { MdStickyNote2 as LogoIcon } from 'react-icons/md';

export function AppBar() {
  return (
    <header className='bg-[#222] p-3 shadow-md flex flex-row justify-between'>
      <div className='flex flex-row items-center gap-8'>
        <Logo />
        <Link
          to='/'
          className='text-white border-2 border-sky-500 px-2 py-1 rounded-md
           hover:bg-sky-300 hover:text-black font-bold hidden md:block'>
          Home
        </Link>
      </div>

      <div className='flex flex-row items-center gap-8'>
        <Link
          to='/create-post'
          className='bg-sky-500 hover:bg-sky-300 text-white font-bold uppercase py-1
          px-3 rounded-md hover:text-black'>
         Nova publicação
        </Link>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link to='/' className='flex flex-row items-center gap-2'>
      <LogoIcon className='text-sky-500 text-4xl' />
      <h1 className='text-lg uppercase font-bold text-white'>Orkut</h1>
    </Link>
  );
}

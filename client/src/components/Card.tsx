type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div className='bg-white m-4 rounded-lg shadow p-4 w-full  max-w-screen-md md:mx-auto break-words '>
      {children}
    </div>
  );
}

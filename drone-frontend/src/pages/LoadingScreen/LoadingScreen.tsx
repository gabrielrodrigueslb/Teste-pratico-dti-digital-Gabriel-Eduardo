import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <main className="bg-(--primary-color) w-full h-screen flex justify-center items-center flex-col gap-8">
      <div className='max-w-38'>
        <img src="/drone.svg" className='w-full h-full flying-animation' alt="Drone dti" />
      </div>
  <img className="max-w-8 text-white" src="/3-dots-fade.svg" alt="" />
    </main>
  );
}

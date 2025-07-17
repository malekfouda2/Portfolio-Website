export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Malek Fouda Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
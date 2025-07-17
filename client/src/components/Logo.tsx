import logoImage from "@assets/57569F74-550E-4BF2-BC57-30907EF46B0F_1752748397331.png";

export default function Logo({ className = "w-20 h-20 md:w-24 md:h-24" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Malek Fouda Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
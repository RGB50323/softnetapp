import { LogoutButton } from "@/components/ui/logout-button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="flex justify-between items-center mt-12">
        <h1 className="text-2xl font-bold">Bienvenido</h1>
        <LogoutButton />
      </div>
    </div>
  );
}
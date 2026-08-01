import { Navbar } from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
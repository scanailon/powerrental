"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/admin";

export default function LogoutButton() {
  const router = useRouter();
  const onClick = async () => {
    await logout();
    router.refresh();
    router.push("/admin/login");
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide border transition-colors duration-200"
      style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.8)" }}
    >
      Cerrar sesión
    </button>
  );
}

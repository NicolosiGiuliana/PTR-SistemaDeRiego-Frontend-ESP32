"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, User, Sprout, LogOut } from "lucide-react"
import { auth } from "@/firebase/firebase"
import { signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Rutas donde NO mostrar el sidebar
  const excludedPaths = ["/login", "/register", "/"]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  if (excludedPaths.includes(pathname)) {
    return null
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <div
      className={`${collapsed ? "w-16" : "w-64"
        } bg-[#003344] h-screen transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 border-b border-[#004455] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <img src="/Logo.png" alt="Logo" />
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-md flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">R</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-white hover:bg-[#004455]"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <Link href="/dashboard" passHref>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""} text-white hover:bg-[#004455]`}
            >
              <div className="h-5 w-5 rounded-full bg-[#FFB347] flex items-center justify-center mr-2">
                <LayoutDashboard className="h-3 w-3 text-[#003344]" />
              </div>
              {!collapsed && <span>Dashboard</span>}
            </Button>
          </Link>
          <Link href="/plantaciones" passHref>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""} text-white hover:bg-[#004455]`}
            >
              <div className="h-5 w-5 rounded-full bg-[#4CAF50] flex items-center justify-center mr-2">
                <Sprout className="h-3 w-3 text-[#003344]" />
              </div>
              {!collapsed && <span>Plantaciones</span>}
            </Button>
          </Link>
          <Link href="/configuracion" passHref>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""} text-white hover:bg-[#004455]`}
            >
              <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center mr-2">
                <Settings className="h-3 w-3 text-[#003344]" />
              </div>
              {!collapsed && <span>Configuración</span>}
            </Button>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-[#004455]">
        <div className={`flex flex-col ${collapsed ? "items-center" : "items-start"}`}>
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <User className="h-4 w-4 text-[#003344]" />
            </div>
            {!collapsed && (
              <div className="ml-2">
                <p className="text-sm font-medium text-white">{user?.email || "Usuario"}</p>
                <p className="text-xs text-gray-300">Administrador</p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start ${collapsed ? "px-2" : ""} text-white hover:bg-[#004455] flex items-center`}
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!collapsed && "Cerrar sesión"}
          </Button>
        </div>
      </div>
    </div>
  )
}

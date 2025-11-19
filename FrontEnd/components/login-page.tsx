"use client"

import { auth } from "@/firebase/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock } from "lucide-react"
import Link from "next/link"

export default function Loginpage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

    // Verificar si ya está autenticado y redirigir al dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario ya logueado, redirigir al dashboard
        router.replace("/dashboard")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard") // Te envia al home
    } catch (err) {
      setError("Email o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#003344] to-[#004455] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-[#003344]">Iniciar Sesión</h1>

        <div className="mb-4">
          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-[#003344]">
            <User className="h-4 w-4" />
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            className="mt-1"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-[#003344]">
            <Lock className="h-4 w-4" />
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="mt-1"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#004455] hover:bg-[#002a33]"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-[#004455] hover:underline">
            Registrate aquí
          </Link>
        </p>
      </form>
    </div>
  )
}

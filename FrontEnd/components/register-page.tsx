"use client"

import { auth } from "@/firebase/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password)
            router.push("/login") // Te envia al login
        } catch (err: any) {
            setError(err.message || "Error en el registro")
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
                <h1 className="text-2xl font-bold mb-6 text-center text-[#003344]">Registrarse</h1>

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

                <div className="mb-4">
                    <Label htmlFor="confirm-password" className="flex items-center gap-2 text-sm font-medium text-[#003344]">
                        <Lock className="h-4 w-4" />
                        Confirmar Contraseña
                    </Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
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
                    {loading ? "Registrando..." : "Registrarse"}
                </Button>

                <p className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tenés cuenta?{" "}
                    <Link href="/login" className="text-[#004455] hover:underline">
                        Iniciá sesión aquí
                    </Link>
                </p>
            </form>
        </div>
    )
}

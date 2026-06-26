import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Stethoscope } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign in | MedPass Admin",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">MedPass Admin</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage submissions
            </p>
          </div>
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <h2 className="text-base font-medium">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Enter your administrator credentials to continue.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

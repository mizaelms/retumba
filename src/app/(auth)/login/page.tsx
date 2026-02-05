import { login, signup } from '@/app/actions/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Login or Create an account</CardDescription>
        </CardHeader>
        <CardContent>
           {searchParams.error && (
            <div className="bg-destructive/15 text-destructive text-sm p-2 rounded mb-4">
                {searchParams.error}
            </div>
           )}
          <form className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex gap-2 justify-between">
                <Button formAction={login} className="w-full">Log in</Button>
                <Button formAction={signup} variant="outline" className="w-full">Sign up</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

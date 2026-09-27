import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User } from "lucide-react";
import SEO from "@/components/SEO";
import { queryClient } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  // The dashboard sends people back here when their session is missing.
  const signedOut = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("session") === "expired";
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState(signedOut ? "Your session has ended. Please sign in again." : "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.error || data.message || `Login failed (${response.status})`);
        return;
      }

      // Sign-in only counts once the session cookie comes back on the next
      // request; otherwise the dashboard would bounce straight back here.
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      const session = await fetch("/api/admin/session", { credentials: "include" });
      if (!session.ok) {
        setError("Signed in, but your browser did not keep the session cookie. Check that cookies are allowed for this site, then try again.");
        return;
      }

      setLocation("/dashboard");
    } catch (err) {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
    <SEO title="Admin Login | Malek Fouda" description="Private portfolio administration." canonicalPath="/login" noIndex />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      <Card className="w-full max-w-md mx-4 bg-gray-900/80 backdrop-blur-sm border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert className="bg-red-900/20 border-red-800 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </>);
}

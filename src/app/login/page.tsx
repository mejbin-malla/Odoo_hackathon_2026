"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { createDriver } from "@/actions/drivers";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [role, setRole] = useState("Fleet Manager");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpStep, setOtpStep] = useState<"none" | "email-verification" | "two-factor" | "forget-password">("none");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string || tempPassword;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    try {
      if (otpStep === "email-verification") {
        const { error: verifyError } = await authClient.emailOtp.verifyEmail({
          email: tempEmail,
          otp,
        });
        if (verifyError) throw verifyError;
        
        // After email verified, log them in
        const { error: signInError } = await authClient.signIn.email({
          email: tempEmail,
          password: tempPassword,
        });
        if (signInError) throw signInError;
        
        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (otpStep === "forget-password") {
        const { error: resetError } = await authClient.emailOtp.resetPassword({
          email: tempEmail,
          otp,
          password,
        });
        if (resetError) throw resetError;

        // Automatically log in after reset
        const { error: signInError } = await authClient.signIn.email({
          email: tempEmail,
          password,
        });
        if (signInError) throw signInError;

        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (otpStep === "two-factor") {
        const { error: verifyError } = await authClient.twoFactor.verifyOtp({
          code: otp,
        });
        if (verifyError) throw verifyError;

        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (isForgotPassword) {
        const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "forget-password",
        });
        if (otpError) throw otpError;

        setTempEmail(email);
        setOtpStep("forget-password");
        setError("");
        alert("Reset code sent! Please check your email (console) for the OTP.");
        return;
      }

      if (isSignUp) {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
          role,
        });
        if (signUpError) throw signUpError;
        
        if (role === "Driver") {
          const res = await createDriver(formData);
          if (!res.success) {
            console.error("Failed to create driver profile:", res.error);
          }
        }

        // Send OTP
        const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-up",
        });
        if (otpError) throw otpError;

        setTempEmail(email);
        setTempPassword(password);
        setOtpStep("email-verification");
        setError("");
        alert("Account created! Please check your email (console) for the OTP.");
      } else {
        const { data, error: signInError } = await authClient.signIn.email({
          email,
          password,
        });
        if (signInError) throw signInError;

        if (data?.twoFactorRedirect) {
          const { error: otpError } = await authClient.twoFactor.sendOtp();
          if (otpError) throw otpError;
          setTempEmail(email);
          setOtpStep("two-factor");
          setError("");
          alert("2FA is enabled. Please check your email (console) for the OTP.");
          return;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle iconOnly />
      </div>
      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Truck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Welcome to TransitOps</CardTitle>
          <CardDescription>
            {isForgotPassword ? "Reset your password" : isSignUp ? "Create an account to get started" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-destructive text-center font-medium">{error}</div>}
            
            {otpStep !== "none" ? (
              <div className="space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                  {otpStep === "email-verification" && "Verify your email address."}
                  {otpStep === "two-factor" && "Two-Factor Authentication required."}
                  {otpStep === "forget-password" && "Enter the reset code and your new password."}
                  <br />
                  Please enter the 6-digit OTP sent to your email.
                </p>
                <div className="space-y-4">
                  <Input 
                    id="otp" 
                    name="otp" 
                    type="text" 
                    required 
                    placeholder="Enter OTP Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center tracking-widest text-lg"
                  />
                  {otpStep === "forget-password" && (
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      required 
                      placeholder="New Password" 
                    />
                  )}
                </div>
              </div>
            ) : isForgotPassword ? (
              <div className="space-y-2">
                <Input id="email" name="email" type="email" required placeholder="Email Address" />
              </div>
            ) : (
              <>
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Input id="name" name="name" required placeholder="Full Name" />
                    </div>
                    <div className="space-y-2 pt-4">
                      <select 
                        id="role" 
                        name="role" 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Fleet Manager">Fleet Manager</option>
                        <option value="Driver">Driver</option>
                        <option value="Safety Officer">Safety Officer</option>
                        <option value="Financial Analyst">Financial Analyst</option>
                      </select>
                    </div>
                    
                    {role === "Driver" && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        <p className="text-sm font-semibold text-muted-foreground">Driver Details</p>
                        <div className="space-y-2">
                          <Input id="licenseNumber" name="licenseNumber" required placeholder="License Number" />
                        </div>
                        <div className="space-y-2">
                          <Input id="licenseCategory" name="licenseCategory" required placeholder="License Category (e.g. CDL-A)" />
                        </div>
                        <div className="space-y-2">
                          <Input id="licenseExpiryDate" name="licenseExpiryDate" type="date" required placeholder="License Expiry Date" />
                        </div>
                        <div className="space-y-2">
                          <Input id="contactNumber" name="contactNumber" required placeholder="Contact Number" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="space-y-2">
                  <Input id="email" name="email" type="email" required placeholder="Email Address" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only">Password</label>
                  </div>
                  <Input id="password" name="password" type="password" required placeholder="Password" />
                  {!isSignUp && (
                    <div className="flex justify-end">
                      <Button variant="link" type="button" onClick={() => setIsForgotPassword(true)} className="px-0 py-0 h-auto text-xs text-muted-foreground">
                        Forgot Password?
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : (otpStep !== "none" ? "Verify Code" : isForgotPassword ? "Send Reset Code" : (isSignUp ? "Create Account" : "Sign In"))}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard"
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {otpStep !== "none" ? (
            <Button variant="link" type="button" onClick={() => { setOtpStep("none"); setOtp(""); }} className="text-sm text-muted-foreground">
              Back to Login
            </Button>
          ) : isForgotPassword ? (
            <Button variant="link" type="button" onClick={() => setIsForgotPassword(false)} className="text-sm text-muted-foreground">
              Back to Login
            </Button>
          ) : (
            <Button variant="link" type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardStaggerWrapper, FadeInCard } from "@/components/DashboardCharts";
import { User, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // OTP Modal State
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpAction, setOtpAction] = useState<"profile" | "password" | "2fa-enable" | "2fa-disable">("profile");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(session?.user?.twoFactorEnabled || false);

  if (isPending) return <div className="p-8">Loading settings...</div>;
  if (!session) return <div className="p-8">Not authenticated</div>;

  const role = session.user.role || "Fleet Manager";

  const requestOtp = async (action: typeof otpAction) => {
    setLoading(true);
    setError("");
    setSuccess("");
    setOtpAction(action);

    try {
      if (action === "profile") {
        await authClient.emailOtp.sendVerificationOtp({ email: session.user.email, type: "email-verification" });
      } else if (action === "password") {
        await authClient.emailOtp.sendVerificationOtp({ email: session.user.email, type: "forget-password" });
      } else if (action === "2fa-enable" || action === "2fa-disable") {
        await authClient.twoFactor.sendOtp();
      }
      setOtp("");
      setOtpModalOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === session.user.name) return; // No change
    requestOtp("profile");
  };

  const verifyOtpAndExecute = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (otpAction === "profile") {
        const { error: verifyErr } = await authClient.emailOtp.verifyEmail({ email: session.user.email, otp });
        if (verifyErr) throw verifyErr;

        const { error: updateErr } = await authClient.updateUser({ name });
        if (updateErr) throw updateErr;
        setSuccess("Profile updated successfully!");
      } 
      else if (otpAction === "password") {
        const { error: passErr } = await authClient.emailOtp.resetPassword({ email: session.user.email, otp, password: newPassword });
        if (passErr) throw passErr;
        setSuccess("Password updated successfully!");
        setNewPassword("");
      }
      else if (otpAction === "2fa-enable") {
        // verify OTP for enabling 2FA (custom integration might require different endpoint)
        const { error: twoFaErr } = await authClient.twoFactor.enable({ password: otp }); 
        // if this fails, we can fall back to general setting update if better-auth 2FA API is strict
        if (twoFaErr) throw twoFaErr;
        setTwoFactorEnabled(true);
        setSuccess("Two-Factor Authentication enabled!");
      }
      else if (otpAction === "2fa-disable") {
        const { error: twoFaErr } = await authClient.twoFactor.disable({ password: otp });
        if (twoFaErr) throw twoFaErr;
        setTwoFactorEnabled(false);
        setSuccess("Two-Factor Authentication disabled.");
      }

      setOtpModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "OTP Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <DashboardStaggerWrapper>
        <div className="grid gap-6 md:grid-cols-2">
          <FadeInCard>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Profile Information
                </CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-status-alert bg-status-alert/10 border border-status-alert/20 rounded-md flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 text-sm text-status-success bg-status-success/10 border border-status-success/20 rounded-md flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> {success}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={session.user.email} disabled className="bg-muted/50 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={role} disabled className="bg-muted/50 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name || session.user.name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeInCard>

          <div className="space-y-6">
            <FadeInCard>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="w-5 h-5 text-status-success" /> Account Security
                  </CardTitle>
                  <CardDescription>Manage your security preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-sm">Password</p>
                      <p className="text-xs text-muted-foreground">Change your login password.</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-sm">Two-Factor Auth</p>
                      <p className="text-xs text-muted-foreground">{twoFactorEnabled ? "2FA is enabled." : "Secure your account."}</p>
                    </div>
                    <Button 
                      variant={twoFactorEnabled ? "destructive" : "outline"} 
                      size="sm"
                      onClick={() => requestOtp(twoFactorEnabled ? "2fa-disable" : "2fa-enable")}
                      disabled={loading}
                    >
                      {twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                  {!twoFactorEnabled && (
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="w-full">
                        <p className="font-medium text-sm mb-2">Change Password</p>
                        <div className="flex gap-2 w-full">
                          <Input 
                            type="password" 
                            placeholder="New Password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="max-w-[200px]"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (!newPassword) return setError("Please enter a new password first");
                              requestOtp("password");
                            }}
                            disabled={loading || !newPassword}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeInCard>

            <FadeInCard>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Appearance</CardTitle>
                  <CardDescription>Customize the interface.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-sm">Theme Preference</p>
                      <p className="text-xs text-muted-foreground">Switch between light and dark mode.</p>
                    </div>
                    <div className="w-auto">
                      <ThemeToggle />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>
          </div>
        </div>
      </DashboardStaggerWrapper>

      <Dialog open={otpModalOpen} onOpenChange={setOtpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Required</DialogTitle>
            <DialogDescription>
              To authorize this change, please enter the 6-digit OTP sent to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              type="text" 
              placeholder="Enter OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center tracking-widest text-lg"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpModalOpen(false)}>Cancel</Button>
            <Button onClick={verifyOtpAndExecute} disabled={loading || otp.length < 6}>
              {loading ? "Verifying..." : "Verify & Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

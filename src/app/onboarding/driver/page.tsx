"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { createDriver } from "@/actions/drivers";
import { authClient } from "@/lib/auth-client";

export default function DriverOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = authClient.useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      // We must append the user's name to the form data because createDriver expects it
      formData.append("name", session?.user?.name || "Unknown Driver");
      
      const res = await createDriver(formData);
      
      if (!res.success) {
        throw new Error(res.error || "Failed to create driver profile");
      }
      
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Truck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Complete Your Profile</CardTitle>
          <CardDescription>
            As a driver, we need a few more details before you can access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-destructive text-center font-medium">{error}</div>}
            
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

            <Button type="submit" className="w-full mt-4" disabled={loading || !session}>
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

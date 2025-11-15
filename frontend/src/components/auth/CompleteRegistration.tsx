import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "@/services/context/auth";

export const CompleteRegistration: React.FC = () => {
  const [role, setRole] = useState<"ADMIN" | "MANAGER" | "MEMBER">("MEMBER");
  const [teamId, setTeamId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    email: string;
    name: string;
  } | null>(null);

  const { backendRegister } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const pendingRegistration = localStorage.getItem("pendingRegistration");
  //   if (!pendingRegistration) {
  //     navigate("/register");
  //     return;
  //   }
  //   setUserData(JSON.parse(pendingRegistration));
  // }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!userData) {
      setError("User data not found");
      setLoading(false);
      return;
    }

    try {
      await backendRegister({
        email: userData.email,
        name: userData.name,
        role,
        teamId: teamId || undefined,
      });
      navigate("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to complete registration"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Registration</CardTitle>
        <CardDescription>Complete your account setup</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={userData.email} disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={userData.name} disabled />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select
              value={role}
              onValueChange={(value: "ADMIN" | "MANAGER" | "MEMBER") =>
                setRole(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="teamId" className="text-sm font-medium">
              Team ID (Optional)
            </label>
            <Input
              id="teamId"
              type="text"
              placeholder="Enter team ID if you have one"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Completing registration..." : "Complete Registration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

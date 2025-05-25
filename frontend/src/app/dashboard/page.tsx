"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth/AuthContext";
import Image from "next/image";
import Navbar from "../components/shared/Navbar";

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setProfile(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [status, session]);

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }
  if (!profile) {
    return null;
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-bold mb-2">My Profile</CardTitle>
          <div className="w-28 h-28 mb-2 relative">
            <Image
              src={profile.profileImage || "/api/placeholder/200/200"}
              alt="Profile"
              fill
              className="rounded-full object-cover border"
            />
          </div>
          <div className="text-lg font-semibold">{profile.name}</div>
          <div className="text-gray-600">{profile.email}</div>
          <div className="mt-1 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium inline-block">
            {profile.role?.toUpperCase()}
          </div>
        </CardHeader>
        <CardContent>
          {profile.role === "student" && (
            <div className="space-y-2">
              <div><span className="font-medium">Student ID:</span> {profile.studentId || "-"}</div>
            </div>
          )}
          {profile.role === "mentor" && (
            <div className="space-y-2">
              <div><span className="font-medium">Expertise:</span> {profile.expertise?.join(", ")}</div>
              <div><span className="font-medium">Qualifications:</span> {profile.qualifications?.join(", ")}</div>
              <div><span className="font-medium">Institution:</span> {profile.institution}</div>
              <div><span className="font-medium">Hourly Rate:</span> ${profile.hourlyRate}</div>
              <div><span className="font-medium">Description:</span> {profile.description}</div>
              <div><span className="font-medium">Rating:</span> {profile.rating ?? 0}</div>
              <div><span className="font-medium">Students Mentored:</span> {profile.studentsmentored ?? 0}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default DashboardPage; 
"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import config from "../../lib/config";

const WorkspacePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let tabWindow: Window | null = null;
  
  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        const { email } = user;
        const url = `${config.simUi.baseURL}/workspace?email=${encodeURIComponent(email)}`;

        // Open a new tab if not already opened, otherwise focus on the existing tab
        if (!tabWindow || tabWindow.closed) {
          tabWindow = window.open(url, '_blank');
        } else {
          tabWindow.focus();
        }

        // Redirect the current page to /dashboard
        window.location.href = "/dashboard";

      } else {
        throw new Error("Missing email or password from API");
      }
    } catch (err: any) {
      console.error("Error fetching workspace credentials:", err);
      setError(
        err?.message ||
        "Something went wrong while redirecting. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader text="Redirecting to sim workspace..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  return null;
};

export default WorkspacePage;

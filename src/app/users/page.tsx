"use client";

import UsersPage from "@/templates/UsersPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Users() {
    return (
        <ProtectedRoute>
            <UsersPage />
        </ProtectedRoute>
    );
}
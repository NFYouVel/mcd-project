// src/pages/ResetPasswordPage.tsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { authService } from "../services/authServices";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [token, setToken] = useState(searchParams.get("token") || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            setSuccess("Password reset successful. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Reset Password</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Reset Token</label>
                    <input
                        type="text"
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        style={styles.input}
                    />

                    <label style={styles.label}>New Password</label>
                    <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={styles.input}
                    />

                    <label style={styles.label}>Confirm New Password</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                    />

                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <Link to="/login" style={styles.backLink}>
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFC72C 0%, #DA291C 100%)",
        fontFamily: "system-ui, sans-serif",
    },
    card: {
        background: "#fff",
        padding: 40,
        borderRadius: 12,
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },
    title: {
        margin: "0 0 20px",
        color: "#DA291C",
        textAlign: "center",
        fontSize: 24,
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 6,
        color: "#333",
    },
    input: {
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
        marginBottom: 12,
    },
    button: {
        padding: 12,
        background: "#DA291C",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontWeight: 600,
        cursor: "pointer",
        marginTop: 6,
    },
    error: {
        background: "#fee",
        color: "#c33",
        padding: 10,
        borderRadius: 6,
        fontSize: 13,
        marginBottom: 10,
    },
    success: {
        background: "#e8f5e9",
        color: "#2e7d32",
        padding: 10,
        borderRadius: 6,
        fontSize: 13,
        marginBottom: 10,
    },
    backLink: {
        display: "block",
        textAlign: "center",
        marginTop: 14,
        color: "#666",
        textDecoration: "none",
        fontSize: 13,
    },
};

export default ResetPasswordPage;
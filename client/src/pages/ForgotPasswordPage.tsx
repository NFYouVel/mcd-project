// src/pages/ForgetPasswordPage.tsx
import { useState } from "react";
import { Link } from "react-router";
import { authService } from "../services/authServices";

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setResetToken("");

        try {
            const data = await authService.forgetPassword(email);
            setMessage(data.message || "Reset token sent");
            // Untuk keperluan demo (di production token dikirim via email)
            if (data.resetToken) {
                setResetToken(data.resetToken);
            }
        } catch (err: any) {
            setMessage(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Forgot Password</h1>
                <p style={styles.subtitle}>Enter your email to get reset token</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Sending..." : "Send Reset Token"}
                    </button>
                </form>

                {message && <div style={styles.message}>{message}</div>}

                {resetToken && (
                    <div style={styles.tokenBox}>
                        <strong>Demo Reset Token:</strong>
                        <code style={styles.code}>{resetToken}</code>
                        <Link to={`/reset-password?token=${resetToken}`} style={styles.tokenLink}>
                            Click here to reset password
                        </Link>
                    </div>
                )}

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
        margin: 0,
        color: "#DA291C",
        textAlign: "center",
        fontSize: 24,
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: 20,
        fontSize: 14,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    input: {
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
    },
    button: {
        padding: 12,
        background: "#DA291C",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontWeight: 600,
        cursor: "pointer",
    },
    message: {
        marginTop: 14,
        padding: 10,
        background: "#e8f5e9",
        color: "#2e7d32",
        borderRadius: 6,
        fontSize: 13,
    },
    tokenBox: {
        marginTop: 14,
        padding: 12,
        background: "#fff8e1",
        borderRadius: 6,
        fontSize: 13,
    },
    code: {
        display: "block",
        background: "#fff",
        padding: 8,
        margin: "8px 0",
        borderRadius: 4,
        wordBreak: "break-all",
        fontSize: 11,
    },
    tokenLink: {
        color: "#DA291C",
        fontWeight: 600,
        textDecoration: "none",
        display: "block",
        marginTop: 6,
    },
    backLink: {
        display: "block",
        textAlign: "center",
        marginTop: 18,
        color: "#666",
        textDecoration: "none",
        fontSize: 13,
    },
};

export default ForgetPasswordPage;
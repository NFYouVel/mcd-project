// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { authService } from "../services/authServices";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            const role = data.user.role;

            if (role === "manager") {
                navigate("/admin");
            } else if (role === "cashier") {
                navigate("/cashier/orders");
            } else {
                navigate("/employee")
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>MCD Admin</h1>
                <p style={styles.subtitle}>Sign in to your account</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="admin@mcd.com"
                    />

                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="Password"
                    />

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <Link to="/forget-password" style={styles.link}>
                        Forgot password?
                    </Link>
                </form>
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
        padding: "40px",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: 400,
    },
    title: {
        margin: 0,
        fontSize: 28,
        color: "#DA291C",
        textAlign: "center",
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: 24,
        fontSize: 14,
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
        fontSize: 14,
        border: "1px solid #ddd",
        borderRadius: 6,
        marginBottom: 14,
        outline: "none",
    },
    button: {
        padding: "12px",
        background: "#DA291C",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        marginTop: 8,
    },
    link: {
        textAlign: "center",
        marginTop: 14,
        color: "#DA291C",
        textDecoration: "none",
        fontSize: 13,
    },
    error: {
        background: "#fee",
        color: "#c33",
        padding: 10,
        borderRadius: 6,
        fontSize: 13,
        marginBottom: 10,
    },
};

export default LoginPage;
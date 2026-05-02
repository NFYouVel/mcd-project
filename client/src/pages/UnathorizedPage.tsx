// src/pages/UnauthorizedPage.tsx
import { Link } from "react-router";

const UnauthorizedPage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1 style={styles.code}>403</h1>
                <h2 style={styles.title}>Unauthorized</h2>
                <p style={styles.text}>You don't have permission to access this page</p>
                <Link to="/" style={styles.link}>Back to Login</Link>
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
        background: "#f5f5f5",
        fontFamily: "system-ui, sans-serif",
    },
    box: {
        background: "#fff",
        padding: 40,
        borderRadius: 12,
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    code: { fontSize: 72, margin: 0, color: "#DA291C" },
    title: { margin: "8px 0", color: "#333" },
    text: { color: "#666", marginBottom: 20 },
    link: {
        color: "#DA291C",
        fontWeight: 600,
        textDecoration: "none",
    },
};

export default UnauthorizedPage;
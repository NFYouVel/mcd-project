import { Link } from "react-router";

export default function MainMenu() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome to McD Manager 👋</h1>
          <p className="page-subtitle">Pilih menu di sidebar untuk mulai mengelola.</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 16 }}>🚀 Quick Start</h2>
        <p style={{ marginBottom: 16, color: "#525252" }}>
          Mulai dengan setup hierarki menu lo:
        </p>
        <ol style={{ paddingLeft: 20, lineHeight: 2, color: "#525252" }}>
          <li>Buat <strong>Type</strong> dulu (Promotion / Heavy / Light)</li>
          <li>Tambah <strong>Section</strong> dibawah Type (e.g. Burger)</li>
          <li>Buat <strong>Filter</strong> di Section (e.g. Beef, Chicken)</li>
          <li>Tambah <strong>Menu</strong> ke Filter (e.g. Big Mac)</li>
        </ol>

        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          <Link to="/menu/dashboard" className="btn btn-primary">📊 Lihat Dashboard</Link>
          <Link to="/menu/types" className="btn btn-yellow">🏷️ Mulai Setup</Link>
        </div>
      </div>
    </div>
  );
}
export const StatCard = ({ title, value, isCurrency = false }) => (
    <div className="stat-card">
      <h3>{title}</h3>
      <p className="stat-value">
        {isCurrency ? `₹${value.toLocaleString()}` : value}
      </p>
    </div>
  );
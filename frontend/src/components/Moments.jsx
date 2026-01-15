function Moments() {
  return (
    <div className="moments">
      <header>
        <h1>Tea Moments</h1>
        <p className="count">0 memories</p>
      </header>

      <div className="empty-state">
        <div className="empty-icon">📷</div>
        <h2>No moments yet</h2>
        <p>Capture special tea moments with friends and family</p>
      </div>

      <button className="fab">➕</button>
    </div>
  );
}

export default Moments;

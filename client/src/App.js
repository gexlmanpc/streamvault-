import React, { useState } from 'react';

const styles = {
  app: { background: '#141414', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' },
  nav: { background: 'linear-gradient(to bottom, #000 0%, transparent 100%)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 100 },
  logo: { color: '#E50914', fontSize: '2rem', fontWeight: 'bold', letterSpacing: '2px' },
  hero: { background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #141414), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600) center/cover', height: '100vh', display: 'flex', alignItems: 'center', padding: '0 40px' },
  heroText: { maxWidth: '600px' },
  heroTitle: { fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' },
  heroDesc: { fontSize: '1.2rem', marginBottom: '30px', color: '#ddd' },
  btn: { background: '#E50914', color: 'white', border: 'none', padding: '15px 30px', fontSize: '1.1rem', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' },
  btnOutline: { background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '15px 30px', fontSize: '1.1rem', borderRadius: '5px', cursor: 'pointer' },
  section: { padding: '40px' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' },
  card: { borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s', background: '#1a1a1a' },
  cardImg: { width: '100%', height: '130px', objectFit: 'cover', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' },
  cardInfo: { padding: '12px' },
  cardTitle: { fontWeight: 'bold', marginBottom: '5px' },
  cardMeta: { color: '#aaa', fontSize: '0.85rem' },
  modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { background: '#1a1a1a', borderRadius: '12px', padding: '40px', width: '400px', maxWidth: '90%' },
  input: { width: '100%', padding: '15px', background: '#333', border: 'none', borderRadius: '5px', color: 'white', fontSize: '1rem', marginBottom: '15px', boxSizing: 'border-box' },
  modalTitle: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px' },
  closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', float: 'right' },
};

const fakeVideos = [
  { id: 1, title: 'فيلم الأكشن', genre: 'أكشن', emoji: '💥', year: 2024 },
  { id: 2, title: 'مسلسل الدراما', genre: 'دراما', emoji: '🎭', year: 2024 },
  { id: 3, title: 'فيلم الرعب', genre: 'رعب', emoji: '👻', year: 2023 },
  { id: 4, title: 'كوميديا', genre: 'كوميديا', emoji: '😂', year: 2024 },
  { id: 5, title: 'وثائقي', genre: 'وثائقي', emoji: '🌍', year: 2023 },
  { id: 6, title: 'خيال علمي', genre: 'خيال علمي', emoji: '🚀', year: 2024 },
];

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [videos, setVideos] = useState(fakeVideos);

  const handleLogin = () => {
    if (email && password) {
      setUser({ name: email.split('@')[0] });
      setShowLogin(false);
    }
  };

  const handleUpload = () => {
    if (uploadTitle) {
      setVideos([...videos, { id: videos.length + 1, title: uploadTitle, genre: 'جديد', emoji: '🎬', year: 2024 }]);
      setUploadTitle('');
      setShowUpload(false);
    }
  };

  return (
    <div style={styles.app}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo}>🎬 StreamVault</div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '20px' }}>مرحباً {user.name} 👋</span>
              <button style={styles.btn} onClick={() => setShowUpload(true)}>رفع فيديو</button>
              <button style={{ ...styles.btn, background: '#555', marginRight: '10px' }} onClick={() => setUser(null)}>خروج</button>
            </>
          ) : (
            <button style={styles.btn} onClick={() => setShowLogin(true)}>تسجيل الدخول</button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>أفلام ومسلسلات بلا حدود 🎬</h1>
          <p style={styles.heroDesc}>شاهد أفضل الأفلام والمسلسلات في أي وقت وأي مكان</p>
          <button style={styles.btnOutline} onClick={() => setShowLogin(true)}>▶ ابدأ المشاهدة</button>
          <button style={{ ...styles.btn, marginRight: '10px' }}>+ قائمتي</button>
        </div>
      </div>

      {/* Videos */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🔥 الأكثر مشاهدة</div>
        <div style={styles.grid}>
          {videos.map(v => (
            <div key={v.id} style={styles.card} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ ...styles.cardImg, fontSize: '4rem', textAlign: 'center', lineHeight: '130px' }}>{v.emoji}</div>
              <div style={styles.cardInfo}>
                <div style={styles.cardTitle}>{v.title}</div>
                <div style={styles.cardMeta}>{v.genre} • {v.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div style={styles.modal} onClick={() => setShowLogin(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowLogin(false)}>✕</button>
            <h2 style={styles.modalTitle}>تسجيل الدخول</h2>
            <input style={styles.input} placeholder="الإيميل" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)} />
            <button style={{ ...styles.btn, width: '100%', marginLeft: 0 }} onClick={handleLogin}>دخول</button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div style={styles.modal} onClick={() => setShowUpload(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowUpload(false)}>✕</button>
            <h2 style={styles.modalTitle}>رفع فيديو جديد 🎬</h2>
            <input style={styles.input} placeholder="اسم الفيديو" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} />
            <button style={{ ...styles.btn, width: '100%', marginLeft: 0 }} onClick={handleUpload}>رفع ✅</button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'https://streamvault-7us0.onrender.com/api';

const styles = {
  app: { background: '#141414', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' },
  nav: { background: 'linear-gradient(to bottom, #000 0%, transparent 100%)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 100 },
  logo: { color: '#E50914', fontSize: '2rem', fontWeight: 'bold' },
  hero: { background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), #141414), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600) center/cover', height: '100vh', display: 'flex', alignItems: 'center', padding: '0 40px' },
  heroContent: { maxWidth: '600px' },
  heroTitle: { fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' },
  heroDesc: { fontSize: '1.2rem', marginBottom: '30px', color: '#ddd' },
  btn: { background: '#E50914', color: 'white', border: 'none', padding: '15px 30px', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' },
  btnGray: { background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '15px 30px', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer' },
  section: { padding: '40px' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' },
  card: { borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s', background: '#1a1a1a', position: 'relative' },
  cardThumb: { width: '100%', height: '140px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', position: 'relative' },
  playOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s', fontSize: '3rem' },
  cardInfo: { padding: '12px' },
  cardTitle: { fontWeight: 'bold', marginBottom: '5px' },
  cardMeta: { color: '#aaa', fontSize: '0.85rem' },
  modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { background: '#1a1a1a', borderRadius: '12px', padding: '40px', width: '450px', maxWidth: '90%' },
  input: { width: '100%', padding: '15px', background: '#333', border: 'none', borderRadius: '5px', color: 'white', fontSize: '1rem', marginBottom: '15px', boxSizing: 'border-box' },
  modalTitle: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px' },
  closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', float: 'right' },
};

const defaultVideos = [
  { id: 1, title: 'فيلم الأكشن', genre: 'أكشن', emoji: '💥', year: 2024, url: 'https://www.youtube.com/embed/c-yWvmsvMF8' },
  { id: 2, title: 'مسلسل الدراما', genre: 'دراما', emoji: '🎭', year: 2024, url: null },
  { id: 3, title: 'فيلم الرعب', genre: 'رعب', emoji: '👻', year: 2023, url: null },
];

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPlayer, setShowPlayer] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [videos, setVideos] = useState(defaultVideos);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadGenre, setUploadGenre] = useState('أكشن');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadEmoji, setUploadEmoji] = useState('🎬');
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (data.token) { setUser(data.user); setToken(data.token); setShowLogin(false); setEmail(''); setPassword(''); }
      else setError(data.message || 'خطأ في تسجيل الدخول');
    } catch { setError('تعذر الاتصال بالسيرفر'); }
  };

  const handleRegister = async () => {
    setError('');
    try {
      const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) });
      const data = await res.json();
      if (data.token) { setUser(data.user); setToken(data.token); setShowRegister(false); setEmail(''); setPassword(''); setUsername(''); }
      else setError(data.message || 'خطأ في التسجيل');
    } catch { setError('تعذر الاتصال بالسيرفر'); }
  };

  const handleUpload = () => {
    if (!uploadTitle || !uploadUrl) { setError('أدخل العنوان والرابط'); return; }
    let embedUrl = uploadUrl;
    if (uploadUrl.includes('youtube.com/watch?v=')) embedUrl = uploadUrl.replace('watch?v=', 'embed/');
    if (uploadUrl.includes('youtu.be/')) embedUrl = uploadUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    setVideos([...videos, { id: videos.length + 1, title: uploadTitle, genre: uploadGenre, emoji: uploadEmoji, year: new Date().getFullYear(), url: embedUrl }]);
    setUploadTitle(''); setUploadUrl(''); setUploadEmoji('🎬'); setShowUpload(false); setError('');
  };

  return (
    <div style={styles.app}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo}>🎬 StreamVault</div>
        <div>
          {user ? (
            <>
              <span style={{ marginLeft: '20px' }}>👋 {user.username}</span>
              <button style={styles.btn} onClick={() => setShowUpload(true)}>+ أضف فيديو</button>
              <button style={{ ...styles.btn, background: '#555' }} onClick={() => { setUser(null); setToken(null); }}>خروج</button>
            </>
          ) : (
            <>
              <button style={styles.btnGray} onClick={() => setShowRegister(true)}>إنشاء حساب</button>
              <button style={styles.btn} onClick={() => setShowLogin(true)}>دخول</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>أفلام ومسلسلات بلا حدود 🎬</h1>
          <p style={styles.heroDesc}>شاهد أفضل المحتوى في أي وقت وأي مكان — مجاناً</p>
          <button style={styles.btnGray} onClick={() => document.getElementById('videos').scrollIntoView({ behavior: 'smooth' })}>▶ شاهد الآن</button>
          {!user && <button style={styles.btn} onClick={() => setShowRegister(true)}>سجّل مجاناً</button>}
        </div>
      </div>

      {/* Videos Section */}
      <div style={styles.section} id="videos">
        <div style={styles.sectionTitle}>🔥 الأفلام والمسلسلات</div>
        <div style={styles.grid}>
          {videos.map(v => (
            <div key={v.id} style={styles.card}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; setHoveredCard(v.id); }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; setHoveredCard(null); }}
              onClick={() => v.url ? setShowPlayer(v) : setShowLogin(true)}>
              <div style={styles.cardThumb}>
                {v.emoji}
                <div style={{ ...styles.playOverlay, opacity: hoveredCard === v.id ? 1 : 0 }}>▶</div>
              </div>
              <div style={styles.cardInfo}>
                <div style={styles.cardTitle}>{v.title}</div>
                <div style={styles.cardMeta}>{v.genre} • {v.year}</div>
                {v.url && <div style={{ color: '#E50914', fontSize: '0.8rem', marginTop: '5px' }}>▶ شاهد الآن</div>}
              </div>
            </div>
          ))}
          {/* زر إضافة فيديو */}
          {user && (
            <div style={{ ...styles.card, border: '2px dashed #555', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}
              onClick={() => setShowUpload(true)}>
              <div style={{ textAlign: 'center', color: '#555' }}>
                <div style={{ fontSize: '3rem' }}>+</div>
                <div>أضف فيديو</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Player */}
      {showPlayer && (
        <div style={styles.modal} onClick={() => setShowPlayer(null)}>
          <div style={{ background: '#000', borderRadius: '12px', padding: '20px', width: '85%', maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>{showPlayer.title}</h3>
              <button style={styles.closeBtn} onClick={() => setShowPlayer(null)}>✕</button>
            </div>
            <iframe src={showPlayer.url} style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }} allowFullScreen title={showPlayer.title} />
          </div>
        </div>
      )}

      {/* Login */}
      {showLogin && (
        <div style={styles.modal} onClick={() => setShowLogin(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowLogin(false)}>✕</button>
            <h2 style={styles.modalTitle}>تسجيل الدخول</h2>
            {error && <p style={{ color: '#E50914', marginBottom: '10px' }}>{error}</p>}
            <input style={styles.input} placeholder="الإيميل" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)} />
            <button style={{ ...styles.btn, width: '100%', marginLeft: 0 }} onClick={handleLogin}>دخول</button>
            <p style={{ marginTop: '15px', color: '#aaa', textAlign: 'center' }}>ما عندك حساب؟ <span style={{ color: '#E50914', cursor: 'pointer' }} onClick={() => { setShowLogin(false); setShowRegister(true); }}>سجّل الآن</span></p>
          </div>
        </div>
      )}

      {/* Register */}
      {showRegister && (
        <div style={styles.modal} onClick={() => setShowRegister(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowRegister(false)}>✕</button>
            <h2 style={styles.modalTitle}>إنشاء حساب جديد</h2>
            {error && <p style={{ color: '#E50914', marginBottom: '10px' }}>{error}</p>}
            <input style={styles.input} placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} />
            <input style={styles.input} placeholder="الإيميل" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)} />
            <button style={{ ...styles.btn, width: '100%', marginLeft: 0 }} onClick={handleRegister}>إنشاء حساب</button>
          </div>
        </div>
      )}

      {/* Upload */}
      {showUpload && (
        <div style={styles.modal} onClick={() => setShowUpload(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowUpload(false)}>✕</button>
            <h2 style={styles.modalTitle}>🎬 إضافة فيديو</h2>
            {error && <p style={{ color: '#E50914', marginBottom: '10px' }}>{error}</p>}
            <input style={styles.input} placeholder="عنوان الفيديو" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} />
            <select style={{ ...styles.input, cursor: 'pointer' }} value={uploadGenre} onChange={e => setUploadGenre(e.target.value)}>
              <option>أكشن</option><option>دراما</option><option>كوميديا</option><option>رعب</option><option>وثائقي</option><option>خيال علمي</option>
            </select>
            <input style={styles.input} placeholder="إيموجي (مثال: 🎬)" value={uploadEmoji} onChange={e => setUploadEmoji(e.target.value)} />
            <input style={styles.input} placeholder="رابط YouTube أو أي رابط embed" value={uploadUrl} onChange={e => setUploadUrl(e.target.value)} />
            <button style={{ ...styles.btn, width: '100%', marginLeft: 0 }} onClick={handleUpload}>✅ إضافة للموقع</button>
          </div>
        </div>
      )}
    </div>
  );
}

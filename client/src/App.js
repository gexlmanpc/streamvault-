import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'https://streamvault-7us0.onrender.com/api';

const styles = {
  app: { background: '#141414', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' },
  nav: { background: 'linear-gradient(to bottom, #000 0%, transparent 100%)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 100 },
  logo: { color: '#E50914', fontSize: '2rem', fontWeight: 'bold' },
  hero: { background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #141414), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600) center/cover', height: '100vh', display: 'flex', alignItems: 'center', padding: '0 40px' },
  heroTitle: { fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' },
  heroDesc: { fontSize: '1.2rem', marginBottom: '30px', color: '#ddd' },
  btn: { background: '#E50914', color: 'white', border: 'none', padding: '15px 30px', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' },
  btnGray: { background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '15px 30px', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer' },
  section: { padding: '40px' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' },
  card: { borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s', background: '#1a1a1a' },
  cardImg: { width: '100%', height: '130px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' },
  cardInfo: { padding: '12px' },
  cardTitle: { fontWeight: 'bold', marginBottom: '5px' },
  cardMeta: { color: '#aaa', fontSize: '0.85rem' },
  modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { background: '#1a1a1a', borderRadius: '12px', padding: '40px', width: '450px', maxWidth: '90%' },
  input: { width: '100%', padding: '15px', background: '#333', border: 'none', borderRadius: '5px', color: 'white', fontSize: '1rem', marginBottom: '15px', boxSizing: 'border-box' },
  modalTitle: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px' },
  closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', float: 'right' },
  progress: { background: '#E50914', height: '5px', borderRadius: '5px', transition: 'width 0.3s', marginBottom: '15px' },
  fileLabel: { display: 'block', padding: '15px', background: '#333', borderRadius: '5px', textAlign: 'center', cursor: 'pointer', marginBottom: '15px', border: '2px dashed #555' },
};

const defaultVideos = [
  { id: 1, title: 'فيلم الأكشن', genre: 'أكشن', emoji: '💥', year: 2024, url: null },
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
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        setUser(data.user);
        setToken(data.token);
        setShowLogin(false);
        setEmail(''); setPassword('');
      } else {
        setError(data.message || 'خطأ في تسجيل الدخول');
      }
    } catch {
      setError('تعذر الاتصال بالسيرفر');
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.token) {
        setUser(data.user);
        setToken(data.token);
        setShowRegister(false);
        setEmail(''); setPassword(''); setUsername('');
      } else {
        setError(data.message || 'خطأ في التسجيل');
      }
    } catch {
      setError('تعذر الاتصال بالسيرفر');
    }
  };

  const handleUpload = async () => {
    if (!uploadTitle || !videoFile) { setError('أدخل العنوان واختر ملف فيديو'); return; }
    setUploading(true); setUploadProgress(10); setError('');
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('type', 'movie');
      formData.append('genre', JSON.stringify([uploadGenre]));
      formData.append('video', videoFile);
      if (thumbFile) formData.append('thumbnail', thumbFile);

      setUploadProgress(40);
      const res = await fetch(`${API}/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setUploadProgress(90);
      const data = await res.json();
      if (data.data) {
        setVideos([...videos, { id: data.data._id, title: data.data.title, genre: uploadGenre, emoji: '🎬', year: 2024, url: data.data.videoUrl }]);
        setShowUpload(false);
        setUploadTitle(''); setVideoFile(null); setThumbFile(null);
        setUploadProgress(100);
      } else {
        setError(data.message || 'فشل الرفع');
      }
    } catch {
      setError('تعذر رفع الفيديو');
    }
    setUploading(false);
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
              <button style={styles.btn} onClick={() => setShowUpload(true)}>+ رفع فيديو</button>
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
        <div style={{ maxWidth: '600px' }}>
          <h1 style={styles.heroTitle}>أفلام ومسلسلات بلا حدود 🎬</h1>
          <p style={styles.heroDesc}>شاهد أفضل المحتوى في أي وقت وأي مكان</p>
          <button style={styles.btnGray} onClick={() => setShowLogin(true)}>▶ ابدأ المشاهدة</button>
          {user && <button style={{ ...styles.btn }} onClick={() => setShowUpload(true)}>+ ارفع فيديو</button>}
        </div>
      </div>

      {/* Videos Grid */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🔥 الأفلام والمسلسلات</div>
        <div style={styles.grid}>
          {videos.map(v => (
            <div key={v.id} style={styles.card}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => v.url && setShowPlayer(v)}>
              <div style={styles.cardImg}>{v.emoji}</div>
              <div style={styles.cardInfo}>
                <div style={styles.cardTitle}>{v.title}</div>
                <div style={styles.cardMeta}>{v.genre} • {v.year}</div>
                {v.url && <div style={{ color: '#E50914', fontSize: '0.8rem', marginTop: '5px' }}>▶ شاهد الآن</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player */}
      {showPlayer && (
        <div style={styles.modal} onClick={() => setShowPlayer(null)}>
          <div style={{ ...styles.modalBox, width: '800px', background: '#000' }} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowPlayer(null)}>✕</button>
            <h3 style={{ marginBottom: '15px' }}>{showPlayer.title}</h3>
            <video src={showPlayer.url} controls style={{ width: '100%', borderRadius: '8px' }} autoPlay />
          </div>
        </div>
      )}

      {/* Login Modal */}
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

      {/* Register Modal */}
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

      {/* Upload Modal */}
      {showUpload && (
        <div style={styles.modal} onClick={() => setShowUpload(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowUpload(false)}>✕</button>
            <h2 style={styles.modalTitle}>🎬 رفع فيديو جديد</h2>
            {error && <p style={{ color: '#E50914', marginBottom: '10px' }}>{error}</p>}
            <input style={styles.input} placeholder="عنوان الفيديو" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} />
            <select style={{ ...styles.input, cursor: 'pointer' }} value={uploadGenre} onChange={e => setUploadGenre(e.target.value)}>
              <option>أكشن</option><option>دراما</option><option>كوميديا</option>
              <option>رعب</option><option>وثائقي</option><option>خيال علمي</option>
            </select>
            <label style={styles.fileLabel}>
              {videoFile ? `✅ ${videoFile.name}` : '📁 اختر ملف الفيديو (MP4)'}
              <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => setVideoFile(e.target.files[0])} />
            </label>
            <label style={styles.fileLabel}>
              {thumbFile ? `✅ ${thumbFile.name}` : '🖼️ اختر صورة مصغرة (اختياري)'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setThumbFile(e.target.files[0])} />
            </label>
            {uploading && <div style={{ background: '#333', borderRadius: '5px', marginBottom: '15px' }}><div style={{ ...styles.progress, width: `${uploadProgress}%` }} /></div>}
            <button style={{ ...styles.btn, width: '100%', marginLeft: 0, opacity: uploading ? 0.6 : 1 }} onClick={handleUpload} disabled={uploading}>
              {uploading ? `⏳ جاري الرفع ${uploadProgress}%` : '⬆️ رفع الفيديو'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

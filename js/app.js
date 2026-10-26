// ===== CONFIGURAÇÃO: cole aqui os dados do seu projeto Supabase =====
const SUPABASE_URL = 'https://ozfbsiptlhcedpzgzzmx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZmJzaXB0bGhjZWRwemd6em14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMDU5ODYsImV4cCI6MjEwODU4MTk4Nn0.bKom-tFsqo8s_fELM6vhizie3wYm4l0QdCZcW9o1mNY';
// ====================================================================
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = 'fotos';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtData = d => d.split('-').reverse().join('/');

function toast(t, erro) {
  let m = $('#msg'); if (!m) { m = document.createElement('div'); m.id = 'msg'; document.body.append(m); }
  m.textContent = t; m.className = erro ? 'err' : ''; m.style.display = 'block';
  clearTimeout(m._t); m._t = setTimeout(() => m.style.display = 'none', 4000);
}

// Exige login e desenha o menu. Use: const sessao = await guard('produtores');
async function guard(pagina) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { location.href = 'index.html'; return null; }
  const links = [['historico','Histórico'],['nova-conferencia','Nova conferência'],['produtores','Produtores']];
  $('#nav').innerHTML = '<b>Conferências</b>' + links.map(([p,t]) =>
    `<a href="${p}.html" class="${p===pagina?'on':''}">${t}</a>`).join('') + '<button id="sair">Sair</button>';
  $('#sair').onclick = async () => { await sb.auth.signOut(); location.href = 'index.html'; };
  return session;
}

// Reduz a foto no navegador (economiza o 1 GB grátis). Notas mantêm mais resolução.
async function comprimir(file, max = 1600, q = 0.75) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(r, 'image/jpeg', q));
}

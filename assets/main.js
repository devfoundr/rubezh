// Мобильное меню
const burger = document.querySelector('.burger');
const mmenu = document.querySelector('.mobile-menu');
if (burger && mmenu) {
  burger.addEventListener('click', () => mmenu.classList.toggle('open'));
  mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mmenu.classList.remove('open')));
}

// Появление блоков при скролле
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Формы (демо — без отправки)
document.querySelectorAll('form[data-demo]').forEach(f => {
  f.addEventListener('submit', e => {
    e.preventDefault();
    const ok = f.querySelector('.form-ok');
    if (ok) { ok.style.display = 'block'; }
    f.querySelectorAll('input,select,button').forEach(el => el.disabled = true);
  });
});

// Маска телефона (простая)
document.querySelectorAll('input[type=tel]').forEach(inp => {
  inp.addEventListener('input', () => {
    let d = inp.value.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10);
    let r = '+7';
    if (d.length) r += ' (' + d.slice(0, 3);
    if (d.length >= 3) r += ') ' + d.slice(3, 6);
    if (d.length >= 6) r += '-' + d.slice(6, 8);
    if (d.length >= 8) r += '-' + d.slice(8, 10);
    inp.value = r;
  });
});

// Калькулятор бетона
const calc = document.querySelector('[data-calc]');
if (calc) {
  const grade = calc.querySelector('[name=grade]');
  const vol = calc.querySelector('[name=volume]');
  const volOut = calc.querySelector('[data-vol]');
  const pump = calc.querySelector('[name=pump]');
  const zoneBtns = calc.querySelectorAll('[data-zone]');
  const km = calc.querySelector('[name=km]');
  const kmField = calc.querySelector('[data-km-field]');
  const out = {
    concrete: calc.querySelector('[data-out=concrete]'),
    delivery: calc.querySelector('[data-out=delivery]'),
    pump: calc.querySelector('[data-out=pump]'),
    total: calc.querySelector('[data-out=total]'),
  };
  const MIXER = 7; // м³ в одном рейсе — уточнить у заказчика
  let zone = 'city';
  const fmt = n => n.toLocaleString('ru-RU') + ' ₽';

  function recalc() {
    const v = +vol.value;
    volOut.textContent = v + ' м³';
    const price = +grade.value;
    const trips = Math.ceil(v / MIXER);
    let perTrip = zone === 'city' ? 3050 : zone === 'district' ? 3560 : 83 * (+km.value || 0);
    const concrete = price * v;
    const delivery = perTrip * trips;
    const pumpCost = pump.checked ? 6100 * 4 : 0;
    out.concrete.textContent = fmt(concrete);
    out.delivery.textContent = fmt(delivery) + ' · ' + trips + ' рейс' + (trips === 1 ? '' : trips < 5 ? 'а' : 'ов');
    out.pump.textContent = pump.checked ? fmt(pumpCost) : '—';
    out.total.textContent = fmt(concrete + delivery + pumpCost);
  }
  zoneBtns.forEach(b => b.addEventListener('click', () => {
    zoneBtns.forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    zone = b.dataset.zone;
    kmField.style.display = zone === 'far' ? 'block' : 'none';
    recalc();
  }));
  [grade, vol, pump, km].forEach(el => el && el.addEventListener('input', recalc));
  recalc();
}

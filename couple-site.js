const params = new URLSearchParams(window.location.search);
const slug = params.get("site");
const sites = JSON.parse(localStorage.getItem("casamentoSites") || "{}");
const site = sites[slug] || {
  couple: "Lívia & Rafael",
  date: "2026-09-20",
  style: "romantic",
  theme: "romantic",
  message: "Vamos celebrar esse dia com as pessoas que amamos.",
  tagline: "Com amor, esperamos você",
  place: "Espaço Jardim das Flores - São Paulo, SP",
  color: "#dd6a73",
  photoShape: "soft",
  showGifts: true,
  showRsvp: true,
  slug: "livia-e-rafael"
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const title = document.querySelector("#couple-title");
const date = document.querySelector("#couple-date");
const message = document.querySelector("#couple-message");
const tagline = document.querySelector("#couple-tagline");
const place = document.querySelector("#couple-place");
const footer = document.querySelector("#couple-footer");
const hero = document.querySelector(".couple-hero");
const heroBg = document.querySelector(".couple-hero-bg");
const storyPhoto = document.querySelector(".story-photo");
const giftGrid = document.querySelector("#couple-gift-grid");
const giftStatus = document.querySelector("#couple-gift-status");
const rsvpForm = document.querySelector("#couple-rsvp-form");
const guestsElement = document.querySelector("#couple-guests");
const noteForm = document.querySelector("#note-form");
const noteList = document.querySelector("#note-list");
const daysLeftElement = document.querySelector("#days-left");
const heroThemeLabel = document.querySelector("#hero-theme-label");
const heroCity = document.querySelector("#hero-city");
const detailDate = document.querySelector("#detail-date");
const detailPlace = document.querySelector("#detail-place");
const detailMood = document.querySelector("#detail-mood");
const detailMoodCopy = document.querySelector("#detail-mood-copy");
const galleryIntro = document.querySelector("#gallery-intro");
const galleryGrid = document.querySelector("#couple-gallery-grid");
const scheduleList = document.querySelector("#schedule-list");

const themeDetails = {
  forest: {
    label: "Floresta elegante",
    mood: "Verde e acolhedor",
    moodCopy: "Um casamento com atmosfera natural, flores, madeira e luz suave.",
    galleryIntro: "Texturas naturais, verde profundo e detalhes florais para uma celebracao cheia de afeto.",
    gallery: [
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=78"
    ],
    schedule: [
      ["15:30", "Recepcao no jardim"],
      ["16:30", "Cerimonia ao ar livre"],
      ["18:00", "Brinde e jantar"],
      ["20:00", "Pista sob as luzes"]
    ]
  },
  classic: {
    label: "Preto e branco",
    mood: "Classico e atemporal",
    moodCopy: "Uma composicao elegante, com contraste, etiqueta e detalhes precisos.",
    galleryIntro: "Retratos sobrios, flores brancas e composicao refinada para um casamento atemporal.",
    gallery: [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=78"
    ],
    schedule: [
      ["17:00", "Boas-vindas"],
      ["18:00", "Cerimonia"],
      ["19:30", "Jantar"],
      ["21:00", "Primeira danca"]
    ]
  },
  photo: {
    label: "Editorial romantico",
    mood: "Leve e cinematografico",
    moodCopy: "Um dia pensado para render lembrancas bonitas, luz natural e cenas espontaneas.",
    galleryIntro: "Paisagem aberta, movimento e um toque editorial para deixar cada momento memoravel.",
    gallery: [
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=78"
    ],
    schedule: [
      ["16:00", "Fotos com familia"],
      ["17:00", "Cerimonia"],
      ["18:30", "Coquetel ao por do sol"],
      ["20:30", "Celebracao"]
    ]
  },
  blush: {
    label: "Minimal delicado",
    mood: "Doce e intimista",
    moodCopy: "Uma celebracao calma, clara e cheia de pequenos detalhes afetivos.",
    galleryIntro: "Tons suaves, mesa posta, flores delicadas e uma atmosfera intimista.",
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=78"
    ],
    schedule: [
      ["10:30", "Cerimonia intimista"],
      ["12:00", "Almoco"],
      ["14:00", "Mesa de doces"],
      ["15:30", "Brinde final"]
    ]
  },
  romantic: {
    label: "Romantico",
    mood: "Afetivo e elegante",
    moodCopy: "Um encontro criado para celebrar o amor com as pessoas mais importantes.",
    galleryIntro: "Uma selecao de imagens para inspirar a celebracao do casal.",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=78",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=78"
    ],
    schedule: [
      ["16:00", "Chegada dos convidados"],
      ["17:00", "Cerimonia"],
      ["18:30", "Recepcao"],
      ["21:00", "Celebracao"]
    ]
  }
};

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function getDaysLeft(value) {
  if (!value) return "--";
  const today = new Date();
  const target = new Date(`${value}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / 86400000);
  return String(Math.max(diff, 0));
}

function getCity(value) {
  if (!value) return "A definir";
  const pieces = value.split("-");
  return (pieces[pieces.length - 1] || value).trim();
}

const requestedThemeKey = site.theme || site.style || "romantic";
const themeKey = themeDetails[requestedThemeKey] ? requestedThemeKey : "romantic";
const theme = themeDetails[themeKey];

document.title = `${site.couple} - Site de casamento`;
document.documentElement.style.setProperty("--blue-300", site.color || "#dd6a73");
document.documentElement.style.setProperty("--blue-400", site.color || "#6a0f23");
document.documentElement.style.setProperty("--blue-500", site.color || "#dd6a73");
title.textContent = site.couple;
date.textContent = formatDate(site.date);
message.textContent = site.message;
tagline.textContent = site.tagline || "";
place.textContent = site.place ? `Local: ${site.place}` : "";
footer.textContent = `${site.couple} - ${formatDate(site.date)}`;
daysLeftElement.textContent = getDaysLeft(site.date);
heroThemeLabel.textContent = theme.label;
heroCity.textContent = getCity(site.place);
detailDate.textContent = formatDate(site.date);
detailPlace.textContent = site.place || "A definir";
detailMood.textContent = theme.mood;
detailMoodCopy.textContent = theme.moodCopy;
galleryIntro.textContent = theme.galleryIntro;
document.body.classList.add(`theme-${themeKey}`);
hero.classList.add(site.style || "romantic", `theme-${themeKey}`);

if (site.heroPhoto) {
  heroBg.style.backgroundImage = `url("${site.heroPhoto}")`;
}

if (site.storyPhoto) {
  storyPhoto.style.backgroundImage = `url("${site.storyPhoto}")`;
}

storyPhoto.classList.add(site.photoShape || "soft");

const galleryImages = site.gallery || [
  site.heroPhoto || theme.gallery[0],
  site.storyPhoto || theme.gallery[1],
  ...theme.gallery
].filter(Boolean).slice(0, 5);

galleryGrid.innerHTML = galleryImages.map((image, index) => `
  <article class="gallery-tile gallery-tile-${index + 1}" style="background-image: url('${image}')">
    <span>${index === 0 ? "Cerimonia" : index === 1 ? "Historia" : "Detalhe"}</span>
  </article>
`).join("");

const schedule = site.schedule || theme.schedule;
scheduleList.innerHTML = schedule.map(([time, label]) => `
  <article class="schedule-item">
    <span>${time}</span>
    <strong>${label}</strong>
  </article>
`).join("");

if (!site.showGifts) {
  document.querySelector('[data-optional-section="gifts"]').classList.add("hidden-section");
  document.querySelector('a[href="#presentes"]')?.classList.add("hidden-section");
}

if (!site.showRsvp) {
  document.querySelector('[data-optional-section="rsvp"]').classList.add("hidden-section");
  document.querySelector('a[href="#rsvp"]')?.classList.add("hidden-section");
  document.querySelector('.couple-hero-content a[href="#rsvp"]')?.classList.add("hidden-section");
}

const gifts = site.gifts || [
  { name: "Jantar romântico", price: 220, icon: "☕" },
  { name: "Passeio na lua de mel", price: 390, icon: "✈" },
  { name: "Cota da casa nova", price: 500, icon: "⌂" },
  { name: "Experiência especial", price: 180, icon: "★" }
];

const catalogGifts = [
  { name: "Noite especial na lua de mel", price: 520, icon: "Lua", description: "Uma diaria charmosa para o casal aproveitar a viagem.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=78" },
  { name: "Jantar romantico a dois", price: 260, icon: "Jantar", description: "Um jantar com vinho, sobremesa e tempo para celebrar.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=78" },
  { name: "Cantinho cafe da manha", price: 340, icon: "Cafe", description: "Para montar uma mesa bonita nos primeiros domingos juntos.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=78" },
  { name: "Passeio de barco", price: 430, icon: "Mar", description: "Uma experiencia leve para guardar na memoria da viagem.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota da casa dos sonhos", price: 650, icon: "Casa", description: "Ajuda simbolica para os primeiros planos do novo lar.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=78" },
  { name: "Brinde ao por do sol", price: 190, icon: "Brinde", description: "Um momento especial para brindar depois do grande dia.", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=78" },
  { name: "Kit panelas premium", price: 780, icon: "Cozinha", description: "Para estrear a casa nova com receitas especiais.", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=700&q=78" },
  { name: "Cafeteira dos sonhos", price: 460, icon: "Cafe", description: "Cafe quentinho para os primeiros dias de casados.", image: "https://images.unsplash.com/photo-1525088553748-01d6e210e00b?auto=format&fit=crop&w=700&q=78" },
  { name: "Aparelho de jantar", price: 390, icon: "Mesa", description: "Uma mesa bonita para receber familia e amigos.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=78" },
  { name: "Diaria em hotel boutique", price: 690, icon: "Hotel", description: "Uma noite especial em um lugar inesquecivel.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=78" },
  { name: "Passeio de balao", price: 880, icon: "Ceu", description: "Uma aventura romantica para lembrar para sempre.", image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=700&q=78" },
  { name: "Adega climatizada", price: 930, icon: "Vinho", description: "Para guardar os vinhos dos proximos brindes.", image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=78" },
  { name: "Robo aspirador", price: 720, icon: "Lar", description: "Mais tempo livre para curtir a vida a dois.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=78" },
  { name: "Enxoval banho e cama", price: 350, icon: "Enxoval", description: "Toalhas e lencois macios para a casa nova.", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=78" },
  { name: "Day spa para o casal", price: 410, icon: "Spa", description: "Um dia de descanso depois da festa.", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota passagem aerea", price: 550, icon: "Viagem", description: "Ajuda para o casal chegar ao destino dos sonhos.", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=78" },
  { name: "Experiencia gastronomica", price: 300, icon: "Menu", description: "Um menu especial para uma noite memoravel.", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=700&q=78" },
  { name: "Decoracao para sala", price: 270, icon: "Decor", description: "Um detalhe bonito para deixar o lar com a cara do casal.", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=700&q=78" }
];

const funCatalogGifts = [
  { name: "Vale nao lavar louca por uma semana", price: 120, icon: "Diversao", description: "Presente simbolico para manter a paz na casa nova.", image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota delivery pos-festa", price: 95, icon: "Delivery", description: "Para o casal descansar sem pensar no jantar.", image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=700&q=78" },
  { name: "Kit primeira briga resolvida", price: 160, icon: "Humor", description: "Um jantar, flores e sobremesa para tudo voltar ao normal.", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=700&q=78" },
  { name: "Ajuda para a geladeira cheia", price: 240, icon: "Mercado", description: "Aquela compra caprichada para inaugurar a despensa.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=78" },
  { name: "Maratona de filmes no sofa", price: 130, icon: "Cinema", description: "Pipoca, cobertor e um fim de semana sem pressa.", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota paciencia para montar moveis", price: 180, icon: "Casa", description: "Porque todo parafuso merece carinho e calma.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=78" },
  { name: "Aula de danca para dois", price: 280, icon: "Danca", description: "Para repetir a primeira danca sem pisar no pe.", image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota toalhas sempre fofinhas", price: 210, icon: "Enxoval", description: "Banho de hotel dentro de casa.", image: "https://images.unsplash.com/photo-1582582429416-1d961b9658f8?auto=format&fit=crop&w=700&q=78" },
  { name: "Assinatura de vinhos", price: 360, icon: "Vinhos", description: "Para brindar todo mes ao novo capitulo.", image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota massagem depois da festa", price: 300, icon: "Relax", description: "Recuperacao oficial depois de dancar a noite toda.", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=78" },
  { name: "Panquecas de domingo", price: 85, icon: "Cafe", description: "Para um cafe da manha demorado e feliz.", image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota plantas para o lar", price: 170, icon: "Verde", description: "Verde, vida e um cantinho mais acolhedor.", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=78" },
  { name: "Playlist da viagem", price: 70, icon: "Musica", description: "Trilha sonora simbolica para a lua de mel.", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota gasolina da lua de mel", price: 220, icon: "Estrada", description: "Para o roteiro render mais historias.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=78" },
  { name: "Kit banho premium", price: 260, icon: "Spa", description: "Sabonetes, aromas e clima de descanso.", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota pizza da mudanca", price: 110, icon: "Pizza", description: "Porque todo lar comeca melhor com pizza.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=78" },
  { name: "Mini bar dos convidados", price: 390, icon: "Festa", description: "Um reforco divertido para animar os brindes.", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=700&q=78" },
  { name: "Cota porta-retratos da familia", price: 150, icon: "Memorias", description: "Para guardar as fotos favoritas do grande dia.", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=78" }
];

const fullCatalogGifts = [...catalogGifts, ...funCatalogGifts];

const displayGifts = gifts.length >= 12
  ? gifts
  : [...gifts, ...fullCatalogGifts]
    .filter((gift, index, list) => list.findIndex((item) => item.name === gift.name) === index)
    .slice(0, 36);

giftGrid.innerHTML = displayGifts.map((gift, index) => `
  <article class="couple-gift-card">
    <div class="couple-gift-photo" style="background-image: url('${gift.image || fullCatalogGifts[index % fullCatalogGifts.length].image}')">
      <span>${gift.icon || "Presente"}</span>
    </div>
    <h3>${gift.name}</h3>
    ${gift.description ? `<small>${gift.description}</small>` : ""}
    <p>${currencyFormatter.format(gift.price)}</p>
    <button class="mini-button" type="button" data-present="${gift.name}" data-price="${gift.price}">Presentear</button>
  </article>
`).join("");

let giftTotal = 0;

giftGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-present]");
  if (!button) return;
  giftTotal += Number(button.dataset.price);
  giftStatus.textContent = `${button.dataset.present} selecionado. Total simbólico: ${currencyFormatter.format(giftTotal)}.`;
  button.textContent = "Selecionado";
});

const guestsKey = `casamentoGuests:${site.slug}`;
const guests = JSON.parse(localStorage.getItem(guestsKey) || "[]");
const notesKey = `casamentoNotes:${site.slug}`;
const notes = JSON.parse(localStorage.getItem(notesKey) || "[]");

function renderNotes() {
  noteList.innerHTML = notes.length
    ? notes.map((note) => `
      <article class="note-card">
        <p>${note.message}</p>
        <strong>${note.name}</strong>
      </article>
    `).join("")
    : `<article class="note-card"><p>Seja a primeira pessoa a deixar um recado para o casal.</p><strong>Com carinho</strong></article>`;
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(noteForm);
  notes.unshift({
    name: data.get("name"),
    message: data.get("message")
  });
  localStorage.setItem(notesKey, JSON.stringify(notes));
  noteForm.reset();
  renderNotes();
});

function renderGuests() {
  guestsElement.innerHTML = guests.length
    ? guests.map((guest) => `
      <article class="guest-item">
        <strong>${guest.name}</strong>
        <p>${guest.companions} acompanhante(s)</p>
        ${guest.note ? `<p>${guest.note}</p>` : ""}
      </article>
    `).join("")
    : `<article class="guest-item"><p>Nenhuma confirmação ainda.</p></article>`;
}

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(rsvpForm);
  guests.unshift({
    name: data.get("guest"),
    companions: data.get("companions"),
    note: data.get("note")
  });
  localStorage.setItem(guestsKey, JSON.stringify(guests));
  rsvpForm.reset();
  renderGuests();
});

renderGuests();
renderNotes();

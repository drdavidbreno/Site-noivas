const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const accordionButtons = document.querySelectorAll(".accordion button");
const modalLayer = document.querySelector(".modal-layer");
const modals = document.querySelectorAll(".modal");
const modalTriggers = document.querySelectorAll(".js-open-modal");
const modalHashMap = {
  "#criar": "site-builder",
  "#buscar": "couple-search",
  "#criar-lista": "gift-tool"
};
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const serviceFeeRate = 0.0389;
const utilityTitle = document.querySelector("#utility-title");
const utilityText = document.querySelector("#utility-text");
const utilityEyebrow = document.querySelector("#utility-eyebrow");
const utilityActions = document.querySelector("#utility-actions");
const chatAssistant = document.querySelector(".chat-assistant");
const chatPanel = document.querySelector(".chat-panel");
const chatClose = document.querySelector(".chat-close");
const chatResponse = document.querySelector("#chat-response");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader);

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const isOpen = panel.classList.toggle("is-open");
    button.querySelector("span").textContent = isOpen ? "-" : "+";
  });
});

if (accordionButtons[0]) {
  accordionButtons[0].click();
}

function openModal(id) {
  modals.forEach((modal) => modal.classList.toggle("is-active", modal.id === id));
  modalLayer.classList.add("is-open");
  modalLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openUtility({ eyebrow = "Ação", title, text, actions = [] }) {
  utilityEyebrow.textContent = eyebrow;
  utilityTitle.textContent = title;
  utilityText.textContent = text;
  utilityActions.innerHTML = actions.map((action) => {
    if (action.type === "button") {
      return `<button type="button" class="${action.secondary ? "secondary" : ""}" data-utility-action="${action.action}">${action.label}</button>`;
    }
    return `<a class="${action.secondary ? "secondary" : ""}" href="${action.href || "#"}">${action.label}</a>`;
  }).join("");
  openModal("utility-modal");
}

function closeModal() {
  modalLayer.classList.remove("is-open");
  modalLayer.setAttribute("aria-hidden", "true");
  modals.forEach((modal) => modal.classList.remove("is-active"));
  document.body.classList.remove("modal-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(trigger.dataset.modal);
  });
});

if (modalHashMap[window.location.hash]) {
  window.requestAnimationFrame(() => openModal(modalHashMap[window.location.hash]));
}

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalLayer.classList.contains("is-open")) {
    closeModal();
  }

  if (event.key === "Escape" && chatPanel?.classList.contains("is-open")) {
    closeChat();
  }
});

const chatAnswers = {
  site: "Claro. Voce pode criar um site com fotos, data, local, confirmacao de presenca e lista de presentes em poucos passos.",
  lista: "A lista pode receber presentes em dinheiro, com opcoes prontas para lua de mel, casa nova e experiencias do casal.",
  ajuda: "Posso te guiar. Comece em Criar site gratis ou fale com a equipe pelo contato para ajustar cada detalhe."
};

function openChat() {
  chatPanel?.classList.add("is-open");
  chatAssistant?.setAttribute("aria-expanded", "true");
}

function closeChat() {
  chatPanel?.classList.remove("is-open");
  chatAssistant?.setAttribute("aria-expanded", "false");
}

chatAssistant?.addEventListener("click", () => {
  if (chatPanel?.classList.contains("is-open")) {
    closeChat();
  } else {
    openChat();
  }
});

chatClose?.addEventListener("click", closeChat);

document.querySelectorAll("[data-chat-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = chatAnswers[button.dataset.chatAnswer];
    if (!chatResponse || !answer) return;
    chatResponse.textContent = answer;
    chatResponse.classList.add("is-visible");
  });
});

document.querySelectorAll("[data-open-tool]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.openTool));
});

const utilityContent = {
  "#entrar": {
    eyebrow: "Login",
    title: "Área dos noivos",
    text: "Aqui entraria o login real. Por enquanto, você pode abrir o último site criado ou criar um novo.",
    actions: [
      { type: "button", action: "open-last-site", label: "Abrir último site" },
      { type: "button", action: "site-builder", label: "Criar novo", secondary: true }
    ]
  },
  "#exemplos": {
    eyebrow: "Exemplos",
    title: "Sites reais para inspiração",
    text: "Mostraria uma galeria de sites publicados. Nesta demo, o botão abre um exemplo criado no próprio sistema.",
    actions: [
      { type: "button", action: "open-demo-site", label: "Abrir exemplo" },
      { type: "button", action: "site-builder", label: "Criar o meu", secondary: true }
    ]
  },
  "#appstore": {
    eyebrow: "Aplicativo",
    title: "App Store",
    text: "Em produção, este botão levaria para a página do aplicativo na App Store.",
    actions: [{ type: "button", action: "tools-panel", label: "Ver recursos" }]
  },
  "#googleplay": {
    eyebrow: "Aplicativo",
    title: "Google Play",
    text: "Em produção, este botão levaria para a página do aplicativo no Google Play.",
    actions: [{ type: "button", action: "tools-panel", label: "Ver recursos" }]
  },
  "#contato": {
    eyebrow: "Contato",
    title: "Fale conosco",
    text: "Canal de atendimento simulado. O próximo passo seria ligar isso a WhatsApp, e-mail ou formulário real.",
    actions: [
      { href: "mailto:contato@casamento.local", label: "Enviar e-mail" },
      { type: "button", action: "rsvp-tool", label: "Testar formulário", secondary: true }
    ]
  },
  "#instagram": {
    eyebrow: "Rede social",
    title: "Instagram",
    text: "Link social pronto para trocar pelo perfil real do projeto.",
    actions: [{ href: "https://www.instagram.com/", label: "Abrir Instagram" }]
  },
  "#facebook": {
    eyebrow: "Rede social",
    title: "Facebook",
    text: "Link social pronto para trocar pela página real.",
    actions: [{ href: "https://www.facebook.com/", label: "Abrir Facebook" }]
  },
  "#youtube": {
    eyebrow: "Rede social",
    title: "YouTube",
    text: "Link social pronto para trocar pelo canal real.",
    actions: [{ href: "https://www.youtube.com/", label: "Abrir YouTube" }]
  },
  "#linkedin": {
    eyebrow: "Rede social",
    title: "LinkedIn",
    text: "Link social pronto para trocar pelo perfil real.",
    actions: [{ href: "https://www.linkedin.com/", label: "Abrir LinkedIn" }]
  }
};

const layoutThemeSites = {
  forest: {
    couple: "Ana & Miguel",
    date: "2026-10-18",
    style: "forest",
    theme: "forest",
    message: "Nosso encontro comecou leve, cresceu com cuidado e agora vira uma celebracao cercada de verde, familia e amigos.",
    tagline: "Um sim entre jardins e memorias",
    place: "Villa Botanica - Campos do Jordao, SP",
    color: "#4c6a57",
    photoShape: "soft",
    heroPhoto: "img/01 (3).png",
    storyPhoto: "img/01 (6).png",
    gallery: ["img/01 (3).png", "img/01 (6).png", "img/01 (4).png", "img/01 (5).png", "img/01 (7).png"],
    showGifts: true,
    showRsvp: true,
    gifts: [
      { name: "Jantar no jardim", price: 260, icon: "J" },
      { name: "Diaria na serra", price: 480, icon: "S" },
      { name: "Decoracao floral", price: 320, icon: "F" },
      { name: "Passeio a dois", price: 210, icon: "P" }
    ]
  },
  classic: {
    couple: "Clara & Joao",
    date: "2026-06-06",
    style: "classic",
    theme: "classic",
    message: "Uma historia elegante, feita de escolhas simples, olhares sinceros e a alegria de reunir quem caminhou conosco.",
    tagline: "Classico, intimo e para sempre",
    place: "Palacio das Artes - Belo Horizonte, MG",
    color: "#1f1f24",
    photoShape: "soft",
    heroPhoto: "img/01 (4).png",
    storyPhoto: "img/01 (7).png",
    gallery: ["img/01 (4).png", "img/01 (7).png", "img/01 (3).png", "img/01 (6).png", "img/01 (5).png"],
    showGifts: true,
    showRsvp: true,
    gifts: [
      { name: "Cota da casa nova", price: 500, icon: "C" },
      { name: "Jantar especial", price: 340, icon: "J" },
      { name: "Enxoval", price: 280, icon: "E" },
      { name: "Noite de hotel", price: 620, icon: "H" }
    ]
  },
  photo: {
    couple: "Marina & Theo",
    date: "2026-11-14",
    style: "photo",
    theme: "photo",
    message: "Queremos um dia com cara de editorial: luz bonita, paisagem aberta e cada detalhe contando um pedaco da nossa historia.",
    tagline: "Uma celebracao leve, linda e inesquecivel",
    place: "Casa das Oliveiras - Curitiba, PR",
    color: "#6a0f23",
    photoShape: "soft",
    heroPhoto: "img/01 (5).png",
    storyPhoto: "img/01 (4).png",
    gallery: ["img/01 (5).png", "img/01 (4).png", "img/01 (7).png", "img/01 (6).png", "img/01 (3).png"],
    showGifts: true,
    showRsvp: true,
    gifts: [
      { name: "Passeio na Toscana", price: 420, icon: "T" },
      { name: "Album do casamento", price: 300, icon: "A" },
      { name: "Brinde ao por do sol", price: 190, icon: "B" },
      { name: "Lua de mel", price: 650, icon: "L" }
    ]
  },
  blush: {
    couple: "Helena & Davi",
    date: "2026-08-22",
    style: "blush",
    theme: "blush",
    message: "Nosso casamento sera delicado, acolhedor e cheio de pequenos gestos. Um encontro para celebrar o amor com calma e beleza.",
    tagline: "Minimal, doce e cheio de significado",
    place: "Atelie Jardim - Florianopolis, SC",
    color: "#a45f70",
    photoShape: "round",
    heroPhoto: "img/01 (7).png",
    storyPhoto: "img/01 (3).png",
    gallery: ["img/01 (7).png", "img/01 (3).png", "img/01 (4).png", "img/01 (5).png", "img/01 (6).png"],
    showGifts: true,
    showRsvp: true,
    gifts: [
      { name: "Cafe da manha", price: 180, icon: "C" },
      { name: "Flores da cerimonia", price: 260, icon: "F" },
      { name: "Experiencia spa", price: 390, icon: "S" },
      { name: "Cota da lua de mel", price: 520, icon: "L" }
    ]
  }
};

function openThemeSite(themeKey) {
  const theme = layoutThemeSites[themeKey];
  if (!theme) return;

  const site = {
    ...theme,
    slug: `${slugify(theme.couple)}-${themeKey}`,
    createdAt: new Date().toISOString()
  };
  const sites = JSON.parse(localStorage.getItem("casamentoSites") || "{}");
  sites[site.slug] = site;
  localStorage.setItem("casamentoSites", JSON.stringify(sites));
  window.location.href = `site.html?site=${encodeURIComponent(site.slug)}`;
}

document.querySelectorAll("[data-layout-theme]").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("button, a")) return;
    openThemeSite(card.dataset.layoutTheme);
  });
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openThemeSite(card.dataset.layoutTheme);
  });
});

document.querySelectorAll("[data-theme-demo]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openThemeSite(button.dataset.themeDemo);
  });
});

const themeCheckoutInfo = {
  forest: {
    category: "01 - Classico",
    title: "Floresta elegante",
    price: "R$ 97",
    image: "img/01 (3).png",
    description: "Visual classico, elegante e acolhedor para casamentos com cerimonia tradicional."
  },
  classic: {
    category: "02 - Preto e branco",
    title: "Preto e branco",
    price: "R$ 97",
    image: "img/01 (4).png",
    description: "Tema sofisticado, limpo e atemporal para um site com cara editorial."
  },
  photo: {
    category: "03 - Editorial",
    title: "Editorial romantico",
    price: "R$ 127",
    image: "img/01 (5).png",
    description: "Tema com impacto visual forte, ideal para destacar fotos grandes e momentos do casal."
  },
  blush: {
    category: "04 - Minimal",
    title: "Minimal delicado",
    price: "R$ 97",
    image: "img/01 (7).png",
    description: "Tema claro, leve e romantico para uma experiencia suave no celular e no desktop."
  }
};

const checkoutImage = document.querySelector("#checkout-image");
const checkoutCategory = document.querySelector("#checkout-category");
const checkoutTitle = document.querySelector("#theme-checkout-title");
const checkoutDescription = document.querySelector("#checkout-description");
const checkoutPrice = document.querySelector("#checkout-price");
const checkoutThemeKey = document.querySelector("#checkout-theme-key");
const checkoutDemo = document.querySelector("#checkout-demo");
const themeCheckoutForm = document.querySelector("#theme-checkout-form");
let selectedCheckoutTheme = "forest";
const salesEmail = "dr.davidbreno@hotmail.com";

function openThemeCheckout(themeKey) {
  const theme = themeCheckoutInfo[themeKey];
  if (!theme) return;

  selectedCheckoutTheme = themeKey;
  checkoutImage.src = theme.image;
  checkoutImage.alt = `Previa do tema ${theme.title}`;
  checkoutCategory.textContent = theme.category;
  checkoutTitle.textContent = theme.title;
  checkoutDescription.textContent = theme.description;
  checkoutPrice.textContent = theme.price;
  checkoutThemeKey.value = themeKey;
  openModal("theme-checkout");
}

document.querySelectorAll("[data-theme-buy]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openThemeCheckout(button.dataset.themeBuy);
  });
});

checkoutDemo?.addEventListener("click", () => {
  openThemeSite(selectedCheckoutTheme);
});

themeCheckoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(themeCheckoutForm);
  const theme = themeCheckoutInfo[selectedCheckoutTheme] || themeCheckoutInfo.forest;
  const order = {
    id: `OPS-${Date.now().toString(36).toUpperCase()}`,
    theme: data.get("theme"),
    themeTitle: theme.title,
    price: theme.price,
    couple: data.get("couple"),
    email: data.get("email"),
    phone: data.get("phone"),
    createdAt: new Date().toISOString()
  };
  const orders = JSON.parse(localStorage.getItem("opscaseiThemeOrders") || "[]");
  orders.unshift(order);
  localStorage.setItem("opscaseiThemeOrders", JSON.stringify(orders));
  const contactMessage = [
    `Novo pedido OPSCASEI ${order.id}`,
    `Tema: ${order.themeTitle} (${order.price})`,
    `Casal: ${order.couple}`,
    `E-mail: ${order.email}`,
    `WhatsApp: ${order.phone}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(contactMessage)}`;
  const mailUrl = `mailto:${salesEmail}?subject=${encodeURIComponent(`Pedido ${order.id} - ${order.themeTitle}`)}&body=${encodeURIComponent(contactMessage)}`;
  themeCheckoutForm.reset();
  closeModal();
  openUtility({
    eyebrow: "Compra iniciada",
    title: "Tema reservado com sucesso",
    text: "O pedido foi salvo neste navegador. Envie os dados para atendimento agora e continue a personalizacao do site.",
    actions: [
      { href: whatsappUrl, label: "Enviar no WhatsApp" },
      { href: mailUrl, label: "Enviar por e-mail", secondary: true },
      { type: "button", action: "site-builder", label: "Personalizar site", secondary: true }
    ]
  });
});

document.addEventListener("click", (event) => {
  const utilityButton = event.target.closest("[data-utility-action]");
  if (!utilityButton) return;

  const action = utilityButton.dataset.utilityAction;
  if (action === "open-last-site") {
    const sites = JSON.parse(localStorage.getItem("casamentoSites") || "{}");
    const last = Object.values(sites).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
    window.location.href = last ? `site.html?site=${encodeURIComponent(last.slug)}` : "site.html";
    return;
  }

  if (action === "open-demo-site") {
    openThemeSite("photo");
    return;
  }

  if (action === "open-demo-site-legacy") {
    const demo = {
      couple: "Marina & Theo",
      date: "2026-11-14",
      style: "modern",
      message: "A nossa história ganha um novo capítulo e queremos você por perto.",
      tagline: "Uma celebração leve, linda e inesquecível",
      place: "Casa das Oliveiras - Curitiba, PR",
      color: "#dd6a73",
      photoShape: "soft",
      showGifts: true,
      showRsvp: true,
      slug: "marina-e-theo-demo",
      createdAt: new Date().toISOString()
    };
    const sites = JSON.parse(localStorage.getItem("casamentoSites") || "{}");
    sites[demo.slug] = demo;
    localStorage.setItem("casamentoSites", JSON.stringify(sites));
    window.location.href = `site.html?site=${demo.slug}`;
    return;
  }

  if (document.getElementById(action)) {
    openModal(action);
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!utilityContent[href]) return;
    event.preventDefault();
    openUtility(utilityContent[href]);
  });
});

document.querySelector(".play-button")?.addEventListener("click", () => {
  openUtility({
    eyebrow: "Vídeo",
    title: "Como funciona",
    text: "Aqui entraria um vídeo institucional. Por enquanto, esta janela simula o player e aponta para as ferramentas principais.",
    actions: [
      { type: "button", action: "site-builder", label: "Criar site" },
      { type: "button", action: "gift-tool", label: "Ver lista", secondary: true }
    ]
  });
});

const introVideoCard = document.querySelector(".video-card");
const introVideo = document.querySelector(".intro-video");
const playButton = document.querySelector(".play-button");

function toggleIntroVideo(event) {
  event?.preventDefault();
  event?.stopImmediatePropagation();

  if (!introVideo || !introVideoCard) return;

  if (introVideo.paused) {
    introVideo.play();
    introVideoCard.classList.add("is-playing");
  } else {
    introVideo.pause();
    introVideoCard.classList.remove("is-playing");
  }
}

playButton?.addEventListener("click", toggleIntroVideo, true);
introVideo?.addEventListener("click", toggleIntroVideo);
introVideo?.addEventListener("ended", () => {
  introVideoCard?.classList.remove("is-playing");
});

const builderForm = document.querySelector("#builder-form");
const sitePreview = document.querySelector("#site-preview");
const updatePreviewButton = document.querySelector("#update-preview");
const uploadedImages = {
  heroPhoto: "",
  storyPhoto: ""
};
const themeByStyle = {
  romantic: "forest",
  classic: "classic",
  modern: "photo"
};

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "nosso-site";
}

function getBuilderData() {
  const data = new FormData(builderForm);
  const style = String(data.get("style") || "romantic");
  const explicitTheme = String(data.get("theme") || "");
  return {
    couple: data.get("couple"),
    date: data.get("date"),
    style,
    theme: explicitTheme || themeByStyle[style] || "forest",
    message: data.get("message"),
    tagline: data.get("tagline"),
    place: data.get("place"),
    color: data.get("color"),
    photoShape: data.get("photoShape"),
    showGifts: data.get("showGifts") === "on",
    showRsvp: data.get("showRsvp") === "on",
    heroPhoto: uploadedImages.heroPhoto,
    storyPhoto: uploadedImages.storyPhoto
  };
}

function updateSitePreview() {
  const data = getBuilderData();
  sitePreview.classList.remove("classic", "modern");
  sitePreview.classList.add(data.style);
  sitePreview.style.setProperty("--preview-color", data.color);
  if (data.heroPhoto) {
    sitePreview.style.backgroundImage = `linear-gradient(rgba(33, 55, 70, 0.36), rgba(33, 55, 70, 0.46)), url("${data.heroPhoto}")`;
  }
  sitePreview.querySelector("h3").textContent = data.couple;
  sitePreview.querySelector("p").textContent = formatDate(data.date);
  sitePreview.querySelector("strong").textContent = data.tagline;
  sitePreview.querySelector("span").textContent = data.message;
}

updatePreviewButton.addEventListener("click", updateSitePreview);

function syncBuilderThemeFromStyle() {
  if (!builderForm?.elements.theme || !builderForm?.elements.style) return;
  const style = String(builderForm.elements.style.value || "romantic");
  builderForm.elements.theme.value = themeByStyle[style] || "forest";
}

if (builderForm?.elements.style) {
  builderForm.elements.style.addEventListener("change", syncBuilderThemeFromStyle);
}

syncBuilderThemeFromStyle();

function readImageInput(input) {
  const file = input.files && input.files[0];
  if (!file) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

builderForm.querySelectorAll('input[type="file"]').forEach((input) => {
  input.addEventListener("change", async () => {
    uploadedImages[input.name] = await readImageInput(input);
    updateSitePreview();
  });
});

builderForm.addEventListener("input", (event) => {
  if (event.target.type !== "file") {
    updateSitePreview();
  }
});

builderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  uploadedImages.heroPhoto = uploadedImages.heroPhoto || await readImageInput(builderForm.elements.heroPhoto);
  uploadedImages.storyPhoto = uploadedImages.storyPhoto || await readImageInput(builderForm.elements.storyPhoto);
  const site = getBuilderData();
  site.slug = slugify(site.couple);
  site.createdAt = new Date().toISOString();
  const sites = JSON.parse(localStorage.getItem("casamentoSites") || "{}");
  sites[site.slug] = site;
  localStorage.setItem("casamentoSites", JSON.stringify(sites));
  window.location.href = `site.html?site=${encodeURIComponent(site.slug)}`;
});

const couples = [
  { name: "Lívia & Rafael", date: "20/09/2026", city: "São Paulo, SP", site: "liviaerafael" },
  { name: "Marina & Theo", date: "14/11/2026", city: "Curitiba, PR", site: "marinaetheo" },
  { name: "Clara & João", date: "06/06/2026", city: "Belo Horizonte, MG", site: "claraejoao" },
  { name: "Helena & Davi", date: "22/08/2026", city: "Florianópolis, SC", site: "helenaedavi" }
];

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const searchResults = document.querySelector("#search-results");

function renderCouples(list) {
  searchResults.innerHTML = list.length
    ? list.map((couple) => `
      <article class="result-card">
        <div class="result-avatar">${couple.name.slice(0, 1)}</div>
        <div>
          <h3>${couple.name}</h3>
          <p>${couple.date} - ${couple.city}</p>
          <p>sites.opscasei.com.br/${couple.site}</p>
        </div>
        <button class="mini-button" type="button" data-open-search-site="${couple.site}" data-couple-name="${couple.name}" data-couple-date="${couple.date}" data-couple-city="${couple.city}">Abrir</button>
      </article>
    `).join("")
    : `<article class="result-card"><div class="result-avatar">?</div><div><h3>Nenhum casal encontrado</h3><p>Tente buscar por Lívia, Marina, Clara ou Helena.</p></div></article>`;
}

function searchCouples() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = couples.filter((couple) => couple.name.toLowerCase().includes(query) || couple.city.toLowerCase().includes(query));
  renderCouples(query ? filtered : couples);
}

searchButton.addEventListener("click", searchCouples);
searchInput.addEventListener("input", searchCouples);
searchResults.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-search-site]");
  if (!button) return;
  const site = {
    couple: button.dataset.coupleName,
    date: button.dataset.coupleDate.split("/").reverse().join("-"),
    style: "romantic",
    message: `Bem-vindo ao site de ${button.dataset.coupleName}.`,
    tagline: "Esperamos você para celebrar conosco",
    place: button.dataset.coupleCity,
    color: "#dd6a73",
    photoShape: "soft",
    showGifts: true,
    showRsvp: true,
    slug: button.dataset.openSearchSite,
    createdAt: new Date().toISOString()
  };
  const sites = JSON.parse(localStorage.getItem("casamentoSites") || "{}");
  sites[site.slug] = site;
  localStorage.setItem("casamentoSites", JSON.stringify(sites));
  window.location.href = `site.html?site=${encodeURIComponent(site.slug)}`;
});
renderCouples(couples);

const countdown = document.querySelector("[data-countdown]");

function updateCountdown() {
  if (!countdown) return;

  const target = new Date(countdown.dataset.countdown).getTime();
  const distance = Math.max(0, target - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  countdown.querySelector("[data-countdown-days]").textContent = String(days);
  countdown.querySelector("[data-countdown-hours]").textContent = String(hours).padStart(2, "0");
  countdown.querySelector("[data-countdown-minutes]").textContent = String(minutes).padStart(2, "0");
  countdown.querySelector("[data-countdown-seconds]").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const showcaseGiftItems = [
  { name: "Cota de viagem", price: 450, tag: "Lua de mel", description: "Ajuda para a primeira viagem do casal.", image: "img/tel.png" },
  { name: "Jantar romantico", price: 260, tag: "Experiencia", description: "Uma noite especial depois do casamento.", image: "img/01 (4).png" },
  { name: "Mobilia da sala", price: 680, tag: "Casa nova", description: "Ajuda para montar o novo lar.", image: "img/01 (6).png" },
  { name: "Album do casamento", price: 320, tag: "Memorias", description: "Fotos impressas para guardar para sempre.", image: "img/01 (5).png" },
  { name: "Passagem aerea", price: 550, tag: "Viagem", description: "Cota para chegar ao destino da lua de mel.", image: "img/01 (7).png" },
  { name: "Diaria em hotel", price: 690, tag: "Lua de mel", description: "Uma noite especial para descansar depois da festa.", image: "img/01 (3).png" },
  { name: "Cafe da manha", price: 180, tag: "Experiencia", description: "Um cafe caprichado para o primeiro domingo casados.", image: "img/tel.png" },
  { name: "Day spa do casal", price: 410, tag: "Relax", description: "Um dia de descanso e cuidado a dois.", image: "img/01 (4).png" },
  { name: "Passeio de barco", price: 430, tag: "Aventura", description: "Uma experiencia leve para guardar na memoria.", image: "img/01 (5).png" },
  { name: "Kit panelas", price: 780, tag: "Cozinha", description: "Para estrear a cozinha da casa nova.", image: "img/01 (6).png" },
  { name: "Cafeteira dos sonhos", price: 460, tag: "Casa nova", description: "Cafe quentinho para os primeiros dias juntos.", image: "img/tel.png" },
  { name: "Aparelho de jantar", price: 390, tag: "Mesa posta", description: "Uma mesa bonita para receber familia e amigos.", image: "img/01 (3).png" },
  { name: "Enxoval banho e cama", price: 350, tag: "Enxoval", description: "Toalhas e lencois macios para o novo lar.", image: "img/01 (7).png" },
  { name: "Adega climatizada", price: 930, tag: "Brindes", description: "Para guardar os vinhos dos proximos brindes.", image: "img/01 (4).png" },
  { name: "Robo aspirador", price: 720, tag: "Praticidade", description: "Mais tempo livre para curtir a vida a dois.", image: "img/01 (6).png" },
  { name: "Decoracao da sala", price: 270, tag: "Decoracao", description: "Um detalhe bonito para deixar o lar com a cara do casal.", image: "img/01 (5).png" },
  { name: "Assinatura de vinhos", price: 360, tag: "Brindes", description: "Para brindar todo mes ao novo capitulo.", image: "img/01 (3).png" },
  { name: "Compra de mercado", price: 240, tag: "Casa nova", description: "Aquela primeira compra caprichada para a despensa.", image: "img/tel.png" },
  { name: "Pizza da mudanca", price: 110, tag: "Mudanca", description: "Porque todo lar comeca melhor com pizza.", image: "img/01 (4).png" },
  { name: "Plantas para o lar", price: 170, tag: "Decoracao", description: "Verde, vida e um cantinho mais acolhedor.", image: "img/01 (7).png" },
  { name: "Aula de danca", price: 280, tag: "Experiencia", description: "Para repetir a primeira danca sem pisar no pe.", image: "img/01 (5).png" },
  { name: "Massagem pos-festa", price: 300, tag: "Relax", description: "Recuperacao oficial depois de dancar a noite toda.", image: "img/01 (3).png" },
  { name: "Brinde ao por do sol", price: 190, tag: "Celebracao", description: "Um momento especial para brindar depois do grande dia.", image: "img/01 (7).png" },
  { name: "Album extra", price: 250, tag: "Memorias", description: "Mais fotos impressas para dividir com a familia.", image: "img/01 (5).png" },
  { name: "Porta-retratos", price: 150, tag: "Memorias", description: "Para guardar as fotos favoritas do grande dia.", image: "img/01 (3).png" },
  { name: "Panquecas de domingo", price: 85, tag: "Cafe", description: "Para um cafe da manha demorado e feliz.", image: "img/tel.png" },
  { name: "Gasolina da lua de mel", price: 220, tag: "Estrada", description: "Para o roteiro render mais historias.", image: "img/01 (4).png" },
  { name: "Kit banho premium", price: 260, tag: "Spa", description: "Sabonetes, aromas e clima de descanso.", image: "img/01 (6).png" },
  { name: "Mini bar dos convidados", price: 390, tag: "Festa", description: "Um reforco divertido para animar os brindes.", image: "img/01 (7).png" },
  { name: "Moveis do quarto", price: 740, tag: "Casa nova", description: "Ajuda para montar um quarto bonito e confortavel.", image: "img/01 (6).png" },
  { name: "Utensilios de cozinha", price: 230, tag: "Cozinha", description: "Itens uteis para cozinhar as primeiras receitas.", image: "img/tel.png" },
  { name: "Noite romantica", price: 520, tag: "Experiencia", description: "Uma reserva especial para o casal comemorar.", image: "img/01 (4).png" },
  { name: "Experiencia gastronomica", price: 300, tag: "Experiencia", description: "Um menu especial para uma noite memoravel.", image: "img/01 (5).png" },
  { name: "Fundo da casa nova", price: 650, tag: "Casa nova", description: "Ajuda simbolica para os primeiros planos do novo lar.", image: "img/01 (3).png" }
];
const showcaseSelectedGifts = [];
const showcaseGiftProducts = document.querySelector("#showcase-gift-products");
const showcaseCart = document.querySelector("#showcase-cart");
const showcaseSubtotal = document.querySelector("#showcase-subtotal");
const showcaseFee = document.querySelector("#showcase-fee");
const showcaseTotal = document.querySelector("#showcase-total");
const showcaseClear = document.querySelector("#showcase-clear");

function renderShowcaseGiftProducts() {
  if (!showcaseGiftProducts) return;

  showcaseGiftProducts.innerHTML = showcaseGiftItems.map((gift, index) => {
    return `
      <article class="gift-card">
        <img src="${gift.image}" alt="${gift.name}">
        <div>
          <span>${gift.tag}</span>
          <h3>${gift.name}</h3>
          <p>${gift.description}</p>
          <strong>${currency.format(gift.price)}</strong>
          <button type="button" data-showcase-gift="${index}">Presentear</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderShowcaseCart() {
  if (!showcaseCart || !showcaseSubtotal || !showcaseFee || !showcaseTotal) return;

  showcaseCart.innerHTML = showcaseSelectedGifts.length
    ? showcaseSelectedGifts.map((gift) => `
      <article>
        <strong>${gift.name}</strong>
        <span>${currency.format(gift.price)}</span>
      </article>
    `).join("")
    : "<p>Nenhum presente selecionado ainda.</p>";

  const subtotal = showcaseSelectedGifts.reduce((sum, gift) => sum + gift.price, 0);
  const fee = subtotal * serviceFeeRate;
  showcaseSubtotal.textContent = currency.format(subtotal);
  showcaseFee.textContent = currency.format(fee);
  showcaseTotal.textContent = currency.format(subtotal + fee);
}

renderShowcaseGiftProducts();

showcaseGiftProducts?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-showcase-gift]");
  if (!button) return;

  const gift = showcaseGiftItems[Number(button.dataset.showcaseGift)];
  if (!gift) return;
  showcaseSelectedGifts.push(gift);
  renderShowcaseCart();
});

showcaseClear?.addEventListener("click", () => {
  showcaseSelectedGifts.length = 0;
  renderShowcaseCart();
});

renderShowcaseCart();

const rsvpConfirmButton = document.querySelector("#rsvp-confirm");
const guestStatusBoard = document.querySelector(".guest-status-board");

rsvpConfirmButton?.addEventListener("click", () => {
  const alreadyConfirmed = guestStatusBoard?.querySelector("[data-live-confirmation]");
  if (alreadyConfirmed) {
    openUtility({
      eyebrow: "RSVP",
      title: "Presenca ja confirmada",
      text: "Sua confirmacao ja apareceu na lista de convidados.",
      actions: [{ type: "button", action: "rsvp-tool", label: "Editar RSVP" }]
    });
    return;
  }

  const item = document.createElement("article");
  item.dataset.liveConfirmation = "true";
  item.innerHTML = '<span class="status-dot confirmed"></span><strong>Voce</strong><p>Confirmado</p>';
  guestStatusBoard?.prepend(item);
  openUtility({
    eyebrow: "RSVP",
    title: "Presenca confirmada",
    text: "Sua confirmacao foi adicionada na lista simulada. No site real, isso fica salvo no painel dos noivos.",
    actions: [{ type: "button", action: "rsvp-tool", label: "Abrir painel RSVP" }]
  });
});

document.querySelector("#note-button")?.addEventListener("click", () => {
  openUtility({
    eyebrow: "Recados",
    title: "Recado enviado",
    text: "Este popup simula o envio de uma mensagem carinhosa para o casal.",
    actions: [{ href: "#recados", label: "Ver mural" }]
  });
});

const gifts = [
  { name: "Jantar romântico", price: 220 },
  { name: "Passeio na lua de mel", price: 390 },
  { name: "Cota da casa nova", price: 500 },
  { name: "Café da manhã especial", price: 180 }
];

const premiumGifts = [
  {
    name: "Noite especial na lua de mel",
    price: 520,
    tag: "Lua de mel",
    description: "Uma diaria charmosa para o casal aproveitar a viagem.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Jantar romantico a dois",
    price: 260,
    tag: "Experiencia",
    description: "Um jantar com vinho, sobremesa e tempo para celebrar.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cantinho cafe da manha",
    price: 340,
    tag: "Casa nova",
    description: "Para montar uma mesa bonita nos primeiros domingos juntos.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Passeio de barco",
    price: 430,
    tag: "Aventura",
    description: "Uma experiencia leve para guardar na memoria da viagem.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota da casa dos sonhos",
    price: 650,
    tag: "Casa nova",
    description: "Ajuda simbolica para os primeiros planos do novo lar.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Brinde ao por do sol",
    price: 190,
    tag: "Celebracao",
    description: "Um momento especial para brindar depois do grande dia.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Kit panelas premium",
    price: 780,
    tag: "Cozinha",
    description: "Para estrear a casa nova com receitas especiais.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cafeteira dos sonhos",
    price: 460,
    tag: "Casa nova",
    description: "Cafe quentinho para os primeiros dias de casados.",
    image: "https://images.unsplash.com/photo-1525088553748-01d6e210e00b?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Aparelho de jantar",
    price: 390,
    tag: "Mesa posta",
    description: "Uma mesa bonita para receber familia e amigos.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Diaria em hotel boutique",
    price: 690,
    tag: "Lua de mel",
    description: "Uma noite especial em um lugar inesquecivel.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Passeio de balão",
    price: 880,
    tag: "Experiencia",
    description: "Uma aventura romantica para lembrar para sempre.",
    image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Adega climatizada",
    price: 930,
    tag: "Casa nova",
    description: "Para guardar os vinhos dos proximos brindes.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Robô aspirador",
    price: 720,
    tag: "Praticidade",
    description: "Mais tempo livre para curtir a vida a dois.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Enxoval banho e cama",
    price: 350,
    tag: "Enxoval",
    description: "Toalhas e lencois macios para a casa nova.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Day spa para o casal",
    price: 410,
    tag: "Relax",
    description: "Um dia de descanso depois da festa.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota passagem aérea",
    price: 550,
    tag: "Viagem",
    description: "Ajuda para o casal chegar ao destino dos sonhos.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Experiencia gastronomica",
    price: 300,
    tag: "Experiencia",
    description: "Um menu especial para uma noite memoravel.",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Decoracao para sala",
    price: 270,
    tag: "Decoracao",
    description: "Um detalhe bonito para deixar o lar com a cara do casal.",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=700&q=78"
  }
];

const funGifts = [
  {
    name: "Vale nao lavar louca por uma semana",
    price: 120,
    tag: "Diversao",
    description: "Presente simbolico para manter a paz na casa nova.",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota delivery pos-festa",
    price: 95,
    tag: "Sobrevivencia",
    description: "Para o casal descansar sem pensar no jantar.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Kit primeira briga resolvida",
    price: 160,
    tag: "Bom humor",
    description: "Um jantar, flores e sobremesa para tudo voltar ao normal.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Ajuda para a geladeira cheia",
    price: 240,
    tag: "Mercado",
    description: "Aquela compra caprichada para inaugurar a despensa.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Maratona de filmes no sofa",
    price: 130,
    tag: "Cinema",
    description: "Pipoca, cobertor e um fim de semana sem pressa.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota paciencia para montar moveis",
    price: 180,
    tag: "Casa nova",
    description: "Porque todo parafuso merece carinho e calma.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Aula de danca para dois",
    price: 280,
    tag: "Experiencia",
    description: "Para repetir a primeira danca sem pisar no pe.",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota toalhas sempre fofinhas",
    price: 210,
    tag: "Enxoval",
    description: "Banho de hotel dentro de casa.",
    image: "https://images.unsplash.com/photo-1582582429416-1d961b9658f8?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Assinatura de vinhos",
    price: 360,
    tag: "Brindes",
    description: "Para brindar todo mes ao novo capitulo.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota massagem depois da festa",
    price: 300,
    tag: "Relax",
    description: "Recuperacao oficial depois de dancar a noite toda.",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Panquecas de domingo",
    price: 85,
    tag: "Cafe",
    description: "Para um cafe da manha demorado e feliz.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota plantas para o lar",
    price: 170,
    tag: "Decoracao",
    description: "Verde, vida e um cantinho mais acolhedor.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Playlist da viagem",
    price: 70,
    tag: "Viagem",
    description: "Trilha sonora simbolica para a lua de mel.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota gasolina da lua de mel",
    price: 220,
    tag: "Estrada",
    description: "Para o roteiro render mais historias.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Kit banho premium",
    price: 260,
    tag: "Spa",
    description: "Sabonetes, aromas e clima de descanso.",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota pizza da mudanca",
    price: 110,
    tag: "Mudanca",
    description: "Porque todo lar comeca melhor com pizza.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Mini bar dos convidados",
    price: 390,
    tag: "Festa",
    description: "Um reforco divertido para animar os brindes.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=700&q=78"
  },
  {
    name: "Cota porta-retratos da familia",
    price: 150,
    tag: "Memorias",
    description: "Para guardar as fotos favoritas do grande dia.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=78"
  }
];

const allGiftProducts = [...premiumGifts, ...funGifts];

const giftShop = document.querySelector("#gift-shop");
const giftCart = document.querySelector("#gift-cart");
const giftTotal = document.querySelector("#gift-total");
const clearGifts = document.querySelector("#clear-gifts");
const selectedGifts = [];

function renderGiftShop() {
  giftShop.innerHTML = allGiftProducts.map((gift, index) => `
    <article class="shop-item">
      <div class="shop-photo" style="background-image: url('${gift.image}')">
        <span>${gift.tag}</span>
      </div>
      <div class="shop-copy">
        <h3>${gift.name}</h3>
        <p class="shop-description">${gift.description}</p>
        <p>Presente simbólico recebido em dinheiro.</p>
      </div>
      <div class="shop-action">
        <div class="shop-price">${currency.format(gift.price)}</div>
        <button class="mini-button" type="button" data-gift="${index}">Adicionar</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  giftCart.innerHTML = selectedGifts.length
    ? selectedGifts.map((gift) => `<div class="cart-item"><strong>${gift.name}</strong><p>${currency.format(gift.price)}</p></div>`).join("")
    : `<div class="cart-item"><p>Nenhum presente adicionado ainda.</p></div>`;

  const total = selectedGifts.reduce((sum, gift) => sum + gift.price, 0);
  giftTotal.textContent = currency.format(total);
}

giftShop.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gift]");
  if (!button) return;
  selectedGifts.push(allGiftProducts[Number(button.dataset.gift)]);
  renderCart();
});

clearGifts.addEventListener("click", () => {
  selectedGifts.length = 0;
  renderCart();
});

renderGiftShop();
renderCart();

const rsvpForm = document.querySelector("#rsvp-form");
const guestList = document.querySelector("#guest-list");
const guests = [
  { guest: "Paula Mendes", companions: "1", status: "Confirmado" },
  { guest: "Carlos Almeida", companions: "0", status: "Confirmado" }
];

function renderGuests() {
  guestList.innerHTML = guests.map((guest) => `
    <article class="guest-item">
      <strong>${guest.guest}</strong>
      <p>${guest.status} - ${guest.companions} acompanhante(s)</p>
    </article>
  `).join("");
}

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(rsvpForm);
  guests.unshift({
    guest: data.get("guest"),
    companions: data.get("companions"),
    status: data.get("status")
  });
  rsvpForm.reset();
  renderGuests();
});

renderGuests();

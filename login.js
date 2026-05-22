import { firebaseConfig } from "./firebase-config.js";

const form = document.querySelector("#login-form");
const feedback = document.querySelector("#login-feedback");
const forgotPassword = document.querySelector("#forgot-password");
const providerButtons = document.querySelectorAll("[data-provider]");

const localUsersKey = "opscaseiUsers";
const localSessionKey = "opscaseiSession";
const firebaseAppUrl = "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
const firebaseAuthUrl = "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
const hasFirebaseConfig = hasUsableFirebaseConfig(firebaseConfig);

let auth = null;
let authMode = "local";
let firebaseAuth = null;

const ready = initAuth();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await ready;

  const data = new FormData(form);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const remember = data.get("remember") === "on";

  if (!email || !password) {
    setFeedback("Preencha e-mail e senha para entrar.", "error");
    return;
  }

  try {
    setFeedback("Entrando...", "info");

    if (authMode === "firebase") {
      await firebaseAuth.setPersistence(
        auth,
        remember ? firebaseAuth.browserLocalPersistence : firebaseAuth.browserSessionPersistence
      );
      await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
      setFeedback("Login realizado com sucesso.", "success");
      redirectAfterLogin();
      return;
    }

    await signInLocally(email, password, remember);
  } catch (error) {
    setFeedback(getAuthErrorMessage(error), "error");
  }
});

providerButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await ready;

    if (authMode !== "firebase") {
      setFeedback("Login social precisa do Firebase configurado. Use e-mail e senha por enquanto.", "info");
      return;
    }

    const providerKey = button.dataset.provider;
    const provider = createProvider(providerKey);

    if (!provider) {
      setFeedback("Ative este provedor no Firebase para liberar o botao.", "info");
      return;
    }

    try {
      setFeedback("Abrindo login seguro...", "info");
      await firebaseAuth.signInWithPopup(auth, provider);
      setFeedback("Login realizado com sucesso.", "success");
      redirectAfterLogin();
    } catch (error) {
      setFeedback(getAuthErrorMessage(error), "error");
    }
  });
});

forgotPassword?.addEventListener("click", async (event) => {
  event.preventDefault();
  await ready;

  const email = String(new FormData(form).get("email") || "").trim().toLowerCase();

  if (!email) {
    setFeedback("Digite seu e-mail para recuperar a senha.", "error");
    return;
  }

  if (authMode !== "firebase") {
    setFeedback("Recuperacao por e-mail fica disponivel quando o Firebase estiver configurado.", "info");
    return;
  }

  try {
    await firebaseAuth.sendPasswordResetEmail(auth, email);
    setFeedback("Enviamos as instrucoes de recuperacao para o seu e-mail.", "success");
  } catch (error) {
    setFeedback(getAuthErrorMessage(error), "error");
  }
});

async function initAuth() {
  if (!hasFirebaseConfig) {
    authMode = "local";
    hydrateLocalSession();
    return;
  }

  try {
    const [{ initializeApp }, authModule] = await Promise.all([
      import(firebaseAppUrl),
      import(firebaseAuthUrl)
    ]);

    const app = initializeApp(firebaseConfig);
    firebaseAuth = authModule;
    auth = firebaseAuth.getAuth(app);
    authMode = "firebase";

    firebaseAuth.onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setFeedback(`Login ativo como ${user.email || user.displayName}.`, "success");
    });
  } catch (error) {
    console.warn("Firebase indisponivel. Login local ativado.", error);
    authMode = "local";
    hydrateLocalSession();
    setFeedback("Firebase indisponivel. Login local ativado.", "info");
  }
}

function hasUsableFirebaseConfig(config) {
  return ["apiKey", "authDomain", "projectId", "appId"].every((key) => {
    const value = String(config?.[key] || "");
    return value && !value.startsWith("COLE_");
  });
}

async function signInLocally(email, password, remember) {
  if (password.length < 6) {
    throw new AuthError("local/weak-password");
  }

  const users = readJson(localUsersKey, {});
  const existingUser = users[email];

  if (existingUser) {
    const hash = await hashPassword(password, existingUser.salt);
    if (hash !== existingUser.passwordHash) {
      throw new AuthError("local/wrong-password");
    }
  } else {
    const salt = createSalt();
    users[email] = {
      email,
      salt,
      passwordHash: await hashPassword(password, salt),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(localUsersKey, JSON.stringify(users));
  }

  saveLocalSession({ email, mode: "local", loggedAt: new Date().toISOString() }, remember);
  setFeedback(existingUser ? "Login realizado com sucesso." : "Conta criada e login realizado.", "success");
  redirectAfterLogin();
}

function hydrateLocalSession() {
  const session = getLocalSession();
  if (!session) {
    setFeedback("Login local ativo. Use e-mail e senha para entrar.", "info");
    return;
  }

  setFeedback(`Login ativo como ${session.email}.`, "success");
}

function saveLocalSession(session, remember) {
  localStorage.removeItem(localSessionKey);
  sessionStorage.removeItem(localSessionKey);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(localSessionKey, JSON.stringify(session));
}

function getLocalSession() {
  return readJson(localSessionKey, null, sessionStorage) || readJson(localSessionKey, null, localStorage);
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createProvider(providerKey) {
  if (!firebaseAuth) return null;

  if (providerKey === "google") {
    return new firebaseAuth.GoogleAuthProvider();
  }

  return null;
}

function redirectAfterLogin() {
  const target = getRedirectTarget();
  window.setTimeout(() => {
    window.location.href = target;
  }, 650);
}

function getRedirectTarget() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && isSafeLocalTarget(next)) return next;

  const sites = Object.values(readJson("casamentoSites", {}));
  const lastSite = sites.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  return lastSite ? `site.html?site=${encodeURIComponent(lastSite.slug)}` : "index.html#criar";
}

function isSafeLocalTarget(target) {
  return !/^[a-z][a-z0-9+.-]*:|^\/\//i.test(target) && !target.includes("login.html");
}

function readJson(key, fallback, storage = localStorage) {
  try {
    return JSON.parse(storage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function setFeedback(message, type = "info") {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.dataset.type = type;
}

function getAuthErrorMessage(error) {
  const messages = {
    "auth/invalid-email": "Confira o e-mail informado.",
    "auth/invalid-credential": "E-mail ou senha invalidos.",
    "auth/user-not-found": "Nao encontramos uma conta com este e-mail.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/popup-closed-by-user": "Login cancelado antes de concluir.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "local/weak-password": "Use uma senha com pelo menos 6 caracteres.",
    "local/wrong-password": "Senha incorreta para este e-mail."
  };

  return messages[error?.code] || "Nao foi possivel concluir o login agora.";
}

class AuthError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

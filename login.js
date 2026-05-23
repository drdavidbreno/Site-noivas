const form = document.querySelector("#login-form");
const feedback = document.querySelector("#login-feedback");
const forgotPassword = document.querySelector("#forgot-password");
const authActionInput = document.querySelector("#auth-action");
const signInButton = document.querySelector("#signin-button");
const signUpButton = document.querySelector("#signup-button");

const firebaseConfig = {
  apiKey: "AIzaSyBulTomdHV1TL5MPa-5fLCKXUAHiSL0Zcc",
  authDomain: "site-casamento-7e66a.firebaseapp.com",
  projectId: "site-casamento-7e66a",
  storageBucket: "site-casamento-7e66a.firebasestorage.app",
  messagingSenderId: "378703321412",
  appId: "1:378703321412:web:ab1daab40ffd7dd16f5f11",
  measurementId: "G-DG9EECRLGR"
};

const localUsersKey = "opscaseiUsers";
const localSessionKey = "opscaseiSession";
const firebaseAppUrl = "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
const firebaseAuthUrl = "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
const hasFirebaseConfig = hasUsableFirebaseConfig(firebaseConfig);

let auth = null;
let authMode = "local";
let firebaseAuth = null;

const ready = initAuth();

signInButton?.addEventListener("click", () => submitAuthForm("signin"));
signUpButton?.addEventListener("click", () => submitAuthForm("signup"));

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await ready;
  const action = getSubmitAction();

  const data = new FormData(form);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const remember = data.get("remember") === "on";

  if (!email || !password) {
    setFeedback("Preencha e-mail e senha para entrar.", "error");
    return;
  }

  try {
    setFeedback(action === "signup" ? "Criando conta..." : "Entrando...", "info");

    if (authMode === "firebase") {
      await firebaseAuth.setPersistence(
        auth,
        remember ? firebaseAuth.browserLocalPersistence : firebaseAuth.browserSessionPersistence
      );

      if (action === "signup") {
        await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
        setFeedback("Conta criada com sucesso.", "success");
      } else {
        await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
        setFeedback("Login realizado com sucesso.", "success");
      }

      redirectAfterLogin();
      return;
    }

    if (action === "signup") {
      await signUpLocally(email, password, remember);
    } else {
      await signInLocally(email, password, remember);
    }
  } catch (error) {
    console.error("Erro no login:", error);

    if (isFirebaseSetupError(error)) {
      authMode = "local";
      firebaseAuth = null;
      auth = null;
      setFeedback("Firebase ainda nao esta ativo. Usando login local de teste...", "info");

      try {
        if (action === "signup") {
          await signUpLocally(email, password, remember);
        } else {
          await signInLocally(email, password, remember);
        }
      } catch (localError) {
        setFeedback(getAuthErrorMessage(localError), "error");
      }
      return;
    }

    setFeedback(getAuthErrorMessage(error), "error");
  }
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

  if (!existingUser) {
    throw new AuthError("local/user-not-found");
  }

  const hash = await hashPassword(password, existingUser.salt);
  if (hash !== existingUser.passwordHash) {
    throw new AuthError("local/wrong-password");
  }

  saveLocalSession({ email, mode: "local", loggedAt: new Date().toISOString() }, remember);
  setFeedback("Login realizado com sucesso.", "success");
  redirectAfterLogin();
}

async function signUpLocally(email, password, remember) {
  if (password.length < 6) {
    throw new AuthError("local/weak-password");
  }

  const users = readJson(localUsersKey, {});
  if (users[email]) {
    throw new AuthError("local/email-already-in-use");
  }

  const salt = createSalt();
  users[email] = {
    email,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(localUsersKey, JSON.stringify(users));

  saveLocalSession({ email, mode: "local", loggedAt: new Date().toISOString() }, remember);
  setFeedback("Conta criada e login realizado.", "success");
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

function submitAuthForm(action) {
  if (authActionInput) {
    authActionInput.value = action === "signup" ? "signup" : "signin";
  }
  if (typeof form?.requestSubmit === "function") {
    form.requestSubmit();
    return;
  }
  form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}

function getSubmitAction() {
  const action = String(authActionInput?.value || "signin").toLowerCase();
  return action === "signup" ? "signup" : "signin";
}

function isFirebaseSetupError(error) {
  const code = String(error?.code || "");
  const message = String(error?.message || "");
  return code === "auth/configuration-not-found"
    || code === "auth/operation-not-allowed"
    || message.includes("CONFIGURATION_NOT_FOUND")
    || message.includes("PASSWORD_LOGIN_DISABLED");
}

function getAuthErrorMessage(error) {
  const messages = {
    "auth/invalid-email": "Confira o e-mail informado.",
    "auth/invalid-credential": "E-mail ou senha invalidos. Se ainda nao cadastrou, clique em Criar conta.",
    "auth/user-not-found": "Conta nao encontrada. Clique em Criar conta.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "auth/email-already-in-use": "Este e-mail ja esta em uso. Tente entrar.",
    "auth/operation-not-allowed": "Ative Email/Senha no Firebase Authentication.",
    "auth/configuration-not-found": "Falta ativar o login por e-mail no Firebase. Abra Firebase > Authentication > Comecar > Sign-in method > Email/Password.",
    "auth/app-not-authorized": "Adicione este dominio nos dominios autorizados do Firebase.",
    "auth/unauthorized-domain": "Adicione este dominio nos dominios autorizados do Firebase.",
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "A chave do Firebase esta invalida neste projeto.",
    "auth/invalid-api-key": "A chave do Firebase esta invalida neste projeto.",
    "auth/weak-password": "Use uma senha com pelo menos 6 caracteres.",
    "auth/network-request-failed": "Falha de conexao. Confira a internet e tente novamente.",
    "local/weak-password": "Use uma senha com pelo menos 6 caracteres.",
    "local/user-not-found": "Conta nao encontrada. Clique em Criar conta.",
    "local/wrong-password": "Senha incorreta para este e-mail.",
    "local/email-already-in-use": "Este e-mail ja esta em uso. Tente entrar."
  };

  const message = String(error?.message || "");
  if (message.includes("PASSWORD_LOGIN_DISABLED")) return messages["auth/operation-not-allowed"];
  if (message.includes("CONFIGURATION_NOT_FOUND")) return messages["auth/configuration-not-found"];
  if (message.includes("INVALID_LOGIN_CREDENTIALS")) return messages["auth/invalid-credential"];
  if (message.includes("EMAIL_EXISTS")) return messages["auth/email-already-in-use"];
  if (message.includes("INVALID_PASSWORD")) return messages["auth/wrong-password"];
  if (message.includes("EMAIL_NOT_FOUND")) return messages["auth/user-not-found"];

  if (error?.code) {
    return `Nao foi possivel concluir o login agora. Codigo: ${error.code}`;
  }

  return "Nao foi possivel concluir o login agora.";
}

class AuthError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

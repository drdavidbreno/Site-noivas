import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const form = document.querySelector("#login-form");
const feedback = document.querySelector("#login-feedback");
const forgotPassword = document.querySelector("#forgot-password");
const providerButtons = document.querySelectorAll("[data-provider]");

const hasFirebaseConfig = !Object.values(firebaseConfig).some((value) => String(value).startsWith("COLE_"));
const providers = {
  google: {
    enabled: true,
    instance: () => new GoogleAuthProvider()
  },
  facebook: {
    enabled: false,
    message: "Facebook já está previsto. Ative o provedor no Firebase para liberar este botão."
  },
  apple: {
    enabled: false,
    message: "Apple já está previsto. Ative o provedor no Firebase para liberar este botão."
  }
};

let auth = null;

function setFeedback(message, type = "info") {
  feedback.textContent = message;
  feedback.dataset.type = type;
}

function ensureFirebase() {
  if (!hasFirebaseConfig) {
    setFeedback("Preencha o firebase-config.js com os dados do seu projeto Firebase.", "error");
    return false;
  }

  return true;
}

if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    setFeedback(`Login ativo como ${user.email || user.displayName}.`, "success");
  });
} else {
  setFeedback("Configure o Firebase para ativar o login.", "error");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!ensureFirebase()) return;

  const data = new FormData(form);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");
  const remember = data.get("remember") === "on";

  try {
    setFeedback("Entrando...", "info");
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    setFeedback("Login realizado com sucesso.", "success");
  } catch (error) {
    setFeedback(getAuthErrorMessage(error), "error");
  }
});

providerButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (!ensureFirebase()) return;

    const providerKey = button.dataset.provider;
    const provider = providers[providerKey];

    if (!provider?.enabled) {
      setFeedback(provider?.message || "Provedor indisponível no momento.", "info");
      return;
    }

    try {
      setFeedback("Abrindo login seguro...", "info");
      await signInWithPopup(auth, provider.instance());
      setFeedback("Login realizado com sucesso.", "success");
    } catch (error) {
      setFeedback(getAuthErrorMessage(error), "error");
    }
  });
});

forgotPassword?.addEventListener("click", async (event) => {
  event.preventDefault();
  if (!ensureFirebase()) return;

  const email = String(new FormData(form).get("email") || "").trim();

  if (!email) {
    setFeedback("Digite seu e-mail para receber a recuperação de senha.", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setFeedback("Enviamos as instruções de recuperação para o seu e-mail.", "success");
  } catch (error) {
    setFeedback(getAuthErrorMessage(error), "error");
  }
});

function getAuthErrorMessage(error) {
  const messages = {
    "auth/invalid-email": "Confira o e-mail informado.",
    "auth/invalid-credential": "E-mail ou senha inválidos.",
    "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/popup-closed-by-user": "Login cancelado antes de concluir.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente."
  };

  return messages[error?.code] || "Não foi possível concluir o login agora.";
}

const users = [
    { username: 'gebruiker1', password: 'Abc!' },
    { username: 'gebruiker2', password: 'Def!' },
    { username: 'gebruiker3', password: 'Ghi!' }
];

function showNotification(element, message, color) {
    if (!element) return;
    element.style.color = color;
    element.textContent = message;
}

function login() {
    const usernameInput = document.getElementById('gebruikersnaam');
    const passwordInput = document.getElementById('wachtwoord');
    const notification = document.getElementById('notification');
    const inlogsubmit = document.getElementById('inlogsubmit');

    if (!usernameInput || !passwordInput) return; 

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username) {
        showNotification(notification, "Vul uw gebruikersnaam in.", "red");
        return;
    }

    if (!password) {
        showNotification(notification, "Vul uw wachtwoord in.", "red");
        return;
    }

    const user = users.find(
        (user) => user.username === username && user.password === password
    );

    if (user) {
        showNotification(notification, "Inloggen succesvol!", "green");
        if (inlogsubmit) inlogsubmit.disabled = true;
        window.location.href = "dashboard.html";
    } else {
        showNotification(notification, "Ongeldige gebruikersnaam of wachtwoord.", "red");
        passwordInput.value = "";
        passwordInput.focus();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById('gebruikersnaam');
    const passwordInput = document.getElementById('wachtwoord');
    const loginForm = document.getElementById('loginForm');

    // LOGIN PAGINA
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            login();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") login();
        });
    }
    if (usernameInput) {
        usernameInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") login();
        });
    }

    // SIGNUP PAGINA
    const aanmeldsubmit = document.getElementById('aanmeldsubmit');
    const signupForm = document.getElementById('signupForm');

    if (signupForm && aanmeldsubmit) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("U heeft een account gemaakt!");
            window.location.href = "dashboard.html";
        });
    }
});


 const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");
  const backdrop = document.getElementById("backdrop");
  const form = document.getElementById("form");

  const nameInput = document.getElementById("name");
  const typeSelect = document.getElementById("type");

  const cardsEl = document.getElementById("cards");
  const countText = document.getElementById("countText");
  const totalText = document.getElementById("totalText");
  const nrText = document.getElementById("nrText");
  const lastAction = document.getElementById("lastAction");

  // Storage
  const STORAGE_KEY = "novatrust_accounts_v1";

  /** @type {{id:string,name:string,type:string,balance:number,createdAt:number}[]} */
  let accounts = loadAccounts();

  // ----- Helpers -----
  function saveAccounts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }

  function loadAccounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // basic shape guard
      if (!Array.isArray(parsed)) return [];
      return parsed.map(a => ({
        id: String(a.id ?? crypto.randomUUID?.() ?? Date.now()),
        name: String(a.name ?? "Rekening"),
        type: String(a.type ?? "Betaal"),
        balance: Number(a.balance ?? 0),
        createdAt: Number(a.createdAt ?? Date.now())
      }));
    } catch {
      return [];
    }
  }

  function formatEUR(value) {
    // value is number
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR"
    }).format(value);
  }

  function setLast(text) {
    if (!lastAction) return;
    lastAction.textContent = text;
  }

  function openModal() {
    backdrop.classList.remove("hidden");
    nameInput?.focus();
  }

  function closeModal() {
    backdrop.classList.add("hidden");
    form?.reset();
    if (typeSelect) typeSelect.selectedIndex = 0;
  }

  function totalBalance() {
    return accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  }

  function updateStats() {
    const n = accounts.length;
    if (countText) countText.textContent = `${n} rekening${n === 1 ? "" : "en"}`;
    if (nrText) nrText.textContent = String(n);
    if (totalText) totalText.textContent = formatEUR(totalBalance());
  }

  function render() {
    if (cardsEl) {
  cardsEl.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const id = e.target.dataset.id;
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    if (!confirm(`Rekening "${acc.name}" verwijderen? Dit kan niet ongedaan.`)) {
      return;
    }

    accounts = accounts.filter(a => a.id !== id);
    saveAccounts();
    render();
    setLast(`🗑️ Rekening verwijderd: ${acc.name}`);
  });
}

    if (!cardsEl) return;

    // empty state
    if (accounts.length === 0) {
      cardsEl.innerHTML = `
        <div class="card">
          <p style="margin:0 0 6px; font-weight:700;">Nog geen rekeningen</p>
          <p style="margin:0; color: rgba(255,255,255,0.65); font-size: 13px;">
            Klik op “+ Nieuwe rekening” om te beginnen.
          </p>
        </div>
      `;
      updateStats();
      return;
    }

    cardsEl.innerHTML = accounts
  .map(a => {
    const safeName = escapeHtml(a.name);
    const safeType = escapeHtml(a.type);

    return `
      <div class="card" data-id="${a.id}">
        <div style="display:flex; justify-content:space-between; gap:10px;">
          <div>
            <div style="font-weight:800;">${safeName}</div>
            <div style="font-size:12px; opacity:.7;">${safeType}</div>
          </div>

          <div style="text-align:right;">
            <div>${formatEUR(a.balance)}</div>
            <button class="delete-btn" data-id="${a.id}">Verwijder</button>
          </div>
        </div>
      </div>
    `;
  })
  .join("");

    updateStats();
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  //  Create account 
  function createAccount(name, type) {
    const account = {
      id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
      name: name.trim(),
      type,
      balance: parseFloat((Math.random() * 1000).toFixed(2)),
      createdAt: Date.now()
    };

    accounts.unshift(account);
    saveAccounts();
    render();
    setLast(`+ Nieuwe rekening: ${account.name} (${account.type})`);
  }

  //  Events 
  openBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);

  // click on dark backdrop closes modal
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  // escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop && !backdrop.classList.contains("hidden")) {
      closeModal();
    }
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput?.value ?? "";
    const type = typeSelect?.value ?? "Betaal";

    if (!name.trim()) {
      nameInput?.focus();
      return;
    }

    createAccount(name, type);
    closeModal();
  });

  render();
  updateStats();
    
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // accounts uit dashboard 
  let accounts = JSON.parse(localStorage.getItem("novatrust_accounts_v1")) || [
    { id: "1", name: "Betaalrekening", balance: 35000 },
    { id: "2", name: "Spaarrekening", balance: 1200 }
  ];

  const fromAcc = document.getElementById("fromAcc");
  const toAcc = document.getElementById("toAcc");
  const amountInput = document.getElementById("amount");
  const passwordInput = document.getElementById("password");
  const msg = document.getElementById("transferMsg");
  const successBox = document.getElementById("successBox");
  const successText = document.getElementById("successText");

  // accounts laden
  function loadOptions(){
    fromAcc.innerHTML = "";
    toAcc.innerHTML = "";
    accounts.forEach(acc => {
      fromAcc.innerHTML += `<option value="${acc.id}">${acc.name} (€${acc.balance})</option>`;
      toAcc.innerHTML += `<option value="${acc.id}">${acc.name}</option>`;
    });
  }
  loadOptions();

  document.getElementById("transferForm").addEventListener("submit", e => {
    e.preventDefault();
    msg.textContent = "";
    successBox.style.display = "none";

    const from = accounts.find(a => a.id === fromAcc.value);
    const to = accounts.find(a => a.id === toAcc.value);
    const amount = Number(amountInput.value);
    const password = passwordInput.value;

    // VALIDATIE
    if (from.id === to.id) {
      msg.style.color = "red";
      msg.textContent = "Je kunt niet naar dezelfde rekening overschrijven.";
      return;
    }
    if (amount <= 0) {
      msg.style.color = "red";
      msg.textContent = "Vul een geldig bedrag in.";
      return;
    }
    if (from.balance < amount) {
      msg.style.color = "red";
      msg.textContent = "Onvoldoende saldo.";
      return;
    }

    // wachtwoord check
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === user);
    if (!currentUser || currentUser.password !== password) {
      msg.style.color = "red";
      msg.textContent = "Onjuist wachtwoord.";
      return;
    }

    // TRANSACTIE
    from.balance -= amount;
    to.balance += amount;
    localStorage.setItem("accounts", JSON.stringify(accounts));

    successText.textContent = `€${amount.toFixed(2)} succesvol overgeschreven van ${from.name} naar ${to.name}.`;
    successBox.style.display = "block";
    msg.style.color = "green";
    msg.textContent = "Transactie geslaagd!";
    loadOptions();
  });
});


const transactions = [
  { id: 1, type: "inkomend", datum: "2026-01-01", bedrag: 300 },
  { id: 2, type: "uitgaand", datum: "2025-11-03", bedrag: -50 },
  { id: 3, type: "inkomend", datum: "2025-11-05", bedrag: 19900 },
  { id: 4, type: "uitgaand", datum: "2025-11-10", bedrag: -30 }
];

function showTransactions(list) {
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  list.forEach(t => {
    container.innerHTML += `
      <div class="transaction ${t.type}">
        <strong>Type:</strong> ${t.type}<br>
        <strong>Datum:</strong> ${t.datum}<br>
        <strong>Bedrag:</strong> €${t.bedrag}
      </div>
    `;
  });
}

function filterTransactions() {
  const type = document.getElementById("typeFilter").value;
  const date = document.getElementById("dateFilter").value;

  let filtered = transactions;

  if (type !== "alle") {
    filtered = filtered.filter(t => t.type === type);
  }

  if (date) {
    filtered = filtered.filter(t => t.datum === date);
  }

  showTransactions(filtered);
}

showTransactions(transactions);



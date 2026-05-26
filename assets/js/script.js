document.addEventListener("DOMContentLoaded", () => {

  let saldo = 760;
  let bezit = {};

  const data = {
    aandelen: {
      TechCorp: 120,
      GreenEnergy: 80,
      HealthPlus: 95,
      AutoDrive: 150
    },
    crypto: {
      BitNova: 45,
      EtherX: 60,
      CoinZ: 25,
      BlockMax: 110
    }
  };

  const categorie = document.getElementById("categorie");
  const product = document.getElementById("product");
  const prijsSpan = document.getElementById("prijs");
  const saldoSpan = document.getElementById("saldo");
  const aantalInput = document.getElementById("aantal");

  if (!categorie || !product) {
    console.error("Categorie of product select bestaat niet");
    return;
  }

  function updateProducten() {
    product.innerHTML = "";

    const items = data[categorie.value];
    if (!items) return;

    Object.keys(items).forEach(naam => {
      const opt = document.createElement("option");
      opt.value = naam;
      opt.textContent = naam;
      product.appendChild(opt);
    });

    updatePrijs();
  }

  function updatePrijs() {
    const prijs = data[categorie.value]?.[product.value];
    if (prijsSpan && prijs !== undefined) {
      prijsSpan.textContent = prijs.toFixed(2);
    }
  }

  function kopen() {
    const aantal = Number(aantalInput.value);
    const prijs = data[categorie.value][product.value];
    const totaal = prijs * aantal;

    if (aantal <= 0) return;

    if (totaal > saldo) {
      window.alert("Niet genoeg saldo");
      return;
    }

    saldo -= totaal;
    bezit[product.value] = (bezit[product.value] || 0) + aantal;
    updateUI();
  }

  function verkopen() {
    const aantal = Number(aantalInput.value);
    const prijs = data[categorie.value][product.value];

    if (!bezit[product.value] || bezit[product.value] < aantal) {
      window.alert("Niet genoeg bezit");
      return;
    }

    bezit[product.value] -= aantal;
    saldo += prijs * aantal;
    updateUI();
  }

  function updateUI() {
    if (saldoSpan) {
      saldoSpan.textContent = saldo.toFixed(2);
    }
  }

  categorie.addEventListener("change", updateProducten);
  product.addEventListener("change", updatePrijs);

  updateProducten();

  window.kopen = kopen;
  window.verkopen = verkopen;
});
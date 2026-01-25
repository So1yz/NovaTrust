let balance = 1000;

let prices = {
  btc: 90000,
  eth: 4800,
  ltc: 250
};

let portfolio = {
  btc: 0,
  eth: 0,
  ltc: 0
};

function updatePrices() {
  for (let coin in prices) {
    let old = prices[coin];
    prices[coin] += (Math.random() - 0.5) * prices[coin] * 0.01;

    let el = document.getElementById(coin);
    el.textContent = coin.toUpperCase() + ": €" + prices[coin].toFixed(2);
    el.className = prices[coin] > old ? "up" : "down";
  }
}

setInterval(updatePrices, 3000);
function updateBalance() {
  document.getElementById("balance").textContent =
    "Saldo: €" + balance.toFixed(2);
}
function buy() {
  let coin = document.getElementById("coin").value;
  let amount = Number(document.getElementById("amount").value);

  if (amount > balance) {
    alert("Niet genoeg saldo");
    return;
  }

  balance -= amount;
  portfolio[coin] += amount / prices[coin];

  updateBalance();
  renderPortfolio();
}


function sell() {
  let coin = document.getElementById("coin").value;

  let value = portfolio[coin] * prices[coin];
  balance += value;
  portfolio[coin] = 0;

  updateBalance();
  renderPortfolio();
}


function renderPortfolio() {
  let ul = document.getElementById("portfolio");
  ul.innerHTML = "";
  for (let coin in portfolio) {
    if (portfolio[coin] > 0) {
      let li = document.createElement("li");
      li.textContent =
        coin.toUpperCase() +
        ": " +
        portfolio[coin].toFixed(4) +
        " (waarde €" +
        (portfolio[coin] * prices[coin]).toFixed(2) +
        ")";
      ul.appendChild(li);
    }
  }
}

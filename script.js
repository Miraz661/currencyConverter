let date = new Date();
const month =
  date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
const base_url = `https://${date.getFullYear()}-${month}-${day}.currency-api.pages.dev/v1/currencies/`;

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const fromValue = document.querySelector(".fromValue");
const msg = document.querySelector(".msg");
const inputAmount = document.querySelector("form input");

window.onload = async () => {
  msg.textContent = "Loading exchange rate...";
  let rate = await loadData();
  if (rate) {
    msg.textContent = `1 USD = ${rate.toFixed(2)} BDT`;
  }
};

for (let select of dropdowns) {
  for (let code in countryList) {
    let newOption = document.createElement("option");
    newOption.textContent = code;
    newOption.value = code;
    if (
      (select.name === "from" && code === "USD") ||
      (select.name === "to" && code === "BDT")
    ) {
      newOption.selected = true;
    }
    select.appendChild(newOption);
  }
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

const updateFlag = (ele) => {
  let currCode = ele.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
  let img = ele.parentElement.querySelector("img");
  img.src = newSrc;
};

const loadData = async () => {
  if (inputAmount.value === "" || inputAmount.value < 1) {
    inputAmount.value = 1;
  }
  let currentAmount = inputAmount.value;
  let url = `${base_url}${fromCurr.value.toLowerCase()}.json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    let rateList = data[fromCurr.value.toLowerCase()];
    let rate = rateList[toCurr.value.toLowerCase()];
    if (rate) {
      return rate;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let rate = await loadData();
  if (!rate) return;
  let totalAmount = (rate * inputAmount.value).toFixed(2);
  msg.textContent = `${inputAmount.value} ${fromCurr.value} = ${totalAmount} ${toCurr.value}`;
});

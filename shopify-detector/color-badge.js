const radios = document.querySelectorAll('input[type="radio"][name^="Color-"]');
let color="";
radios.forEach(radio => {
  if (radio.checked) {
    // console.log(radio.value);
    color = radio.value;
  }
});

const badge = document.createElement("div");
badge.innerText = "Built with Shopify";
badge.className="badge";
badge.style.cssText = `
    position: absolute;
    top: 1%;
    left: 1%;
    background:${color};
    color: #000;
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    text-align: center;
    z-index: 999999;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    font-family: sans-serif;
`;

var container=document.querySelector(".product__modal-opener");
container.append(badge);
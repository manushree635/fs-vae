const METHODS = ["SD-VAE ft-MSE", "Finetune (ℓ1 + LPIPS + GAN)", "FS-VAE", "FS-VAE (fine → coarse)"];
// [image prefix, F-Sim per method]; image _c0 = full input, _c1 = ground-truth crop, _c2.._c5 = methods
const EXAMPLES = [
  ["f8_r0", [0.314, 0.354, 0.355, 0.416]],
  ["f8_r1", [0.604, 0.611, 0.624, 0.638]],
  ["f8_r2", [0.226, 0.266, 0.280, 0.300]],
  ["f11_r0", [0.168, 0.208, 0.214, 0.237]],
  ["f11_r3", [0.099, 0.121, 0.146, 0.129]],
  ["f11_r4", [0.161, 0.196, 0.203, 0.192]],
  ["f11_r5", [0.253, 0.252, 0.274, 0.270]],
];
const IMG = "./static/images/";
let ex = 0, m = 2;
const $ = id => document.getElementById(id);
const stage = $("stage"), slider = $("slider");

function render() {
  const [p, scores] = EXAMPLES[ex];
  $("imgL").src = `${IMG}${p}_c1.jpg`;
  $("imgL").alt = "Ground-truth face crop";
  $("imgR").src = `${IMG}${p}_c${m + 2}.jpg`;
  $("imgR").alt = `${METHODS[m]} reconstruction`;
  $("ctx").src = `${IMG}${p}_c0.jpg`;
  $("tagR").textContent = METHODS[m];
  const best = Math.max(...scores);
  $("methods").innerHTML = METHODS.map((name, i) =>
    `<button type="button" data-m="${i}" aria-pressed="${i === m}" class="${scores[i] === best ? "best" : ""}">
      <span>${name}</span><span class="fs">${scores[i].toFixed(3)}</span></button>`).join("");
  [...$("thumbs").children].forEach((b, i) => b.setAttribute("aria-pressed", i === ex));
}

$("thumbs").innerHTML = EXAMPLES.map(([p], i) =>
  `<button type="button" aria-label="Example ${i + 1}"><img src="${IMG}${p}_c1.jpg" alt=""></button>`).join("");
$("thumbs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  ex = [...$("thumbs").children].indexOf(b); render();
});
$("methods").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  m = +b.dataset.m; render();
});

function setX(pct) {
  pct = Math.max(0, Math.min(100, pct));
  stage.style.setProperty("--x", pct + "%");
  slider.value = pct;
}
slider.addEventListener("input", () => setX(+slider.value));
let dragging = false;
const fromEvent = e => { const r = stage.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100); };
stage.addEventListener("pointerdown", e => { dragging = true; stage.setPointerCapture(e.pointerId); fromEvent(e); });
stage.addEventListener("pointermove", e => { if (dragging) fromEvent(e); });
stage.addEventListener("pointerup", () => { dragging = false; });

render();

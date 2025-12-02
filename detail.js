let data;
let eruptions = [];
let selectedName;
let selectedYear = 0;
let selectedNumber = 0;
let currentIndex = 0;

// immagini vulcano
let stratoImg, calderaImg, complexImg, cinderImg, compoundImg, craterImg, fissureImg;
let lava_coneImg, lava_domeImg, maarImg, pumiceImg, pyroclastic_coneImg, pyroclastic_shieldImg;
let shieldImg, subglacialImg, submarineImg, tuffImg, volcanic_fieldImg;

// immagine mappa
let worldMap; 

function preload() {
  data = loadTable("assets/data_impatto.csv", "csv", "header");
  worldMap = loadImage("assets/world_map.png");

  // preload illustrazioni
  stratoImg = loadImage("assets/illustrations/stratovolcano.png");
  calderaImg = loadImage("assets/illustrations/caldera.png");
  complexImg = loadImage("assets/illustrations/complex_volcano.png");
  cinderImg = loadImage("assets/illustrations/cinder_cone.png");
  compoundImg = loadImage("assets/illustrations/compound_volcano.png");
  craterImg = loadImage("assets/illustrations/crater_rows.png");
  fissureImg = loadImage("assets/illustrations/fissure_vent.png");
  lava_coneImg = loadImage("assets/illustrations/lava_cone.png");
  lava_domeImg = loadImage("assets/illustrations/lava_dome.png");
  maarImg = loadImage("assets/illustrations/maar.png");
  pumiceImg = loadImage("assets/illustrations/pumice_cone.png");
  pyroclastic_coneImg = loadImage("assets/illustrations/pyroclastic_cone.png");
  pyroclastic_shieldImg = loadImage("assets/illustrations/pyroclastic_shield.png");
  shieldImg = loadImage("assets/illustrations/shield_volcano.png");
  subglacialImg = loadImage("assets/illustrations/subglacial_volcano.png");
  submarineImg = loadImage("assets/illustrations/submarine.png");
  tuffImg = loadImage("assets/illustrations/tuff_cone.png");
  volcanic_fieldImg = loadImage("assets/illustrations/volcanic_field.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");

  selectedName = getQueryParam("name");
  selectedYear = int(getQueryParam("year"));
  selectedNumber = int(getQueryParam("number"));

  if (!selectedName) return;

  // popola eruptions[] filtrando per Name
  for (let i = 0; i < data.getRowCount(); i++) {
    if (data.getString(i, "Name") === selectedName) {
      eruptions.push({
        year: int(data.getString(i, "Year")),
        type: data.getString(i, "Type") || "Unknown",
        deaths: data.getString(i, "Deaths") || "Not Available",
        number: int(data.getString(i, "Number")),
        lat: float(data.getString(i, "Latitude")),
        lon: float(data.getString(i, "Longitude")),
      });
    }
  }

  // ordina per anno
  eruptions.sort((a, b) => a.year - b.year);

  // sincronizza currentIndex con number o year
  if (!isNaN(selectedNumber) && selectedNumber > 0) {
    const idxByNumber = eruptions.findIndex(e => e.number === selectedNumber);
    if (idxByNumber !== -1) currentIndex = idxByNumber;
  } else if (!isNaN(selectedYear) && selectedYear > 0) {
    const idxByYear = eruptions.findIndex(e => e.year === selectedYear);
    if (idxByYear !== -1) {
      currentIndex = idxByYear;
      selectedNumber = eruptions[currentIndex].number;
    }
  }

  // fallback (primo elemento)
  if (eruptions.length > 0 && currentIndex === 0) {
    selectedYear = eruptions[0].year;
    selectedNumber = eruptions[0].number;
  }
}

function draw() {
  background("#FFFFFF");

  if (eruptions.length === 0) {
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Nessun vulcano selezionato", 50, 50);
    drawBackButton();
    return;
  }

  const selected = eruptions[currentIndex];


  // mappa accanto al titolo (in alto a destra)
  drawMap(selected.lat, selected.lon);

 // illustrazione + titolo
  drawVolcanoType(selected.type);

  // titolo
  writeText();

  // navigatore anni (spostato più a destra e più in basso)
  drawYearNavigator(selected.year);

  // back button
  drawBackButton();

  // disegno grafico
  drawImpactChart(selected);

}

// --- UTILS ---
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// disegna illustrazione con varianti e fallback
function drawVolcanoType(typeRaw) {
  const type = (typeRaw || "").trim().toLowerCase();

  push();
  translate(width - 500, height - 350);
  imageMode(CENTER);

  switch (type) {
    case "caldera": image(calderaImg, 0, 0, 1250, 750); break;
    case "cinder cone": image(cinderImg, 0, 0, 1250, 750); break;
    case "complex volcano":
    case "complex vulcano": image(complexImg, 0, 0, 1250, 750); break;
    case "compound volcano": image(compoundImg, 0, 0, 1250, 750); break;
    case "crater rows": image(craterImg, 0, 0, 1250, 750); break;
    case "fissure vent": image(fissureImg, 0, 0, 1250, 750); break;
    case "lava cone": image(lava_coneImg, 0, 0, 1250, 750); break;
    case "lava dome": image(lava_domeImg, 0, 0, 1250, 750); break;
    case "maar": image(maarImg, 0, 0, 1250, 750); break;
    case "pumice cone": image(pumiceImg, 0, 0, 1250, 750); break;
    case "pyroclastic cone": image(pyroclastic_coneImg, 0, 0, 1250, 750); break;
    case "pyroclastic shield": image(pyroclastic_shieldImg, 0, 0, 1250, 750); break;
    case "shield volcano": image(shieldImg, 0, 0, 1250, 750); break;
    case "stratovolcano":
    case "strato volcano": image(stratoImg, 0, 0, 1250, 750); break;
    case "subglacial volcano": image(subglacialImg, 0, 0, 1250, 750); break;
    case "submarine volcano": image(submarineImg, 0, 0, 1250, 750); break;
    case "tuff cone": image(tuffImg, 0, 0, 1250, 750); break;
    case "volcanic field": image(volcanic_fieldImg, 0, 0, 1250, 750); break;
    default:
      fill(200);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(24);
      text("Tipo non disponibile", 0, 0);
      break;
  }
  pop();
}

// titolo
function writeText() {
  fill(0);
  textAlign(LEFT, TOP);
  textSize(72);
  textStyle(BOLD);
  text("THE IMPACT OF ", 60, 75);

  fill(245, 40, 0);
  text(selectedName ? selectedName.toUpperCase() : "UNKNOWN", 60, 75 + textAscent() + 5);
}

// mappa accanto al titolo
function drawMap(lat, lon) {
  let mapW = 300;
  let mapH = 150;
  let mapX = width - mapW - 60;
  let mapY = 75;

  // cornice + immagine
  push();
  stroke(245, 40, 0);
  strokeWeight(2);
  noFill();
  rect(mapX, mapY, mapW, mapH);

  tint(245, 40, 0);
  image(worldMap, mapX, mapY, mapW, mapH);
  noTint();
  pop();

  // correzione margini immagine
  let marginX = mapW * 0.05;
  let marginY = mapH * 0.05;

  let x = map(lon, -180, 180, mapX + marginX, mapX + mapW - marginX);
  let y = map(lat, 90, -90, mapY + marginY, mapY + mapH - marginY);

  // marker
  push();
  strokeWeight(2);
  stroke(255);
  fill(0);
  ellipse(x, y, 7, 7);
  pop();
}

function drawImpactChart(selected) {
  let categories = [
    { name: "Deaths", value: parseFloat(selected.deaths) || 0 },
    { name: "Injuries", value: parseFloat(selected.injuries) || 0 },
    { name: "Damage ($Mil)", value: parseFloat(selected.damage) || 0 },
    { name: "Houses Destroyed", value: parseFloat(selected.houses) || 0 }
  ];

  let maxVal = max(categories.map(c => c.value));
  let levels = categories.map(c => ceil(map(c.value, 0, maxVal, 1, 5)));

  let cx = 180;
  let cy = height - 180;
  let baseR = 30;
  let stepR = 15;
  let slice = 360 / categories.length;
  let hovered = getHoveredSlice(cx, cy, baseR, stepR, slice);

  push();
  translate(cx, cy);
  angleMode(DEGREES);

  for (let i = 0; i < categories.length; i++) {
    let start = i * slice;
    let end = start + slice;
    let lvl = levels[i];

    for (let r = 0; r < 5; r++) {
      let rad = baseR + r * stepR;
      let active = r < lvl;
      let alpha = active ? 80 + r * 30 : 20;
      let col = color(255, 0, 0, alpha);

      // hover effect
      if (i === hovered && active) {
        col = color(200, 0, 0, 200);
        rad += 5; // ingrandisce leggermente
      }

      fill(col);
      arc(0, 0, rad * 2, rad * 2, start, end, PIE);
    }

    // etichetta fissa
    let mid = start + slice / 2;
    let lx = cos(mid) * (baseR + 5 * stepR + 20);
    let ly = sin(mid) * (baseR + 5 * stepR + 20);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(categories[i].name, lx, ly);
  }

  // titolo
  fill(0);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("LEVELS OF IMPACT", 0, -baseR - 5 * stepR - 30);
  pop();

  // tooltip
  if (hovered !== -1) {
    let cat = categories[hovered];
    drawTooltip(mouseX, mouseY, cat.name, cat.value);
  }
}

function getHoveredSlice(cx, cy, baseR, stepR, sliceAngle) {
  let dx = mouseX - cx;
  let dy = mouseY - cy;
  let dist = sqrt(dx * dx + dy * dy);
  if (dist < baseR || dist > baseR + 5 * stepR) return -1;

  let angle = degrees(atan2(dy, dx));
  if (angle < 0) angle += 360;
  return floor(angle / sliceAngle);
}

function drawTooltip(x, y, label, valueRaw) {
  // se il valore non è disponibile, mostra N/A
  let value = (valueRaw && valueRaw !== "Not Available") ? valueRaw : "N/A";

  let w = 160;
  let h = 45;

  // rettangolo bianco con bordo nero
  fill(255);
  stroke(0);
  rect(x, y, w, h, 6);

  // testo dentro
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`${label}: ${value}`, x + 10, y + h / 2);
}


// back button
function drawBackButton() {
  noStroke();
  fill(0);
  textSize(18);
  textAlign(LEFT, TOP);
  text("← BACK", 20, 20);
}

// navigatore anni (frecce + anno centrati a destra e più in basso)
function drawYearNavigator(year) {
  const y = height - 60;        
  const navigatorX = width - 120;

  textAlign(CENTER, CENTER);
  fill(0);

  // sinistra
  textSize(36);
  text("<", navigatorX - 70, y);

  // anno
  push();
  fill(245, 4, 0);
  textSize(48);
  text(year, navigatorX, y);
  pop();

  // destra
  textSize(36);
  text(">", navigatorX + 70, y);

  // indicatore posizione
  textSize(11);
  text(`${currentIndex + 1} / ${eruptions.length}`, navigatorX, y + 27);
}

function mousePressed() {
  // back button
  if (mouseX > 20 && mouseX < 100 && mouseY > 20 && mouseY < 50) {
    window.location.href = "index.html";
    return;
  }

  // stesse coordinate usate in drawYearNavigator
  const y = height - 60;        // più in basso
  const navigatorX = width - 120; // più a destra

  // freccia sinistra "<"
if (mouseX > navigatorX - 90 && mouseX < navigatorX - 50 &&
    mouseY > y - 20 && mouseY < y + 20) {
  if (currentIndex > 0) {
    currentIndex--;
    selectedYear = eruptions[currentIndex].year;
    selectedNumber = eruptions[currentIndex].number;
  }
  return;
}

// freccia destra ">"
if (mouseX > navigatorX + 50 && mouseX < navigatorX + 90 &&
    mouseY > y - 20 && mouseY < y + 20) {
  if (currentIndex < eruptions.length - 1) {
    currentIndex++;
    selectedYear = eruptions[currentIndex].year;
    selectedNumber = eruptions[currentIndex].number;
  }
  return;
}

  /*
  // freccia sinistra "<"
  if (mouseX > navigatorX - 90 && mouseX < navigatorX - 50 &&
      mouseY > y - 20 && mouseY < y + 20) {
    if (currentIndex > 0) {
      currentIndex--;
      const e = eruptions[currentIndex];
      const href = `detail.html?name=${encodeURIComponent(selectedName)}&year=${e.year}&number=${e.number}`;
      window.location.href = href;
    }
    return;
  }

  // freccia destra ">"
  if (mouseX > navigatorX + 50 && mouseX < navigatorX + 90 &&
      mouseY > y - 20 && mouseY < y + 20) {
    if (currentIndex < eruptions.length - 1) {
      currentIndex++;
      const e = eruptions[currentIndex];
      const href = `detail.html?name=${encodeURIComponent(selectedName)}&year=${e.year}&number=${e.number}`;
      window.location.href = href;
    }
    return;
  }
    */
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
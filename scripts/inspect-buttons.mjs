import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const ROOT = "https://abdulrehmansarwar.vercel.app";
fs.mkdirSync("button-check", { recursive: true });
const browser = await chromium.launch({headless:true,args:["--no-sandbox"]});
const failures = [];
const samples = [];

async function inspect(route, viewport, label) {
  const page = await browser.newPage({viewport,deviceScaleFactor:1});
  await page.goto(ROOT+route+"?visual-check="+Date.now(), {waitUntil:"networkidle",timeout:60000});
  await page.screenshot({path:path.join("button-check", label+".png"),fullPage:true});
  const info = await page.locator('a[data-button-system="unified-v3"]').evaluateAll(elements =>
    elements.map(a => {
      const css = getComputedStyle(a);
      const icon = a.querySelector(".neo-action__icon");
      return {
        text:a.innerText.replace(/\s+/g," ").trim(),
        href:a.getAttribute("href"),
        variant:a.getAttribute("data-neo-action"),
        background:css.backgroundImage,
        color:css.color,
        radius:css.borderRadius,
        boxShadow:css.boxShadow,
        height:a.getBoundingClientRect().height,
        width:a.getBoundingClientRect().width,
        fontSize:css.fontSize,
        iconSize:icon ? getComputedStyle(icon).width : null,
      };
    })
  );
  if (info.length===0) failures.push(label+": missing unified-v3 controls");
  for (const item of info) {
    if (item.radius !== "13px") failures.push(label+": radius for "+item.text+" is "+item.radius);
    if (item.boxShadow === "none") failures.push(label+": no shadow for "+item.text);
    if (!item.background.includes("linear-gradient")) failures.push(label+": expected neumorphic gradient "+item.text);
    if (item.height < 40) failures.push(label+": insufficient tap height "+item.text);
  }
  const width=await page.evaluate(() => ({
    doc:document.documentElement.scrollWidth,
    viewport:window.innerWidth,
  }));
  if (viewport.width===390 && width.doc>width.viewport+5) failures.push(label+": horizontal overflow "+JSON.stringify(width));
  samples.push({label,route,viewport,buttons:info,layout:width});
  console.log(label+": "+info.length+" unified buttons; "+info.map(x=>x.text+" ["+x.variant+"] "+x.radius).join(" | "));
  await page.close();
}
try {
  await inspect("/",{width:1280,height:800},"home-desktop");
  await inspect("/",{width:390,height:844},"home-mobile");
  await inspect("/work/ocean-yacht-registration",{width:1280,height:800},"case-study-desktop");
  await inspect("/services",{width:390,height:844},"services-mobile");
  await inspect("/contact",{width:390,height:844},"contact-mobile");
} finally {await browser.close();}
fs.writeFileSync("button-check/results.json",JSON.stringify({samples,failures},null,2));
console.log("CHECK RESULTS",JSON.stringify({pages:samples.length,buttons:samples.reduce((n,a)=>n+a.buttons.length,0),failures},null,2));
if(failures.length)process.exitCode=1;

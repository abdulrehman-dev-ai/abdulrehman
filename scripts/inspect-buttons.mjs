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
  const response = await page.goto(ROOT+route, {waitUntil:"networkidle",timeout:60000});
  await page.waitForTimeout(600);
  const diagnostic = await page.evaluate(() => ({
    url:location.href,
    rootClass:document.documentElement.className,
    theme:document.documentElement.getAttribute("data-theme"),
    heading:document.querySelector("h1")?.textContent?.slice(0,100),
    body:document.body?.innerText?.slice(0,650),
    allAnchors:document.querySelectorAll("a[href]").length,
    actionAnchors:document.querySelectorAll(".neo-action").length,
    versionedAnchors:document.querySelectorAll("[data-button-system]").length,
  }));
  console.log(label+" diagnostic "+JSON.stringify({status:response?.status(),...diagnostic}));
  await page.screenshot({path:path.join("button-check", label+".png"),fullPage:true});
  const info = await page.locator('a.neo-action').evaluateAll(elements =>
    elements.map(a => {
      const css = getComputedStyle(a);
      const icon = a.querySelector(".neo-action__icon");
      return {
        text:a.innerText.replace(/\s+/g," ").trim(),
        href:a.getAttribute("href"),
        variant:a.getAttribute("data-neo-action"),
        system:a.getAttribute("data-button-system"),
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
    if (item.system !== "unified-v3") failures.push(label+": missing current design marker for "+item.text);
    if (item.radius !== "13px") failures.push(label+": radius for "+item.text+" is "+item.radius);
    if (item.boxShadow === "none") failures.push(label+": no shadow for "+item.text);
    if (!item.background.includes("linear-gradient")) failures.push(label+": expected neumorphic gradient "+item.text);
    if (item.height < 40) failures.push(label+": insufficient tap height "+item.text);
  }
  const type = await page.evaluate(() => {
    const h1=document.querySelector("h1");
    const h2=document.querySelector("h2");
    const paragraph=document.querySelector("main p, section p, article p, p");
    const family=(el)=>el?getComputedStyle(el).fontFamily:"";
    const size=(el)=>el?parseFloat(getComputedStyle(el).fontSize):0;
    const bounding=h1?.getBoundingClientRect();
    return {
      bodyFont:family(document.body),
      headingFont:family(h1),
      sectionFont:family(h2),
      textFont:family(paragraph),
      h1Size:size(h1),
      h2Size:size(h2),
      paragraphSize:size(paragraph),
      lineHeight:paragraph?getComputedStyle(paragraph).lineHeight:"",
      fontReady:document.fonts.status,
      overflow:h1?bounding.right>innerWidth+6:false,
    };
  });
  if(!/inter/i.test(type.bodyFont)) failures.push(label+": Inter body font not applied: "+type.bodyFont);
  if(!/manrope/i.test(type.headingFont)) failures.push(label+": Manrope headline not applied: "+type.headingFont);
  if(type.h1Size<32) failures.push(label+": headline too small: "+type.h1Size);
  if(type.overflow) failures.push(label+": headline extends beyond viewport");
  if(type.fontReady!=="loaded") failures.push(label+": font resources not loaded");
  console.log(label+" typography "+JSON.stringify(type));
  const width=await page.evaluate(() => ({
    doc:document.documentElement.scrollWidth,
    viewport:window.innerWidth,
  }));
  if (viewport.width===390 && width.doc>width.viewport+5) failures.push(label+": horizontal overflow "+JSON.stringify(width));
  samples.push({label,route,viewport,buttons:info,typography:type,layout:width});
  console.log(label+": "+info.length+" unified buttons; "+info.map(x=>x.text+" ["+x.variant+"] "+x.radius).join(" | "));
  await page.close();
}
try {
  await inspect("/",{width:1280,height:800},"home-desktop");
  await inspect("/",{width:390,height:844},"home-mobile");
  await inspect("/work/ocean-yacht-registration",{width:1280,height:800},"case-study-desktop");
  await inspect("/services",{width:390,height:844},"services-mobile");
  await inspect("/contact",{width:390,height:844},"contact-mobile");
  await inspect("/about",{width:390,height:844},"about-mobile");
  await inspect("/blog",{width:390,height:844},"journal-mobile");
  await inspect("/work",{width:1280,height:800},"work-desktop");
  await inspect("/blog/registration-platform-lessons",{width:1280,height:800},"article-desktop");
} finally {await browser.close();}
fs.writeFileSync("button-check/results.json",JSON.stringify({samples,failures},null,2));
console.log("CHECK RESULTS",JSON.stringify({pages:samples.length,buttons:samples.reduce((n,a)=>n+a.buttons.length,0),failures},null,2));
if(failures.length)process.exitCode=1;

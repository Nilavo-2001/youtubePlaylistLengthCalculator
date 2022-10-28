const puppeteer = require("puppeteer");
const url =
  "https://www.youtube.com/playlist?list=PLRBp0Fe2GpglJwMzaCkRtI_BqQgU_O6Oy";
analyse(url);
const selector = "span.style-scope.ytd-thumbnail-overlay-time-status-renderer";
let page;

async function analyse(url) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.goto(url);
  await scrollTillEnd();
  let list = await page.evaluate(getList, selector);
  let reqTime = calTime(list);
  page.evaluate((reqTime) => {
    window.alert(reqTime);
  }, reqTime);
  console.log(reqTime);
}

async function scrollTillEnd() {
  let curVideos = await page.evaluate(noOfVideos, selector);
  let prev = curVideos;
  await page.waitForSelector(".style-scope.ytd-browse.grid.grid-disabled");
  let height = await page.evaluate((selector) => {
    return document.querySelector(selector).scrollHeight;
  }, ".style-scope.ytd-browse.grid.grid-disabled");
  while (true) {
    await page.evaluate((height) => {
      window.scrollBy(0, height);
    }, height);
    await wait(1000);
    curVideos = await page.evaluate(noOfVideos, selector);
    if (curVideos <= prev) {
      break;
    }
    prev = curVideos;
  }
}

function noOfVideos(selector) {
  let videos = document.querySelectorAll(selector);
  return videos.length;
}

function getList(selector) {
  let videos = document.querySelectorAll(selector);
  let list = [];
  videos.forEach((ele) => {
    if (!ele.innerText.includes("\n")) {
      list.push(ele.innerText);
    } else {
      list.push(ele.innerText.substring(3, ele.innerText.length - 1));
    }
  });
  return list;
}

function calTime(list) {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  list.forEach((ele, index) => {
    let arr = ele.split(":");
    if (arr.length == 2) {
      minutes += parseInt(arr[0]);
      seconds += parseInt(arr[1]);
    } else {
      hours += parseInt(arr[0]);
      minutes += parseInt(arr[1]);
      seconds += parseInt(arr[2]);
    }
  });
  let totalSeconds = seconds % 60;
  let totalMinutes = (minutes + parseInt(seconds / 60)) % 60;
  let totalHours = parseInt(hours + (minutes + parseInt(seconds / 60)) / 60);
  return `Hours: ${totalHours} Minutes: ${totalMinutes} Seconds: ${totalSeconds}`;
}

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

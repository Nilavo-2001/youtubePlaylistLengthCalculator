const puppeteer = require("puppeteer");
const url =
  "https://www.youtube.com/playlist?list=PL1QH9gyQXfgs7foRxIbIH8wmJyDh5QzAm";
analyse(url, 114);
const selector = "span.style-scope.ytd-thumbnail-overlay-time-status-renderer";
let page;

async function analyse(url, totalVideos) {
  console.log(new Date().toLocaleTimeString());
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.goto(url);
  await scrollTillEnd(totalVideos);
  let list = await page.evaluate(getList, selector);
  //console.log(list);
  console.log(calTime(list));
}

async function scrollTillEnd(totalVideos) {
  let curVideos = await page.evaluate(noOfVideos, selector);
  while (curVideos != totalVideos) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    curVideos = await page.evaluate(noOfVideos, selector);
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
  console.log(new Date().toLocaleTimeString());
  return `Hours: ${totalHours} Minutes: ${totalMinutes} Seconds: ${totalSeconds}`;
}

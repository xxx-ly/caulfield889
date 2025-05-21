var trackChange = null;
var pageDelayed = 1000;
var mobileWidth = 1024;
var googleTranslateInitialized = false; // 確保只初始化一次
var isSyncing = false; // 用來防止迴圈觸發
var apiDomain =
  window.location.host === "localhost"
    ? "http://localhost/lmtdwine"
    : location.protocol + "//" + window.location.host;
var pageLanguage = location.pathname.indexOf("/en/") >= 0 ? "en" : "zh-TW"; // 網頁預設語言
// console.log("頁面語言", pageLanguage)

document.addEventListener("DOMContentLoaded", function () {
  window.onload = adjustGoogleTranslateVisibility;
  window.onresize = adjustGoogleTranslateVisibility;

  // 監聽翻譯初始化狀況
  waitForGoogleTranslate(function () {
    var translateSelectLang = document.querySelector(".goog-te-combo").value;
    var googleCookie = getGoogleTranslateCookie(); // 可能輸出 "/zh-TW/en" 或 "/zh-TW/zh-TW" 等 (/原始語言/目標語言)
    var targetLang = googleCookie.split("/")[2];
    // console.log("初始語言", translateSelectLang);
    // console.log("初始cookie", googleCookie);
    // console.log("目標語言為", targetLang);

    // 如果發現語言與預設的 `zh-TW` 或 `en` 不符，則重置翻譯
    if (
      googleCookie &&
      googleCookie !== "/zh-TW/" + pageLanguage &&
      googleCookie !== "/zh-CN/" + pageLanguage
    ) {
      // console.log("偵測到不符合的語言設定，目標語言為:", targetLang);
      translateSelectLang = targetLang;
      goTranslate(targetLang); // 取目標語言
    } else if (translateSelectLang !== "") {
      // 如果語言選單已經有值，則自動翻譯
      goTranslate(translateSelectLang);
    }

    translateSelectLang =
      translateSelectLang === "" ? targetLang : translateSelectLang;

    // 初始化語言選擇同步
    initLanguageSync(translateSelectLang);
  });

  // setInterval(() => {
  //     console.log("目前 Google 翻譯 Cookie:", getGoogleTranslateCookie());
  // }, 1000);
});

function adjustGoogleTranslateVisibility() {
  var windowWidth = window.innerWidth;

  var laptopElement = document.getElementsByName("googleTranslateLaptop")[0];
  var mobileElement = document.getElementsByName("googleTranslateMobile")[0];

  if (windowWidth >= mobileWidth) {
    laptopElement.classList.remove("d-none");
    mobileElement.classList.add("d-none");

    if (!googleTranslateInitialized) {
      googleTranslateElementInit();
    }
  } else {
    laptopElement.classList.add("d-none");
    mobileElement.classList.remove("d-none");

    if (!googleTranslateInitialized) {
      googleTranslateElementInit();
    }
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "zh-TW", // 如果設定zh，一開始就會翻譯
      autoDisplay: false, // 確保不自動翻譯 (就不會有橫幅 .goog-te-banner-frame)
      includedLanguages: "en,zh-TW",
      layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
    },
    "googleTranslate"
  ); // 這裡初始化翻譯，只會初始化一次

  googleTranslateInitialized = true; // 標記為已初始化
}

function waitForGoogleTranslate(callback) {
  var observer = new MutationObserver(function (mutations) {
    var translateSelect = document.querySelector(".goog-te-combo");
    if (translateSelect) {
      // console.log("Google 翻譯初始化完成！");
      observer.disconnect(); // 停止監聽
      callback();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function goTranslate(lang) {
  if (isSyncing) return; // 避免在同步過程中再次觸發

  var translateSelect = document.querySelector(".goog-te-combo");
  var translateSelectLaptop = document.querySelector(
    '[name="googleTranslateLaptop"] select'
  );
  var translateSelectMobile = document.querySelector(
    '[name="googleTranslateMobile"] select'
  );

  // console.log("語言更新:", lang)

  // 當語言選擇改變時，同步更新另一邊
  if (lang === "") {
    resetGoogleTranslate();
    return;
  }

  // 開始同步
  isSyncing = true;

  // 更新選單
  if (translateSelectLaptop && translateSelectMobile) {
    // 確保同步選項
    if (translateSelectLaptop.value !== lang) {
      translateSelectLaptop.value = lang;
    }
    if (translateSelectMobile.value !== lang) {
      translateSelectMobile.value = lang;
    }

    // 建立並觸發 change 事件
    if (translateSelect) {
      translateSelect.value = lang;

      var event = new Event("change", { bubbles: true });
      translateSelect.dispatchEvent(event);
    }
  }

  // 同步結束，重置標誌
  isSyncing = false;
}

function switchLanguage(lang) {
  // 取得當前網址，並移除 apiDomain，確保只保留「檔名 + 參數」
  var relativePath = window.location.href.replace(apiDomain, ""); // 例如 `/en/index.php?id=1`

  // 預設去掉 `/en/`
  var newPath = relativePath.replace(/^\/en\//, "/");

  if (pageLanguage !== lang) {
    if (lang === "en" && pageLanguage === "zh-TW") {
      // 中文版 → 英文版，添加 `/en/`
      if (!relativePath.startsWith("/en/")) {
        setGoogleTranslateCookie("zh-TW", "en");
        newPath = "/en" + relativePath; // 在前面加 `/en`
        // console.log("中文版 → 英文版", newPath)
        window.location.href = apiDomain + newPath; // 直接跳轉到新網址
      }
    } else if (lang === "zh-TW" && pageLanguage === "en") {
      // 英文版 → 中文版，移除 `/en/`
      if (relativePath.startsWith("/en/")) {
        setGoogleTranslateCookie("zh-TW");
        newPath = relativePath.replace(/^\/en/, ""); // 確保 `/en/` 被正確移除
        // console.log("英文版 → 中文版", newPath)
        window.location.href = apiDomain + newPath; // 直接跳轉到新網址
      }
    }
  } else {
    if (lang === "en") {
      // 先檢查 Cookie，避免重複設置
      var currentGoogleTrans = getGoogleTranslateCookie(); // 可能輸出 "/zh-TW/en" 或 "/zh-TW/zh-TW" 等 (/原始語言/目標語言)
      // console.log(currentGoogleTrans)
      if (
        currentGoogleTrans !== "/zh-TW/en" &&
        currentGoogleTrans !== "/zh-CN/en"
      ) {
        // console.log("當頁面本來是英文版，但仍有中文時，強制執行 Google 翻譯")
        //setGoogleTranslateCookie("zh-TW", "en")
        //window.location.reload(); // 讓 Google 翻譯生效
      }
    }
  }
}

function resetGoogleTranslate() {
  // console.log("回到初始語言");

  // 移除 Google 翻譯的 iframe 和其他翻譯元素
  var translateIframe = document.querySelector(".goog-te-banner-frame");
  if (translateIframe) {
    // console.log("移除 .goog-te-banner-frame");
    translateIframe.remove(); // 移除翻譯橫幅
  }

  var googleFrame = document.querySelector(".goog-te-gadget");
  if (googleFrame) {
    googleFrame.remove(); // 移除翻譯控制面板
  }

  var currentCookie = getGoogleTranslateCookie();
  if (currentCookie !== "null") {
    // console.log("目前的翻譯 Cookie:", currentCookie);
  }

  // 只有在 cookie 不存在的情況下，才設置 cookie
  if (
    !currentCookie ||
    currentCookie !== "/" + pageLanguage + "/" + pageLanguage
  ) {
    setGoogleTranslateCookie(pageLanguage);
  }

  window.location.reload(); // 重新載入頁面恢復原始語言

  // 強制將語言選擇器設回原始語言 (zh-TW)
  // var translateSelect = document.querySelector('.goog-te-combo');
  // if (translateSelect) {
  //     console.log("強制將語言選擇器設回原始語言")
  //     translateSelect.value = "zh-TW"; // 設回原始語言
  //     var event = new Event('change', {bubbles: true}); // 觸發語言改變事件
  //     translateSelect.dispatchEvent(event);
  // }
}

// 初始化語言選擇同步
function initLanguageSync(lang = "") {
  // console.log("初始化語言選擇同步", lang, pageLanguage)
  var translateSelectLaptop = document.querySelector(
    '[name="googleTranslateLaptop"] select'
  );
  var translateSelectMobile = document.querySelector(
    '[name="googleTranslateMobile"] select'
  );

  if (translateSelectLaptop && translateSelectMobile) {
    if (lang !== "") {
      lang = lang !== pageLanguage ? "" : lang; // 如果選項語言 !== 頁面語言
      translateSelectLaptop.value = lang;
      translateSelectMobile.value = lang;
    }

    translateSelectLaptop.addEventListener("change", function () {
      var selectedValue = translateSelectLaptop.value;
      // console.log("電腦端語言選擇", selectedValue);
      // 更新手機端選項
      if (!isSyncing) {
        isSyncing = true;
        translateSelectMobile.value = selectedValue;

        // 如果使用者切換語言
        switchLanguage(selectedValue);

        // 手機端觸發 change 事件
        var event = new Event("change", { bubbles: true });
        translateSelectMobile.dispatchEvent(event);
        isSyncing = false;
      }
    });

    translateSelectMobile.addEventListener("change", function () {
      var selectedValue = translateSelectMobile.value;
      // console.log("手機端語言選擇", selectedValue);
      // 更新電腦端選項
      if (!isSyncing) {
        isSyncing = true;
        translateSelectLaptop.value = selectedValue;

        // 如果使用者切換語言
        switchLanguage(selectedValue);

        // 電腦端觸發 change 事件
        var event = new Event("change", { bubbles: true });
        translateSelectLaptop.dispatchEvent(event);
        isSyncing = false;
      }
    });
  }
}

// 取得google翻譯cookie
function getGoogleTranslateCookie() {
  var cookies = document.cookie.split("; ");
  var googtransCookie = cookies.find((row) => row.startsWith("googtrans="));
  return googtransCookie
    ? decodeURIComponent(googtransCookie.split("=")[1])
    : null;
}

// /原始語言/目標語言
function setGoogleTranslateCookie(lang, after = "") {
  after = lang === "en" && after === "" ? "zh-TW" : after;
  after = after === "" ? lang : after;
  document.cookie =
    "googtrans=/" +
    lang +
    "/" +
    after +
    "; path=/; domain=.lmdtwine.com; expires=Fri, 01 Jan 2055 00:00:00 UTC;";
  document.cookie =
    "googtrans=/" +
    lang +
    "/" +
    after +
    "; path=/; expires=Fri, 01 Jan 2055 00:00:00 UTC;";
  // console.log("設定 Google 翻譯 Cookie 為: /" + lang + "/" + after);
}

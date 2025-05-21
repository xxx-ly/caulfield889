var projectName = "pintech.lmtdwine";
var network = "online";
var apiDomain =
  window.location.host === "localhost"
    ? "http://localhost/lmtdwine"
    : location.protocol + "//" + window.location.host;
var status = 0;
var default_img = "assets/img/shot-1.jpg";
var ageRemember = localStorage.getItem("age_remember");
var utmSourceShown = localStorage.getItem("utm_source_shown"); // Ads參數是否已顯示
var modalId = aes_decrypt(getUrlParam("modal"));
var utm_source = getUrlParam("utm_source"); // Ads參數
var initPromo = false;
var firstParamArr = [
  "min_price",
  "max_price",
  "winery",
  "product_area",
  "product_grade",
  "product_color",
  "product_year",
  "product_grape",
  "score",
  "merch_category",
  "merch_use",
  "merch_brand",
]; // 可以當作第一個篩選的分類樹
var f = getUrlParam("f") ? getUrlParam("f") : $("[name=f]").val();
var pageLanguage = location.pathname.indexOf("/en/") >= 0 ? "en" : "zh-TW"; // 網頁預設語言
var pagePrefix = location.pathname.indexOf("/en/") >= 0 ? "../" : ""; // 圖片相對位置
var commonLanguage = {
  IS_REQUIRED: {
    "zh-TW": "此欄位為必填",
    en: "This field is required.",
  },
  INVALID_FORMAT: {
    "zh-TW": "格式不正確",
    en: " field format is invalid.",
  },
  INVALID_EMAIL_FORMAT: {
    "zh-TW": "電子信箱格式錯誤",
    en: "Invalid email format.",
  },
  INVALID_PHONE_FORMAT: {
    "zh-TW": "手機格式錯誤",
    en: "Invalid phone format.",
  },
  INVALID_DOB_FORMAT: {
    "zh-TW": "生日格式錯誤",
    en: "Invalid dob format. (Y-m-d)",
  },
  INVALID_ID_FORMAT: {
    "zh-TW": "身分證字號/居留證號格式錯誤",
    en: "Invalid ID Numer format.",
  },
  PASSWD_NOT_MATCH: {
    "zh-TW": "兩次輸入的密碼不同",
    en: "The confirmed password doesn′t match the new password.",
  },
  INVALID_PWD_FORMAT: {
    "zh-TW": "密碼規則不符",
    en: "Password doesn't meet the requirements.",
  },
  PWD_FORMAT: {
    "zh-TW":
      "密碼格式須符合：6~20個字元的英文字母、數字、底線混合，但不含空白鍵及特殊符號",
    en: "Password must be 6-20 characters long, including letters, numbers, and underscores, but no spaces or special characters.",
  },
  PLS_AGREE_YEAR: {
    "zh-TW": "請勾選『我確認我已年滿18歲，並接受使用條款和隱私政策』",
    en: 'Please check "I confirm that I am over 18 years old and accept the Terms of Service and Privacy Policy."',
  },
  PLS_AGREE_TERM: {
    "zh-TW": "請勾選『我已經詳細閱讀隱私權條款』",
    en: 'Please check "I have read the Privacy Policy in detail."',
  },
  PLS_CHOOSE_PRODUCT: {
    "zh-TW": "請勾選要加入的商品",
    en: "Select the items you wish to add.",
  },
  PLS_CHOOSE_OPTION: {
    "zh-TW": "請勾選其中一個選項",
    en: "Please choose one of the options.",
  },
  LOGIN_FIRST: {
    "zh-TW": "請先登入會員",
    en: "Please log in to your account first.",
  },
  ADD_FAV_FAILED: {
    "zh-TW": "無法加入我的最愛",
    en: "Unable to add to my favorites.",
  },
  UPLOAD_FAILED: {
    "zh-TW": "上傳失敗",
    en: "Upload failed.",
  },
  PLS_UPLOAD_FILE: {
    "zh-TW": "請上傳指定檔案",
    en: "No uploaded files.",
  },
  NO_COUPON: {
    "zh-TW": "尚無任何優惠代碼",
    en: "No available discount codes.",
  },
  NO_FILE: {
    "zh-TW": "未選擇任何檔案",
    en: "You haven't selected any file.",
  },
  ADD_TO_INQUIRY: {
    "zh-TW": "加入詢問清單",
    en: "Add To Inquiry",
  },
  CONTACT_US: {
    "zh-TW": "詢問請洽客服人員",
    en: "Contact Us",
  },
  DELETE_FROM_INQUIRY: {
    "zh-TW": "從詢問清單中移除",
    en: "Remove from the inquiry list.",
  },
  CONFIRM_DELETE: {
    "zh-TW": "確定要刪除嗎?",
    en: "Are you sure you want to delete this item?",
  },
  CONFIRM_UNBIND: {
    "zh-TW": "確定要取消綁定 ",
    en: "Are you sure you want to disconnect from ",
  },
  PROMO_COMBINED: {
    "zh-TW": "可與其他可累加優惠同時使用",
    en: "Can be combined with other applicable discounts.",
  },
  PROMO_INDEPEND: {
    "zh-TW": "僅可獨立使用",
    en: "Valid for independent use only.",
  },
  PROMO: {
    "zh-TW": "優惠促銷",
    en: "Promotions",
  },
  PROMO_USAGE: {
    "zh-TW": "優惠說明",
    en: "Usage Guide",
  },
  PROMO_PERIOD: {
    "zh-TW": "優惠期間",
    en: "Promotion Period",
  },
  COUPON: {
    "zh-TW": "優惠代碼",
    en: "Coupon Code",
  },
  COUPON_APPLIED: {
    "zh-TW": "已套用",
    en: "Applied",
  },
  USE_IT: {
    "zh-TW": "立即使用",
    en: "Use Now",
  },
  AMOUNT: {
    "zh-TW": "數量",
    en: "Amount",
  },
  GIFT: {
    "zh-TW": "贈品",
    en: "Gift",
  },
  ADDON: {
    "zh-TW": "加購品",
    en: "Add-on",
  },
};

$(function () {
  // table外層被系統自動加上一層不必要的div...
  if ($(".article-contnet").length > 0) {
    var target = $(".article-contnet").get(0);
    var debounceTimer;
    // 1️⃣ 建立一個監聽器 (只用一個 MutationObserver 監聽全域，減少效能消耗)
    var observer = new MutationObserver(function (mutations, obs) {
      // 加上防抖機制，避免過度觸發影響效能
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var hasModified = false; // 記錄是否有做修改

        mutations.forEach(function (mutation) {
          $(mutation.addedNodes).each(function () {
            var $node = $(this);
            if (
              $node.is("div") &&
              $node.css("overflow-x") === "auto" &&
              $node.children("table").length > 0
            ) {
              $node.replaceWith($node.children("table"));
              hasModified = true;
            }
          });
        });

        // 如果確定所有 table 都處理過，就停止監聽
        if (hasModified) {
          obs.disconnect(); // 停止監聽，釋放資源 (因為這個情況應該只會發生一次變更，所以處理完要停止監聽比較好)
        }
      }, 100);
    });

    // 2️⃣ 開始監聽父層 div 內的變動
    observer.observe(target, { childList: true, subtree: true });
  }

  // 警示重置
  $(document).on("focus click", ".is-invalid", function () {
    $(this).removeClass("is-invalid");
    var onInvalidFeedback = $(this)
      .parents(".form-group,.pickup-box,.row")
      .find(".onInvalidFeedback");
    if (onInvalidFeedback.length > 0) {
      onInvalidFeedback.removeClass("show");
    }
  });

  if ($(".modal").length > 0) {
    $(".modal").css("overflow-y", "auto");
  }

  // 如果表單是modal, 但是因為失敗而返回的話, 讓modal自動跳出
  if (modalId !== null && modalId !== undefined && modalId !== "") {
    var thisModal = $("#" + modalId);
    if (thisModal.length > 0) {
      var isLogin = thisModal.data("login");
      if (isLogin !== null && isLogin !== undefined && isLogin !== "") {
        if (aes_decrypt(isLogin) !== "1") {
          // 尚未登入
          thisModal.modal("show");
        } else {
          // 已登入
          add_history("modal", "");
        }
      } else {
        thisModal.modal("show");
      }
    } else {
      add_history("modal", "");
    }
  }

  /*------------------
             表單必填提醒
        -------------------*/

  $("[type=submit]").click(function (e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    var sum_arr = [];
    var invalid_arr = {};
    var isValid = true;
    var firstInvalidElement = null;
    var this_btn = $(this);
    var this_form = Boolean($(this).parents("form"))
      ? $(this).parents("form")
      : $("#" + $(this).attr("form"));
    // var is_invalid = this_form.find(".is-invalid").length;
    // if (is_invalid > 0) {
    //     this_btn.prop('disabled', false).css("pointer-events", "");
    //     $('html, body').animate({
    //         scrollTop: $('.is-invalid:first').offset().top - 200
    //     }, 500);
    //     return false;
    // }

    this_btn.prop("disabled", true).css("pointer-events", "none"); // .append("<span class=\"mx-1 spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>");
    $(":input", this_form)
      .removeClass("is-invalid")
      .prop("readonly", true)
      .css("pointer-events", "none"); // 禁用表單
    $(":input", this_form)
      .parents(".form-group,.pickup-box,.row")
      .find(".onInvalidFeedback")
      .removeClass("show"); // 移除提示訊息

    this_form.find("[req=Y]").each(function () {
      var result = checkRequired(this);
      if (!result.state) {
        sum_arr.push(result.msg);
        invalid_arr[result.name] = result.msg;
        if (result.modal) {
          firstInvalidElement = $(this);
        }
      }
    });

    if (
      location.pathname.indexOf("register") >= 0 ||
      location.pathname.indexOf("member") >= 0
    ) {
      if ($("#password1").val() !== "") {
        var this_val = $.trim($("#password1").val());
        var re = new RegExp($("#password1").attr("pattern"));
        if (!re.test(this_val)) {
          sum_arr.push(commonLanguage.INVALID_PWD_FORMAT[pageLanguage]);
          invalid_arr.password1 = commonLanguage.PWD_FORMAT[pageLanguage];
        }
      }

      if (
        $("#password1").val() !== $("#password2").val() &&
        $("#password1").val() !== "" &&
        $("#password2").val() !== ""
      ) {
        sum_arr.push(commonLanguage.PASSWD_NOT_MATCH[pageLanguage]);
        invalid_arr.password2 = commonLanguage.PASSWD_NOT_MATCH[pageLanguage];
      }
    }

    sum_arr = sum_arr.filter((item) => item);
    if (sum_arr.length > 0) {
      this_btn.prop("disabled", false).css("pointer-events", ""); // 解除禁用按紐
      // $("[role=status]").remove();// 移除loading
      $(":input", this_form).prop("readonly", false).css("pointer-events", ""); // 解除禁用表單
      $.each(invalid_arr, function (name, msg) {
        var ele = this_form.find("[name=" + name + "]");
        invalidInput(ele, msg);
      });

      $("html, body").animate(
        {
          scrollTop: $(".is-invalid:first").offset().top - 200,
        },
        500
      );
      return false;
    } else {
      var modal = this_form.parents(".modal").attr("id");
      if (modal !== undefined && modal !== null && modal !== "") {
        add_history("modal", aes_encrypt(modal));
      }

      this_form.submit();
      return true;
    }
  });

  /*------------------
             返回上一頁
        -------------------*/
  $(".goBack").on("click", function () {
    $(".goBack").attr("href", "javascript:history.back()");
  });
  /*------------------
          copyright 年份
        -------------------*/

  if ($(".copyright").length > 0) {
    var d = new Date();
    var year = d.getFullYear();
    $(".copyright").html(year);
  }

  // 下拉選單如果有 default這屬性, 代表要預選, 一頁可能有多個select..., 所以用each
  // 如: <select defaults="value">
  if ($("select[defaults]").length > 0) {
    $("select[defaults]").each(function () {
      var defaults = $(this).attr("defaults");
      $(this)
        .find("option")
        .each(function () {
          if ($(this).val() === defaults) {
            $(this).prop("selected", true);
          }
        });
    });
  }

  // 如果送出後，因為有必填沒填寫而被返回上一頁時，預覽圖會消失，所以要讓預覽圖再出現
  if ($("textarea.base64").length > 0) {
    setTimeout(function () {
      $("textarea.base64").each(function () {
        var b64 = $(this).val();
        if (b64.indexOf("base64") >= 0 && b64.indexOf("data:image") >= 0) {
          var filename = localStorage.getItem("file1_name");
          $("#fileName").text(filename);

          $("#uploadedImage").attr("src", b64);

          setTimeout(function () {
            $("#uploadedImage").show(); // 顯示圖片區塊
            $(".pic-box").css("opacity", "0");
            $("#imageContainer").addClass("picShow");
          }, 200);

          $(".base64").removeClass("is-invalid");
          $("#deleteButton").removeClass("hide");
        }
      });
    }, 500);
  }

  // 上傳檔案init func
  if ($(".custom-file-input").length > 0) {
    bsCustomFileInput.init();
  }

  /*-----------------------------------
        確認使用者年齡
        ----------------------------------*/
  if ("#age-comfirm".length > 0) {
    // 「我已年滿18 記住我」
    if (ageRemember !== null && ageRemember === "true") {
      $(".age_box").hide();
      setTimeout(() => {
        $(".body.index").addClass("complete");
      }, 100);
    } else {
      // loading載入
      setTimeout(() => {
        $("#loading").show().addClass("in-view");
      }, 0);
    }

    // 「確定我已年滿18歲」按鈕
    $("#age-comfirm").click(function () {
      var is_remember = $("input[name='age_remember']").is(":checked");
      localStorage.setItem("age_remember", is_remember);
      setTimeout(() => {
        $(".body.index").addClass("complete");
      }, 100);
    });
  }

  /*-----------------------------------
        輪播圖載入
        ----------------------------------*/
  setTimeout(() => {
    $(".slider-container,.sticky-wrapper").addClass("in-view-1");
  }, 100);

  /*-----------------------------------
        頭部搜尋工具
        ----------------------------------*/
  $("#m-search").click(function (e) {
    e.preventDefault();
    $(".m-search-box").toggleClass("active");
  });

  // 當點擊手機版搜尋按鈕時，切換搜尋框的顯示狀態
  $("#mobile-search").click(function (e) {
    e.preventDefault();
    $("#mobile-search-box").slideToggle(300);
  });

  // 當視窗變大 (回到桌機版)，自動隱藏手機版搜尋框
  function hideMobileSearchOnResize() {
    if ($(window).width() >= 768) {
      // md 斷點
      $("#mobile-search-box").hide();
    }
  }

  // 監聽視窗大小變化
  $(window).on("resize", hideMobileSearchOnResize);

  // 讓桌機版 & 手機版輸入框同步
  $("[name=keyword]:not([search_ref])").on("input", function () {
    var keyword = $(this).val();
    $("[name=keyword]:not([search_ref])").not(this).val(keyword);
  });

  /*-----------------------------------
        banner-social顯示隱藏控制
        ----------------------------------*/
  if ($(".banner-social").length > 0) {
    $(window).scroll(function () {
      var bannerSocial = $(".banner-social");
      var scrollTop = $(this).scrollTop();
      var windowHeight = $(window).height();
      var documentHeight = $(document).height();
      var distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (scrollTop > 180 && distanceFromBottom > 250) {
        bannerSocial.addClass("visible");
      } else {
        bannerSocial.removeClass("visible");
      }
    });
  }

  /*-----------------------------------
        全選設定
        ----------------------------------*/
  if ($("#CheckAll").length > 0) {
    $("#CheckAll").click(function () {
      var checked = $(this).prop("checked");
      var checkbox = $("input[name=" + $(this).data("for") + "]");
      if (checkbox.length > 0) {
        checkbox.each(function (i, ele) {
          $(ele).prop("checked", checked);
        });
      }
    });
  }

  // 密碼驗證
  if ($("#password1").length > 0) {
    $("#password1").blur(function () {
      var this_input = $(this);
      var this_val = this_input.val();
      if (this_val !== null && this_val !== undefined && this_val !== "") {
        var pattern = this_input.attr("pattern");
        var pattern_option = this_input.data("option");
        var re = new RegExp(pattern, pattern_option);

        if (!re.test(this_val)) {
          invalidInput(this_input, commonLanguage.PWD_FORMAT[pageLanguage]);
          return false;
        }
      } else {
        return false;
      }

      var passwd2 = $("#password2");
      var passwd2_val = passwd2.val();
      if (
        passwd2_val !== null &&
        passwd2_val !== undefined &&
        passwd2_val !== ""
      ) {
        if (this_val !== passwd2) {
          invalidInput(passwd2, commonLanguage.PASSWD_NOT_MATCH[pageLanguage]);
          return false;
        }
      } else {
        return false;
      }
    });
  }

  // 密碼確認
  if ($("#password2").length > 0) {
    $("#password2").blur(function () {
      var this_input = $(this);
      var this_val = this_input.val();

      var passwd1 = $("#password1");
      var passwd1_val = passwd1.val();
      if (
        passwd1_val !== null &&
        passwd1_val !== undefined &&
        passwd1_val !== "" &&
        this_val !== null &&
        this_val !== undefined &&
        this_val !== ""
      ) {
        if (passwd1_val !== this_val) {
          invalidInput(
            this_input,
            commonLanguage.PASSWD_NOT_MATCH[pageLanguage]
          );
          return false;
        }
      }
    });
  }

  // 地址
  if ($("#city").length > 0) {
    // 縣市區域
    var city_param = [];
    var city_default = "";
    var region_default = "";
    var zipcode_default = "";

    city_default = $("[name=city]").attr("defaults");
    region_default = $("[name=region]").attr("defaults");
    zipcode_default = $("[name=zipcode]").attr("defaults");

    city_param["city_name"] = "city";
    city_param["region_name"] = "region";
    city_param["zipcode_name"] = "zipcode";
    city_param["city_default"] = city_default !== "" ? city_default : "";
    city_param["region_default"] = region_default !== "" ? region_default : "";
    city_param["zipcode_default"] =
      zipcode_default !== "" ? zipcode_default : "";
    city_related(city_param);
  }

  // 登出
  if ($("#logout").length > 0) {
    $("#logout").click(function () {
      // 清空localStorage我的最愛
      $.when(clearLocal("favorite")).then(function () {
        document.location.href = "logout.php";
      });
    });
  }

  if (location.pathname.indexOf("member") >= 0) {
    /*-----------------------------------
            會員頭貼照片上傳
            ----------------------------------*/
    $(document).on("change", "[type=file]", function (event) {
      // 縮圖
      selectFileImage(
        this,
        1024,
        1024,
        "[id=file0_str]",
        "[id=profile-img]",
        "mobile",
        uploadFile(this)
      );
    });

    // base64上傳相片
    function uploadFile(input) {
      var file = input.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        var b64 = reader.result;
        var obj = {
          file0_str: b64,
        };

        $.when(api("post_file.php", obj))
          .then(function (resp) {
            $(input).val("");
            alert(resp.message);
          })
          .fail(function (err) {
            alert(
              commonLanguage.UPLOAD_FAILED[pageLanguage] + " " + err.message
            );
            return false;
          });
      };
      reader.onerror = function (error) {
        alert(commonLanguage.UPLOAD_FAILED[pageLanguage]);
        return false;
      };
    }

    if (location.pathname.indexOf("member.") >= 0) {
      // 取得會員我的最愛
      $.when(getFavorite()).then(function (resp) {
        $.when(clearLocal("favorite")).then(function () {
          saveLocal("favorite", resp.data, "uuid");
        });
      });
    }
  }

  // 會員登入、註冊、忘記密碼Modal：如果使用者主動關閉，那就移除網址參數 modal
  $(".modal#login,.modal#forget,.modal#register").on(
    "hidden.bs.modal",
    function () {
      var modal = getUrlParam("modal");
      if (modal !== undefined && modal !== null && modal !== "") {
        add_history("modal", "");
      }
      // 如果是登入model，清空參數
      if ($(this).attr("id") === "login") {
        $(this).find("[name=redirect]").val(aes_encrypt(""));
      }
    }
  );

  // Ads參數
  if (utm_source !== null && utm_source !== undefined) {
    if (utm_source !== "") {
      if (utmSourceShown !== null && utmSourceShown === "true") {
        // 如果已經出現過+使用者重新整理，就清空參數
        add_history("utm_source", "");
      } else {
        // 註冊完成後加入參數
        localStorage.setItem("utm_source_shown", "true");
      }
    }
  }

  // 註冊Modal
  if ($("#register").length >= 0) {
    /*-----------------------------------
            身分證照片上傳
            ----------------------------------*/
    $(document).on("change", "[type=file]", function (event) {
      var file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        // 顯示檔名
        var filename = file.name;
        localStorage.setItem("file1_name", filename);
        $("#fileName").text(filename);
      }

      // 縮圖
      selectFileImage(
        this,
        1024,
        1024,
        "[id=file1_str]",
        "[id=uploadedImage]",
        "mobile",
        function () {
          // 照片預覽
          setTimeout(function () {
            $("#uploadedImage").show(); // 顯示圖片區塊
            $(".pic-box").css("opacity", "0");
            $("#imageContainer").addClass("picShow");
          }, 200);

          $(".base64").removeClass("is-invalid");
          $("#deleteButton").removeClass("hide");
        }
      );
    });

    // 清空圖片及檔名
    $("#deleteButton").on("click", function () {
      var filename = commonLanguage.NO_FILE[pageLanguage];
      localStorage.setItem("file1_name", filename);

      $("#fileInput").val(""); // 清空 input
      $(".base64").val(""); // 清空base64
      $("#fileName").text(filename); // 檔案名稱
      $("#uploadedImage").attr("src", "").hide(); // 隱藏圖片區塊
      $(".pic-box").css("opacity", "1");
    });
  }

  // 隱私權條款modal
  if ($(".simple-ajax-popup").length > 0) {
    $(".simple-ajax-popup").magnificPopup({
      type: "ajax",
      callbacks: {
        open: function () {
          $("html").addClass("lightbox-opened");
        },
        close: function () {
          $("html").removeClass("lightbox-opened");
        },
      },
    });

    $("#info_close_btn").on("click", function () {
      $.magnificPopup.close();
    });
  }

  // 如果回到產品列表，但是URL初始沒有參數，清空local，如果初始就有參數
  if (
    location.pathname.indexOf("product_list") >= 0 ||
    location.pathname.indexOf("merch_list") >= 0
  ) {
    var page =
      location.pathname.indexOf("product_list") >= 0 ? "product" : "merch";
    var params = getUrlParam();
    clearLocal(page + "_filter");

    if (Object.keys(params).length > 0) {
      $.each(params, function (key, val) {
        if (firstParamArr.indexOf(key) >= 0) {
          handleFirstParam(key, val, page);
        }
      });
    }
  }

  /* 列表篩選 */
  if ($("[search_ref]").length > 0) {
    $(".search-list").each(function () {
      // 在每個分類區塊內檢查是否有被勾選的 checkbox
      var firstChecked = $(this).find('input[type="checkbox"]:checked').first();

      if (firstChecked.length > 0) {
        // 滾動到第一個被勾選的 checkbox
        var offset = firstChecked.position().top + $(this).scrollTop();
        var height = $(this).height(); // 調整值，讓項目不會被遮到

        if (offset > height) {
          $(this).animate(
            {
              scrollTop: offset - height,
            },
            300
          );
        }
      }
    });

    // 產品列表價錢區間篩選
    $("#price_box").click(function () {
      searchPriceRange(this);
    });

    // 列表上方的篩選DOM
    // 按下搜尋按鈕時，取得有search_ref的所有元素，將所有值組合成url param，並導向
    $("[name=search_button]").click(function (event) {
      var str = $("[search_ref]")
        .map(function () {
          var name = $(this).attr("name");
          var val = $.trim($(this).val().replaceAll(".", ""));
          if (name === "keyword") {
            val = aes_encrypt(val);
          }
          if (val !== "") {
            return name + "=" + val;
          }
          // 拼成網址參數字串
        })
        .get()
        .join("&");

      if (location.pathname.indexOf("product_detail") >= 0) {
        // 在產品內頁搜尋->導至產品列表頁
        document.location.href = "product_list.php?" + str;
      } else if (location.pathname.indexOf("merch_detail") >= 0) {
        // 在周邊商品內頁搜尋->導至周邊商品列表頁
        document.location.href = "merch_list.php?" + str;
      } else {
        document.location.href = "?" + str;
      }
    });

    // 自動搜尋
    $("[search_ref]").each(function () {
      $(this).change(function () {
        var deferred = $.Deferred();
        var this_name = $(this).attr("name");
        var this_val = $(this).val();
        if (this_name === "orderby_i") {
          var orderby = $("option:selected", this).data("orderby");
          var sortby = $("option:selected", this).data("sortby");
          if (orderby !== null && orderby !== undefined && orderby !== "") {
            $("[name=orderby]").val(orderby);
          }
          if (sortby !== null && sortby !== undefined && sortby !== "") {
            $("[name=sortby]").val(sortby);
          }
        }

        // 紀錄條件加入的順序
        if (
          (location.pathname.indexOf("product_list") >= 0 ||
            location.pathname.indexOf("merch_list") >= 0) &&
          firstParamArr.indexOf(this_name) >= 0
        ) {
          var page =
            location.pathname.indexOf("product_list") >= 0
              ? "product"
              : "merch";
          $.when(handleFirstParam(this_name, this_val, page)).then(function () {
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }

        deferred.always(function () {
          $("[name=search_button]").trigger("click");
        });
      });
    });
  }

  function handleFirstParam(name, val, page = "product") {
    var deferred = $.Deferred();
    var table = page + "_filter";
    var obj = {
      timestamp: Date.now(),
      key: name,
      value: val,
    };

    if (val !== "") {
      if (f === undefined || f === null || f === "") {
        $("[name=f]").val(name);
        add_history("f", name);
      }
      // 更新local
      $.when(saveLocal(table, obj, "key")).always(function () {
        deferred.resolve();
      });
    } else {
      var deferredValueEmpty = $.Deferred();
      $.when(searchLocal(table, obj, "key"))
        .then(function () {
          $.when(toggleLocal(table, obj, "key")).always(function () {
            deferredValueEmpty.resolve();
          });
        })
        .fail(function () {
          deferredValueEmpty.resolve();
        });

      deferredValueEmpty.then(function () {
        $.when(getLocal(table))
          .then(function (data) {
            var newF = data[data.length - 1].key;
            $("[name=f]").val(newF);
            deferred.resolve();
          })
          .fail(function () {
            $("[name=f]").val("");
            deferred.resolve();
          });
      });
    }

    return deferred.promise();
  }

  // 日期篩選器
  if ($("[name=daterange]").length > 0) {
    dateRangeSet();

    setTimeout(function () {
      $(".calendar-table").attr("translate", "no"); // 不要翻譯日期數字
    }, 100);
  }

  // 我的最愛-樣式
  if ($("[data-favorite]").length > 0) {
    $("[data-favorite]").each(function (i, ele) {
      var uuid = $(ele).data("favorite"); // distinguish + major_id
      var obj = {
        uuid: uuid,
      };

      $.when(searchLocal("favorite", obj, "uuid"))
        .then(function () {
          switchFavoriteClass(ele);
        })
        .fail(function () {
          switchFavoriteClass(ele, false);
        });
    });
  }

  /*-----------------------------------
        會員愛心消失
        ----------------------------------*/

  /*
        var cardToDelete; // 儲存要刪除的卡片

        // 點擊愛心，打開模態框
        $('.delete-card').click(function (event) {
            event.preventDefault(); // 防止預設行為
            cardToDelete = $(this).closest('.card'); // 儲存要刪除的卡片
            $('#confirmDeleteModal').modal('show'); // 打開模態框
        });

        // 點擊確認移除按鈕，刪除卡片
        $('#confirmDelete').click(function () {
            cardToDelete.remove(); // 刪除卡片
            $('#confirmDeleteModal').modal('hide'); // 關閉模態框
        });
         */

  // 加入我的最愛
  if ($("[name=add-favorite]").length > 0) {
    $(document).on("click", "[name=add-favorite]", function (e) {
      e.preventDefault(); // 避免超連結
      var data = $(this).data();
      addFavorite(this, data.distinguish, data.major);
    });
  }

  // 產品數量改變(按鈕)
  if ($(".minus, .plus").length > 0) {
    $(document).on("click", ".minus, .plus", function () {
      var types = 1; // 增加
      if ($(this).hasClass("minus")) {
        types = -1; // 減少
      }
      handleQtyBtnClick(this, types);
    });
  }

  // 產品數量[輸入框]改變
  if ($(".qty").length > 0) {
    $(document).on("change", ".qty", function () {
      var newValue = handleQtyInputChange(this);
      renderQtyValue(this, newValue);
    });

    $(".qty").each(function (i, ele) {
      handleQtyBtnStatus(ele); // 確認按鈕狀態
    });
  }

  // 加入詢問清單
  if ($("#add-cart").length > 0) {
    $(document).on("click", "#add-cart", function () {
      var data = $(this).data();
      var quantity = $("[name=quantity]");
      var value = quantity.length > 0 ? parseInt(quantity.val()) : 1; // 如果數量input不存在，那就視為1 (可能是客戶自己把按鈕加在文章內)
      //  先檢查當前庫存
      $.when(validateStock(data.id, value)).then(function () {
        // 加入詢問清單session
        $.when(addCart(data.id, value)).then(function (resp) {
          if (resp.message !== "") {
            alert(resp.message);
          }
        });
      });
    });
  }

  // 移除詢問清單
  if ($("[name=delete-cart]").length > 0) {
    $(document).on("click", "[name=delete-cart]", function () {
      var this_dom = $(this);
      var yes = confirm(commonLanguage.CONFIRM_DELETE[pageLanguage]);
      if (yes) {
        var data = this_dom.data();
        var this_cart = this_dom.parents("[name=cart-item]");
        var qty = parseInt(this_cart.find(".qty").val());

        $.when(addCart(data.id, qty, -2)).then(function (resp) {
          this_cart.remove();
        });
      }
    });
  }

  // 會員中心-我的最愛-酒款
  if ($("#add-cart-checked").length > 0) {
    $(document).on("click", "#add-cart-checked", function () {
      var all = $("#member-love")
        .find("[name=checkbox_product]:checked")
        .map(function (i, ele) {
          return $(ele).val();
        })
        .get()
        .join(",");

      if (all === "") {
        alert(commonLanguage.PLS_CHOOSE_PRODUCT[pageLanguage]);
        return false;
      }

      // 加入詢問清單session
      $.when(addCart(all, 1)).then(function (resp) {
        if (resp.message !== "") {
          alert(resp.message);
        }
      });
    });
  }

  /*-----------------------------------
        商品分類產區選單
        ----------------------------------*/
  if (
    location.pathname.indexOf("product_") >= 0 ||
    location.pathname.indexOf("merch_") >= 0 ||
    location.pathname.indexOf("news_list") >= 0 ||
    location.pathname.indexOf("news_category_list") >= 0 ||
    location.pathname.indexOf("knowledge_list") >= 0
  ) {
    // initKeyword();

    if ($("[name=area]").length > 0) {
      var checkedValue = $("[name=product_area]")
        .val()
        .split(",")
        .filter((item) => item);
      $(document).on("change", "[name=country]", function (e) {
        $(e.target)
          .parents("li")
          .find("> ul input")
          .prop("checked", e.target.checked) // 全選、取消全選
          .prop("indeterminate", false)
          .change();
      });
      $(document).on("change", "[name=area]", function () {
        var deferred = $.Deferred();
        var this_dom = $(this);
        var this_checked = this_dom.prop("checked");
        var table = "product_area";

        var checkedLength = 0;
        var indeterminateLength = 0;
        var $checkbox = $(this).parents("li").eq(1).find("> label > input");
        var $children = $(this).closest("ul").find("> li > label > input");
        // 子選項, EX勃根地
        $children.each(function () {
          if (this.checked) {
            if (!checkedValue.includes(this.value)) {
              //checking weather array contain the id
              checkedValue.push(this.value); //adding to array because value doesnt exists
            }
            checkedLength++;
          } else {
            if (checkedValue.includes(this.value)) {
              //checking weather array contain the id
              checkedValue.splice(checkedValue.indexOf(this.value), 1); //deleting
            }
          }
          if (this.indeterminate) {
            indeterminateLength++;
          }

          $checkbox
            .prop("checked", checkedLength === $children.length)
            .prop(
              "indeterminate",
              indeterminateLength > 0 ||
                (checkedLength > 0 && checkedLength < $children.length)
            );
        });

        var data_dom = $("[name=product_area]");
        var value = checkedValue.join();

        data_dom.val(value);
        if (!this_checked && f === table) {
          $.when(handleFirstFilterUncheck(table, value)).then(function () {
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }

        deferred.then(function () {
          data_dom.change();
        });
      });

      // 進入頁面時先判斷子選項有沒有勾選
      initProductCountryCheckbox();
    }

    // 勾選篩選條件
    $(document).on("change", "[name^=checkbox_]", function (e) {
      combineCheckbox($(this));
    });

    // 取消所有標籤
    if ($("#cancel_all_tag").length > 0) {
      $("#cancel_all_tag").click(function () {
        $("[name=filterArea]")
          .find("[type=checkbox]")
          .each(function (i, ele) {
            if ($(ele).prop("checked")) {
              $(ele).prop("checked", false);
            }
          })
          .addBack()
          .next("[data-for]")
          .val("")
          .change();
      });
    }

    // 排除無庫存
    if ($("#stock_none").length > 0) {
      $("#stock_none").change(function () {
        var checked = $(this).prop("checked");
        var stock = checked ? 1 : 0;

        $("[name=stock]").val(stock).change();
      });
    }

    // 手機版-進階搜尋
    $("#filter-btn").on("click", function () {
      $("#filter-box").addClass("show-box");
    });
    $("#filter-close").on("click", function () {
      $("#filter-box").removeClass("show-box");
    });
    $(".backdrop-box").on("click", function () {
      $("#filter-box").removeClass("show-box");
    });
  }

  if (location.pathname.indexOf("favorite") >= 0) {
    // 可使用的優惠
    if ($("[name=checkbox_promo]").length > 0) {
      $(document).on("change", "[name=checkbox_promo]", function (e) {
        var deferred = $.Deferred();
        var this_dom = $(this);
        if (initPromo) {
          var this_val = this_dom.val();
          var checked = this_dom.prop("checked") ? 1 : 0;
          $.when(validatePromo(this_val, checked))
            .then(function (resp) {
              var checked_arr = resp.data.promo.checked;
              $("[name=checkbox_promo]").each(function (i, ele) {
                var val = $(ele).val();
                // 將不存在session的優惠取消勾選
                if (checked_arr.indexOf(val) <= -1) {
                  $(ele).prop("checked", false);

                  // 如果是優惠代碼，那就先隱藏它
                  if (aes_decrypt($(ele).data("code")) == "1") {
                    $(ele).parents("li").addClass("d-none");
                  }
                }
              });

              // 更新主選單的詢問清單數量(產品數量)
              var products_arr = resp.data.products;
              var cartCount = Object.keys(products_arr).length;
              $("#cartCount").text(cartCount);

              // 刷新產品
              $.when(renderProducts(products_arr)).then(function (
                products_html
              ) {
                $("#cartArea").html(products_html);
              });

              // 刷新加購品
              var addon_html = renderAddon(resp.data.addon);
              $("#addonArea").find(".owl-carousel").html(addon_html);
              if (addon_html !== "") {
                $("#addonArea").removeClass("d-none");
              } else {
                $("#addonArea").addClass("d-none");
              }

              // 刷新價格
              renderPrice(resp.data);

              deferred.resolve();
            })
            .fail(function () {
              e.preventDefault();
              return false;
            });
        } else {
          deferred.resolve(true);
        }

        deferred.then(function (init = false) {
          if (init) {
            initPromo = true;
          }
          combineCheckbox(this_dom);
        });
      });

      if (!initPromo) {
        $("[name=checkbox_promo]").change();
      }
    }

    // 選擇優惠券modal
    if ($("#openCouponModal").length > 0) {
      var couponModal = $("#couponModal");
      $("#openCouponModal").click(function () {
        $.when(getCoupon()).then(function (resp) {
          if (resp.data.length > 0) {
            var html = renderCoupon(resp.data);
            couponModal.find(".modal-body").html(html);
            couponModal.modal("show");
          } else {
            alert(commonLanguage.NO_COUPON[pageLanguage]);
          }
        });
      });

      // 選擇優惠券modal，點擊使用
      $(document).on(
        "click",
        "[name=couponUseBtn]:not(.disabled)",
        function (e) {
          var coupon_val = aes_decrypt($(this).data("value")); // 優惠代碼
          $.when(validateCoupon(coupon_val)).then(function (resp) {
            handleSelectCoupon(resp);
            couponModal.modal("hide");
          });
        }
      );
    }

    // 手動輸入優惠代碼並點擊按鈕
    if ($("#couponBtn").length > 0) {
      $("#couponBtn").click(function () {
        var coupon = $(this).prev(":input");
        var coupon_val = $.trim(coupon.val());
        if (coupon_val === "") {
          return false;
        }

        $.when(validateCoupon(coupon_val)).then(function (resp) {
          handleSelectCoupon(resp);
          coupon.val("");
        });
      });
    }

    // 加購品
    $(document).on("click", "[name=add-cart-addon]", function () {
      var data = $(this).data();
      var value = 1;
      //  先檢查當前庫存
      $.when(validateStock(data.id, 1)).then(function () {
        // 加入詢問清單session
        $.when(addCart(data.id, value, 2)).then(function (resp) {
          if (resp.message !== "") {
            alert(resp.message);
          }
        });
      });
    });

    // 如果表單被返回
    setTimeout(function () {
      $("input[name=invoice]").change();
      $("input[name=pickup]").change();
      $("#same-box").change();
      $("#same-box-1").change();
    }, 100);

    /*-----------------------------------
            詢問清單-發票
            詢問清單-取貨方式
            ----------------------------------*/
    function checkInfoRequired(this_info, not_this_info) {
      if (this_info.length > 0) {
        this_info.show();
      }
      not_this_info.hide();

      // 屬於這個區塊的，加上必填 (排除備註、同會員資料)
      $(":input:not(textarea,[type=checkbox],[type=hidden])", this_info).each(
        function (i, ele) {
          $(ele).attr("req", "Y");
        }
      );

      // 不屬於這個區塊的，取消必填 (排除備註、同會員資料)
      $(
        ":input:not(textarea,[type=checkbox],[type=hidden])",
        not_this_info
      ).each(function (i, ele) {
        $(ele).removeAttr("req").removeClass("is-invalid");

        var onInvalidFeedback = $(ele)
          .parents(".form-group,.pickup-box,.row")
          .find(".onInvalidFeedback");
        if (onInvalidFeedback.length > 0) {
          onInvalidFeedback.removeClass("show");
        }
      });
    }

    function invoiceAddress() {
      // 載具發票+寄送到府 不需要填發票地址
      var pickup = $("input[name=pickup]:checked");
      var invoice = $("input[name=invoice]:checked");
      var fee = aes_decrypt(pickup.data("fee")) == "1"; // aes 是否要+運費1/0 = 是否要發票地址
      var address = aes_decrypt(invoice.data("address")) == "1"; // aes 是否要+發票地址1/0
      if (fee && address) {
        // 需要發票地址
        $("#same-box-1").prop("checked", false).change();
        $("#same-box-1").parent("div").removeClass("d-none");
      } else {
        // 不需要發票地址
        $("#same-box-1").prop("checked", true).change();
        $("#same-box-1").parent("div").addClass("d-none");
      }
    }

    $(document).on("change", "input[name=invoice]", function () {
      var this_checked = $("input[name=invoice]:checked");
      var id = this_checked.val();
      var this_info = $('.invoice-info[data-id="invoice' + id + '"]');
      var not_this_info = $('.invoice-info[data-id!="invoice' + id + '"]');

      checkInfoRequired(this_info, not_this_info);

      // 載具發票+寄送到府 不需要填發票地址
      invoiceAddress();
    });

    $(document).on("change", "input[name=pickup]", function () {
      var this_checked = $("input[name=pickup]:checked");
      var id = this_checked.val();
      var this_info = $('.pickup-info[data-id="pickup' + id + '"]');
      var not_this_info = $('.pickup-info[data-id!="pickup' + id + '"]');

      checkInfoRequired(this_info, not_this_info);

      // 門市自取不會有運費
      postShipping(this_checked.data("fee"));

      // 載具發票+寄送到府 不需要填發票地址
      invoiceAddress();
    });

    // 收貨地址、發票地址 縣市區域下拉選單
    var address_arr = ["pickup", "invoice"];
    $.each(address_arr, function (i, add) {
      // 縣市區域
      var city_param = [];
      var city_default = "";
      var region_default = "";
      var zipcode_default = "";

      city_default = $("[name=" + add + "_city]").attr("defaults");
      region_default = $("[name=" + add + "_region]").attr("defaults");
      zipcode_default = $("[name=" + add + "_zipcode]").attr("defaults");

      city_param["city_name"] = add + "_city";
      city_param["region_name"] = add + "_region";
      city_param["zipcode_name"] = add + "_zipcode";
      city_param["city_default"] = city_default !== "" ? city_default : "";
      city_param["region_default"] =
        region_default !== "" ? region_default : "";
      city_param["zipcode_default"] =
        zipcode_default !== "" ? zipcode_default : "";
      city_related(city_param);
    });

    // 同會員資料
    $("#same-box").change(function () {
      var checked = $(this).prop("checked");
      var box = $(this).parents(".pickup-info");
      if (checked) {
        box.find("[data-same]").each(function (i, ele) {
          var same = $(ele).data("same");
          var member_data = $("[name=" + same + "]").val();
          if (member_data !== undefined && member_data !== null) {
            var member_val = aes_decrypt(member_data);
            $(ele).val(member_val).change();
          }
        });
      }
    });

    // 發票地址同收貨人地址
    $("#same-box-1").change(function () {
      var checked = $(this).prop("checked");
      if (checked) {
        // 不屬於這個區塊的，取消必填
        $(".same-box-1")
          .addClass("hide")
          .find(":input:not([type=hidden])")
          .each(function (i, ele) {
            $(ele).removeAttr("req").removeClass("is-invalid");
          });
      } else {
        // 屬於這個區塊的，加上必填
        $(".same-box-1")
          .removeClass("hide")
          .find(":input:not([type=hidden])")
          .each(function (i, ele) {
            $(ele).attr("req", "Y");
          });
      }
    });

    // 詢價成功modal
    if ($("#order_ok").length > 0) {
      var show = aes_decrypt(getUrlParam("show"));
      if (show !== "1") {
        // 如果已經顯示過了
        $("#order_ok").modal("show");
      }

      $("#order_ok").on("hidden.bs.modal", function () {
        add_history("show", aes_encrypt(1));
      });
    }

    /*-----------------------------------
            列印
            ----------------------------------*/
    if ($("[id^=printer]").length > 0) {
      $("[id^=printer]").click(function () {
        window.print();
      });
    }
  }

  /*-----------------------------------
        svg圖檔img轉svg程式碼
        ----------------------------------*/
  if ($("img.svg").length > 0) {
    $("img.svg").each(function () {
      var $img = $(this);
      var imgID = $img.attr("id");
      var imgClass = $img.attr("class");
      var imgURL = $img.attr("src");

      $.get(
        imgURL,
        function (data) {
          var $svg = $(data).find("svg");
          if (typeof imgID !== "undefined") {
            $svg = $svg.attr("id", imgID);
          }
          if (typeof imgClass !== "undefined") {
            $svg = $svg.attr("class", imgClass + " replaced-svg");
          }
          $svg = $svg.removeAttr("xmlns:a");
          if (
            !$svg.attr("viewBox") &&
            $svg.attr("height") &&
            $svg.attr("width")
          ) {
            $svg.attr(
              "viewBox",
              "0 0 " + $svg.attr("height") + " " + $svg.attr("width")
            );
          }
          $img.replaceWith($svg);
        },
        "xml"
      );
    });
  }

  /*-----------------------------------
        tab 滾動效果
        ----------------------------------*/
  if ($(".scroll_tag").length > 0) {
    $(".scroll_tag").click(function (e) {
      e.preventDefault();
      $("body,html").animate(
        {
          scrollTop: $(this.hash).offset().top - 70,
        },
        500
      );
    });
  }

  // 切換tab時，記住id
  // if ($(".tabs").length > 0) {
  //     $(".tabs>a.nav-link").click(function () {
  //         var id = $(this).attr("id").substr(2);
  //         add_history("violation_types_id", violation_types_id);
  //     })
  // }

  /*-----------------------------------
        fancybox
        ----------------------------------*/
  if ($("[data-fancybox]").length > 0) {
    Fancybox.bind("[data-fancybox]", {
      Image: {
        zoom: true, // 允許縮放
        fit: "cover", // 避免 max-width 限制，讓圖片填滿視窗
        click: "toggleZoom", // 點擊時切換縮放
        wheel: "zoom", // 滾輪縮放
      },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: ["prev", "infobar", "next"],
          right: ["slideshow", "download", "thumbs", "close"], // 下載按鈕
        },
      },
      on: {
        reveal: (fancybox, slide) => {
          $(slide.contentEl).addClass("custom-fancybox");
        },
      },
    });
  }
});

/* 暫時刪除暫存用 */
function clearLocal(table) {
  var deferred = $.Deferred();
  var item_arr = [];
  item_arr["model"] = "clear";
  item_arr["network"] = network; //可以是online / offline / 或不要有這key
  item_arr["table"] = projectName + "." + table;
  item_arr["callback"] = function (data) {
    if (data.state === "1") {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  };
  pintech_localControl(item_arr);

  return deferred.promise();
}

/* 儲存local資料 */
function saveLocal(table, data, pk, max) {
  var deferred = $.Deferred();
  var item_arr = [];
  item_arr["model"] = "addonly";
  item_arr["network"] = network; //可以是online / offline / 或不要有這key
  item_arr["table"] = projectName + "." + table;
  item_arr["table_pk"] = pk;
  item_arr["table_arr"] = data;
  if (max > 0) {
    item_arr["table_quota"] = max; // 最大筆數, 只在addonly與toggle會生效, 如果不設限就不要有這參數
  }
  item_arr["callback"] = function (data) {
    if (data.state === "1") {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  };
  pintech_localControl(item_arr);

  return deferred.promise();
}

/* 切換local資料 */
function toggleLocal(table, data, pk, max) {
  var deferred = $.Deferred();
  var item_arr = [];
  item_arr["model"] = "toggle";
  item_arr["network"] = network; //可以是online / offline / 或不要有這key
  item_arr["table"] = projectName + "." + table;
  item_arr["table_pk"] = pk;
  item_arr["table_arr"] = data;
  if (max > 0) {
    item_arr["table_quota"] = max; // 最大筆數, 只在addonly與toggle會生效, 如果不設限就不要有這參數
  }
  item_arr["callback"] = function (data) {
    if (data.state === "1") {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  };
  pintech_localControl(item_arr);

  return deferred.promise();
}

/* 檢查local資料 */
function getLocal(table) {
  var deferred = $.Deferred();
  var item_arr = [];
  item_arr["model"] = "print";
  item_arr["network"] = network; //可以是online / offline / 或不要有這key
  item_arr["table"] = projectName + "." + table;
  item_arr["callback"] = function (data) {
    if (data.data.length > 0) {
      deferred.resolve(data.data);
    } else {
      deferred.reject();
    }
  };
  pintech_localControl(item_arr);

  return deferred.promise();
}

/* 搜尋local資料 */
function searchLocal(table, data, pk) {
  var deferred = $.Deferred();
  var item_arr = [];
  item_arr["model"] = "checked";
  item_arr["table"] = projectName + "." + table;
  item_arr["table_pk"] = pk;
  item_arr["table_arr"] = data;
  // 檢查時可只帶入uuid, 其他欄位title, time不一定要帶入, 主要靠pk欄位判斷資料是否存在
  item_arr["callback"] = function (data) {
    if (data.state === "1") {
      deferred.resolve(data.data[0]);
    } else {
      deferred.reject();
    }
  };
  pintech_localControl(item_arr);

  return deferred.promise();
}

/* API */
function api(method = "", data = {}) {
  var deferred = $.Deferred();

  var event_arr = [];
  event_arr["success"] = function (resp) {
    if (resp.state === 1) {
      deferred.resolve(resp);
    } else {
      deferred.reject(resp);
    }
  };

  event_arr["failed"] = function (resp) {
    deferred.reject(resp, false);
  };

  /* post */
  ajax_pub_adv(apiDomain + "/api/" + method, data, event_arr, { async: false });

  return deferred.promise();
}

// 表單驗證
function invalidInput(ele, msg) {
  if (ele.length > 0) {
    if (msg !== "") {
      var onInvalidFeedback = ele
        .parents(".form-group,.pickup-box,.row")
        .eq(0)
        .find(".onInvalidFeedback");
      if (onInvalidFeedback.length > 0) {
        onInvalidFeedback.addClass("show").text(msg);
      } else {
        ele.next(".invalid-feedback").text(msg);
      }
    }

    if (!ele.hasClass("is-invalid")) {
      ele.addClass("is-invalid");
    }
  }
}

// 顯示提示Modal
function showAlertModal(msg = "", title = "", ele = "#alert") {
  var modal = $(ele);
  if (title !== "") {
    modal.find(".modal-title").html(title);
  }
  msg = msg.replace("\\n", "<br>");
  modal.find(".modal-body").html(msg);
  modal.modal("show");
}

// 顯示確認modal
function showConfirmModal(msg, title, ele = "#confirm") {
  var modal = $(ele);
  if (title !== "") {
    modal.find(".modal-title").html(title);
  }
  msg = msg.replace("\\n", "<br>");
  modal.find(".modal-body h5").html(msg);
  modal.modal("show");
}

// 關閉modal後的func
function afterCloseModal(event_arr, ele = "#confirm") {
  var success = function () {};
  if (
    typeof event_arr["success"] != "undefined" &&
    $.isFunction(event_arr["success"])
  ) {
    success = event_arr["success"];
  }
  $(ele).on("hidden.bs.modal", function (event) {
    success(event);
  });
}

/* fade out old element and fade in new element */
function fadeInOut(element, item, speed = 150) {
  var fadein = speed * 2;
  $(element).fadeOut(speed, function () {
    $(this).html(item).fadeIn(fadein);
  });
}

// 西元年轉民國年
function dateTo_c(in_date, in_txt = "") {
  var date = new Date(in_date);
  date.setFullYear(date.getFullYear() - 1911);
  var formattedDate = date.toISOString().split("T")[0].replace(/-/g, in_txt);
  return formattedDate.replace(/^0+/, "");
}

// 確認必填
function checkRequired(ele) {
  var this_input = $(ele);
  var this_val = $.trim(this_input.val());
  var this_name = ele.name;
  var tooltips = this_input.attr("data-tooltip");
  var title = Boolean(tooltips)
    ? pintech_trim(this_input.attr("data-tooltip"))
    : pintech_trim(this_input.attr("title"));
  var result = {
    state: 0,
    title: title,
    name: ele.name,
    msg: "",
    modal: 0,
  };

  switch (ele.type) {
    case "file":
      var files = this_input.prop("files");
      var is_edit = aes_decrypt(this_input.data("file")); // 暫存後重新編輯
      if (is_edit === "" && files.length === 0) {
        result.msg = commonLanguage.PLS_UPLOAD_FILE[pageLanguage];
      } else {
        result.state = 1;
      }
      break;
    case "radio":
      this_val = $('input[name="' + this_name + '"]:checked').val();
      if (this_val === "" || this_val === undefined) {
        result.msg = commonLanguage.PLS_CHOOSE_OPTION[pageLanguage];
      } else {
        result.state = 1;
      }
      break;
    default:
      if (this_val === "" || this_val == null) {
        result.msg = commonLanguage.IS_REQUIRED[pageLanguage];
      } else {
        if (
          ele.name.indexOf("email") >= 0 &&
          validateEmail(this_val) === false
        ) {
          result.msg = commonLanguage.INVALID_EMAIL_FORMAT[pageLanguage];
        } else if (
          ele.name.indexOf("tel") >= 0 &&
          ValidateMobile(this_val) === false
        ) {
          result.msg = commonLanguage.INVALID_PHONE_FORMAT[pageLanguage];
        } else if (
          ele.name.indexOf("birthday") >= 0 &&
          ValidateYYYYMMDD(this_val) === false
        ) {
          result.msg = commonLanguage.INVALID_DOB_FORMAT[pageLanguage];
        } else if (
          ele.name.indexOf("id_number") >= 0 &&
          ValidateID(this_val) === false
        ) {
          result.msg = commonLanguage.INVALID_ID_FORMAT[pageLanguage];
        } else if (
          ele.id.indexOf("is_agree") >= 0 &&
          $("#is_agree:checked").length === 0
        ) {
          result.msg = commonLanguage.PLS_AGREE_YEAR[pageLanguage];
        } else if (
          ele.id.indexOf("terms") >= 0 &&
          $("#terms:checked").length === 0
        ) {
          result.msg = commonLanguage.PLS_AGREE_TERM[pageLanguage];
        } else if (
          this_input.attr("pattern") !== "" &&
          this_input.attr("pattern") !== null &&
          this_input.attr("pattern") !== undefined
        ) {
          var pattern = this_input.attr("pattern");
          var pattern_option = this_input.data("option");
          var re = new RegExp(pattern, pattern_option);

          if (!re.test(this_val)) {
            result.msg = title + commonLanguage.INVALID_FORMAT[pageLanguage];
            result.modal = 1;
          } else {
            result.state = 1;
          }
        } else {
          result.state = 1;
        }
      }
      break;
  }

  return result;
}

/*-----------------------------------
news_list + event_list 日期區間篩選器
----------------------------------*/

function dateRangeSet() {
  var dateRangePickerOption = {
    autoUpdateInput: false,
    autoApply: true, // 自動送出
    opens: "left",
    applyButtonClasses: "btn btn-modern btn-primary btn-outline",
    cancelClass: "btn btn-modern btn-light btn-outline",
    // alwaysShowCalendars: true,
    locale: {
      format: "YYYY/MM/DD",
      separator: " ― ",
      applyLabel: "搜尋",
      cancelLabel: "清空",
      daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
      monthNames: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      firstDay: 1,
      customRangeLabel: "自訂日期區間",
    },
    ranges: {
      全部: ["", ""],
      今日: [moment(), moment()],
      昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      過去7天: [moment().subtract(6, "days"), moment()],
      // '過去30天': [moment().subtract(29, 'days'), moment()],
      這個月: [moment().startOf("month"), moment().endOf("month")],
      上個月: [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ],
    },
  };

  var startDate = $("[name=start_date]").val() ?? ""; // 預設無
  var endDate = $("[name=end_date]").val() ?? ""; // 預設無
  if (startDate !== "") {
    dateRangePickerOption.startDate = startDate;
  } else {
    dateRangePickerOption.startDate = moment().subtract(45, "days");
  }

  if (endDate !== "") {
    dateRangePickerOption.endDate = endDate;
  } else {
    dateRangePickerOption.endDate = moment();
  }

  $('[name="daterange"]').daterangepicker(
    dateRangePickerOption,
    function (start, end, label) {
      // Apply
      var start_date = start.format("YYYY-MM-DD");
      var end_date = end.format("YYYY-MM-DD");
      if (start_date == "Invalid date") {
        start_date = "";
      }

      if (end_date == "Invalid date") {
        end_date = "";
      }

      $("[name=start_date]").val(start_date);
      $("[name=end_date]").val(end_date);
      $("[name=start_date],[name=end_date]").change();
    }
  );

  $('[name="daterange"]').on("cancel.daterangepicker", function (ev, picker) {
    $(this).val("");
    $("[name=start_date]").val("");
    $("[name=end_date]").val("");
    $("[name=start_date],[name=end_date]").change();
  });
}

function unbindThirdParty(member_id, third) {
  var obj = {
    third: third,
    member_id: member_id,
  };

  var yes = confirm(
    commonLanguage.CONFIRM_UNBIND[pageLanguage] + aes_decrypt(third) + "?"
  );
  if (yes) {
    $.when(api("third_party_unbind.php", obj))
      .then(function () {
        document.location.href = "member.php";
      })
      .fail(function (err) {
        alert(err.message);
        return false;
      });
  }
}

// 將會員有的最愛加入localStorage
function getFavorite() {
  var deferred = $.Deferred();
  var member_id = "";
  var obj = {};

  if ($("[name=member_id]").length > 0) {
    member_id = $("[name=member_id]").val(); // aes 會員uuid
    if (member_id !== undefined && member_id !== null) {
      obj.member_id = member_id;
    }
  }

  if (aes_decrypt(member_id) === "") {
    alert(commonLanguage.LOGIN_FIRST[pageLanguage]);
    deferred.reject();
  } else {
    $.when(api("get_member_favorite.php", obj))
      .then(function (resp) {
        deferred.resolve(resp);
      })
      .fail(function (err) {
        deferred.reject();
      });
  }

  return deferred.promise();
}

// 加入我的最愛
function addFavorite(ele, distinguish, major_id) {
  var member_id = "";
  var obj = {
    distinguish: distinguish,
    major_id: major_id,
    member_id: aes_encrypt(member_id),
    uuid: distinguish + major_id,
  };

  if ($("[name=member_id]").length > 0) {
    member_id = $("[name=member_id]").val(); // aes 會員uuid
    if (member_id !== undefined && member_id !== null) {
      obj.member_id = member_id;
    }
  }

  if (aes_decrypt(member_id) === "") {
    alert(commonLanguage.LOGIN_FIRST[pageLanguage]);
    showLoginModal();
    return false;
  } else if (major_id === undefined) {
    alert(commonLanguage.ADD_FAV_FAILED[pageLanguage]);
    return false;
  }

  var deferred = $.Deferred();
  // 先儲存local, 重複就會刪除(toggle)
  $.when(toggleLocal("favorite", obj, "uuid"))
    .then(function () {
      $.when(searchLocal("favorite", obj, "uuid"))
        .then(function () {
          switchFavoriteClass(ele);
          deferred.resolve(1);
        })
        .fail(function () {
          switchFavoriteClass(ele, false);
          deferred.resolve(-1);
        });
    })
    .fail(function () {
      switchFavoriteClass(ele, false);
      deferred.resolve(-1);
    });

  // 如果有會員, 再儲存主機
  deferred.then(function (orders) {
    obj.orders = aes_encrypt(orders);
    $.when(api("post_favorite.php", obj)).then(function (resp) {
      alert(resp.message);
    });
  });
}

function switchFavoriteClass(ele, added = true) {
  if ($(ele).hasClass("delete")) {
    // 我的最愛-刪除
    if (!added) {
      $(ele).parents(".border").remove();
    }
  } else {
    if (added) {
      $(ele).html('<i class="bi bi-heart-fill bi-lg"></i>');
    } else {
      $(ele).html('<i class="bi bi-heart bi-lg"></i>');
    }
  }
}

// 產品列表頁 關鍵字查詢篩選條件
function filterSearch(ele, table) {
  var keyword = $.trim($(ele).val());
  var obj = {
    table: table,
    keyword: aes_encrypt(keyword),
  };

  add_history(ele.name, keyword); // 歷史紀錄
  var table_decrypt = aes_decrypt(table);
  var params = $("[name=" + table_decrypt + "]").val(); // 搜尋紀錄
  var checked_arr = [];
  if (params !== undefined && params !== null && params !== "") {
    checked_arr = params.split(",").filter((item) => item);
  }

  if (
    $(ele)
      .parents(".simple-search")
      .find("[name=" + table_decrypt + "_union_str]").length > 0
  ) {
    var union_str = $(ele)
      .parents(".simple-search")
      .find("[name=" + table_decrypt + "_union_str]")
      .val();
    obj.union = union_str;
  }

  $.when(api("get_filter.php", obj)).then(function (resp) {
    // 這邊改的話product_list.php也要改
    var str = "";
    $.each(resp.data, function (i, item) {
      var id = item.id;
      var checked = checked_arr.indexOf(id) >= 0 ? "checked" : "";
      str += '<div class="form-check">\n';
      str +=
        '<input class="form-check-input" name="checkbox_' +
        table_decrypt +
        '" type="checkbox" value="' +
        id +
        '" id="' +
        table_decrypt +
        "_" +
        id +
        '" ' +
        checked +
        ">\n";
      str +=
        '<label class="form-check-label" for="' +
        table_decrypt +
        "_" +
        id +
        '">' +
        item.title +
        "</label>\n";
      str += "</div>\n";
    });

    $(ele).parents(".toggle-content").find("[name=filterArea]").html(str);
  });
}

function filterAreaSearch(ele, table) {
  var keyword = $.trim($(ele).val());
  var obj = {
    table: table,
    keyword: aes_encrypt(keyword),
  };

  add_history(ele.name, keyword); // 歷史紀錄
  var table_decrypt = aes_decrypt(table);
  var params = $("[name=" + table_decrypt + "]").val(); // 搜尋紀錄
  var checked_arr = [];
  if (params !== undefined && params !== null && params !== "") {
    checked_arr = params.split(",").filter((item) => item);
  }

  if (
    $(ele)
      .parents(".simple-search")
      .find("[name=" + table_decrypt + "_union_str]").length > 0
  ) {
    var union_str = $(ele)
      .parents(".simple-search")
      .find("[name=" + table_decrypt + "_union_str]")
      .val();
    obj.union = union_str;
  }

  $.when(api("get_filter.php", obj)).then(function (resp) {
    // 這邊改的話product_list.php也要改
    var str = "";
    $.each(resp.data, function (country_id, country) {
      str += '<li class="mb-2">\n';
      str +=
        '<label class="mb-1 form-check" for="country_' + country_id + '">\n';
      str +=
        '<input type="checkbox" name="country" class="form-check-input" id="country_' +
        country_id +
        '">\n';
      str += country.title;
      str += "</label>\n";
      str += "<ul>\n";

      $.each(country.data, function (i, item) {
        var id = item.id;
        var checked = checked_arr.indexOf(id) >= 0 ? "checked" : "";
        str += '<li class="mb-1">\n';
        str += '<label class="mb-1 form-check" for="area_' + id + '">\n';
        str +=
          '<input class="form-check-input" name="area" type="checkbox" value="' +
          id +
          '" id="area_' +
          id +
          '" ' +
          checked +
          ">\n";
        str += item.title;
        str += "</label>\n";
        str += "</li>\n";
      });

      str += "</ul>\n";
      str += "</li>\n";
    });

    $(ele).parents(".toggle-content").find(".tree > ul").html(str);
    initProductCountryCheckbox();
  });
}

// 產品列表頁 檢查國家是否要勾選
function initProductCountryCheckbox() {
  $("[name=country]").each(function () {
    var $checkbox = $(this);
    var checkedLength = 0;
    var indeterminateLength = 0;
    var $children = $checkbox.parents("li").find("> ul input");
    $children.each(function () {
      if (this.checked) {
        checkedLength++;
      }
      if (this.indeterminate) {
        indeterminateLength++;
      }

      $checkbox
        .prop("checked", checkedLength === $children.length)
        .prop(
          "indeterminate",
          indeterminateLength > 0 ||
            (checkedLength > 0 && checkedLength < $children.length)
        );
    });
  });
}

function initKeyword() {
  $("[name^=keyword_]").each(function () {
    var value = $(this).val();
    if (value !== "") {
      $(this).change(); // 重新取得篩選條件
    }
  });
}

// 產品列表頁 價格區間搜尋
function searchPriceRange(ele) {
  var this_dom = $(ele);
  var this_parents = this_dom.parents(".toggle-content");
  var start_price = parseInt(this_parents.find("[name=start_price]").val());
  var end_price = parseInt(this_parents.find("[name=end_price]").val());
  if (!isNaN(start_price)) {
    $("[name=min_price]").val(start_price);
  } else {
    $("[name=min_price]").val("");
  }

  if (!isNaN(end_price) && end_price >= 0) {
    $("[name=max_price]").val(end_price);
  } else {
    $("[name=max_price]").val("");
  }

  $("[name=min_price],[name=max_price]").change();
}

// 產品列表頁 移除已選擇篩選條件
function removeFilter(ele, types, id) {
  var name = aes_decrypt(types);
  var this_id = aes_decrypt(id);
  var this_checkbox = $("[data-types=" + aes_encrypt(name + this_id) + "]");
  if (this_checkbox.length > 0) {
    this_checkbox.prop("checked", false).change();
  }
}

// 產品數量[按鈕]選擇
function handleQtyBtnClick(ele, types) {
  if ($(ele).prop("disabled")) {
    return false;
  }

  var quantity = $(ele).parents(".quantity").find(".qty"); // 數量 dom
  var value = parseInt(quantity.val()); // 數量
  var min = parseInt(quantity.attr("min")); // 最小庫存
  var max = parseInt(quantity.attr("max")); // 最大庫存

  if (isNaN(value)) {
    quantity.val(1);
    return false;
  }

  if (isNaN(min)) {
    $(ele).attr("min", 1);
    return false;
  }

  if (isNaN(max)) {
    $(ele).attr("max", 1);
    return false;
  }

  var newValue = value;
  if (types === 1) {
    // 增加+
    newValue = Math.max(value + 1, min);
  } else {
    // 減少-
    newValue = Math.min(value - 1, max);
  }

  if (newValue >= max) {
    // 超過最大庫存
    newValue = Math.max(max, min);
  } else if (newValue <= min) {
    // 不足最小庫存
    newValue = Math.min(min, max);
  }

  renderQtyValue(quantity, newValue);
}

// 產品數量[按鈕]狀態
function handleQtyBtnStatus(ele) {
  var minus = $(ele).siblings(".minus"); // 減少-按鈕
  var plus = $(ele).siblings(".plus"); // 增加+按鈕

  var value = parseInt($(ele).val()); // 數量
  var min = parseInt($(ele).attr("min")); // 最小庫存
  var max = parseInt($(ele).attr("max")); // 最大庫存

  if (value >= max) {
    // 超過最大庫存
    plus.prop("disabled", true);
    minus.prop("disabled", false);
  } else if (value <= min) {
    // 不足最小庫存
    plus.prop("disabled", false);
    minus.prop("disabled", true);
  } else {
    // 正常範圍
    plus.prop("disabled", false);
    minus.prop("disabled", false);
  }
}

// 產品數量[輸入框]改變
function handleQtyInputChange(ele) {
  var value = parseInt($(ele).val()); // 數量
  var min = parseInt($(ele).attr("min")); // 最小庫存
  var max = parseInt($(ele).attr("max")); // 最大庫存

  var newValue = value;
  if (value >= max) {
    // 超過最大庫存
    newValue = Math.max(max, min);
  } else if (value <= min) {
    // 不足最小庫存
    newValue = Math.min(min, max);
  }

  return parseInt(newValue);
}

function renderQtyValue(ele, value) {
  $(ele).val(value);
  handleQtyBtnStatus(ele);

  // 如果是在詢問清單頁
  if (location.pathname.indexOf("favorite") >= 0) {
    // 更新session數量
    var id = $(ele).data("id");
    $.when(addCart(id, value, 2)).then(function (resp) {
      if (resp.message !== "") {
        alert(resp.message);
      }
    });
  }
}

// 計算[商品金額]
function countSubtotal() {
  var total = 0;
  $(".qty").each(function (i, q) {
    var price = parseInt(aes_decrypt($(q).data("price"))); // 售價
    var qty = parseInt($(q).val()); // 數量
    total += price * qty; // 小計
  });

  $("[data-count=subtotal]")
    .text("$" + total.toLocaleString())
    .data("value", aes_encrypt(total));
  countPrice();
}

// 計算[總金額]
function countPrice() {
  var total = 0;
  $("[data-count]").each(function (i, ele) {
    var data = $(ele).data();
    var minus = aes_decrypt(data.minus) === "1"; // 是否為負數
    var value = parseInt(aes_decrypt(data.value)); // 數值
    total += minus ? value * -1 : value;
  });

  // 可能要注意，扣除優惠金額後會不會小於0
  $("#total").text("$" + total.toLocaleString());
}

// 是否需要運費
function postShipping(orders) {
  var deferred = $.Deferred();
  var obj = {
    orders: orders,
  };

  var member_id = "";
  if ($("[name=member_id]").length > 0) {
    member_id = $("[name=member_id]").val(); // aes 會員uuid
    if (member_id !== undefined && member_id !== null) {
      obj.member_id = member_id;
    }
  }

  if (aes_decrypt(member_id) === "") {
    alert(commonLanguage.LOGIN_FIRST[pageLanguage]);
    showLoginModal();
    deferred.reject();
  } else {
    $.when(api("post_shipping.php", obj))
      .then(function (resp) {
        // 刷新價格
        renderPrice(resp.data);

        deferred.resolve(resp);
      })
      .fail(function (err) {
        alert(err.message);
        deferred.reject();
      });
  }

  return deferred.promise();
}

// 刷新價格
function renderPrice(cart) {
  var price_arr = cart.price;
  $.each(price_arr, function (key, item) {
    if ($("[data-count=" + key + "]").length > 0) {
      var this_count = $("[data-count=" + key + "]");
      var this_parent = this_count.parents("#" + key);
      var this_price = "$" + item.value.toLocaleString();
      if (key === "shipping" && item.value <= 0) {
        this_price = "";
      }

      this_count.text(this_price);
      this_count.data("value", aes_encrypt(item.value));

      // 如果是折扣金額會是負數
      if (item.minus) {
        if (item.value <= 0) {
          this_parent.addClass("hide");
        } else {
          if (this_parent.hasClass("hide")) {
            this_parent.removeClass("hide");
          }
        }
      }

      // 如果有備註 ex運費說明
      var this_note = $("[data-count=" + key + "_note]");
      if (this_note.length > 0) {
        if (item.note !== undefined && item.note !== "") {
          this_note
            .text(item.note)
            .parents("#" + key)
            .removeClass("hide");
        } else {
          this_note.parents("#" + key).addClass("hide");
        }
      }
    }
  });
}

// 加入詢問清單前，先確認庫存
function validateStock(id, qty) {
  var deferred = $.Deferred();
  var obj = {
    id: aes_encrypt(id),
    qty: aes_encrypt(qty),
  };

  $.when(api("validate_stock.php", obj))
    .then(function (resp) {
      deferred.resolve();
    })
    .fail(function (err) {
      alert(err.message);
      deferred.reject();
    });

  return deferred.promise();
}

// 加入詢問清單
function addCart(id, qty, orders = 1) {
  var deferred = $.Deferred();
  var member_id = "";
  var obj = {
    id: aes_encrypt(id),
    qty: aes_encrypt(qty),
    member_id: aes_encrypt(member_id),
    orders: aes_encrypt(orders),
  };

  if ($("[name=member_id]").length > 0) {
    member_id = $("[name=member_id]").val(); // aes 會員uuid
    if (member_id !== undefined && member_id !== null) {
      obj.member_id = member_id;
    }
  }

  if (aes_decrypt(member_id) === "") {
    alert(commonLanguage.LOGIN_FIRST[pageLanguage]);
    showLoginModal();
    deferred.reject();
  } else {
    $.when(api("post_cart.php", obj))
      .then(function (resp) {
        // 更新主選單的詢問清單數量(產品數量)
        var products_arr = resp.data.products;
        var cartCount = Object.keys(products_arr).length;
        $("#cartCount").text(cartCount);

        if (location.pathname.indexOf("favorite") >= 0) {
          // 刷新優惠
          if ($("[name=filterArea]").length > 0) {
            var promo = resp.data.promo;
            var promo_html = renderPromo(promo.data);
            var checked_str = promo.checked.join(",");
            if (promo_html === "") {
              $("[name=filterArea]").prev().addClass("d-none");
            } else {
              $("[name=filterArea]").prev().removeClass("d-none");
            }
            $("[name=filterArea]")
              .html(promo_html)
              .next("[data-for]")
              .val(checked_str);
          }

          // 刷新產品
          if ($("#cartArea").length > 0) {
            $.when(renderProducts(products_arr)).then(function (products_html) {
              $("#cartArea").html(products_html);
            });
          }
        }

        // 刷新價格
        renderPrice(resp.data);

        deferred.resolve(resp);
      })
      .fail(function (err) {
        alert(err.message);
        if (err.state === 2) {
          // 如果全部都被清空就跳出這頁
          document.location.href = "index.php";
        }
        deferred.reject();
      });
  }

  return deferred.promise();
}

// 如果勾選優惠，確認優惠是否可以套用、可疊加?
function validatePromo(id, checked) {
  var deferred = $.Deferred();
  var obj = {
    id: aes_encrypt(id),
    checked: aes_encrypt(checked),
  };

  var member_id = "";
  if ($("[name=member_id]").length > 0) {
    member_id = $("[name=member_id]").val(); // aes 會員uuid
    if (member_id !== undefined && member_id !== null) {
      obj.member_id = member_id;
    }
  }

  if (aes_decrypt(member_id) === "") {
    alert(commonLanguage.LOGIN_FIRST[pageLanguage]);
    showLoginModal();
    deferred.reject();
  } else {
    $.when(api("validate_promo.php", obj))
      .then(function (resp) {
        deferred.resolve(resp);
      })
      .fail(function (err) {
        alert(err.message);
        deferred.reject();
      });
  }

  return deferred.promise();
}

// 如果勾選優惠，確認優惠是否可以套用、可疊加?
function validateCoupon(code) {
  var deferred = $.Deferred();
  var obj = {
    code: aes_encrypt(code),
  };

  var member_id = "";
  if ($("[name=member_id]").length > 0) {
    member_id = $("[name=member_id]").val(); // aes 會員uuid
    if (member_id !== undefined && member_id !== null) {
      obj.member_id = member_id;
    }
  }

  if (aes_decrypt(member_id) === "") {
    alert(commonLanguage.LOGIN_FIRST[pageLanguage]);
    showLoginModal();
    deferred.reject();
  } else {
    $.when(api("validate_coupon.php", obj))
      .then(function (resp) {
        deferred.resolve(resp);
      })
      .fail(function (err) {
        alert(err.message);
        deferred.reject();
      });
  }

  return deferred.promise();
}

// 刷新優惠
function renderPromo(promo_arr, is_selected = false) {
  var promo_html = "";
  $.each(promo_arr, function (_, item) {
    var checked = is_selected || item.is_selected == "1" ? "checked" : "";
    var is_accumulated =
      item.is_accumulated == "1"
        ? "※" + commonLanguage.PROMO_COMBINED[pageLanguage]
        : "※" + commonLanguage.PROMO_INDEPEND[pageLanguage];
    var hide = "";
    var is_code = 0; // 是否為優惠代碼且使用者已領取
    if (item.code !== "" && item.added_coupon !== "1") {
      is_code = 1;
      if (!is_selected && item.is_selected !== "1") {
        hide = "d-none";
      }
    }

    promo_html += '<li class="px-0 d-flex align-items-center ' + hide + '">\n';
    promo_html +=
      '<input type="checkbox" name="checkbox_promo" id="item' +
      item.id +
      '" value="' +
      item.id +
      '" class="form-check-input scale-1 me-2" ' +
      checked +
      ' data-code="' +
      aes_encrypt(is_code) +
      '">\n';
    promo_html += '<label for="item' + item.id + '">\n';
    if (item.code !== "") {
      promo_html +=
        '<span class="badge badge-primary-100 badge-sm text-2 me-2 letter-spacing-1">' +
        item.code +
        "</span>\n";
    } else {
      promo_html +=
        '<span class="badge badge-secondary badge-sm text-2 me-2 letter-spacing-1">' +
        commonLanguage.PROMO[pageLanguage] +
        "</span>\n";
    }
    promo_html += item.title;
    promo_html +=
      '<small class="mx-1 text-danger">' + is_accumulated + "</small>\n";
    promo_html += "</label>\n";
    promo_html += "</li>\n";
  });

  return promo_html;
}

function handleSelectCoupon(resp) {
  var promo_arr = resp.data; // 優惠資訊
  var checkbox = $("[name=checkbox_promo][value=" + promo_arr[0].id + "]");
  if (checkbox.length > 0) {
    if (checkbox.parents("li").hasClass("d-none")) {
      checkbox.parents("li").removeClass("d-none");
    }
    if (checkbox.prop("checked") === false) {
      checkbox.prop("checked", true).change();
    }
  } else {
    // 新增checkbox
    var promo_html = renderPromo(promo_arr, true);
    $("[name=filterArea]").append(promo_html);
    $("[name=checkbox_promo][value=" + promo_arr[0].id + "]").change();
  }
}

// 取得會員目前已領取的優惠券
function getCoupon() {
  var deferred = $.Deferred();
  var obj = {};

  var member_id = "";
  if ($("[name=member_id]").length > 0) {
    member_id = $("[name=member_id]").val(); // aes 會員uuid
    if (member_id !== undefined && member_id !== null) {
      obj.member_id = member_id;
    }
  }

  if (aes_decrypt(member_id) === "") {
    alert(commonLanguage.LOGIN_FIRST[pageLanguage]);
    showLoginModal();
    deferred.reject();
  } else {
    $.when(api("get_member_promo.php", obj))
      .then(function (resp) {
        deferred.resolve(resp);
      })
      .fail(function (err) {
        alert(err.message);
        deferred.reject();
      });
  }

  return deferred.promise();
}

function renderCoupon(coupon_arr) {
  var coupon_html = "";
  $.each(coupon_arr, function (i, item) {
    var is_accumulated =
      item.is_accumulated == "1"
        ? "※" + commonLanguage.PROMO_COMBINED[pageLanguage]
        : "※" + commonLanguage.PROMO_INDEPEND[pageLanguage];

    var start_date =
      item.start_date !== "0000-00-00 00:00:00"
        ? getISODateTime(item.start_date, "yyyy/MM/dd HH:mm")
        : "";
    var end_date =
      item.end_date !== "0000-00-00 00:00:00"
        ? getISODateTime(item.end_date, "yyyy/MM/dd HH:mm")
        : "";

    var introd = "";
    if (item.introd !== "") {
      introd =
        '<li class="px-0 mb-0 line-height-5"><span class="text-color-dark">' +
        commonLanguage.PROMO_USAGE[pageLanguage] +
        "：</span><br>" +
        item.introd +
        "</li>";
    }

    var default_btn = `<div class="col-md-4 bg-color-primary-200 text-center py-2">
									<div class="d-flex flex-column justify-content-center align-items-center h-100">
										<div class="text-color-light text-3 letter-spacing-1">${
                      commonLanguage.COUPON[pageLanguage]
                    }</div>
										<div class="text-color-light text-5 font-weight-black letter-spacing-3 line-height-2">${
                      item.code
                    }</div>
										<button type="button" name="couponUseBtn" data-value="${aes_encrypt(
                      item.code
                    )}" class="btn btn-modern btn-primary btn-outline white-btn btn-swap-1 custom-btn custom-font-secondary text-2 mt-md-3 mt-2 p-2">
											<span>${commonLanguage.USE_IT[pageLanguage]}</span>
											<span>${commonLanguage.USE_IT[pageLanguage]}</span>
										</button>
									</div>
								</div>`;

    if (item.is_selected == "1") {
      default_btn = `<div class="col-md-4 bg-color-grey-500 text-center py-2">
									<div class="d-flex flex-column justify-content-center align-items-center h-100">
										<div class="text-color-default text-3 letter-spacing-1">${commonLanguage.COUPON[pageLanguage]}</div>
										<div class="text-color-default text-5 font-weight-black letter-spacing-3 line-height-2">${item.code}</div>
										<button type="button" class="btn btn-modern btn-primary btn-outline btn-swap-1 custom-btn custom-font-secondary text-2 mt-md-3 mt-2 p-2">
											<span>${commonLanguage.COUPON_APPLIED[pageLanguage]}</span>
											<span>${commonLanguage.COUPON_APPLIED[pageLanguage]}</span>
										</button>
									</div>
								</div>`;
    }

    coupon_html += `<div class="card p-0 mb-3">
                    <div class="row g-0">
                        <div class="col-md-8">
                            <div class="card-body p-3 text-3-5 font-weight-medium letter-spacing-1 text-color-grey">
                                <p class="text-4-5 line-height-3 mb-2"><a href="javascript:void(0)" class="text-decoration-none" title="${item.title}">${item.title}</a>
                                </p>
                                <ul class="list list-icons text-color-grey-800 text-2 mb-0">
                                    <li class="px-0 mb-2 line-height-5"><span
                                                class="text-color-dark">${commonLanguage.PROMO_PERIOD[pageLanguage]}：</span><br>${start_date}―${end_date}
                                    </li>
                                    ${introd}
                                    <span class="mx-1 text-danger">${is_accumulated}</span>
                                </ul>
                            </div>
                        </div>
                        ${default_btn}
                    </div>
                </div>`;
  });

  return coupon_html;
}

function renderProducts(products_arr) {
  var deferred = $.Deferred();
  var product_html = "";
  var cartCount = Object.keys(products_arr).length;
  var i = 0;
  $.each(products_arr, function (product_id, item) {
    // 移除整個產品
    var remove_cart = `<a href="javascript:void(0)" class="delete" title="${commonLanguage.DELETE_FROM_INQUIRY[pageLanguage]}" data-id="${product_id}" name="delete-cart"><img class="svg" src="${pagePrefix}assets/img/favorite/close.svg" alt=""></a>`;

    // 已加入數量
    var added = item.added;

    // 價錢
    var price = commonLanguage.CONTACT_US[pageLanguage];
    var price_ori = "";
    var price_aes = aes_encrypt(0);
    if (parseInt(item.price) > 0) {
      price_aes = aes_encrypt(parseInt(item.price));
      price = "$" + item.price.toLocaleString();
    }

    // 庫存
    var min_stock = 1; // 最小數量
    var max_stock = 1; // 最大數量
    var stock = parseInt(item.stock); // 實際庫存
    if (stock > 0 && added > 0) {
      max_stock = stock;
      // 如果庫存不足，更新session數量為目前庫存
      if (stock < added) {
        added = stock;
      }
    } else {
      // 如果庫存=0或選擇數量=0，移除詢問清單
    }

    var qty_str = `<div class="quantity quantity-lg me-0">
                            <input type="button"
                                   class="minus text-color-hover-light bg-color-hover-primary border-color-hover-primary"
                                   value="―">
                            <input type="number" class="input-text qty text" title="${commonLanguage.AMOUNT[pageLanguage]}"
                                       value="${added}"
                                       name="quantity"
                                       min="${min_stock}"
                                       max="${max_stock}"
                                       data-price="${price_aes}" data-id="${product_id}">
                            <input type="button"
                                   class="plus text-color-hover-light bg-color-hover-primary border-color-hover-primary"
                                   value="+">
                        </div>`;

    // 1酒款
    var product_title = "";
    switch (item.types_option) {
      case "2": // 周邊
        product_title =
          '<h3 class="text-5 font-weight-bold line-height-3 mb-0 text-color-primary multiline-ellipsis text-transform-none"><a href="merch_detail.php?id=' +
          product_id +
          '" class="text-decoration-none" title="' +
          item.title +
          '">' +
          item.title +
          "</a></h3>";
        break;
      case "3": // 贈品
        price = "";
        qty_str = "";
        remove_cart = "";
        product_title =
          "<span>" +
          item.title +
          '</span><span class="d-flex align-items-center"><img width="16" src="' +
          pagePrefix +
          'assets/img/favorite/tag.svg" alt="" class="me-2"><span class="text-color-primary-100">' +
          commonLanguage.GIFT[pageLanguage] +
          "</span></span>";
        break;
      case "4": // 加購品
        qty_str = "";
        product_title =
          "<span>" +
          item.title +
          '</span><span class="d-flex align-items-center"><img width="16" src="' +
          pagePrefix +
          'assets/img/favorite/tag.svg" alt="" class="me-2"><span class="text-color-primary-100">' +
          commonLanguage.ADDON[pageLanguage] +
          "</span></span>";
        break;
      default: // 酒款
        product_title =
          '<h3 class="text-5 font-weight-bold line-height-3 mb-0 text-color-primary multiline-ellipsis text-transform-none"><a href="product_detail.php?id=' +
          product_id +
          '" class="text-decoration-none" title="' +
          item.title +
          '">' +
          item.title +
          '</a></h3><p class="mb-0">' +
          item.product_grape_title +
          "</p>";
        break;
    }

    var filepath = pagePrefix + "uploads/others/" + item.file0;
    checkIfImageExists(apiDomain + "/" + filepath, (exists) => {
      if (!exists) {
        filepath = pagePrefix + "assets/img/product_default.png";
      }

      product_html += `<div class="bg-white mb-4 py-3 px-2 px-md-3 list position-relative" name="cart-item">
                        <div class="row align-items-lg-center mx-0">
                            <div class="col-lg-1 col-sm-2 px-lg-2 px-md-4 mb-3 mb-md-0 d-flex justify-content-center align-items-center">
                                <a class="lightbox" href="${filepath}" data-plugin-options="{'type':'image'}">
                                    <div class="position-relative">
                                        <img class="img-fluid" width="50" src="${filepath}" alt="${item.title}" style="max-width:100%;height: auto;">
                                        <span class="zoom">
                                            <i class="fas fa-search"></i>
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="col px-md-4">
                                <div class="row align-items-center">
                                    <div class="col-12 col-lg-7 col-xl-8 mb-lg-0 mb-3">${product_title}</div>
                                    <div class="col-6 col-lg-3 col-xl-2 shop d-flex justify-content-lg-center justify-content-start">
                                        ${qty_str}
                                    </div>
                                    <div class="col-6 col-lg-2 shop text-end text-lg-center">
                                        <div class="me-xl-0 me-3">
                                            <span class="text-color-primary-100 text-5">${price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ${remove_cart}
                    </div>`;

      i++;
      if (i === cartCount) {
        deferred.resolve(product_html);
      }
    });
  });

  return deferred.promise();
}

function renderAddon(addon_arr) {
  var addon_html = "";
  $.each(addon_arr, function (addon_id, item) {
    addon_html += `<div class="product mb-0 p-3">
                        <div class="product-thumb-info gift-hover border-0 mb-3 bg-transparent">
                            <a class="lightbox" href="uploads/others/${
                              item.file0
                            }" data-plugin-options="{'type':'image'}">
                                <div class="product-thumb-info-image" style="width: auto; max-width: 8rem">
                                    <div class="position-relative">
                                        <img class="img-fluid" width="50" src="uploads/others/${
                                          item.file0
                                        }" alt="${item.title}">
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="mb-2 custom-font-secondary">
                            <h3 class="text-3 font-weight-black mb-0 text-color-primary">${
                              item.title
                            }</h3>
                        </div>
                        <p class="price text-4">
                            <span class="amount order-1">\$${item.price.toLocaleString()}</span>
                        </p>
                        <button type="button" name="add-cart-addon" data-id="${
                          item.id
                        }"
                                class="btn btn-sm btn-primary btn-custom-claret">
                            ${commonLanguage.ADD_TO_INQUIRY[pageLanguage]}
                        </button>
                    </div>`;
  });

  return addon_html;
}

// 檢查發票載具格式(規則為 8碼 第一字為/ 其他7碼為 A-Z,0-9,+,-,.)
function checkInvoiceBarcodeId(st) {
  if (st.charAt(0) !== "/") {
    return false;
  }
  if (st.length !== 8) {
    return false;
  }
  if (st.length === 8) {
    const str7 = st.substring(1, 8);

    const ary = [];
    for (let i = 0; i < 26; i++) {
      ary.push(String.fromCharCode(i + 65));
    }
    for (let i = 0; i < 10; i++) {
      ary.push(String.fromCharCode(i + 48));
    }
    ary.push("+", "-", ".");

    for (let i = 0; i <= 6; i++) {
      const nchar = str7.charAt(i);
      if (!ary.includes(nchar)) {
        return false;
      }
    }
  }
  return true;
}

// 組合checkbox已勾選的value
function combineCheckbox(this_dom) {
  var deferred = $.Deferred();
  var this_checked = this_dom.prop("checked");
  var this_name = this_dom.attr("name");
  var data_dom = this_dom
    .parents("[name=filterArea]")
    .next("[data-for=" + this_name + "]");
  var match = this_name.match(/^checkbox_(.+)$/); // 找到 "checkbox_" 後面的所有字元
  var table = match ? match[1] : null; // 如果有找到，回傳表格名稱

  var value = $("[name=" + this_name + "]")
    .map(function (i, ele) {
      var val = $(ele).val();
      var checked = $(ele).prop("checked");
      if (checked) {
        return val;
      }
    })
    .get()
    .join();

  data_dom.val(value);
  if (!this_checked && f === table) {
    $.when(handleFirstFilterUncheck(table, value)).then(function () {
      deferred.resolve();
    });
  } else {
    deferred.resolve();
  }

  deferred.then(function () {
    data_dom.change();
  });
}

// 當第一個篩選條件有取消勾選(uncheck)的情況發生時，就必須檢查其他分類樹的合理性
function handleFirstFilterUncheck(table, value) {
  var deferred = $.Deferred();
  var obj = {
    table: aes_encrypt(table),
    in_str: aes_encrypt(value),
    init: $("[name=init_sql]").val(),
  };

  $.when(api("get_filter_union.php", obj)).then(function (resp) {
    var filter = resp.data;
    $.each(filter, function (key, ids) {
      var search_dom =
        key == "product_area"
          ? $("[data-for=area]")
          : $("[data-for=checkbox_" + key + "]");
      if (search_dom.length > 0) {
        var checked_val = search_dom.val();
        var checked_arr = checked_val.split(","); // 原本已勾選的條件
        var updated_arr = []; // 比對過後的項目
        if (checked_val !== "") {
          // 如果分類數原本已勾選的條件，可以合理存在查詢條件中
          updated_arr = checked_arr.filter(function (id) {
            return ids.includes(id);
          });
        }

        search_dom.val(updated_arr.join());
      }
    });

    deferred.resolve();
  });

  return deferred.promise();
}

// 顯示登入modal
function showLoginModal() {
  var request_uri = location.pathname + location.search;
  $("#login").find("[name=redirect]").val(aes_encrypt(request_uri));
  $("#login").modal("show");
}

function checkIfImageExists(url, callback) {
  var img = new Image();
  img.src = url;

  if (img.complete) {
    callback(true);
  } else {
    img.onload = () => {
      callback(true);
    };

    img.onerror = () => {
      callback(false);
    };
  }
}

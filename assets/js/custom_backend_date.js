$(function () {
  // 下拉日期
  if ($(".onChangeDate").length > 0) {
    var year_now = new Date().getFullYear();
    var year_start = year_now - 90;
    var year_end = year_now - 17;

    var limit = 0;
    var day30 = new Date(GetDateStr(30)); // 30天內

    $("body")
      .find(".onChangeDate")
      .each(function () {
        var this_dom = $(this);
        var this_defaults = parseInt($(this).attr("defaults"));
        if (this_dom.hasClass("future")) {
          // 未來日期(自取日期)
          limit = parseInt(aes_decrypt(this_dom.data("limit")));
          day30 = new Date(GetDateStr(limit)); // 30天內

          year_start = year_now;
          year_end = day30.getFullYear();
          // 年
          for (var i = year_start; i <= year_end; i++) {
            // 遞增
            if (i == this_defaults) {
              this_dom.append(
                '<option value="' +
                  i +
                  '" selected>' +
                  (i - 1911) +
                  "年</option>"
              );
            } else {
              this_dom.append(
                '<option value="' + i + '">' + (i - 1911) + "年</option>"
              );
            }
          }
        } else if (this_dom.hasClass("bd_y")) {
          // 出生日期
          // 年
          for (var i = year_end; i >= year_start; i--) {
            // 遞減
            if (i == this_defaults) {
              this_dom.append(
                '<option value="' + i + '" selected>' + i + "年</option>"
              );
            } else {
              this_dom.append('<option value="' + i + '">' + i + "年</option>");
            }
          }
        }

        // 月
        var dom_month = this_dom.closest(".year").next(".month");
        var dom_month_defaults = parseInt(
          dom_month.find(".bd_m").attr("defaults")
        );
        for (var i = 1; i <= 12; i++) {
          if (!isNaN(dom_month_defaults) && i == dom_month_defaults) {
            dom_month
              .find(".bd_m")
              .append(
                '<option value="' + i + '" selected>' + i + "月</option>"
              );
          } else {
            dom_month
              .find(".bd_m")
              .append('<option value="' + i + '">' + i + "月</option>");
          }
        }
      });

    // 依照年份、月份顯示日期
    $("body").on("change", ".bd_y,.bd_m", function () {
      var this_dom = $(this);
      var year_dom = this_dom.closest(".row").find(".bd_y");
      var month_dom = this_dom.closest(".row").find(".bd_m");
      var day_dom = this_dom.closest(".row").find(".bd_d");

      setTimeout(function () {
        onChangeDate(year_dom, month_dom, day_dom);
      }, 300);
    });

    // 如果同時綁定2種event,用setTimeout避免同時觸發
    function onHandleIdBlurChangeDob(e) {
      clearTimeout(onHandleIdBlurChangeDob.timeout);
      onHandleIdBlurChangeDob.timeout = setTimeout(function () {
        var this_dom = $(e.target);
        var year = this_dom.closest(".row").find(".bd_y option:checked").val();
        var month = this_dom.closest(".row").find(".bd_m option:checked").val();
        var day = this_dom.closest(".row").find(".bd_d option:checked").val();

        if (year !== "" && month !== "" && day !== "") {
          var dob = getISODateTime(
            year + "/" + month + "/" + day + " 00:00:00",
            "yyyy-MM-dd"
          );
          var date = new Date(dob); // 組合日期

          var start = new Date();
          var end = day30;
          var msg = "";

          // 是否在時間範圍內
          var isInRange = checkDateRange(date, start, end, true);
          if (isInRange) {
            // 移除is-invalid
            this_dom
              .closest(".row")
              .find("select")
              .each(function (i, ele) {
                $(ele).removeClass("is-invalid");
                var onInvalidFeedback = $(ele)
                  .parents(".row")
                  .find(".onInvalidFeedback");
                if (onInvalidFeedback.length > 0) {
                  onInvalidFeedback.removeClass("show");
                }
              });
          } else {
            msg = "自取日期需為" + limit + "天內";
          }

          if (msg !== "") {
            invalidInput(this_dom, msg);
            return false;
          }
        }
      }, 100);
    }

    function checkDateRange(date, start, end, is_includes = false) {
      if (is_includes) {
        return date >= start && date <= end;
      } else {
        return date > start && date < end;
      }
    }

    if (location.pathname.indexOf("favorite") >= 0) {
      $("form").on("blur change", ".bd_y,.bd_m,.bd_d", onHandleIdBlurChangeDob); // 出生日 失焦or改變
    }
    $(".bd_y").change();
    $(".bd_m").change();
  }

  // 下拉式日期選擇
  function onChangeDate($y, $m, $d) {
    var select_d = $d;
    var defaults = parseInt(select_d.attr("defaults"));
    if ($y.val() !== "" && $m.val() !== "") {
      var date_temp = new Date($y.val(), $m.val(), 0);
      //移除超過此月份的天數
      select_d.find("option").each(function () {
        if ($(this).val() !== "" && $(this).val() > date_temp.getDate())
          $(this).remove();
      });

      //加入此月份的天數
      for (var i = 1; i <= date_temp.getDate(); i++) {
        var selected = "";
        if (i == defaults) {
          selected = "selected";
        }
        if (!select_d.find("option[value='" + i + "']").length) {
          select_d.append(
            '<option value="' + i + '" ' + selected + ">" + i + "日</option>"
          );
        }
      }
    } else {
      select_d.find("option:selected").removeAttr("selected");
    }
  }
});

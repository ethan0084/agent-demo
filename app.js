/* 内容账号数据运营 Agent - 交互式 Demo 逻辑（纯前端模拟） */
(function () {
  "use strict";

  var chat = document.getElementById("chat");
  var input = document.getElementById("input");
  var sendBtn = document.getElementById("send");

  /* ---------- 模拟数据池（脱敏，基于真实案例） ---------- */
  var SAMPLES = {
    dy1: {
      text: "8.43 复制打开抖音，看看【对标账号A的作品】我让6个AI当场PK了！每天认识一个宝藏网站【49期】... https://v.douyin.com/m8pmwNcYJ8M/ H@i.pD hBG:/ :9pm 04/14",
      result: {
        platform: "抖音",
        title: "我让6个AI当场PK了！每天认识一个宝藏网站【49期】",
        author: "对标账号A",
        stats: { digg: 14070, collect: 8184, comment: 359, share: 1831, play: 0 },
        owner: "非自家号",
        table: "对标素材表",
        action: "新增",
      },
    },
    dy2: {
      text: "5.69 复制打开抖音，看看【自家账号B的作品】这是一个能让拼豆爱好者一玩就停不下来的网站 每天认... https://v.douyin.com/Jws-EptyRbM/ d@a.nD nda:/ :8pm 06/03",
      result: {
        platform: "抖音",
        title: "这是一个能让拼豆爱好者一玩就停不下来的网站",
        author: "自家账号B",
        stats: { digg: 29, collect: 25, comment: 1, share: 17, play: 0 },
        owner: "自家号",
        table: "抖音作品数据",
        action: "新增",
      },
    },
    xhs1: {
      text: "35 打开小红书，看看【自家账号C的笔记】整理好所有工作的skills让集体破防的网站 ... https://xhslink.com/abc123 复制本条信息",
      result: {
        platform: "小红书",
        title: "整理好所有工作的skills让集体破防的网站",
        author: "自家账号C",
        stats: { digg: 43, collect: 136, comment: 0, share: 11, play: null },
        owner: "自家号",
        table: "小红书笔记数据",
        action: "新增",
      },
    },
    bad: {
      text: "https://www.bilibili.com/video/BV1xx411c7mD 这个视频很有意思",
      result: null,
    },
  };

  /* ---------- 工具 ---------- */
  function el(cls, text) {
    var d = document.createElement("div");
    d.className = cls;
    d.textContent = text || "";
    return d;
  }

  function scrollBottom() {
    chat.scrollTop = chat.scrollHeight;
  }

  function fmt(n) {
    return n === null || n === undefined ? "—" : n.toLocaleString();
  }

  function detectPlatform(text) {
    if (/v\.douyin\.com|douyin\.com\/video|iesdouyin\.com|复制打开抖音/.test(text)) return "抖音";
    if (/xhslink\.com|xiaohongshu\.com\/explore|xiaohongshu\.com\/discovery|打开小红书/.test(text)) return "小红书";
    return null;
  }

  /* ---------- 渲染消息 ---------- */
  function addMsg(cls, html) {
    var d = document.createElement("div");
    d.className = "msg " + cls;
    d.innerHTML = html;
    chat.appendChild(d);
    scrollBottom();
    return d;
  }

  function addTyping(text) {
    var d = document.createElement("div");
    d.className = "msg agent typing";
    d.textContent = text;
    chat.appendChild(d);
    scrollBottom();
    return d;
  }

  function addUser(text) {
    addMsg("user", escapeHtml(text));
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 模拟处理流程 ---------- */
  function simulate(text, sample) {
    var plat = detectPlatform(text);

    // 无效链接
    if (!plat) {
      addMsg("agent err", "<span class='tick'>❌</span> 无法识别平台：目前只支持<b>抖音</b>和<b>小红书</b>分享链接（B站/视频号/YouTube 暂不支持）。<br>请粘贴抖音或小红书 App 里复制的分享口令。");
      return;
    }

    if (!sample) {
      addMsg("agent", "<span class='tick'>✅</span> 已识别为「<b>" + plat + "</b>」分享链接。<br><span class='prog'>（演示环境：链接为示例，已模拟完成入库流程）</span><br>结果：写入对标素材表｜非自家号｜新增 1 条");
      return;
    }

    var r = sample.result;
    var t1 = addTyping("正在识别平台…");
    setTimeout(function () {
      t1.textContent = "✅ 识别平台：抖音".replace("抖音", r.platform);
      var t2 = addTyping("正在抓取作品详情…");
      setTimeout(function () {
        t2.textContent = "✅ 抓取成功：作品「" + r.title.slice(0, 18) + "…」";
        var t3 = addTyping("正在判断作者归属…");
        setTimeout(function () {
          t3.textContent = r.owner === "自家号" ? "✅ 归属判断：命中账号表 → 自家账号" : "✅ 归属判断：未命中账号表 → 对标账号";
          var t4 = addTyping("正在写入表格…");
          setTimeout(function () {
            t4.textContent = "✅ 写入完成（演示）";
            var stats = r.stats;
            var statStr = "赞" + fmt(stats.digg) + " 藏" + fmt(stats.collect) + " 评" + fmt(stats.comment) + " 分享" + fmt(stats.share);
            if (r.platform === "抖音" && stats.play !== null) statStr += " 播" + fmt(stats.play);

            var html =
              "<span class='tick'>✅</span> <b>" + r.table + "</b> | " + r.owner + "「" + r.author + "」| " + r.action + "<br>" +
              "<div class='work-card'>" +
              "<div class='t'>📌 " + escapeHtml(r.title) + "</div>" +
              "<div class='row'><span>平台：" + r.platform + "</span><span>作者：" + r.author + "</span></div>" +
              "<div class='row'>" + statStr + "</div>" +
              "<span class='tag " + (r.owner === "自家号" ? "self" : "bench") + "'>" + (r.owner === "自家号" ? "自家账号 → 作品数据表" : "对标账号 → 对标素材表") + "</span>" +
              "</div>" +
              "<span class='prog'>⏱ 演示耗时 2.4s（真实环境约 8-13s，含 TikHub 抓取）</span>";

            addMsg("agent", html);
          }, 700);
        }, 700);
      }, 700);
    }, 600);
  }

  /* ---------- 入口 ---------- */
  function handleSend() {
    var text = (input.value || "").trim();
    if (!text) return;
    addUser(text);
    input.value = "";
    simulate(text, null);
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleSend();
  });

  // 示例 chips
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var key = chip.getAttribute("data-sample");
      var s = SAMPLES[key];
      if (!s) return;
      addUser(s.text);
      simulate(s.text, s);
    });
  });

  // 开场欢迎语
  addMsg("agent", "👋 你好！我是<b>内容账号数据运营 Agent</b>。<br><br>" +
    "我可以：<br>" +
    "🔗 自动识别抖音/小红书分享链接并入库<br>" +
    "📊 每日同步账号数据、推送日报<br>" +
    "📈 每周一输出周报对比分析<br><br>" +
    "<span class='prog'>👇 试试在下方输入框粘贴一条分享口令，或点击下方示例</span>");
})();

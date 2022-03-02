function getTransformItem(idx, totalLen, height) {
  var top = (height / totalLen) * idx;
  return getTopTransformStr(top);
}

function getTopTransformStr(top = 0) {
  return `transform: translateY(${top}px)`;
}

function showLinks(links) {
  var navHeight = (window.innerHeight * 0.7) / links.length;
  links.each(function (idx) {
    var trans = getTopTransformStr((idx + 1) * navHeight);

    $(this).attr("style", `${trans}skew(45deg)`);
    $(this).addClass("is-hover");
  });
}
function hideLinks(links) {
  links.each(function () {
    $(this).removeClass("is-hover");
    $(this).attr("style", `translate(0,0)skew(45deg)`);
  });
}

$(function () {
  $("body").prepend(
    `<ul id="nav" class="navigation">
  <li class="main" href="/"></li>
  <li class="nav-link" id="old-fashion-selfie">
    <a href="/old-fashion-selfie/">Old fashion selfie</a>
  </li>
  <li class="nav-link" id="proof-of-consensus">
    <a href="/proof-of-consensus/">Proof of consensus</a>
  </li>
  <li class="nav-link" id="mobmess">
    <a href="/mobmess/">mobMess</a>
  </li>

  <li class="nav-link" id="power-plant">
    <a href="/power-plant/">Power</a><a href="/power-plant/">PLant</a>
  </li>

  <li class="nav-link" id="babyduck">
    <a href="/babyduck/">BabyDuck</a>
  </li>
  <li class="nav-link" id="mundo-gorila">
    <a href="/mundo-gorila/">MundoGorila</a>
  </li>
  <li class="nav-link" id="comuna-con-la-cocina">
    <a href="/comuna-con-la-cocina/">Comuna</a>
  </li>
  <li class="nav-link" id="fragiles">
    <a href="/fragiles/">Fragiles</a>
  </li>
</ul>`
  );

  $("body").append(`
    <div class="sidebar">
    <div id="videos">
      <a href="/videos/">videos</a>
    </div>

    <div id="documents">
      <a href="/documents/">documents</a>
    </div>

    <div id="curriculo">
      <a href="/cv">cv</a>
    </div>

    <div id="profile">
      <div id="signature">
        <p>Mario Romera Gomez</p>
      </div>
    </div>
    </div>
  `);

  if (window.location.pathname !== "/") {
    $("body").append(`<a class="home" href="/">⌂</a>`);
  }

  var links = $("#nav").children(".nav-link");

  $(".navigation .main").on("click", function () {
    var maxScroll = $(document).height();
    if ($("body").hasClass("menu-visible")) {
      $(".navigation").height(100);
    } else {
      $(".navigation").height(maxScroll);
    }

    $("body").toggleClass("menu-visible");
    if (!$("body").hasClass("menu-visible")) {
      hideLinks(links);
    } else {
      showLinks(links);
    }
  });

  $("#profile").on("click", function () {
    window.location.href = "/bio";
  });

  $(".navigation").on("mouseover", function () {
    var maxScroll = $(document).height();
    $(".navigation").height(maxScroll);

    $("body").toggleClass("menu-visible");

    showLinks(links);
  });
  $(".navigation").on("mouseout", function () {
    $("body").toggleClass("menu-visible");

    hideLinks(links);
  });
});

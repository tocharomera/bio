function getTransformItem(idx, totalLen, height) {
  var top = (idx + 0.8) * (height / totalLen - 1);

  return getTopTransformStr(top);
}

function getTopTransformStr(top = 0) {
  return `transform: translateY(${top}px)`;
}

function showLinks(links) {
  links.each(function (idx) {
    var navHeight = window.innerHeight;
    var trans = getTransformItem(idx, links.length, navHeight);
    console.log("nav", navHeight);
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

  <li class="nav-link" id="baby-duck">
    <a href="/baby-duck/">BabyDuck</a>
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
  var links = $("#nav").children(".nav-link");
  var maxScroll = $(document).height();
  $(".navigation").height(maxScroll);

  $(".navigation .main").on("click", function () {
    $("body").toggleClass("menu-visible");
    if (!$("body").hasClass("menu-visible")) {
      hideLinks(links);
    } else {
      showLinks(links);
    }
  });

  $(".navigation").on("mouseover", function () {
    $("body").toggleClass("menu-visible");

    showLinks(links);
  });
  $(".navigation").on("mouseout", function () {
    $("body").toggleClass("menu-visible");

    hideLinks(links);
  });
});

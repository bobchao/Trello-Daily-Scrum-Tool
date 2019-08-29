var trelloDailyScrum_next,trelloDailyScrum_thelist,trelloDailyScrum_btn,trelloDailyScrum_initTimes=0;

function trelloDailyScrum_startOver(){
    trelloDailyScrum_next=0;
    trelloDailyScrum_btn.innerHTML="Stand up!";
    $("a.list-card").fadeIn()
}

function trelloDailyScrum_format(t,l){
  return "<strong>Now: "+t+"</strong> <small>Next: "+(""==l?"end":l)+"</small>";
}

function trelloDailyScrum_getStandupMembers(){
  var t=new Array;

  $("textarea[aria-label='Stand-up Members']").parent().parent().find("div[data-idmem]").each(function(){
    var l={name:"",id:""};
    l.name=this.parentNode.parentNode.querySelector("span.list-card-title").textContent.match(/^#\d+(.+)/)[1];
    l.id=this.getAttribute("data-idmem");
    t.push(l);
  });

  return t;
}

function trelloDailyScrum_init(){
  var retry = false;
  trelloDailyScrum_initTimes++;

  if (!trelloDailyScrum_board) {
    console.info('[Daily Scrum Tool] Board not yet ready.');
    retry = true;
  } else if (!document.querySelector("textarea[aria-label='Stand-up Members']")) {
    //no Stand-up Members, abort the process
    console.info("[Daily Scrum Tool] Searching for a 'Stand-up Members' list...");
    retry = true;
  }

  if (retry) {
    if (trelloDailyScrum_initTimes > 5){
      console.error('[Daily Scrum Tool] Tried too many times, abort the process.');
      return;
    }
    console.info('[Daily Scrum Tool] Try again in 2 seconds');
    window.setTimeout(trelloDailyScrum_init, 2000);
    return;
  }

  //start init.

  $(".board-header-btn-divider:last").after('<div class="board-header-btns mod-left"><a id="trelloDailyScrum_btn" class="board-header-btn board-header-btn-without-icon board-header-btn-text" href="#"></a></div><span class="board-header-btn-divider"></span>');
  trelloDailyScrum_btn = $("#trelloDailyScrum_btn")[0];

  trelloDailyScrum_btn.addEventListener("click",function(){
    trelloDailyScrum_thelist=trelloDailyScrum_getStandupMembers();
    if (trelloDailyScrum_next!=trelloDailyScrum_thelist.length){
      $("a.list-card").fadeOut(500);
      $("a.list-card").has("div.member[data-idmem='"+trelloDailyScrum_thelist[trelloDailyScrum_next].id+"']").fadeIn(500);
      nowName=trelloDailyScrum_thelist[trelloDailyScrum_next].name;
      nextName=++trelloDailyScrum_next==trelloDailyScrum_thelist.length?"":trelloDailyScrum_thelist[trelloDailyScrum_next].name
      trelloDailyScrum_btn.innerHTML=trelloDailyScrum_format(nowName,nextName);
    } else {
      trelloDailyScrum_startOver();
    }
  });

  trelloDailyScrum_startOver();
}

var trelloDailyScrum_board = document.getElementById('content');
trelloDailyScrum_init();

// Some logic inspired from https://github.com/christiankaindl/trello-super-powers/, thanks!

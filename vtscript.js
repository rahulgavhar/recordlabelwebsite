//doesnt store cache
document.head.insertAdjacentHTML("afterbegin",'<meta http-equiv="Cache-control" content="no-cache">');

//avoid being in someone else's iframe
if(window.self != window.top) {
  try {
    if(window.parent.location.hostname.indexOf("vestibuletrap.mozello.com") == -1) {
      window.location.href="error404.com";
    } else {
      //You are in an iframe but Same-Origin
    }
  } catch (ex) {
    //You are in an iframe loaded in a stranger's site!
    window.location.href="error404.com";
  }
}
    //back-to-top-button on all blogs
const blogpg = window.location.href
if (blogpg.search("https://vestibuletrap.mozello.com/blog")==0){
    document.querySelector("#sidebar").firstElementChild.firstElementChild.insertAdjacentHTML("afterbegin",'<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous"> <style> #back-to-top-btn { display: none; position: fixed; bottom: 20px; right: 20px; font-size: 26px; width: 50px; height: 50px; background-color: rgba(0,0,0,0); color: #333; cursor: pointer; outline: none; border: 3px solid rgba(133, 133, 133,0.5); border-radius: 50%; transition-duration: 0.2s; transition-timing-function: ease-in-out; transition-property: background-color, color; } #back-to-top-btn:hover, #back-to-top-btn:focus { background-color: rgba(0,0,0,0); color: #333; border: none; } @media(max-width: 992px) { .container { padding: 20px 100px; } #back-to-top-btn { font-size: 22px; width: 40px; height: 40px; bottom: 15px; right: 15px; } } @media(max-width:768px) { body { font-size: 16px; } .container { padding: 10px 50px; } h1 { font-size: 26px; } h2 { font-size: 22px; } hr { margin: 30px 0; } #back-to-top-btn { font-size: 18px; width: 32px; height: 32px; bottom: 6px; right: 6px; } }  .btnEntrance { animation-duration: 0.5s; animation-fill-mode: both; animation-name: btnEntrance; } @keyframes btnEntrance { from { opacity: 0; transform: translate3d(0, 100%, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } } .btnExit { animation-duration: 0.25s; animation-fill-mode: both; animation-name: btnExit; } @keyframes btnExit { from { opacity: 1; } to { opacity: 0; transform: translate3d(0, 100%, 0); } } </style> <button id="back-to-top-btn"><i class="fas fa-angle-double-up"></i></button>');
   };
   

let backToTopButton = document.querySelector("#back-to-top-btn");
if (backToTopButton==null){
    document.querySelector("#wrap").insertAdjacentHTML("afterbegin","<button style='display:none'></button>");
    backToTopButton = document.querySelector("#wrap").firstElementChild;
}

window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
if (window.pageYOffset > 300) { // Show backToTopButton
if (!backToTopButton.classList.contains("btnEntrance")) {
  backToTopButton.classList.remove("btnExit");
  backToTopButton.classList.add("btnEntrance");
  if (document.querySelector('#back-to-top-btn')!=null){
      backToTopButton.style.display = "block";
  };
  
}
}
else { // Hide backToTopButton
if (backToTopButton.classList.contains("btnEntrance")) {
  backToTopButton.classList.remove("btnEntrance");
  backToTopButton.classList.add("btnExit");
  setTimeout(function () {
   backToTopButton.style.display = "none";
  }, 250);
}
}
}

backToTopButton.addEventListener("click", smoothScrollBackToTop);


function smoothScrollBackToTop() {
const targetPosition = 0;
const startPosition = window.pageYOffset;
const distance = targetPosition - startPosition;
const duration = 750;
let start = null;

window.requestAnimationFrame(step);

function step(timestamp) {
if (!start) start = timestamp;
const progress = timestamp - start;
window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
if (progress < duration) window.requestAnimationFrame(step);
}
}

function easeInOutCubic(t, b, c, d) {
t /= d / 2;
if (t < 1) return c / 2 * t * t * t + b;
t -= 2;
return c / 2 * (t * t * t + 2) + b;
};

//onscrollul function
function onscrollul(){
    if (window.pageYOffset<84.4){
        document.querySelector('#menu').firstElementChild.style.textAlign="left";
    }else{
        document.querySelector('#menu').firstElementChild.style.textAlign="right";
    }
}
    //preloader
const lc='<div id="loading"></div>';
document.body.insertAdjacentHTML("afterbegin",lc);
const preloader=document.getElementById("loading");
  document.onreadystatechange = function() {
      
    if (document.readyState !== "complete") {
        preloader.style.visibility = "visible";
        document.querySelector("body").style.backgroundColor = "white";
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#wrap").style.display = "none";
    } else {
        //avoiding improper nav bar if page loaded after scrolled
     if (window.innerWidth>750){
         document.querySelector('#top').setAttribute("class","is-fat menu-wrapped");
         document.querySelector('body').setAttribute("onscroll","onscrollul()");
     }
        document.querySelector("body").style.backgroundColor = "black";
        document.querySelector("body").style.visibility = "visible";
        document.querySelector("#wrap").style.display = "block";
        document.querySelector(".cursor").style.visibility = "hidden";
    }
};

//cursor
const cursor = document.querySelector('.cursor');
    
    document.addEventListener('mousemove', e => {
        document.querySelector(".cursor").style.visibility = "visible";
        cursor.setAttribute("style", "top: "+(e.clientY-20)+"px; left:"+(e.clientX-20)+"px;")
        
    })
    document.addEventListener("mouseout",() => {
        cursor.style.visibility="hidden";
    })
    document.addEventListener('click', () => {
        cursor.classList.add("expand");

        setTimeout(() => {
            cursor.classList.remove("expand");
        }, 500)
    })
    
//Home svg
const homesvg = document.getElementById("menu");
homesvg.firstElementChild.firstChild.nextElementSibling.innerHTML='<a href="/" style="vertical-align:sub;"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"></path></svg></a>';

//favicon
document.querySelector('[rel="shortcut icon"]').setAttribute("href","https://i.ibb.co/tBBHWCy/VT-circular.png");
document.querySelector('[rel="apple-touch-icon"]').setAttribute("href","https://i.ibb.co/tBBHWCy/VT-circular.png");

//disabled right click
document.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);

//music-library, artists-page, talpoolpage fit-mobile-width
const muslibpad = document.querySelector('[data-row-id="6628645"]');
if (muslibpad!=null){
    muslibpad.firstElementChild.style.padding="0 20px 0";
}
const artlibpad = document.querySelector('[data-row-id="10322040"]');
if (artlibpad!=null){
    artlibpad.firstElementChild.style.padding="0 20px 0";
}
const talpoolpad = document.querySelector('[data-row-id="6628794"]');
if (talpoolpad!=null){
    talpoolpad.firstElementChild.style.padding="0 20px 0";
}

//latest release
const latestrelease=document.querySelector('[data-row-id="5404049"]');
const latestreleasebg='<div style="background-image: url(https://i.scdn.co/image/ab67616d0000b27374fbeabb969ed0d9f5994618);top:-10px;bottom: 0px;left: 0px;right: 0px;filter: blur(20px);background-size: cover;background-position: 50% 50%;position: absolute;"><div style="position: absolute;background:rgb(0,0,0,0.5);height:100%;width:100%;"></div></div>';

if (latestrelease != null){
    
    const belowlr = document.querySelector('[data-row-id="6628645"]');
    belowlr.style.position="relative";
    belowlr.style.zIndex="2";
    
    //header section
    document.querySelector("#top").style.zIndex="3";
    document.querySelector('#top').style.borderBottom="0.5px white solid";
    
    latestrelease.insertAdjacentHTML("afterbegin",latestreleasebg);
    latestrelease.style.position="relative";
    latestrelease.firstElementChild.nextElementSibling.style.position="relative";
    latestrelease.firstElementChild.nextElementSibling.style.padding="20px 20px";
}

//#error404 popup
  function displayErrorNotFound(){
      if((window.location.href.search(".com/musiclibrary/#error404")!=-1) || (window.location.href.search(".com/artists/#error404")!=-1)){
          //InvalidURL Object not found - pending
      }
  };

//MusicPage
const urlllmp = window.location.href;
const indxxmp = urlllmp.search(".com/music");
const basicidmp = "#trackid";
let statusmp = "";
if ((indxxmp!=-1) && (urlllmp!="https://vestibuletrap.mozello.com/musiclibrary/")  && (urlllmp!="https://vestibuletrap.mozello.com/musiclibrary") && (urlllmp!="https://vestibuletrap.mozello.com/music-platforms") && (urlllmp!="https://vestibuletrap.mozello.com/music-platforms/")){
    
    if (urlllmp.search(".com/music/#trackid")!=-1){
        if ((Number.parseInt(urlllmp.substr(indxxmp+19))>Number.parseInt(document.querySelector(".music").firstElementChild.getAttribute("track-id"))) || (Number.parseInt(urlllmp.substr(indxxmp+19))<1) || isNaN(Number.parseInt(urlllmp.substr(indxxmp+19)))){
            window.location.replace("https://vestibuletrap.mozello.com/musiclibrary/#error404");
            displayErrorNotFound();
        }else{
            statusmp="success";

            for (var tt=0; tt<document.getElementsByClassName("keepdisplaynone").length; tt++){
                if (Number.parseInt(urlllmp.substr(indxxmp+19))!=Number.parseInt(document.getElementsByClassName("keepdisplaynone")[tt].getAttribute("track-id"))){
                    document.getElementsByClassName("keepdisplaynone")[tt].remove()
                }
            }
            //Designing displayed track
    beforecodeforconcatmp='<div class="currentbgimg" style="background-image: url(';
    bgimagecodemp=beforecodeforconcatmp.concat(document.querySelector(String(basicidmp.concat("-",urlllmp.substr(indxxmp+19)))).getAttribute("bg-img"),');top: -10px;right: 0px;bottom: 0px;left: 0px;filter: blur(20px);background-size: cover;background-position: 50% 50%;position: absolute;"><div style="position: absolute;background:rgb(0,0,0,0.5);height:100%;width:100%;"></div></div>');
    document.querySelector('[data-row-id="10350137"]').style.position="relative";
    document.querySelector('[data-row-id="10350137"]').insertAdjacentHTML("afterbegin",bgimagecodemp);
    document.querySelector('[data-row-id="10350137"]').firstElementChild.nextElementSibling.style.padding="20px 10px";
    document.querySelector("#top").style.zIndex="4";
    document.querySelector("#top").style.borderBottom="0.5px solid white";
    document.querySelector("#bottom").style.borderTop="0.5px solid white";
    document.querySelector("#bottom").style.backgroundColor="black";
    document.querySelector("#bottom").style.maxWidth="100%";
            document.querySelector(String(basicidmp.concat("-",urlllmp.substr(indxxmp+19)))).style.display="block";
            
        };
    }else{
        window.location.replace("https://vestibuletrap.mozello.com/musiclibrary/#error404");
        displayErrorNotFound();
    };
    
};


//Artist Page
const urlllap = window.location.href;
const indxxap = urlllap.search(".com/artist");
const basicidap = "#id";
let statusap = "";
if ((indxxap!=-1) && (urlllap!="https://vestibuletrap.mozello.com/artists/")  && (urlllap!="https://vestibuletrap.mozello.com/artists")){
    
    if (urlllap.search(".com/artist/#id")!=-1){
        if ((Number.parseInt(urlllap.substr(indxxap+15))>Number.parseInt(document.querySelector(".artist").firstElementChild.getAttribute("artist-id"))) || (Number.parseInt(urlllap.substr(indxxap+15))<1) || isNaN(Number.parseInt(urlllmp.substr(indxxap+15)))){
            window.location.replace("https://vestibuletrap.mozello.com/artists/#error404");
            displayErrorNotFound();
        }else{
            statusap="success";

            for (var aa=0; aa<document.getElementsByClassName("keepdisplaynone").length; aa++){
                if (Number.parseInt(urlllap.substr(indxxap+15))!=Number.parseInt(document.getElementsByClassName("keepdisplaynone")[aa].getAttribute("artist-id"))){
                    document.getElementsByClassName("keepdisplaynone")[aa].remove()
                }
            }
            //Designing displayed artist
            //pending
            
            
            document.querySelector(String(basicidap.concat("-",urlllap.substr(indxxap+15)))).style.display="block";
            
        };
    }else{
        window.location.replace("https://vestibuletrap.mozello.com/artists/#error404");
        displayErrorNotFound();
    };
    
};

    //Setting background color of footer
    document.body.querySelector("#bottom").style.backgroundColor="#000";
    document.body.querySelector("#bottom").style.maxWidth="none";
    

//close back-to-top on opening menu
function baktotop(){
    if(document.querySelector('#back-to-top-btn')!=null){
            document.querySelector('#back-to-top-btn').style.display="none";
    };
};
function bcktotop(){
     if(document.querySelector('#back-to-top-btn')!=null){
         if (window.pageYOffset>300){
             document.querySelector('#back-to-top-btn').style.display="block";
         }else{
             document.querySelector('#back-to-top-btn').style.display="none";
         };
     };
};

//Change Color of Cookies popup
  function saveCustomCookie(){
    setTimeout(() => {
      document.querySelector('#cookie-save-button').style.backgroundColor="#6a12a3";
    }, 10);
  }

//After Loading of website
window.onload = function(){
    if (window.innerWidth<750){
         document.querySelector("#menu-opener").setAttribute("onclick","baktotop()");
         document.querySelector(".mobile-menu-closer").setAttribute("onclick","bcktotop()");
    };
    
    //Follow Us on
    const footertexxt=document.getElementById('foottext');
    footertexxt.innerHTML='<span style="color:white;">Follow Us on</span>';
    
    //Copyright text
    const footerarea=document.getElementById('footer');
    const copyright=document.createElement('div');
    copyright.innerHTML='<p style="text-align: center;color:white;">© Copyright 2024 <span style="color: #ffffff">VT</span> all rights reserved.</p>';
    footerarea.appendChild(copyright);
    
    //social icons footer
const socialsec=document.getElementById('social');
const sicon='<a class="spotify icon-spotify" href="https://open.spotify.com/user/lyd4ped3z340bl5puc9xjiqds" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16"> <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"/> </svg></a>';
socialsec.firstElementChild.insertAdjacentHTML("beforeend",sicon);

const twitterx = '<a class="x icon-x" href="https://x.com/Trapvestibule" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16"> <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"></path> </svg></a>';
socialsec.firstElementChild.insertAdjacentHTML("afterbegin",twitterx);
socialsec.firstElementChild.querySelector(".twitter").remove();
    
        //important
        preloader.style.visibility = "hidden";
        
    
    //Hide Engaga Badge
     if (document.querySelector(".engaga-badge")!=null){
        document.querySelector(".engaga-badge").style.visibility="hidden";
    };
     
     //Change Color of Cookies popup
     if (document.querySelector("#cookie-notification")!=null){
         document.querySelector("#cookie-notification").firstElementChild.nextElementSibling.style.backgroundColor="#6a12a3";
         document.querySelector("#cookie-notification").firstElementChild.nextElementSibling.nextElementSibling.style.border="1.3px solid #6a12a3";
         document.querySelector('#cookie-config-link').setAttribute("onclick","saveCustomCookie()");
     };

    //******************* Place Code Below For Onload *********************//



      
    //******************* Place Code Above For Onload *********************//
    //(ALERT: 'Change Engaga Font' should be at the end of onload)
  
    //Change Engaga Font 
         //put font Exo 2 
             setTimeout(() => {
               if(document.querySelector(".engaga-scrollbox")!=null){
            if(document.querySelector(".engaga-frame").contentWindow.document.location.href!="about:blank"){
         document.querySelector(".engaga-frame").contentWindow.document.head.insertAdjacentHTML('beforeend','<style>@import url("https://fonts.googleapis.com/css2?family=Exo+2:wght@200;300;400;500;600;700;800&display=swap");</style>');
         document.querySelector(".engaga-frame").contentWindow.document.body.style.fontFamily="'Exo 2', Roboto";
         //.title
         document.querySelector(".engaga-frame").contentWindow.document.body.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.style.fontFamily="inherit";
         //.bodytext
         document.querySelector(".engaga-frame").contentWindow.document.body.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.style.fontFamily="inherit";
         //#comp_submit
         document.querySelector(".engaga-frame").contentWindow.document.body.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.style.fontFamily="inherit";
                }
               }
            
        }, "2199");
};

 setTimeout(() => {
  if(document.querySelector('#cookie-notification')!=null){
    document.querySelector(".engaga-scrollbox").remove();
  }
   }, "1899");


  //homepage playlists automatic text
     if (window.location.href==("https://vestibuletrap.mozello.com/" || "https://vestibuletrap.mozello.com/home/" || "https://vestibuletrap.mozello.com/home" || "https://vestibuletrap.com/" || "https://vestibuletrap.com/home")){
         var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        };
    };
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #000}";
    document.body.appendChild(css);
    };
    
    //Add meta tag for google adsense
    document.head.insertAdjacentHTML("beforeend",'<meta name="google-adsense-account" content="ca-pub-5483447146655436">');
  

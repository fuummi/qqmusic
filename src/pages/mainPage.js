export default function () {
  const root = document.querySelector(".root");
  (async function () {
    let shadowDom = `
            <link rel="stylesheet" href="./css/mainPage.css">
            <nav>
            <a href="#/recommend">
                <span class="current">推荐</span>
                <span class="current_after"></span>
            </a>
            <a href="#/rank">
                <span class="out">排行</span>
                <span class="current_after" style="display: none;"></span>
            </a>
        </nav>
          <div class="search_wrap">
              <div class="shadow"> </div>
              <input type="text" class="search input_before" placeholder="搜索" maxlength="29" >
              <img src="./icons/close.png" class="img_before">
              <span class="span_before">取消</span>
          </div>
          <div class="search_container">
              <div class="search_box">
                  <div class="header">
                      <div class="title">搜索记录</div>
                      <img src="../icons/dustbin.png" alt="">
                  </div>
                  <div class="items"></div>
              </div>
              <div class="hot_search_box">
                  <div class="header">
                      <div class="title">热门搜索</div>
                  </div>
                  <div class="items"></div>
              </div>
          </div>
              
          <div class="main_container">
      `;
    await axios({
      method: "GET",
      url: "http://localhost:5000/api/recommendations",
    }).then((data) => {
      shadowDom += `<div class="song_list_wrap">
                    <div class="title">
                        官方歌单
                        <a href="#">更多></a>
                    </div>
                    <ul>`;
      data.data.offical.forEach((element, index) => {
        let { cover, title, views } = element;
        let item = `
                      <li>
                          <a href="#/songList/offical/${index}">
                              <div class="item">
                                  <img src="${cover}" alt="">
                                  <div class="number">${views}</div>
                                  <div class="list_name">${title}</div>
                              </div>
                          </a>
                      </li>`;
        shadowDom += item;
      });
      shadowDom += `</ul></div>
                    <div class="song_list_wrap" style="margin-top:24vw">
                      <div class="title">
                          达人歌单
                          <a href="#">更多></a>
                      </div>
                      <ul>`;
      data.data.tatsujin.forEach((element, index) => {
        let { cover, title, views } = element;
        let item = `
                      <li>
                          <a href="#/songList/tatsujin/${index}">
                              <div class="item">
                                  <img src=${cover} alt="">
                                  <div class="number">${views}</div>
                                  <div class="list_name">${title}</div>
                              </div>
                          </a>
                      </li>`;
        shadowDom += item;
      });
      shadowDom += `</ul></div>
        <div class="song_list_wrap" style="margin-top:24vw">
            <div class="title">
                专区
                <a href="#">更多></a>
            </div>
            <ul>`;
      data.data.column.forEach((element, index) => {
        let { background, icon, title, description } = element;
        let item = `
                <li>
                <a href="#/songList/column/${index}">
                    <div class="item">
                        <img src="${background}" alt="" class="big">
                        <div class="list_name">${description}</div>
                        <div class="info">
                            <img src="${icon}" alt="">
                            <span class="title">${title}</span>
                        </div>
                    </div>
                </a>
                </li>`;
        shadowDom += item;
      });
      shadowDom += `</ul></div></div>
        <div class="bottom">
          <img src="https://y.qq.com/mediastyle/mod/mobile/img/logo_ch.svg" alt="">
          <p>Copyright © 1998 - 2019 Tencent. All Rights Reserved.</p>
          <p>联系电话：0755-86013388 QQ群：55209235</p>
        </div>
        `;
    });
    root.innerHTML = shadowDom;
    let search = document.querySelector(".search");
    let searchContainer = document.querySelector(".search_container");
    let main_container = document.querySelector(".main_container");
    let cancel = document.querySelector(".search_wrap span");
    let clear = document.querySelector(".search_wrap img");
    let searchItems = document.querySelector(".search_box .items");
    let hotSearchItems = document.querySelector(".hot_search_box .items");
    let removeHistory = document.querySelector(".search_box .header img");
    let historyArr = [];
    let counter = 0;
    window.onload = function () {
      if (localStorage.history !== "") {
        historyArr = [...JSON.parse(localStorage.history)];
      }
      counter = 0;
    };

    search.onfocus = () => {
        if(localStorage.history == undefined){
            localStorage.setItem('history','')
            document.querySelector('.search_box').style.display = 'none'
        }
      search.className = "search input_after";
      searchContainer.style.display = "block";
      main_container.style.display = "none";
      cancel.className = "span_after";
      clear.className = "img_after";
      if (counter === 0) {
        axios({
          method: "GET",
          url: "http://localhost:5000/api/hot",
        }).then((data) => {
          data.data.forEach((element) => {
            let node = document.createElement("a");
            node.innerHTML = element;
            node.href = `#/search/${element}`;
            hotSearchItems.appendChild(node);
            node.addEventListener("click", () => {
                if (localStorage.history !== "") {
                    let temp = JSON.parse(localStorage.history);
                    temp.forEach((ele,index)=>{
                        if (ele===element) {
                            temp.splice(index, 1);
                        }
                    })
                    historyArr = [element, ...temp];       
                  }else{
                      historyArr = [element];   
                  }
                localStorage.setItem("history", JSON.stringify(historyArr));
            });
          });
        });
        if (localStorage.history !== "") {
          JSON.parse(localStorage.history).forEach((element) => {
            let node = document.createElement("a");
            node.href = `#/search/${element}`;
            node.innerHTML = element;
            searchItems.appendChild(node);
          });
        } else {
          document.querySelector(".search_box").style.display = "none";
        }
        counter++;
      }
    };
    document.onkeydown = function (e) {
      if (e.keyCode === 13) {
        if (search.value === "") {
          alert("输入不能为空!");
          return;
        }
        let node = document.createElement("a");
        node.innerHTML = search.value;
        node.href = `#/search/${search.value}`;
        searchItems.insertBefore(node, searchItems.children[0]);
        if (localStorage.history !== "") {
          let temp = JSON.parse(localStorage.history);
          temp.forEach((element,index)=>{
            if(element===search.value){
                temp.splice(index, 1)
            }
          })
          historyArr = [search.value, ...temp];       
        }else{
            historyArr = [search.value];   
        }
        localStorage.setItem("history", JSON.stringify(historyArr));

        location.hash = `#/search/${search.value}`;
      }
    };
    cancel.addEventListener("click", () => {
      search.className = "search input_before";
      searchContainer.style.display = "none";
      cancel.className = "span_before";
      clear.className = "img_before";
      main_container.style.display = "block";
    });
    removeHistory.addEventListener("click", () => {
      alert("确认清空历史数据?");
      searchItems.innerHTML = "";
      localStorage.setItem("history", "");
      document.querySelector(".search_box").style.display = "none";
    });
    clear.addEventListener("click", () => {
      search.value = "";
    });
  })();
}

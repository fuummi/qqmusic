export default function () {
  const root = document.querySelector(".root");
  (async function () {
    let allRoute = location.hash.slice(2);
    let routeArr = allRoute.split("/");
    let shadowDom = `
      <link rel="stylesheet" href="./css/search.css">
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
            <input type="text" class="search input_after" placeholder="搜索" maxlength="29">
            <img src="./icons/close.png" class="img_after">
            <span class="span_after">取消</span>
        </div>
        <div class="search_container" style="display:none">
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
        <ul class="search_list">
        `;
    await axios({
      method: "GET",
      url: `http://localhost:5000/api/search?keyword=${
        routeArr[routeArr.length - 1]
      }`,
    }).then((data) => {
      data.data.forEach((element) => {
        const { artist, title } = element;
        shadowDom += `
                <li>
                    <a href="#/song/${title}">
                        <p class="title">${title}</p>
                        <p class="singer">${artist}</p>
                    </a>
                </li>`;
      });
      shadowDom += `</ul>
        <div class="bottom">
          <img src="https://y.qq.com/mediastyle/mod/mobile/img/logo_ch.svg" alt="">
          <p>Copyright © 1998 - 2019 Tencent. All Rights Reserved.</p>
          <p>联系电话：0755-86013388 QQ群：55209235</p>
        </div>`;
    });
    root.innerHTML = shadowDom;
    let search = document.querySelector(".search");
    let cancle = document.querySelector(".span_after");
    let back = document.querySelector(".img_after");
    let searchContainer = document.querySelector(".search_container");
    let searchList = document.querySelector(".search_list");
    let cancel = document.querySelector(".search_wrap span");
    let clear = document.querySelector(".search_wrap img");
    let searchItems = document.querySelector(".search_box .items");
    let hotSearchItems = document.querySelector(".hot_search_box .items");
    let removeHistory = document.querySelector(".search_box .header img");
    let counter = 0;
    let historyArr = [];
    window.onload = function () {
      if (localStorage.history !== undefined) {
        historyArr = [...JSON.parse(localStorage.history)];
      }
    };
    document.onkeydown = async function (e) {
      if (e.keyCode == 13) {
        document.querySelector(".search_box").style.display = "block";
        if (search.value === "") {
          alert("输入不能为空!");
          return;
        }
        if (search.value===JSON.parse(localStorage.history)[0]) {
            searchContainer.style.display = "none";
            searchList.style.display = "none";
            //欺骗用户的定时器呀，假装我又搜了一遍
            setTimeout(()=>{
                searchList.style.display = "block";
            },200)
            return
        }else{
            location.hash = `#/search/${search.value}`;
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
      }

    };

    cancel.addEventListener("click", () => {
      location.hash = "";
      search.className = "search input_before";
      searchContainer.style.display = "none";
      cancel.className = "span_before";
      clear.className = "img_before";
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

    back.addEventListener("click", () => {
      searchContainer.style.display = "block";
      searchList.style.display = "none";
      if (counter === 0) {
        counter++;
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
            node.innerHTML = element;
            node.href = `#/search/${element}`;
            searchItems.appendChild(node);
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
        } else {
          document.querySelector(".search_box").style.display = "none";
        }
      }
    });
  })();
}

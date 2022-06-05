export default function () {
  const root = document.querySelector(".root");
  (async function () {
    let shadowDom = `
      <link rel="stylesheet" href="./css/rank.css">
            <nav>
                <a href="#/recommend">
                    <span class="out">推荐</span>
                    <span class="current_after" style="display: none;"></span>
                </a>
                <a href="#/rank">
                    <span class="current">排行</span>
                    <span class="current_after"></span>
                </a>
            </nav>
            <ul class="rank_list">
        `;
    await axios({
      method: "GET",
      url: "http://localhost:5000/api/ranking",
    }).then((data) => {
      data.data.forEach((element, index) => {
        const { cover, title, top3, update_frequence, views } = element;
        shadowDom += `<li id="${index}">
                <span class="p">${title}</span>
                <div class="items">
                    <div class="item">
                        <span class="rank">1.</span>
                        <span class="title">${top3[0].title}</span>
                        <span class="singer">${top3[0].artist}</span>
                    </div>
                    <div class="item">
                        <span class="rank">2.</span>
                        <span class="title">${top3[1].title}</span>
                        <span class="singer">${top3[1].artist}</span>
                    </div>
                    <div class="item">
                        <span class="rank">3.</span>
                        <span class="title">${top3[2].title}</span>
                        <span class="singer">${top3[2].artist}</span>
                    </div>
                </div>
                <span class="update">每${update_frequence}更新</span>
                <img src="${cover}">
                <div class="num">${views}</div>
            
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
    //拖拽相关
    let li = document.querySelectorAll("li");
    let tempArr = [];
    let counter = 0;
    let vw =(document.documentElement.clientWidth || document.body.clientWidth) / 100;
    li.forEach((element) => {
      let start, end;
      element.addEventListener("touchstart", (evt) => {
        let touch = evt.changedTouches[0];
        let y = Number(touch.pageY);
        for (let i = 0; i < 10; i++) {
          if (
            y < i * 30.6667 * vw + 60 * vw &&
            y > i * 30.6667 * vw + 29.3334 * vw
          ) {
            //start:起点位置
            start = i;
          }
        }
      });
      element.addEventListener("touchmove", (evt) => {
        evt.preventDefault();
        let touch = evt.touches[0];
        let y = Number(touch.pageY);
        element.style.transition = "none";
        element.style.zIndex = "999";
        element.style.transform = `translateY(${y - 40 * vw}px)`;
      });
      element.addEventListener("touchend", (evt) => {
        let touch = evt.changedTouches[0];
        let y = Number(touch.pageY);
        for (let i = 0; i < 10; i++) {
          if (
            y < i * 30.6667 * vw + 60 * vw &&
            y > i * 30.6667 * vw + 29.3334 * vw
          ) {
            //end:终点位置
            end = i;
          }
        }
        element.style.transition = "all 0.5s";
        element.style.zIndex = "0";
        //第一次拖动，获取初始元素顺序
        if (counter === 0) {
          counter++;
          tempArr = [...document.querySelector("ul").children];
        }
        //交换数组顺序
        let temp;
        temp = tempArr[start];
        tempArr[start] = tempArr[end];
        tempArr[end] = temp;
        //根据新的数组顺序调整位置
        tempArr.forEach((element, index) => {
          if (index !== 0) {
            element.style.transform = `translateY(${(index + 1) * 30.6667 - 30.6667}vw)`;
          } else {
            element.style.transform = `translateY(${0}vw)`;
          }
        });
      });
    });
    //歌手名过长变点
    let title = document.querySelectorAll(".title");
    let singer = document.querySelectorAll(".singer");
    title.forEach((element, index) => {
      let titleWidth = element.offsetWidth/vw;
      let singerWidth = singer[index].offsetWidth/vw;
      if (titleWidth + singerWidth > 38.6667) {
        singer[index].style.width=`${38.6667-titleWidth}vw`
      }
    });
  })();
}

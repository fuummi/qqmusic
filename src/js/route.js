const root = document.querySelector(".root");
import mainPage from "../pages/mainPage.js";
import rank from "../pages/rank.js";
import search from "../pages/search.js";

const routeList = [
  { name: "主页", path: "", element: mainPage },
  { name: "排名", path: "rank", element: rank },
  { name: "推荐", path: "recommend", element: mainPage },
  { name: "搜索", path: "search", element: search },
];

window.addEventListener("load", function () {
  //首页的重定向，让一打开就是首页
  location.hash = "";
  mainPage();
});

//根据传入的element“渲染组件”
function render(routeObj) {
  if (routeObj.element !== undefined) {
    routeObj.element();
  }
}

//匹配路由的关键函数
function matchRoutes(routeList, routeArr, count) {
  try {
    routeList.forEach((element) => {
      //获取跟现在的路由层级匹配的，路由表里的路由
      let nowRoute = element.path.split("/")[count];
      //该路由匹配上
      if (nowRoute === routeArr[count]) {
        //如果还有下级路由
        if (element.children !== undefined) {
          //有子级路由，但是当前处于父级路由，也就是routeArr[count+1]没有元素
          if (routeArr[count + 1] === undefined) {
            //只渲染父级页面
            render(element);
            //try-catch实现退出foreach，匹配到了就不用继续往下遍历了
            throw new Error("End Loop");
          } else {
            //count++，下一级路由继续匹配，直到routeArr[count+1]为undefined，就"渲染"
            count++;
            matchRoutes(element.children, routeArr, count);
          }
        } else {
          //进行“渲染”
          render(element);
        }
      }
    });
  } catch (error) {
    //对抛出的错误不作处理
    return;
  }
}

window.addEventListener("hashchange", function () {
  let allRoute = location.hash.slice(2);
  let routeArr = allRoute.split("/"); //路由层级数组
  let count = 0; //计数器，记录路由层级，用于从截取的路由数组中取出路由
  matchRoutes(routeList, routeArr, count);
});

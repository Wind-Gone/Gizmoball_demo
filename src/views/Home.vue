<template>
  <div class="home">
    <div class="main test-border">
      <GamePanel></GamePanel>
    </div>
    <div class="right-side test-border">
      <div class="right-top test-border">
        <ItemZone></ItemZone>
      </div>
      <div class="right-middle test-border">
        <ToolZone></ToolZone>
      </div>
      <div class="right-bottom test-border">
        <ModeZone></ModeZone>
      </div>
    </div>
    <div class="right-side2 test-border">
      <div class="right-bottom test-border">
        <button class="btn btn-2 btn-2h" @click="save">保存</button>
        <div class="load">
          <input style="max-width: 170px " type="file" id="files" ref="refFile" v-on:change="importCsv">
        </div>
      </div>
      <div class="right-bottom test-border">
        <h1 class="nanTitle">Wuli南南</h1>、
        <img src="img/wulinannan.jpg" style="border-radius: 20px;height: 150px;width: 180px">
      </div>
    </div>

    <!--    <div>-->

    <!--      <div class="load">-->
    <!--        <input type="file" id="files"  ref="refFile" v-on:change="importCsv">-->
    <!--      </div>-->

    <!--    </div>-->

  </div>
</template>

<script lang="ts">
import GamePanel from "@/components/modules/GamePanel.vue";
import ItemZone from "@/components/modules/ItemZone.vue";
import ToolZone from "@/components/modules/ToolZone.vue";
import ModeZone from "@/components/modules/ModeZone.vue";
import Instruction from "@/components/modules/instruction/Instruction.vue";
import Controller from "@/core/controller/Controller";
import {Component, Prop, Vue} from "vue-property-decorator";
import {MapItem} from "@/core/mapitems/map-item";
import {itemMap} from "@/core/constants";
import {MapItemJSON} from "@/core/controller/Map";
import {isRotatable, isZoomable} from "@/core/common";
import Papa from 'papaparse'

@Component({
  components: {
    GamePanel,
    ItemZone,
    ToolZone,
    ModeZone,
    Instruction,
  },
})
export default class Home extends Vue {
  @Prop() private msg!: string;

  private save(): void {
    let content = Controller.getInstance().items;
    let length = content.length;
    const items: MapItem[] = [];
    for (const jsonItem of content) {
      const item = MapItemJSON.createFromJSON(jsonItem);
      if (item !== null) {
        const mapItem = new itemMap[item.name](
            item.position.x,
            item.position.y
        );
        // 检测是否旋转
        if (isRotatable(mapItem)) {
          if (item.rotation !== undefined) {
            mapItem.rotation = item.rotation;
          } else {
            return;
          }
        }
        // 检测是否放缩
        if (isZoomable(mapItem)) {
          if (item.zoom !== undefined) {
            mapItem.zoomTo(mapItem.position, item.zoom);
          } else {
            return;
          }
        }
        items.push(mapItem);
      } else {
        return;
      }
    }
    for (let i = 0; i < length; i++) {
      console.log(items[i].name);
      console.log(items[i].position.x);
      console.log(items[i].position.y);
      console.log(items[i].zoom);
      console.log(items[i].rotation);
    }
    let heads = ['name', 'position_x', "position_y", "zoom", "rotation"]
    let Data = [];
    for (let i = 0; i < length; i++) {
      Data.push({
        [heads[0]]: items[i].name,
        [heads[1]]: items[i].position.x,
        [heads[2]]: items[i].position.y,
        [heads[3]]: items[i].zoom,
        [heads[4]]: items[i].rotation,
      });
    }
    console.log(Data)
    const csv = Papa.unparse(Data);
    console.log(csv)
    let content2 = new Blob([csv]);
    let urlObject = window.URL || window.webkitURL || window;
    let url = urlObject.createObjectURL(content2);
    let el = document.createElement("a");
    el.href = url;
    el.download = "Gizmoball文件导出.cvs";
    el.click();
    urlObject.revokeObjectURL(url);
  }

  private importCsv() {
    let selectedFile = null
    selectedFile = this.$refs.refFile.files[0];
    if (selectedFile === undefined) {
      return
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile)
    const importitems: MapItem[] = [];  //MapItem类型
    reader.onload = evt => {
      Papa.parse(selectedFile, {
        encoding: "ANSI",
        complete: res => {
          let data = res.data;
          if (data[data.length - 1] == "") {
            data.pop();
          }
          console.log(data);  // data就是文件里面的数据
          Controller.getInstance().stop();  // 先清空盘面
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] != null) {
              const mapItem = new itemMap[data[i][0]](
                  data[i][1],
                  data[i][2]
              );
              if (isZoomable(mapItem)) {
                if (data[i][3] !== undefined) {
                  mapItem.zoomTo(mapItem.position, data[i][3]);
                } else {
                  return;
                }
              }
              if (isRotatable(mapItem)) {
                if (data[i][4] !== undefined) {
                  mapItem.rotation = data[i][4];
                } else {
                  return;
                }
              }
              importitems.push(mapItem);
            } else {
              return;
            }
          }
          console.log(importitems.length)
          Controller.getInstance().loadMapItemsFromItems(importitems);
        }
      });
    };
  }
}
</script>

<style scoped>
.main.test-border {
  background-color: #f9e0ae;
}

.test-border {
  border-style: inset;
  border-color: #f9e0ae;
  border-radius: 20px;
  color: #f9e0ae;
  border-width: 2px;
}

.home {
  display: flex;
  height: 100%;
}

.load {
  background-color: #bce6eb; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 40px 20px 1px 20px;
  border-radius: 20px;
}

.main {
  width: 790px;
}

.right-side {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #f9e0ae;
}

.right-side2 {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #f9e0ae;
}

.right-top {
  height: 45.5%;
}

.right-middle.test-border {
  background-color: #fbf6f0;
  padding: 2.5%;
  border-radius: 20px;
}

.right-middle {
  height: 21.5%;
}

.right-bottom.test-border {
  background-color: #fbf6f0;
  padding: 2.5%;
  border-radius: 20px;
}

.right-bottom {
  height: 33%;
}

.instruction {
  padding: 0 0 0 20px;
  width: 360px;
  text-align: left;
  flex: none;
}

/*xiala*/
.dropbtn {
  background-color: #4CAF50;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* 容器 <div> - 需要定位下拉内容 */
.dropdown {
  position: relative;
  display: inline-block;
}

/* 下拉内容 (默认隐藏) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

/* 下拉菜单的链接 */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* 鼠标移上去后修改下拉菜单链接颜色 */
.dropdown-content a:hover {
  background-color: #f1f1f1
}

/* 在鼠标移上去后显示下拉菜单 */
.dropdown:hover .dropdown-content {
  display: block;
}

/* 当下拉内容显示后修改下拉按钮的背景颜色 */
.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}

.nanTitle{
  text-shadow: 3px -3px black, 2px -2px white;

  font-weight: bold;

  webkit-text-fill-color: transparent;

  webkit-background-clip: text


}

</style>
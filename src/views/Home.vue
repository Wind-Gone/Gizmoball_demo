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
    <div class="instruction">
      <Instruction></Instruction>
    </div>
    <div id="example-2">
      <button @click="save">保存</button>
    </div>
    <div>
      <button @click="load">加载</button>
    </div>
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
    let heads = ['name', 'position_x', "position_y" , "zoom" , "rotation"]
    let Data = [];
    for(let i=0; i<length; i++) {
      Data.push({
        [heads[0]]: items[i].name,
        [heads[1]]: items[i].position.x,
        [heads[2]]: items[i].position.y,
        [heads[3]]: items[i].zoom,
        [heads[4]]: items[i].rotation,

      })
    }
    console.log(Data)
    const csv = Papa.unparse(Data);
    console.log(csv)
    //定义文件内容，类型必须为Blob 否则createObjectURL会报错
    let content2 = new Blob([csv]);
    //生成url对象
    let urlObject = window.URL || window.webkitURL || window;
    let url = urlObject.createObjectURL(content2);
    //生成<a></a>DOM元素
    let el = document.createElement("a");
    //链接赋值
    el.href = url;
    el.download = "文件导出.cvs";
    //必须点击否则不会下载
    el.click();
    //移除链接释放资源
    urlObject.revokeObjectURL(url);
  }

  private load(): void {
    alert('Hello ' + 2 + '!')
  }

}
</script>

<style scoped>
.test-border {
  border-style: inset;
  border-color: #000;
  border-width: 2px;
}

.home {
  display: flex;
  height: 100%;
}

.main {
  width: 734px;
}

.right-side {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
}

.right-top {
  height: 45.5%;
}

.right-middle {
  height: 21.5%;
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
</style>

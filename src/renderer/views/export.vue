<template>
  <div class="form-view">

    <div class="row">
      <div class="col"></div>
      <div class="col">
        <h3 class="text-center">日期导出</h3>
        <p>导出文件夹：{{savePath}}
          <a href="#" @click="changePath">切换</a>
        </p>
        <div class="form">
          <div class="form-group">
            <button @click="exportAll" type="button" class="btn btn-danger btn-block">全部导出</button>
          </div>
        </div>
      </div>
      <div class="col">
      </div>
    </div>
  </div>
</template>

<script>
  import Selector from '../components/Selector'
  import moment from 'moment'
  import Xlsx from 'node-xlsx';
  import fs from 'fs';
  import {ipcRenderer} from 'electron'

  export default {
    name: "export-view",
    components: {
      Selector
    },
    data() {
      return {
        exlHeader: ['游戏名称', '金额', '客户昵称', '客服名字', '转账方式', '最后时间', '备注'],
        isSaving: false,
        search: {
          startDate: '',
          endDate: '',
          date: moment().format('YYYY-MM-DD')
        },
        form: {
          date: moment().format('YYYY-MM-DD')
        },
        games: [],
        savePath: null,
        saveName: '全部导出-' + moment().format('YYYY-MM-DD_HHmmss') + '.xlsx',
      }
    },
    methods: {
      changePath() {
        ipcRenderer.send('choose');
      },
      async findRecords(gameName) {
        const _self = this;
        return new Promise((resolve, reject) => {
          _self.$db.records.find({game: gameName})
            .sort({createDateTime: -1})
            .exec((err, docs) => {
              const data = [_self.exlHeader];
              docs.forEach((it) => {
                data.push([it.game, it.money, it.customer, it.imName, it.transferType, it.createDateTime, it.note]);
              });
              resolve({name: gameName, data: data});
            });
        });
      },
      async exportAll() {
        if (this.checkFilePath() === false) {
          return false;
        }
        if (true !== confirm('导出后会删除之前的所有数据，请耐心等待。确认导出吗？')) {
          return false;
        }
        const buildData = [];
        const execMethods = [];
        for (let i = 0; i < this.games.length; i++) {
          let game = this.games[i];
          let d = await this.findRecords(game.name);
          buildData.push(d);
        }
        const buffer = Xlsx.build(buildData, []); // Returns a buffer
        let dateTime = moment().format('YYYY-MM-DD_HHmmss') + '.xlsx';
        fs.writeFileSync(this.savePath + `/全部导出_${dateTime}`, buffer);
        this.$toasted.success("导出成功,到文件：" + this.savePath).goAway(2000)
        //this.$db.records.remove({}, {multi: true});
      },
      checkFilePath() {
        if (this.savePath === null) {
          ipcRenderer.send('choose');
          return false;
        } else {
          return true;
        }
      },
    },
    mounted() {
      //初始化获取游戏
      this.$db.settings.find({type: 'type.game'}).sort({sort: 1}).exec((err, docs) => {
        this.games = [...docs]
      });
    },
    created() {
      this.checkFilePath();
      ipcRenderer.on('chooseOk', (e, args) => {
        if (args === null) {
          return false;
        }
        this.savePath = args[0];
      })
    }
  }
</script>

<style scoped lang="scss">
  .form-view {
    padding: 25px;

  }
</style>

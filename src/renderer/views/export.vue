<template>
  <div class="form-view">

    <div class="row">
      <div class="col"></div>
      <div class="col">
        <h3 class="text-center">日期导出</h3>
        <p>导出文件夹：{{savePath}}
          <button class="btn btn-sm btn-primary" type="button" @click="changePath">切换</button>
        </p>
        <div class="form">
          <div class="form-group">
            <label for="">选择日期</label>
            <input type="date" class="form-control" v-model="form.date">
          </div>
          <div class="form-group">
            <button @click="exportDate" type="button" class="btn btn-primary btn-block">日期导出</button>
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
        exlHeader: ['游戏名称', '金额', '客户昵称', '客服名字', '转账方式', '备注', '最后时间', '日期'],
        isSaving: false,
        search: {
          date: moment().format('YYYY-MM-DD')
        },
        form: {
          date: moment().format('YYYY-MM-DD')
        },
        savePath: null,
        saveName: '导出表单-' + moment().format('YYYY-MM-DD') + '.xlsx',
      }
    },
    methods: {
      changePath() {
        ipcRenderer.send('choose');
      },
      //按照日期导出
      exportDate() {
        if (this.checkFilePath() === false) {
          return false;
        }
        this.$db.records.find(this.form)
          .sort({createDateTime: -1})
          .exec((err, docs) => {
            if (!err) {
              this.doExport(docs, this.saveName);
            }
          });
      },
      //执行导出
      doExport(docs, filename) {
        const data = [this.exlHeader];
        docs.forEach((it) => {
          data.push([it.game, it.money, it.customer, it.imName, it.transferType, it.note, it.createDateTime, it.date]);
        });
        const options = [];
        const buffer = Xlsx.build([{
          name: `${this.form.date}报表`,
          data: data
        }], options); // Returns a buffer
        fs.writeFileSync(this.savePath + '/' + filename, buffer);
        this.$toasted.success("导出成功,到文件：" + this.savePath).goAway(2000)
      },
      exportAll() {
        if (this.checkFilePath() === false) {
          return false;
        }
        if (true !== confirm('全部导出如果数据很多会花费大量时间，请耐心等待')) {
          return false;
        }
        this.$db.records.find({})
          .sort({createDateTime: -1})
          .exec((err, docs) => {
            const data = [this.exlHeader];
            docs.forEach((it) => {
              data.push([it.game, it.money, it.customer, it.imName, it.transferType, it.note, it.createDateTime, it.date]);
            });
            const options = [];
            const buffer = Xlsx.build([{
              name: `全部导出报表`,
              data: data
            }], options); // Returns a buffer
            fs.writeFileSync(this.savePath + '/全部导出.xlsx', buffer);
            this.$toasted.success("导出成功,到文件：" + this.savePath).goAway(2000)
          });
      },
      checkFilePath() {
        if (this.savePath === null) {
          ipcRenderer.send('choose');
          return false;
        } else {
          return true;
        }
      }
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

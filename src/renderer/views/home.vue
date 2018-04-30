<template>
  <div class="form-view">
    <form class="form">
      <div class="form-group">
        <label>游戏名称</label>
        <selector :chooses="gameNames" v-model="form.game" tips="请选择游戏名称"></selector>
      </div>
      <div class="form-group">
        <label>金额</label>
        <input v-model="form.money" type="number" class="form-control">
      </div>
      <div class="form-group">
        <label>客户昵称</label>
        <input v-model="form.customer" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>客服名字</label>
        <selector :chooses="ims" v-model="form.imName"></selector>
      </div>
      <div class="form-group">
        <label>转账方式</label>
        <selector :chooses="payments" v-model="form.transferType"></selector>
      </div>
      <div class="form-group">
        <label>备注</label>
        <textarea v-model="form.note" class="form-control" rows="3">无</textarea>
      </div>
      <div class="form-group footer-btns">
        <button @click="reset" type="button" class="btn btn-danger">清空</button>
        <div style="width: 100px"></div>
        <button @click="submit" type="button" class="btn btn-primary btn-submit">
          保存(Enter)
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import Selector from '../components/Selector'

  const Mousetrap = require('mousetrap');

  import Moment from 'moment'

  export default {
    name: "home",
    components: {
      Selector
    },
    data() {
      return {
        form: {
          game: '',
          money: '',
          date: '',
          imName: '',
          transferType: '',
          customer: '',
          note: ''
        },
        gameNames: [],
        ims: [],
        payments: [],
        isSaving: false,
      }
    },
    methods: {
      async submit() {
        if (this.form.game === '') {
          //return
          return this.$toasted.info('未选择游戏名称...').goAway(2000)
        }
        if (this.form.money === '') {
          //return
          return this.$toasted.info('请填写金额...').goAway(2000)
        }
        if (this.form.customer === '') {
          //return
          return this.$toasted.info('请填写客户昵称...').goAway(2000)
        }
        if (this.form.imName === '') {
          //return
          return this.$toasted.info('请填写客服名字...').goAway(2000)
        }
        if (this.form.transferType === '') {
          //return
          return this.$toasted.info('请选择转账方式...').goAway(2000)
        }
        this.form.createDateTime = Moment().format('YYYY-MM-DD HH:mm:ss');
        this.form.date = Moment().format('YYYY-MM-DD');
        this.isSaving = true;
        this.$db.records.insert(this.form, (err, res) => {
          this.$electron.shell.beep();
          this.$toasted.success('保存新记录成功').goAway(2000)
          this.reset();
        });
        this.isSaving = false;
      },
      loadData() {
        const _self = this;
        _self.gameNames = [];
        _self.payments = [];
        _self.ims = [];
        this.$db.settings.find({}, (err, docs) => {
          if (err) {
            throw err;
          }
          docs.forEach((item) => {
            if (item.type === 'type.game') {
              _self.gameNames.push(item);
            }
            if (item.type === 'type.payment') {
              _self.payments.push(item);
            }
            if (item.type === 'type.im') {
              _self.ims.push(item);
            }
          });
        });
      },
      reset() {
        this.form = {
          game: '',
          money: '',
          date: '',
          imName: '',
          transferType: '',
          customer: '',
          note: '',
        };
      }
    },
    mounted() {
      Mousetrap.bind('enter', () => {
        console.log("Enter Submit")
        this.submit();
        return false;//冒泡
      }, 'keyup');
    },
    created() {
      this.loadData();
    }
  }
</script>

<style scoped lang="scss">
  .form-view {
    padding: 25px;
    .footer-btns {
      text-align: center;
      display: flex;
      .btn {
        flex: 1;
      }
      .btn-record {
        margin: 0 10px
      }
    }
  }
</style>

<template>
  <div class="settings-view">
    <h3 class="text-center">游戏种类</h3>
    <ul>
      <li class="" v-for="(it,i) in games">
        <span>{{it.name}}</span>
        <a href="#" @click="remove(it)" class="remove-btn">删除</a>
      </li>
    </ul>
    <h3 class="text-center">转账方式</h3>
    <ul>
      <li class="" v-for="(it,i) in payments">
        <span>{{it.name}}</span>
        <a href="#" @click="remove(it)" class="remove-btn">删除</a>
      </li>
    </ul>
    <h3 class="text-center">客服名称</h3>
    <ul>
      <li class="" v-for="(it,i) in ims">
        <span>{{it.name}}</span>
        <a href="#" @click="remove(it)" class="remove-btn">删除</a>
      </li>
    </ul>
    <form>
      <div class="form-group">
        <label for="">名称</label>
        <input class="form-control" type="text" v-model="newItem.name">
      </div>
      <div class="form-group">
        <label for="">类型</label>
        <select placeholder="输入配置类型" class="form-control" v-model="newItem.type">
          <option :value="t.key" v-for="t in types">{{t.name}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="">排序(大号在上)</label>
        <input placeholder="填写排序值" class="form-control" type="number" v-model="newItem.sort">
      </div>
      <div class="form-group">
        <button @click="insert" type="button" class="btn btn-block btn-primary">确认新增</button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: "record",
    data() {
      return {
        games: [],
        payments: [],
        ims: [],
        types: [
          {
            key: 'type.game',
            name: '游戏名称'
          },
          {
            key: 'type.payment',
            name: '转账方式'
          },
          {
            key: 'type.im',
            name: '客服名称'
          },
        ],
        newItem: {
          name: '',
          type: '',
          sort: 0
        }
      }
    },
    methods: {
      insert() {
        const _self = this;
        if (this.newItem.type === '') {
          return alert('对不起,请先选择添加设置的类型');
        }
        this.$db.settings.insert(this.newItem, (err, res) => {
          this.loadData();
        });
      },
      remove(it) {
        if (true !== confirm('确认删除吗？')) {
          return false;
        }
        console.log(it);
        this.$db.settings.remove({_id: it._id}, () => {
          this.loadData();
        })
      },
      loadData() {
        const _self = this;
        _self.games = [];
        _self.payments = [];
        _self.ims = [];
        this.$db.settings.find({}).sort({sort: 1}).exec((err, docs) => {
          if (err) {
            throw err;
          }
          docs.forEach((item) => {
            if (item.type === 'type.game') {
              _self.games.push(item);
            }
            if (item.type === 'type.payment') {
              _self.payments.push(item);
            }
            if (item.type === 'type.im') {
              _self.ims.push(item);
            }
          });
        });
      }
    },
    mounted() {
      this.loadData();
    }
  }
</script>

<style scoped lang="scss">
  .settings-view {
    padding: 20px;
    .table {
      font-size: .9rem;
      text-align: center;
    }
    .remove-btn {
      margin-left: 10px;
      color: red;
    }
  }
</style>

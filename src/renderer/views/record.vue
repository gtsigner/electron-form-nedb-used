<template>
  <div class="record-view">
    <div class="text-center">
      <div class="form form-inline" style="display: none">
        <div class="row">
          <div class="col">
            <label for="">客户名称</label>
          </div>
        </div>
      </div>
      <table class="table table-bordered">
        <thead>
        <th>编号</th>
        <th>游戏</th>
        <th>金额</th>
        <th>客户</th>
        <th>客服</th>
        <th>转账</th>
        <th>备注</th>
        <th>时间</th>
        <th>操作</th>
        </thead>
        <tbody>
        <tr v-for="rec in records">
          <td>{{rec._id}}</td>
          <td>{{rec.game}}</td>
          <td>{{rec.money}}</td>
          <td>{{rec.customer}}</td>
          <td>{{rec.imName}}</td>
          <td>{{rec.transferType}}</td>
          <td>{{rec.note}}</td>
          <td>{{rec.createDateTime}}</td>
          <td style="padding: 8px">
            <button type="button" @click="remove(rec)" class="btn btn-sm btn-primary">删除</button>
          </td>
        </tr>
        <tr v-if="pager.total===0">
          <td colspan="30">暂无记录</td>
        </tr>
        </tbody>
      </table>
      <div class="text-center" v-if="pager.total>0">
        <b-pagination
          size="md"
          align="center"
          :total-rows="pager.total"
          v-model="pager.current"
          :per-page="pager.limit"></b-pagination>
      </div>
    </div>
    <div class="text-center">
      <!--<button type="button" @click="clear" class="btn btn-danger">清空</button>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "record",
    data() {
      return {
        records: [],
        pager: {
          total: 50,
          current: 1,
          limit: 16,
        }
      }
    },
    watch: {
      ['pager.current']() {
        this.loadData();
      }
    },
    methods: {
      loadData() {
        const _self = this;
        let skip = (this.pager.limit * (this.pager.current - 1));
        this.$db.records.find({})
          .skip(skip)
          .sort({createDateTime: -1})
          .limit(this.pager.limit)
          .exec((err, docs) => {
            _self.records = [...docs];
          });
      },
      remove(it) {
        const _self = this;
        this.$db.records.remove({_id: it._id}, () => {
          this.loadData();
          this.loadPage();
          this.$toasted.error('删除成功').goAway(2000);
        });
      },
      clear() {
        this.$db.records.remove({}, {multi: true});
        this.$toasted.error('删除成功').goAway(2000);
      },
      loadPage() {
        this.$db.records.count({}, (err, count) => {
          this.pager.total = count;
        });
      }
    },
    created() {
      this.loadPage();
      this.loadData();
    }
  }
</script>

<style scoped lang="scss">
  .record-view {
    .table {
      font-size: .9rem;
      text-align: center;
    }
    .pagination {

    }
  }
</style>

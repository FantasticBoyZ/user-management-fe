<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"><strong>Advanced Search</strong></slot>
          </div>

          <div class="modal-body">
            <Form>
              <div>
                <div class="col-lg-12 d-flex justify-content-between">
                  <div class="form-group col-lg-5">
                    <label><strong>Full Name</strong></label>
                    <input
                      name="fullName"
                      @change="searchKeyword.fullName = $event.target.value"
                      type="text"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group col-lg-5">
                    <label><strong>Address</strong></label>
                    <input
                      name="address"
                      @change="searchKeyword.address = $event.target.value"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
                <br />
                <label><strong>BirthDate</strong></label>
                <div class="form-group">
                  <label>From Date</label>
                  <input
                    name="fromDate"
                    @change="searchKeyword.fromDate = $event.target.value"
                    type="date"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>To Date</label>
                  <input
                    name="toDate"
                    @change="searchKeyword.toDate = $event.target.value"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="section"><strong>Section</strong></label>
                <select
                  class="form-select"
                  @change="searchKeyword.sectionId = $event.target.value"
                  name="section"
                >
                  <option value="0">-- Select Section --</option>
                  <option
                    v-for="section in sections"
                    :value="section.id"
                    :key="section.id"
                  >
                    {{ section.name }}
                  </option>
                </select>
              </div>
              <div class="modal-footer text-center">
                <button
                  class="btn btn-danger mx-2"
                  type="button"
                  @click="$emit('searchAdvance', searchKeyword)"
                >
                  <!-- v-on:click="$emit('searchAdvance')" -->
                  Search
                </button>
                <button
                  class="btn btn-secondary mx-2"
                  type="button"
                  v-on:click="$emit('close')"
                >
                  Cancel
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <div class="confirmbox justify-content-center mt5"></div>
</template>
<script>
import SectionService from "../services/section.service";
import { Form } from "vee-validate";
export default {
  components: {
    Form,
  },
  props: {},
  data() {
    return {
      sections: null,

      searchKeyword: {
        fullName: "",
        address: "",
        fromDate: "",
        toDate: "",
        sectionId: 0,
      },
    };
  },
  methods: {
    getAllSection() {
      SectionService.getAllSection()
        .then((response) => {
          this.sections = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    test() {
      console.log(this.searchKeyword);
    },
  },
  created() {
    this.getAllSection();
  },
  mounted() {},
};
</script>
<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  height: 480px;
  margin: 0px auto;
  padding: 0;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  height: auto;
}

.modal-footer {
  justify-content: center;
  padding: 10px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

<template>
  <Navbar />
  <div class="container">
    <header>
      <!-- <h3>{{ content }}</h3> -->
      <!-- ở đây ta dùng shorthand `:key` thay vì `v-bind:key` -->
      <!-- <ul> -->
      <!-- <li v-for="item in content" :key="item.id"> -->
      <!-- nội dung<a href="#">{{ item.username }}</a> -->
      <!-- </li> -->
      <!-- </ul> -->
      <div class="title d-flex justify-content-between">
        <h3 class="my-2">List User</h3>

        <div class="my-2">
          <button
            v-if="showActionButton"
            type="button"
            class="btn btn-info float-right"
            @click="showAddUpdateForm(null)"
          >
            <font-awesome-icon icon="plus-circle" /> Add New
          </button>
        </div>
      </div>
      <div class="row my-2 justify-content-md-center">
        <div class="col-lg-9 card-margin">
          <form id="search-form">
            <div class="row no-gutters">
              <div class="col-lg-2 col-md-2 col-sm-12 p-0">
                <select
                  class="form-select shadow-none"
                  name="searchType"
                  @change="getSearchType"
                  id="exampleFormControlSelect1"
                >
                  <option value="1">Full Name</option>
                  <option value="2">Address</option>
                  <option value="3">Description</option>
                </select>
              </div>
              <div class="col-lg-7 col-md-6 col-sm-12 p-0">
                <input
                  type="text"
                  v-model="keyword"
                  placeholder="Search..."
                  class="form-control shadow-none"
                  id="search"
                  name="search"
                />
              </div>
              <div class="col-lg-3 col-md-3 col-sm-12 p-0 m-0">
                <button
                  type="button"
                  @click="onSearchClick"
                  class="btn btn-outline-secondary shadow-none"
                >
                  <font-awesome-icon icon="search" />
                </button>
                <button
                  type="button"
                  class="btn btn-primary shadow-none fs-7 px-2"
                  @click="showAdvancedSearch = true"
                >
                  Advanced Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <AdvancedSearch
        v-if="showAdvancedSearch"
        @close="showAdvancedSearch = false"
        @searchAdvance="onAdvancedSearchClick"
      />
      <div v-if="showTable">
        <!-- {{ tableKey }} -->
        <div class="table h-100 d-inline-block">
          <table
            class="table table-bordered"
            border="1px "
            style="text-align: center"
          >
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Full Name</th>
                <th scope="col">Date Of Birth</th>
                <th scope="col">Description</th>
                <th scope="col">Address</th>
                <th scope="col" v-if="showActionButton" colspan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in content" :key="item.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ item.fullName }}</td>
                <td>{{ item.dateOfBirth }}</td>
                <td>
                  {{
                    item.description == null
                      ? item.description
                      : item.description.slice(0, 20)
                  }}
                </td>
                <td>{{ item.address }}</td>
                <td v-if="showActionButton">
                  <button
                    type="button"
                    class="btn btn-primary"
                    v-on:click="showAddUpdateForm(item)"
                  >
                    <font-awesome-icon icon="edit" /> Edit
                  </button>
                </td>
                <td v-if="showActionButton">
                  <button
                    type="button"
                    class="btn btn-danger"
                    v-on:click="(showDelete = true), (currentUser = item)"
                  >
                    <font-awesome-icon icon="trash-alt" /> Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
            role="alert"
          >
            {{ message }}
            <button
              type="button"
              class="close"
              style="float: right"
              aria-label="Close"
              @click="message = ''"
            >
              <span aria-hidden="true">X</span>
            </button>
          </div>
          <div class="text-muted">
            Showing <strong>{{ offset + 1 }}</strong> -
            <strong>{{ offset + numOfElement }}</strong> of
            <strong>{{ totalSize }}</strong> results
          </div>
        </div>
        <!-- AddEditModal -->
        <modal
          v-if="showAddEdit"
          :user="currentUser"
          @close="showAddEdit = false"
          @submit="addUpdateSuccess"
        >
        </modal>
        <!-- DeleteModal -->
        <deleteModal
          v-if="showDelete"
          :object-type="'user'"
          @close="showDelete = false"
          @delete="deleteUser"
        ></deleteModal>

        <div class="footer d-flex justify-content-between">
          <!-- Pagination -->
          <pagination
            v-model="pageIndex"
            :total-pages="totalPage"
            :total="totalSize"
            :per-page="pageSize"
            :current-page="pageIndex"
            @pagechanged="onPageChange"
          ></pagination>
          <!-- export data button -->
          <button @click="exportExcel" class="btn btn-success float-right">
            Export Data
          </button>
        </div>
      </div>
      <div v-else class="fst-italic fs-20 text-center my-5">
        No result showing
      </div>
    </header>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import UserService from "../services/user.service";
import AdminService from "../services/admin.service";
import modal from "../components/Modal.vue";
import deleteModal from "../components/DeleteConfirmModal";
import pagination from "../components/Pagination.vue";
import AdvancedSearch from "../components/AdvancedSearch.vue";

export default {
  name: "User",
  components: {
    modal,
    deleteModal,
    pagination,
    AdvancedSearch,
    Navbar,
  },
  props: ["user"],
  computed: {
    loggedInUser() {
      return this.$store.state.auth.user;
    },
    showActionButton() {
      if (this.loggedInUser && this.loggedInUser.role) {
        return this.loggedInUser.role === "ROLE_ADMIN";
      }

      return false;
    },

    // shortDescription: function () {
    //   if (this.description.length > 20) {
    //     return this.description.slice(0, 20) + "...";
    //   } else {
    //     return this.description;
    //   }
    // },
  },
  data() {
    return {
      content: "",
      index: 0,
      showAddEdit: false,
      showDelete: false,
      showTable: true,
      showAdvancedSearch: false,
      message: "",
      currentUser: null,
      tableKey: "tableNeedsData",
      keyword: "",
      searchType: "1",
      pageIndex: 1,
      pageSize: "10",
      totalPage: 0,
      totalSize: 0,
      numOfElement: 0,
      offset: 0,

      isAdvancedSearch: false,
      advancedKeyword: {
        fullName: "",
        address: "",
        fromDate: "",
        toDate: "",
        sectionId: 0,
      },
    };
  },
  mounted() {
    this.getUserBySearching();
    this.tableKey = "tableHasData";
  },
  methods: {
    setTimeoutMessage(message) {
      if (message) {
        setTimeout(() => (this.message = null));
      }
    },
    exportExcel() {
      console.log(this.content);
      AdminService.exportExcel(this.content).then(
        (response) => {
          console.log(response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
          });

          // const url = "http://localhost:8082/api/admin/export";
          const today = new Date();
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download =
            "user_" +
            today.getDay() +
            "_" +
            today.getMonth() +
            "_" +
            today.getFullYear() +
            ".xlsx";
          console.log(link.download);
          document.body.appendChild(link);
          // link.click();
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    // Advanced Search
    getSearchAdvanceKeyword(
      fullName,
      address,
      fromDate,
      toDate,
      sectionId,
      pageIndex,
      pageSize
    ) {
      let params = {};
      if (fullName) {
        params["fullName"] = fullName;
        this.advancedKeyword.fullName = fullName;
      }
      if (address) {
        params["address"] = address;
        this.advancedKeyword.address = address;
      }
      if (fromDate) {
        params["fromDate"] = fromDate;
        this.advancedKeyword.fromDate = fromDate;
      }
      if (toDate) {
        params["toDate"] = toDate;
        this.advancedKeyword.toDate = toDate;
      }

      if (sectionId) {
        params["sectionId"] = sectionId;
        this.advancedKeyword.sectionId = sectionId;
      }
      if (pageIndex) {
        params["pageIndex"] = pageIndex;
      }

      if (pageSize) {
        params["pageSize"] = pageSize;
      }
      console.log(this.advancedKeyword);
      return params;
    },
    searchAdvance(searchKeyword) {
      // this.pageIndex = 1;

      console.log(this.advancedKeyword);
      const params = this.getSearchAdvanceKeyword(
        searchKeyword.fullName,
        searchKeyword.address,
        searchKeyword.fromDate,
        searchKeyword.toDate,
        searchKeyword.sectionId,
        this.pageIndex,
        this.pageSize
      );
      console.log(params);
      UserService.getSearchAdvance(params).then(
        (response) => {
          this.content = response.data.content;
          this.totalPage = response.data.totalPage;
          this.totalSize = response.data.totalSize;
          this.numOfElement = response.data.numOfElement;
          this.offset = response.data.offset;

          if (this.totalSize != 0) {
            this.showTable = true;
          } else {
            this.showTable = false;
            console.log(this.totalSize);
          }

          this.isAdvancedSearch = true;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
      this.showAdvancedSearch = false;
      console.log(searchKeyword);
    },
    getSearchType(e) {
      this.searchType = e.target.value;
    },
    getRequestParams(keyword, pageIndex, pageSize, type) {
      let params = {};

      if (keyword) {
        params["keyword"] = keyword.trim();
      } else {
        params["keyword"] = "      ".trim();
      }

      if (pageIndex) {
        params["pageIndex"] = pageIndex;
      }

      if (pageSize) {
        params["pageSize"] = pageSize;
      }
      console.log(type);
      if (type) {
        params["type"] = type;
      }
      console.log(params);
      return params;
    },
    getUserBySearching() {
      const params = this.getRequestParams(
        this.keyword,
        this.pageIndex,
        this.pageSize,
        this.searchType
      );
      UserService.getUserSearch(params).then(
        (response) => {
          console.log(params);
          console.log(response.data);
          // this.tableKey = "tableNeedsData";
          this.totalPage = response.data.totalPage;
          this.totalSize = response.data.totalSize;
          this.numOfElement = response.data.numOfElement;
          this.offset = response.data.offset;
          this.content = response.data.content;
          console.log(response.data.content);
          if (this.totalSize != 0) {
            this.showTable = true;
          } else {
            this.showTable = false;
            console.log(this.totalSize);
          }
          this.isAdvancedSearch = false;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    getAllUser() {
      UserService.getUserBoard().then(
        (response) => {
          this.content = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    showAddUpdateForm(item) {
      this.showAddEdit = true;
      if (item) {
        this.currentUser = item;
        console.log(this.currentUser);
        console.log(item);
      } else {
        this.currentUser = {
          username: "",
          password: "",
          fullName: "",
          address: "",
          dateOfBirth: null,
          description: "",
          sectionId: "",
          creatorId: "",
          updaterId: "",
        };
      }
    },
    addUpdateSuccess() {
      (this.successful = true),
        (this.showAddEdit = false),
        (this.message = "Successful"),
        this.setTimeoutMessage(this.message),
        this.getUserBySearching(),
        (this.tableKey = "tableAddUpdateData");
    },
    deleteUser() {
      console.log(this.tableKey);
      AdminService.deleteUser(this.currentUser.id)
        .then((response) => {
          console.log(response.data);
          this.successful = true;
          this.currentUser = null;
          this.message = "The user was deleted successfully!";
          this.getUserBySearching();
          // this.tableKey = "tableDeleteData";
        })
        .catch((e) => {
          console.log(this.currentUser.id);
          this.message = "The user was deleted fail";

          console.log(e);
        });
      this.showDelete = false;
    },
    onPageChange(pageIndex) {
      console.log(pageIndex);

      this.pageIndex = pageIndex;
      if (this.isAdvancedSearch) {
        this.searchAdvance(this.advancedKeyword);
      } else {
        this.getUserBySearching();
      }
    },
    // reset pageIndex to 1 each time search
    onSearchClick() {
      this.pageIndex = 1;
      this.getUserBySearching();
    },
    onAdvancedSearchClick(searchKeyword) {
      this.pageIndex = 1;
      this.searchAdvance(searchKeyword);
    },
  },
};
</script>
<style scoped>
</style>
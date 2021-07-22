<template>
  <Navbar />
  <div class="row my-5">
    <div
      class="section col-4 border-end border-primary overflow-auto m-5"
      style="width: 400px; height: 600px"
    >
      <div class="row">
        <div class="">
          <div class="btn-toolbar" role="toolbar">
            <div class="btn-group btn-group-justified" role="group">
              <input
                v-model="keyword"
                type="search"
                class="form-control"
                id="search"
                placeholder="Search"
              />
              <div
                class="btn-group d-inline-block"
                role="group"
                tabindex="0"
                data-bs-toggle="tooltip"
                title="Search"
              >
                <button
                  id="search"
                  class="btn btn-warning"
                  data-original-title="search"
                >
                  <font-awesome-icon icon="search" />
                </button>
              </div>
              <div
                v-if="showActionButton"
                class="btn-group d-inline-block"
                role="group"
                tabindex="1"
                data-bs-toggle="tooltip"
                title="Add"
              >
                <button
                  id="add"
                  class="btn btn-primary"
                  data-original-title="Add"
                  @click="showAddEditForm(null)"
                >
                  <font-awesome-icon icon="plus" />
                </button>
              </div>
              <div
                v-if="showActionButton"
                class="btn-group d-inline-block"
                role="group"
                data-bs-toggle="tooltip"
                title="Edit"
              >
                <button
                  id="edit"
                  :disabled="!isEdit"
                  class="btn btn-primary"
                  data-original-title="Edit"
                  @click="showAddEditForm(currentSection)"
                >
                  <font-awesome-icon icon="pencil-alt" />
                </button>
              </div>
              <div
                v-if="showActionButton"
                class="btn-group d-inline-block"
                role="group"
                tabindex="0"
                data-bs-toggle="tooltip"
                title="Delete"
              >
                <button
                  id="delete"
                  :disabled="!isEdit"
                  class="btn btn-primary"
                  data-original-title="Delete"
                  @click="showDelete = true"
                >
                  <font-awesome-icon icon="trash-alt" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- tree -->
      <div class="my-2" v-for="item in content" :key="item">
        <Tree
          :node="item"
          :current-node="currentSection"
          @select="onSelect"
          @on-click="getUserBySection"
        />
        <!-- <h1>{{ content }}</h1> -->
      </div>
    </div>

    <div class="table col h-100 d-inline-block m-5">
      <!-- <h3 v-if="currentSection.name">
        <font-awesome-icon icon="list" /> {{ currentSection.name }}
      </h3> -->

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
            <!-- <th scope="col" colspan="2">Action</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in listUser" :key="user.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ user.fullName }}</td>
            <td>{{ user.dateOfBirth }}</td>
            <td>
              {{
                user.description == null
                  ? user.description
                  : user.description.slice(0, 20)
              }}
            </td>
            <td>{{ user.address }}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer" v-if="showPaging">
        <!-- Pagination -->
        <pagination
          v-model="pageIndex"
          :total-pages="totalPage"
          :total="totalSize"
          :per-page="pageSize"
          :current-page="pageIndex"
          @pagechanged="onPageChange"
        ></pagination>
      </div>
      <div v-else class="fst-italic text-center">No result showing</div>
    </div>
    <deleteModal
      v-if="showDelete"
      :object-type="'department'"
      @close="showDelete = false"
      @delete="deleteSection"
    />
    <AddEditSection
      v-if="showAddEdit"
      :section="addEditSection"
      @close="showAddEdit = false"
      @submit="forceRerender"
    />
  </div>
</template>
<script>
import Navbar from "../components/Navbar.vue";
import SectionService from "../services/section.service";
import AdminService from "../services/admin.service";
import Tree from "../components/Tree";
import pagination from "../components/Pagination.vue";
import deleteModal from "../components/DeleteConfirmModal.vue";
import AddEditSection from "../components/AddEditSection.vue";

export default {
  props: {
    user: Object,

    // sectionId: {
    //   type: Number,
    //   default: 2,
    // },
  },
  components: {
    Tree,
    Navbar,
    pagination,
    deleteModal,
    AddEditSection,
  },
  data() {
    return {
      content: null,
      listUser: [],
      showPaging: false,
      showDelete: false,
      showAddEdit: false,
      isEdit: false,
      pageIndex: 1,
      pageSize: 10,
      currentSection: null,
      addEditSection: null,
      totalPage: 0,
      totalSize: 1,
      sectionId: 2,
      keyword: "",
      currentNode: null,
      treeChange: "needData",
      // root: {
      //   name: "root",
      //   children: [
      //     {
      //       name: "1",
      //       children: [
      //         {
      //           name: "2",
      //           children: [{ name: "9", children: [{ name: "10" }] }],
      //         },
      //         { name: "4", children: [{ name: "11" }] },
      //         { name: "5" },
      //       ],
      //     },
      //     {
      //       name: "3",
      //       pages: [{ name: "6" }, { name: "7" }, { name: "8" }],
      //     },

      //     { name: "11", pages: [] },
      //   ],
      // },
    };
  },
  methods: {
    onSelect(node) {
      this.currentSection = node;
      this.isEdit = true;
      // if (this.currentNode === node) {
      //   this.currentNode = null;
      // } else {
      //   this.currentNode = node;
      // }
    },
    onPageChange(pageIndex) {
      console.log(pageIndex);
      this.pageIndex = pageIndex;
      this.getUserBySection(this.currentSection);
    },
    getRequestParams(sectionId, pageIndex, pageSize) {
      let params = {};

      if (sectionId) {
        params["sectionId"] = sectionId;
      }

      if (pageIndex) {
        params["pageIndex"] = pageIndex;
      }

      if (pageSize) {
        params["pageSize"] = pageSize;
      }

      return params;
    },
    getUserBySection(section) {
      if (section) {
        const params = this.getRequestParams(
          section.id,
          this.pageIndex,
          this.pageSize
        );
        SectionService.getUserBySection(params).then(
          (response) => {
            this.listUser = response.data.content;
            this.totalPage = response.data.totalPage;
            this.totalSize = response.data.totalSize;
            this.currentSection = section;
            if (this.totalSize == 0) {
              this.showPaging = false;
            } else {
              this.showPaging = true;
            }
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
      }
    },
    getAllSection() {
      SectionService.getAllSection().then(
        (response) => {
          this.content = SectionService.generateTree(response.data);

          this.currentSection = this.content;
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
    forceRerender() {
      this.treeChange = "needData";
      this.content = this.getAllSection();
      this.showAddEdit = false;
    },
    deleteSection() {
      console.log("Delete " + this.currentSection.id);
      AdminService.deleteSection(this.currentSection.id)
        .then((response) => {
          console.log(response.data);
          this.currentSection = null;
          this.listUser = null;
          this.forceRerender();
          alert("The department was deleted successfully!");
        })
        .catch((e) => {
          alert("The department was deleted fail");

          console.log(e);
        });
      this.showDelete = false;
    },
    showAddEditForm(section) {
      this.showAddEdit = true;
      if (section) {
        this.addEditSection = section;
        // console.log("edit");
        // console.log(section);
      } else {
        this.addEditSection = {
          name: "",
          code: "",
          description: "",
          parentId: "",
          creatorId: "",
          updaterId: "",
        };
        this.addEditSection.parentId = this.currentSection.id;
      }
    },
  },
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
  },
  created() {
    // this.getAllSection();
    if (this.currentSection) {
      this.getUserBySection(this.currentSection);
    }
  },
  mounted() {
    this.getAllSection();
    this.treeChange = "hasData";
  },
};
</script>




<style scoped>
/* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
.active {
  display: block;
}
.container {
  margin: 0 !important;
}
</style>
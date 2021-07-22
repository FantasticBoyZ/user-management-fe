<!-- template for the modal component -->

<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container-edit overflow-auto">
          <div class="modal-header">
            <slot name="header"
              ><strong>{{ this.title }} Department Detail</strong></slot
            >
          </div>

          <div class="modal-body">
            <Form @submit="saveSection" :validation-schema="schema">
              <div class="form-group">
                <label for="name">Name</label>
                <Field
                  name="name"
                  type="text"
                  v-model="this.name"
                  class="form-control"
                  required
                />
                <ErrorMessage name="name" class="error-feedback text-danger" />
              </div>
              <div class="form-group">
                <label for="code">Code</label>
                <Field
                  name="code"
                  type="code"
                  v-model="this.code"
                  aria-readonly="true"
                  class="form-control"
                />
                <ErrorMessage name="code" class="error-feedback text-danger" />
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <textarea
                  name="description"
                  v-model="description"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="section">Parent</label>
                <select
                  class="form-select"
                  name="section"
                  v-model="parentId"
                  required
                >
                  <option
                    v-for="section in sections"
                    :value="section.id"
                    :selected="section.id === parentId"
                    :key="section.id"
                  >
                    {{ section.name }}
                  </option>
                </select>
                <ErrorMessage
                  name="section"
                  class="error-feedback text-danger"
                />
              </div>

              <div class="form-group">
                <div
                  v-if="message"
                  class="alert"
                  :class="successful ? 'alert-success' : 'alert-danger'"
                  role="alert"
                >
                  {{ message }}
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-success" :disabled="loading">
                  <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  Save
                </button>
                <slot name="footer">
                  <button class="btn btn-secondary" v-on:click="$emit('close')">
                    Exit
                  </button>
                </slot>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import SectionService from "../services/section.service";
import AdminService from "../services/admin.service";

export default {
  props: { section: Object },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // const today = new Date();
    const schema = yup.object().shape({
      name: yup.string().required("Name is required!"),
      code: yup.string().required("Code is required!"),
    });

    return {
      isEdit: false,
      loading: false,
      message: "",
      title: "",
      sections: "",
      successful: false,
      currentSection: this.section,
      name: "",
      code: "",
      description: "",
      parentId: 0,
      currentUser: JSON.parse(localStorage.getItem("user")),
      schema,
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
    saveSection() {
      // set data in field for data in currentSection
      this.currentSection.name = this.name;
      this.currentSection.code = this.code;
      this.currentSection.description = this.description;
      this.currentSection.parentId = this.parentId;
      // if it is edit just update Section else create new Section
      if (this.isEdit) {
        this.currentSection.updaterId = this.currentUser.id;
        AdminService.updateSection(this.currentSection)
          .then((response) => {
            console.log(response.data);
            this.loading = true;
            this.successful = true;
            this.$emit("submit");
          })
          .catch((e) => {
            this.message = "The department was updated fail";
            console.log(e);
          });
      } else {
        this.currentSection.creatorId = this.currentUser.id;
        console.log(this.parentId);

        if (this.parentId === 0) {
          this.successful = false;
          this.message = "Please select Parent";
        } else {
          AdminService.createSection(this.section)
            .then((response) => {
              console.log(response.data);
              this.loading = true;
              this.successful = true;
              this.$emit("submit");
            })
            .catch((e) => {
              this.message = "The department was created fail! " + e;
            });
        }
      }
    },
  },
  created() {
    // if section don't have name set this title to "Add" else to "Edit"
    if (this.currentSection.name == "") {
      this.title = "Add";
      this.isEdit = false;
    } else {
      this.title = "Edit";
      this.isEdit = true;
    }
    this.getAllSection();
    // if section has data then set data to temp var else just set parentId to create new section
    if (this.section != null) {
      this.name = this.section.name;
      this.code = this.section.code;
      this.description = this.section.description;
      this.parentId = this.section.parentId;
    } else {
      this.parentId = this.currentSection.id;
    }
  },
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

.modal-container-edit {
  width: 600px;
  height: auto;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #ffffff;
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

.modal-default-button {
  float: right;
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

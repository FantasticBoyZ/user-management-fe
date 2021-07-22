<!-- template for the modal component -->

<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container-edit overflow-auto">
          <div class="modal-header">
            <slot name="header"
              ><strong>{{ this.title }} User Detail</strong></slot
            >
          </div>

          <div class="modal-body">
            <Form @submit="saveUser" :validation-schema="schema">
              <div class="form-group">
                <label for="username">Username</label>
                <Field
                  name="username"
                  type="text"
                  v-model="this.username"
                  :readonly="isEdit"
                  class="form-control"
                />
                <ErrorMessage
                  name="username"
                  class="error-feedback text-danger"
                />
              </div>
              <div v-show="!isEdit" class="form-group">
                <label for="password">Password</label>
                <Field
                  name="password"
                  type="password"
                  v-model="this.password"
                  aria-readonly="true"
                  class="form-control"
                />
                <ErrorMessage
                  name="password"
                  class="error-feedback text-danger"
                />
              </div>
              <div class="form-group">
                <label for="fullname">Full Name</label>
                <Field
                  name="fullname"
                  type="text"
                  v-model="this.fullName"
                  class="form-control"
                />
                <ErrorMessage
                  name="fullname"
                  class="error-feedback text-danger"
                />
              </div>

              <div class="form-group">
                <label for="address">Address</label>
                <Field
                  name="address"
                  type="text"
                  v-model="this.address"
                  class="form-control"
                />
                <ErrorMessage
                  name="address"
                  class="error-feedback text-danger"
                />
              </div>

              <div class="form-group">
                <label for="dateOfBirth">Date Of Birth</label>
                <Field
                  name="dateOfBirth"
                  type="date"
                  v-model="this.dateOfBirth"
                  class="form-control"
                />
                <ErrorMessage
                  name="dateOfBirth"
                  class="error-feedback text-danger"
                />
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
                <label for="section">Section</label>
                <select
                  class="form-select"
                  name="section"
                  v-model="sectionId"
                  required
                >
                  <option
                    v-for="section in sections"
                    :value="section.id"
                    :selected="section.id === sectionId"
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
                <label for="role">Role</label>
                <select
                  class="form-select"
                  name="role"
                  :disabled="isEdit"
                  v-model="roleId"
                  required
                >
                  <option>-- Choose Section --</option>
                  <option
                    v-for="role in roles"
                    :value="role.id"
                    :selected="role.id === roleId"
                    :key="role.id"
                  >
                    {{ role.name.slice(5, role.name.length) }}
                  </option>
                </select>
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
import AdminService from "../services/admin.service";
import SectionService from "../services/section.service";
import RoleService from "../services/role.service";
import * as yup from "yup";

export default {
  props: { user: Object },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const today = new Date();
    const schema = yup.object().shape({
      username: yup.string().required("Username is required!"),
      password: yup.string().required("Password is required!"),
      fullname: yup
        .string()
        .typeError("Fullname is required!")
        .required("Fullname is required!")
        .max(255),
      dateOfBirth: yup
        .date()
        .typeError("Date of Birth is required!")
        .max(today),
      address: yup
        .string()
        .typeError("Address is required")
        .required()
        .max(255),
    });
    return {
      isEdit: false,
      loading: false,
      message: "",
      title: "",
      sections: "",
      roles: "",
      successful: false,
      userData: this.user,
      username: "",
      password: "",
      fullName: "",
      address: "",
      dateOfBirth: "",
      description: "",
      sectionId: "",
      roleId: "",
      userLoggingIn: JSON.parse(localStorage.getItem("user")),
      schema,
    };
  },
  mounted() {
    console.log(this.user);
  },
  created() {
    if (this.userData.username == "") {
      this.title = "Add";
      this.isEdit = false;
    } else {
      this.title = "Edit";
      this.isEdit = true;
    }
    if (this.user != null) {
      this.username = this.user.username;
      this.password = this.user.password;
      this.address = this.user.address;
      this.dateOfBirth = this.user.dateOfBirth;
      this.fullName = this.user.fullName;
      this.sectionId = this.user.sectionId;
      this.roleId = this.user.roleId;
      this.description = this.user.description;
    }
    this.getAllSection();
    this.getAllRole();
  },
  methods: {
    getAllRole() {
      RoleService.getAllRoles()
        .then((response) => {
          this.roles = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getAllSection() {
      SectionService.getAllSection()
        .then((response) => {
          this.sections = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    saveUser() {
      this.userData.fullName = this.fullName;
      this.userData.address = this.address;
      this.userData.dateOfBirth = this.dateOfBirth;
      this.userData.description = this.description;
      this.userData.sectionId = this.sectionId;
      this.userData.roleId = this.roleId;
      if (this.isEdit) {
        this.userData.updaterId = this.userLoggingIn.id;
        console.log(this.user);
        AdminService.updateUser(this.user)
          .then((response) => {
            console.log(response.data);
            this.loading = true;
            this.successful = true;
            this.message = "";
            this.$emit("submit");
          })
          .catch((e) => {
            this.message = "The user was updated fail";
            console.log(e);
          });
      } else {
        //add new user
        this.userData.username = this.username;
        this.userData.password = this.password;

        this.userData.creatorId = this.userLoggingIn.id;
        if (this.sectionId == null) {
          this.successful = false;
          this.message = "Please select Section";
        } else if (this.roleId == null) {
          this.successful = false;
          this.message = "Please select Role";
        } else {
          AdminService.createUser(this.user)
            .then((response) => {
              console.log(response.data);
              this.loading = true;
              this.successful = true;
              this.message = "";
              this.$emit("submit");
            })
            .catch((e) => {
              this.message = "The user was created fail" + e;
            });
        }
      }
    },
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
  height: 600px;
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

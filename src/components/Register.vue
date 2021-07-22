<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <Form @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div class="form-group">
            <label for="username">Username</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback text-danger" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback text-danger" />
          </div>
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <Field name="fullName" type="text" class="form-control" />
            <ErrorMessage name="fullName" class="error-feedback text-danger" />
          </div>
          <div class="form-group">
            <label for="dateOfBirth">Date Of Birth</label>
            <Field name="dateOfBirth" type="date" class="form-control" />
            <ErrorMessage name="dateOfBirth" class="error-feedback text-danger" />
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <Field name="address" type="text" class="form-control" />
            <ErrorMessage name="address" class="error-feedback text-danger" />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              name="description"
              :value="user.description" v-on:change="onChange"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span v-show="loading" class="spinner-border spinner-border-sm">
              </span>
              <span>Sign up</span>
            </button>
          </div>
        </div>
      </Form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
        role="alert"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const today = new Date();
    const schema = yup.object().shape({
      username: yup
        .string()
        .required("Username is required!")
        .min(3, "Must be at least 3 character!")
        .max(20, "Must be maximum 20 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),
      fullName: yup
        .string()
        .required("FullName is required!")
        .max(100, "Must be maximum 100 characters!"),
      dateOfBirth: yup
        .date()
        .typeError("Date Of Birth is required!")
        .max(today),
      address: yup
        .string()
        .required("Address is required!")
        .max(100, "Must be maximum 100 character!"),
      description: yup
        .string()

    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      user: { description: '' },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    onChange(e) { this.user.description = e.target.value; },

    handleRegister(user) {
      user.description = this.user.description;
      this.message = "";
      this.successful = false;
      this.loading = true;
      
      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
    },
  },
};
</script>
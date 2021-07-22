<template>
  <div class="banner">
    <!-- <img src="../assets/Nagakawa-Banner-1.jpg" /> -->
    <div class="logo-banner"></div>
  </div>
  <div class="register-box">
    <Form @submit="handleRegister" :validation-schema="schema">
      <div class="header-box">Đăng ký</div>
      <div class="input-field" v-if="!successful">
        <div class="email-entry">
          <div class="entry-label">Họ</div>
          <Field
            name="firstName"
            type="text"
            placeholder="Nguyễn"
            class="entry-input"
          />
          <!-- <ErrorMessage name="firstName" class="error-feedback text-danger" /> -->
        </div>
        <div class="email-entry">
          <div class="entry-label">Tên</div>
          <Field
            name="lastName"
            type="text"
            placeholder="Minh"
            class="entry-input"
          />
          <!-- <ErrorMessage name="fullName" class="error-feedback text-danger" /> -->
        </div>
        <div class="email-entry">
          <div class="entry-label">Mật khẩu</div>
          <Field
            name="password"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            type="password"
            class="entry-input"
          />
          <!-- <ErrorMessage name="password" class="error-feedback text-danger" /> -->
        </div>

        <div class="email-entry">
          <div class="entry-label">Xác nhận mật khẩu</div>
          <Field
            name="re-password"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            type="password"
            class="entry-input"
          />
          <!-- <ErrorMessage name="re-password" class="error-feedback text-danger" /> -->
        </div>
        <div class="email-entry">
          <div class="entry-label">Email</div>
          <Field
            name="username"
            type="text"
            placeholder="example@email.com"
            class="entry-input"
          />
          <!-- <ErrorMessage name="firstName" class="error-feedback text-danger" /> -->
        </div>
        <div class="register-action">
          <div class="notify-confirm">
            <label class="">
              <input class="check-confirm" type="checkbox" />
              <span class="checkmark-register"></span>
            </label>
            <span class="check-content"
              >Tôi đồng ý nhận email và các bản cập nhật mới và khuyến mãi từ
              Nagakawa</span
            >
          </div>
        </div>
        <!-- <div class="email-entry">
          <label for="dateOfBirth">Date Of Birth</label>
          <Field name="dateOfBirth" type="date" class="form-control" />
          <ErrorMessage name="dateOfBirth" class="error-feedback text-danger" />
        </div>
        <div class="email-entry">
          <label for="address">Address</label>
          <Field name="address" type="text" class="form-control" />
          <ErrorMessage name="address" class="error-feedback text-danger" />
        </div>
        <div class="email-entry">
          <label for="description">Description</label>
          <textarea
            name="description"
            :value="user.description"
            v-on:change="onChange"
            class="form-control"
          />
        </div> -->
        <button class="btn-register" :disabled="loading">Đăng ký</button>
      </div>
    </Form>
  </div>
  <div class="logo">
    <div class="logo-picture">
      <img src="../assets/logo-nagakawa.png" />
    </div>
    <div class="slogan">Tiêu chuẩn của cuộc sống</div>
  </div>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
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
      description: yup.string(),
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      user: { description: "" },
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
    onChange(e) {
      this.user.description = e.target.value;
    },

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

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  font-family: "Roboto", sans-serif;
}

.container {
  width: 100%;
  height: 100%;
  display: grid;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.banner {
  width: 100vw;
  height: 50vh;
  border-bottom: 8px solid #db4437;
  background-size: cover;
  background-image: url("../assets/Nagakawa-Banner-1.jpg");
}
.banner img {
  top: 0px;
  left: 0;

  max-width: 100%;
}
.register-box {
  z-index: 999;
  top: 21%;
  left: 60%;
  width: 30%;
  height: 63%;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 4px 12px #00000029;
  opacity: 1;
  text-align: center;
  position: absolute;
}

.register-box > form {
  width: 100%;
  height: 80%;
}

.register-box .input-field {
  height: 100%;
}
.header-box {
  height: 5%;
  margin-top: 5%;
  margin-bottom: 11%;
  font-size: 2vw;
  font-weight: bold;
  color: #00833e;
  opacity: 0.8;
}
.email-entry {
  margin: auto;
  margin-bottom: 8px;
  width: 68%;
  height: 6vh;
  border-radius: 5px;
  border: 1px #707070;
  background-color: #f1f1f1;
  text-align: left;
}
.password-entry {
  margin: auto;
  margin-bottom: 8px;
  width: 68%;
  height: 6vh;
  border-radius: 5px;
  border: 1px #707070;
  background-color: #f1f1f1;
  text-align: left;
}
.entry-label {
  height: 1vh;
  margin-left: 17px;
  padding-top: 6px;
  font-size: 12px;
  font-weight: bold;
  color: black;
}
.entry-input {
  width: 92%;
  height: 32%;
  margin-left: 17px;
  margin-top: 5%;
  font-size: 15px;
  background-color: #f1f1f1;
  outline: none;
  border: none;
}

::placeholder {
  opacity: 0.5; /* Firefox*/
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */

  opacity: 0.5;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: #707070;
  opacity: 0.5;
}
.register-action {
  width: 70%;
  height: 2%;
  margin: 0 auto;
  margin-bottom: 0;
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
}
.check-content {
  text-align: left;
  margin-left: 2%;
  font: normal bold 12px/14px Roboto;
  color: #707070;
  opacity: 0.8;
}
.notify-confirm {
  width: 80%;
  display: flex;
  flex-direction: row;
  text-align: left;
}
.check-confirm {
  vertical-align: middle;
}
/* Create a custom checkbox */
label .checkmark-register {
  font-size: 12px;
  text-align: left;
  color: #707070;
  opacity: 0.8;
}
label > input[type="checkbox"] {
  display: none;
}
label > input[type="checkbox"] + *::before {
  content: "";
  margin-right: 5px;
  display: inline-block;
  vertical-align: middle;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  border-style: solid;
  border-width: 0.1rem;
  border-color: #00833e;
}
label > input[type="checkbox"]:checked + *::before {
  content: "\2713";
  line-height: 1;
  color: white;
  text-align: center;
  background: #00833e;
  border-color: #00833e;
}
.forgot-password a {
  color: #00833e;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  opacity: 0.8;
}
.btn-register {
  margin-top: 10%;
  color: #ffffff;
  font-size: 14px;
  line-height: 17px;
  vertical-align: middle;
  text-align: center;
  width: 51%;
  height: 10%;
  border-radius: 10px;
  background: #00833e 0% 0% no-repeat padding-box;
  outline: none;
  border: none;
  box-shadow: 0px 0px 4px #00000029;
}

.logo {
  margin-top: 0;
  padding-left: 9%;
  padding-right: 50%;
  text-align: center;
  height: 50vh;
}
.logo-picture img {
  width: 41vw;
}
.logo .slogan {
  font-size: 36px;
  height: 4%;
  color: #00833e;
  opacity: 0.8;
}

@media only screen and (max-width: 1000px) {
  body {
    background-color: lightblue;
  }
  .logo {
    display: none;
  }
  .banner {
    transition: 0.3s;
    background-image: none;
    background: transparent linear-gradient(90deg, #182924 0%, #135945 100%) 0%
      0% no-repeat padding-box;
  }
  .logo-banner {
    margin-top: 160px;
    height: 170px;
    max-height: 170px;
    width: auto;
    background-image: url("../assets/logo-nagakawa.png");
    background-size: cover;
    /* background-position: bottom; */
  }
  .register-box {
    transition: 0.3s ease;
    width: 100%;
    height: 50%;
    top: 50%;
    left: 0%;
  }
}
@media only screen and (max-width: 800px) {
  .logo-banner {
    transition: 0.1s;
    height: 30%;
  }
}
@media only screen and (max-width: 600px) {
  .logo-banner {
    transition: 0.1s;
    height: 20%;
  }
}
</style>

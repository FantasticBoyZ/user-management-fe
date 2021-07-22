<template>
  <div class="banner">
    <!-- <img src="../assets/Nagakawa-Banner-1.jpg" /> -->
    <div class="logo-banner"></div>
  </div>
  <div class="login-box">
    <Form @submit="handleLogin" :validation-schema="schema">
      <div class="header-box">Đăng nhập</div>
      <div class="email-entry">
        <div class="entry-label">Username</div>
        <Field
          name="username"
          type="text"
          class="entry-input"
          placeholder="example@gmail.com"
        />
      </div>
      <div class="password-entry">
        <div class="entry-label">Mật khẩu</div>
        <Field
          name="password"
          class="entry-input"
          type="password"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
        />
      </div>
      <div class="login-action">
        <div class="remember-me">
          <label class="">
            <input class="check-remember" type="checkbox" />
            <span class="checkmark">Lưu ý email</span>
          </label>
        </div>
        <div class="forgot-password">
          <a href="#">Quên mật khẩu?</a>
        </div>
      </div>
      <ErrorMessage name="username" class="error-feedback" />
      <ErrorMessage name="password" class="error-feedback" />
      <br />
      <button class="btn-login" :disabled="loading">
        <label>Đăng nhập</label>
      </button>

      <div class="form-group">
        <div v-if="message" class="alert alert-danger" role="alert">
          {{ message }}
        </div>
      </div>
      <div class="suggest-register">
        <span
          >Bạn chưa đăng ký tài khoản?
          <router-link to="/register">Đăng ký ngay!</router-link>
        </span>
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
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("Username is required!"),
      password: yup.string().required("Password is required!"),
    });

    return {
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/profile");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
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
.login-box {
  z-index: 999;
  top: 28%;
  left: 60%;
  width: 30%;
  height: 50%;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 4px 12px #00000029;
  opacity: 1;
  text-align: center;
  position: absolute;
}
.login-box .header-box {
  padding-top: 7%;
  padding-bottom: 41px;
  font-size: 2vw;
  font-weight: bold;
  color: #00833e;
  opacity: 0.8;
}
.email-entry {
  margin: auto;
  margin-bottom: 8px;
  width: 68%;
  height: 33%;
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
  font-size: 18px;
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
.login-action {
  width: 68%;
  margin: auto;
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
}
.check-remember {
  vertical-align: middle;
}
/* Create a custom checkbox */
label .checkmark {
  font-size: 12px;
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
.btn-login {
  width: 51%;
  height: 40px;
  border-radius: 10px;
  background: #00833e 0% 0% no-repeat padding-box;
  outline: none;
  border: none;
  box-shadow: 0px 0px 4px #00000029;
}
.btn-login label {
  color: #ffffff;
  font-size: 14px;
  line-height: 17px;
  text-align: left;
}
.suggest-register {
  font-size: 14px;
  margin-top: 6%;
  margin-bottom: 20px;
  color: #707070;
  opacity: 0.8;
}
.suggest-register a {
  color: #00833e;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  line-height: 17px;
  text-decoration: none;
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
  .login-box {
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
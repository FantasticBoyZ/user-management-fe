<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"><strong>Confirm Delete</strong></slot>
          </div>

          <div class="modal-body">
            <Form>
              <h3 class="text-center">
                <strong
                  >Are you sure to delete this {{ this.objectType }}?</strong
                >
              </h3>
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
              <div class="modal-footer text-center">
                <button
                  class="btn btn-danger mx-2"
                  v-on:click.prevent="$emit('delete')"
                >
                  OK
                </button>
                <button
                  class="btn btn-secondary mx-2"
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
export default {
  props: {
    objectType: String,
  },
  mounted() {
    console.log(this.objectType);
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
  background-color: rgba(199, 190, 190, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  height: 225px;
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
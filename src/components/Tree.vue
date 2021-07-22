<template>
  <div>
    <div
      @click="nodeClicked"
      :style="{ 'margin-left': `${depth * 20}px` }"
      class="node"
    >
      <span v-if="hasChildren" class="type">
        <!-- {{ expanded ? "&#9660;" : "&#9658;" }} -->
        <font-awesome-icon v-if="expanded" icon="caret-down" />
        <font-awesome-icon v-else icon="caret-right" />
      </span>
      <span v-else><font-awesome-icon icon="long-arrow-alt-right" /> </span>
      <span
        @click="selectGroup"
        :class="{ 'border border-primary': isActiveItem }"
        id="sectionNode"
      >
        <span v-if="hasChildren">
          <strong>{{ " " + node.name }}</strong>
        </span>
        <span v-else> {{ " " + node.name }}</span>
      </span>
    </div>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <Tree
      v-if="expanded"
      v-for="child in node.children"
      :key="child.id"
      :node="child"
      :depth="depth + 1"
      :current-node="currentNode"
      @select="select"
      @on-click="(node) => $emit('onClick', node)"
    />
  </div>
</template>


<script>
export default {
  name: "Tree",
  props: {
    node: Object,
    depth: {
      type: Number,
      default: 0,
    },
    sectionId: {
      type: Number,
      default: 1,
    },
    currentNode: Object,
  },
  computed: {
    hasChildren() {
      return this.node.children.length > 0;
    },
    isActiveItem() {
      console.log(this.currentNode);
      console.log(this.node);
      return this.currentNode === this.node;
    },
  },
  methods: {
    nodeClicked() {
      this.expanded = !this.expanded;
      this.$emit("onClick", this.node);
      console.log(this.node);
    },
    // activate(node) {
    //   this.currentNode = node;
    // },
    selectGroup: function () {
      this.select(this.node);
    },
    select: function (node) {
      console.log(this.isActiveItem);
      this.$emit("select", node);
    },
  },
  data() {
    return {
      expanded: false,
      isClicked: false,
    };
  },
  created() {
    console.log(this.node.name);
  },
  mounted() {},
};
</script>

<style scoped>
.node {
  text-align: left;
  font-size: 18px;
}
.icon {
  font-size: 11px;
  margin: 3px;
}
</style>

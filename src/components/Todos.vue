<template>
  <div id="app">
    <ApolloQuery
      :query="require('../graphql/Todos.gql')"
    >
      <ApolloSubscribeToMore
              :document="require('../graphql/TodoDragging.gql')"
              :update-query="todoDragging"
      />
      <div
        slot-scope="{ result }"
      >
        <template v-if="result.data">
          <div
            v-for="todo of result.data.todos"
            :key="todo.id"
          >
            <VueDragResize
                    class="titlebar"
                    :isActive="true"
                    :w="200"
                    :h="200"
                    :x="todo.coords.xAxis"
                    :y="todo.coords.yAxis"
                    :isResizable="false"
                    v-on:dragging="(ev) => drag(todo.id, ev)"
                    >
              <h3 class="text">{{todo.content}}</h3>

            </VueDragResize>
          </div>
        </template>

      </div>
    </ApolloQuery>
  </div>
</template>

<script>
    import VueDragResize from 'vue-drag-resize';
    import TODO_DRAG_MUTATION from '../graphql/TodoDrag.gql'

    export default {
        name: 'app',

        components: {
            VueDragResize
        },

        data() {
            return {
                currentId: ''
            }
        },

        methods: {
            setCurrentId(id) {
                console.log('LOL')
                console.log('ID', id);
                this.currentId = id
            },
            drag(id, { top: xAxis, left: yAxis }) {

                this.$apollo.mutate({
                    mutation: TODO_DRAG_MUTATION,
                    variables: {
                        input: {
                            id,
                            xAxis,
                            yAxis
                        },
                    },
                })
            },
            todoDragging() {
                console.log('....')
            }
        }
    }
</script>

<style scoped>
  .vdr.active:before {
    outline: none;
  }
  .vdr.active {
    border: solid black;
  }
</style>
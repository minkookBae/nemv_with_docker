<template>
  <v-card>
    <v-container pa-1>
      <v-layout row>
        <v-flex xs9>
          <v-card-title primary-title>
            <div>
              <div class="grey--text">{{title}}</div>
              <h3 class="headline">{{number}}</h3>
            </div>
          </v-card-title>
        </v-flex>
        <v-flex xs3>
          <v-card-title primary-title>
            <v-avatar>
              <v-icon medium :color="tIconColor">{{tIcon}}</v-icon>
            </v-avatar>
          </v-card-title>
        </v-flex>
      </v-layout>
      
    </v-container>
  </v-card>
</template>
<script>
export default {
  props: ['title', 'number', 'tIcon', 'tIconColor']
}
</script>